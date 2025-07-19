"use client";

import { Menu, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Link from "next/link";

const SocialIcons = () => (
  <>
    <Button
      variant="ghost"
      size="icon"
      className="text-white hover:bg-background h-9 w-9"
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
      className="text-white hover:bg-background h-9 w-9"
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
      className="text-white hover:bg-background h-9 w-9"
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
  </>
);

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mude para false para testar
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Seção esquerda - Ícone do menu + Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-background"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-white text-2xl font-bold">Newsletter</h1>
        </div>

        {/* Seção central - Menu de navegação */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Início
          </Link>
          <Link
            href="#"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Notícias
          </Link>
          <Link
            href="#"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Guia Industrial
          </Link>
          <Link
            href="#"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Coluna Empresarial
          </Link>
          <Link
            href="#"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Coluna Social
          </Link>
          <Link
            href="#"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Edições
          </Link>
        </nav>

        {/* Seção direita - Redes sociais + Avatar (se logado) */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            <SocialIcons />
          </div>

          {isLoggedIn && (
            <>
              <div className="hidden md:block h-6 w-px bg-white/20 mx-2"></div>
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="Avatar"
                />
                <AvatarFallback className="bg-white/20 text-white text-sm">
                  U
                </AvatarFallback>
              </Avatar>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
