"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function TestEditorPage() {
  const [content, setContent] = useState(
    "<h1>Teste do Editor</h1><p>Este é um teste do editor de texto rico.</p>"
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Teste do Editor de Texto Rico</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Editor:</h2>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">HTML Gerado:</h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">{content}</pre>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Visualização:</h2>
        <div
          className="p-4 border rounded-lg bg-white"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
