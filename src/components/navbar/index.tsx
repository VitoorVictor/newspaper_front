"use client";

import { Menu, Instagram, Twitter, Facebook, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutBtn } from "../custom-btns/logout-btn";
import { useSidebar } from "../ui/sidebar";

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

export function Navbar({ email }: { email: string }) {
  const firstLetter = email.charAt(0).toUpperCase();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Seção esquerda - Ícone do menu + Logo */}
        <div className="flex items-center gap-4">
          <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            size="icon"
            className="size-7 text-white hover:bg-background cursor-pointer"
            onClick={toggleSidebar}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Trocar Sidebar</span>
          </Button>
          <Link href="/">
            <Image
              src="/orange_logo_border.png"
              alt="Logo"
              width={2237}
              height={366}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Seção central - Menu de navegação */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Início
          </Link>
          <Link
            href="/noticias"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Notícias
          </Link>
          <Link
            href="/guia-industrial"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Guia Industrial
          </Link>
          <Link
            href="/coluna-social"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Coluna Social
          </Link>
          <Link
            href="/edicoes"
            className="text-white hover:text-white/80 transition-colors font-medium"
          >
            Edições
          </Link>
        </nav>

        {/* Seção direita - Redes sociais + Avatar (se logado) */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1">
            <SocialIcons />
          </div>

          <div className="hidden lg:block h-6 w-px bg-white/20 mx-2"></div>
          {email ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                  <AvatarImage
                    src={`https://placehold.co/32x32/ffffff/102741/?text=${firstLetter}`}
                    alt="Avatar"
                  />
                  <AvatarFallback className="bg-white/20 text-white text-sm">
                    {firstLetter}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage
                        src={`https://placehold.co/32x32/102741/ffffff/?text=${firstLetter}`}
                        alt="Avatar"
                      />
                      <AvatarFallback className="rounded-lg">
                        {firstLetter}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {email.split("@")[0]}
                      </span>
                      <span className="truncate text-xs">{email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogoutBtn />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/admin/entrar">
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-white/20 transition-all">
                <AvatarImage
                  src={`https://placehold.co/32x32/102741/`}
                  alt="Avatar"
                />
                <AvatarFallback className="bg-white/20 text-white text-sm">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
