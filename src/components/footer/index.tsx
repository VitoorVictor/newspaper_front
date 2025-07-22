import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <footer className="bg-[#182641] text-white">
      {/* Seção principal do rodapé */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 place-items-center">
          {/* Logo e descrição */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">Newsletter</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Sua fonte confiável de informações sobre indústria, economia e
                negócios. Conectando você ao que realmente importa no mundo
                corporativo.
              </p>
            </div>

            {/* Redes sociais */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-white h-9 w-9"
                asChild
              >
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-white h-9 w-9"
                asChild
              >
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-white h-9 w-9"
                asChild
              >
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Links Institucionais */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Institucional
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/sobre"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="/contato"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Contato
                </a>
              </li>
              <li>
                <a
                  href="/trabalhe-conosco"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Trabalhe Conosco
                </a>
              </li>
              <li>
                <a
                  href="/anuncie"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Anuncie
                </a>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Serviços</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/assinar-revista"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Assinar Revista
                </a>
              </li>
              <li>
                <a
                  href="/guia"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Guia Industrial
                </a>
              </li>
              <li>
                <a
                  href="/cadastre-se"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Cadastre-se
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter e Contato */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Sobre nós</h4>

            {/* Informações de contato */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Mail className="h-4 w-4" />
                <span>contato@newsletter.com.br</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Phone className="h-4 w-4" />
                <span>(11) 1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/20" />

      {/* Rodapé inferior */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright e CNPJ */}
          <div className="text-center md:text-left">
            <p className="text-white/80 text-sm">
              © 2024 Newsletter Industrial. Todos os direitos reservados.
            </p>
            <p className="text-white/60 text-xs mt-1">
              CNPJ: 12.345.678/0001-90
            </p>
          </div>

          {/* Links legais */}
          <div className="flex items-center gap-6">
            <a
              href="/politica-privacidade"
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              Política de Privacidade
            </a>
            <a
              href="/termos-uso"
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              Termos de Uso
            </a>
            <a
              href="/cookies"
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
