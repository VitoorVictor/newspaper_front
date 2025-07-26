"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { Extension, Node } from "@tiptap/core";
import type { Command } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FileUpload } from "@/components/file-upload";
import {
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Video,
  Palette,
  Highlighter,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

// Extensão personalizada para tamanho de fonte
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string): Command =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        (): Command =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

// Extensão customizada para imagens com melhor controle
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute("width") || element.style.width,
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            width: attributes.width,
            style: `width: ${attributes.width}; height: auto;`,
          };
        },
      },
      align: {
        default: null,
        parseHTML: (element) =>
          element.style.textAlign || element.getAttribute("align"),
        renderHTML: (attributes) => {
          if (!attributes.align) return {};
          const style = `text-align: ${
            attributes.align
          }; display: block; margin: ${
            attributes.align === "center"
              ? "0 auto"
              : attributes.align === "right"
              ? "0 0 0 auto"
              : "0 auto 0 0"
          };`;
          return { style };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageSize:
        (width: string): Command =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { width });
        },
      setImageAlign:
        (align: string): Command =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align });
        },
    };
  },
});

// Extensão para vídeos customizada com tipagem correta
const CustomVideo = Node.create({
  name: "customVideo",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("video, iframe")?.getAttribute("src"),
      },
      width: {
        default: "100%",
        parseHTML: (element) =>
          element.getAttribute("width") || element.style.width || "100%",
        renderHTML: (attributes) => {
          return { width: attributes.width };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) =>
          element.style.textAlign || element.getAttribute("align") || "center",
        renderHTML: (attributes) => {
          return { align: attributes.align };
        },
      },
      type: {
        default: "video",
        parseHTML: (element) =>
          element.querySelector("iframe") ? "youtube" : "video",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video]",
        getAttrs: (element) => {
          const mediaElement = element.querySelector("video, iframe");
          return {
            src: mediaElement?.getAttribute("src"),
            width: element.style.width || mediaElement?.style.width || "100%",
            align: element.style.textAlign || "center",
            type: element.querySelector("iframe") ? "youtube" : "video",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, width, align, type } = HTMLAttributes;
    const wrapperStyle = `text-align: ${align}; margin: 1rem 0; width: 100%;`;
    const mediaStyle = `width: ${width}; height: auto; max-width: 100%; border-radius: 8px;`;

    if (type === "youtube") {
      const aspectRatio =
        width === "100%" ? "315px" : `${Number.parseInt(width) * 0.5625}px`;
      return [
        "div",
        {
          "data-video": "",
          style: wrapperStyle,
          class: "video-wrapper",
          width: width,
          align: align,
        },
        [
          "iframe",
          {
            src,
            style: `${mediaStyle} height: ${aspectRatio};`,
            frameborder: "0",
            allowfullscreen: "true",
            class:
              "hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer",
          },
        ],
      ];
    }

    return [
      "div",
      {
        "data-video": "",
        style: wrapperStyle,
        class: "video-wrapper",
        width: width,
        align: align,
      },
      [
        "video",
        {
          src,
          controls: "true",
          style: mediaStyle,
          class:
            "hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options: {
          src: string;
          type?: string;
          width?: string;
          align?: string;
        }): Command =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              type: options.type || "video",
              width: options.width || "100%",
              align: options.align || "center",
            },
          });
        },
      setVideoSize:
        (width: string): Command =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { width });
        },
      setVideoAlign:
        (align: string): Command =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align });
        },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Digite o conteúdo...",
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<
    "image" | "video" | null
  >(null);

  // Garantir que o componente só seja renderizado no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image", "customVideo"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class:
            "max-w-full h-auto rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all",
        },
        allowBase64: true,
      }),
      CustomVideo,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      // Detectar tipo de mídia selecionada
      const { selection } = editor.state;
      const node = editor.state.doc.nodeAt(selection.from);

      if (node?.type.name === "image") {
        setSelectedMediaType("image");
      } else if (node?.type.name === "customVideo") {
        setSelectedMediaType("video");
      } else {
        setSelectedMediaType(null);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
    }
  }, [editor, linkUrl]);

  const addImageFromUrl = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
    }
  }, [editor, imageUrl]);

  const addImageFromFile = useCallback(
    (file: File, dataUrl: string) => {
      if (editor) {
        editor.chain().focus().setImage({ src: dataUrl }).run();
      }
    },
    [editor]
  );

  const addVideoFromUrl = useCallback(() => {
    if (videoUrl && editor) {
      // Detectar se é YouTube
      const isYouTube =
        videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

      if (isYouTube) {
        let videoId = "";

        if (videoUrl.includes("youtube.com/watch?v=")) {
          videoId = videoUrl.split("v=")[1]?.split("&")[0] || "";
        } else if (videoUrl.includes("youtu.be/")) {
          videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0] || "";
        }

        if (videoId) {
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          editor
            .chain()
            .focus()
            .setVideo({
              src: embedUrl,
              type: "youtube",
              width: "100%",
              align: "center",
            })
            .run();
        }
      } else {
        // Vídeo direto por URL
        editor
          .chain()
          .focus()
          .setVideo({
            src: videoUrl,
            type: "video",
            width: "100%",
            align: "center",
          })
          .run();
      }
      setVideoUrl("");
    }
  }, [editor, videoUrl]);

  const addVideoFromFile = useCallback(
    (file: File, dataUrl: string) => {
      if (editor) {
        editor
          .chain()
          .focus()
          .setVideo({
            src: dataUrl,
            type: "video",
            width: "100%",
            align: "center",
          })
          .run();
      }
    },
    [editor]
  );

  const setFontSizeCommand = useCallback(
    (size: number) => {
      if (editor) {
        editor.chain().focus().setFontSize(`${size}px`).run();
      }
    },
    [editor]
  );

  const resizeSelectedMedia = useCallback(
    (width: number) => {
      if (!editor || !selectedMediaType) return;

      const widthStr = `${width}%`;

      if (selectedMediaType === "image") {
        editor.chain().focus().setImageSize(widthStr).run();
      } else if (selectedMediaType === "video") {
        editor.chain().focus().setVideoSize(widthStr).run();
      }
    },
    [editor, selectedMediaType]
  );

  const alignSelectedMedia = useCallback(
    (alignment: "left" | "center" | "right") => {
      if (!editor || !selectedMediaType) return;

      if (selectedMediaType === "image") {
        editor.chain().focus().setImageAlign(alignment).run();
      } else if (selectedMediaType === "video") {
        editor.chain().focus().setVideoAlign(alignment).run();
      }
    },
    [editor, selectedMediaType]
  );

  // Mostrar loading enquanto não está montado no cliente
  if (!isMounted) {
    return (
      <div className="border rounded-lg">
        <div className="border-b p-2 h-12 bg-muted animate-pulse" />
        <div className="min-h-[200px] p-4 flex items-center justify-center">
          <div className="text-muted-foreground">Carregando editor...</div>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="border rounded-lg">
        <div className="border-b p-2 h-12 bg-muted animate-pulse" />
        <div className="min-h-[200px] p-4 flex items-center justify-center">
          <div className="text-muted-foreground">Inicializando editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 items-center">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Tamanho do texto (Headings) */}
        <Select
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
              ? "h3"
              : "p"
          }
          onValueChange={(value) => {
            if (value === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = Number.parseInt(value.replace("h", "")) as
                | 1
                | 2
                | 3;
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">Normal</SelectItem>
            <SelectItem value="h1">H1</SelectItem>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
          </SelectContent>
        </Select>

        {/* Tamanho da fonte personalizado */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <Label>Tamanho da Fonte: {fontSize}px</Label>
              <Slider
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                min={8}
                max={72}
                step={1}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setFontSizeCommand(fontSize)}
                >
                  Aplicar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => editor.chain().focus().unsetFontSize().run()}
                >
                  Resetar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Formatação básica */}
        <Toggle
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          size="sm"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          size="sm"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          size="sm"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        {/* Cor do texto */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-6 gap-2">
              {[
                "#000000",
                "#374151",
                "#DC2626",
                "#EA580C",
                "#D97706",
                "#65A30D",
                "#059669",
                "#0891B2",
                "#2563EB",
                "#7C3AED",
                "#C026D3",
                "#DC2626",
              ].map((color) => (
                <button
                  type="button"
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-2 bg-transparent"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              Remover cor
            </Button>
          </PopoverContent>
        </Popover>

        {/* Marca texto */}
        <Popover>
          <PopoverTrigger asChild>
            <Toggle pressed={editor.isActive("highlight")} size="sm">
              <Highlighter className="h-4 w-4" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-6 gap-2">
              {[
                "#FEF3C7",
                "#DBEAFE",
                "#D1FAE5",
                "#FCE7F3",
                "#E0E7FF",
                "#FED7D7",
              ].map((color) => (
                <button
                  type="button"
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    editor.chain().focus().toggleHighlight({ color }).run()
                  }
                />
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-2 bg-transparent"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              Remover marca
            </Button>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Alinhamento */}
        <Toggle
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          size="sm"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          size="sm"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          size="sm"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
          size="sm"
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        {/* Listas */}
        <Toggle
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          size="sm"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          size="sm"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        {/* Link */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label>URL do Link</Label>
              <Input
                placeholder="https://exemplo.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={addLink}>
                  Adicionar Link
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                >
                  Remover Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Imagem */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Upload de Imagem</Label>
                <FileUpload
                  accept="image/*"
                  onFileSelect={addImageFromFile}
                  placeholder="Arraste uma imagem ou clique para selecionar"
                  maxSize={5}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button type="button" size="sm" onClick={addImageFromUrl}>
                  Adicionar por URL
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Vídeo */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Upload de Vídeo</Label>
                <FileUpload
                  accept="video/*"
                  onFileSelect={addVideoFromFile}
                  placeholder="Arraste um vídeo ou clique para selecionar"
                  maxSize={50}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL do YouTube</Label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <Button type="button" size="sm" onClick={addVideoFromUrl}>
                  Adicionar YouTube
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Editor */}
      <div className="min-h-[200px]">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ol]:ml-6"
        />
      </div>

      {/* Controles de mídia selecionada */}
      {selectedMediaType && (
        <div className="border-t p-3 bg-muted/30">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm font-medium">
              {selectedMediaType === "image"
                ? "🖼️ Imagem selecionada"
                : "🎥 Vídeo selecionado"}
            </div>

            {/* Controles de tamanho */}
            <div className="flex items-center gap-2">
              <Label className="text-xs">Tamanho:</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => resizeSelectedMedia(25)}
                className="h-7 px-2 text-xs"
              >
                25%
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => resizeSelectedMedia(50)}
                className="h-7 px-2 text-xs"
              >
                50%
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => resizeSelectedMedia(75)}
                className="h-7 px-2 text-xs"
              >
                75%
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => resizeSelectedMedia(100)}
                className="h-7 px-2 text-xs"
              >
                100%
              </Button>
            </div>

            {/* Controles de alinhamento */}
            <div className="flex items-center gap-1">
              <Label className="text-xs">Alinhar:</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => alignSelectedMedia("left")}
                className="h-7 w-7 p-0"
              >
                <AlignLeft className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => alignSelectedMedia("center")}
                className="h-7 w-7 p-0"
              >
                <AlignCenter className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => alignSelectedMedia("right")}
                className="h-7 w-7 p-0"
              >
                <AlignRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
