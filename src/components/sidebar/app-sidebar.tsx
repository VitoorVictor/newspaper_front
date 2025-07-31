"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { data } from "./data-sidebar";
import Link from "next/link";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useAdminCategories } from "@/hooks/tanstackQuery/useCategory";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session | null;
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useAdminCategories();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Sidebar
      ref={sidebarRef}
      collapsible="offcanvas"
      className="z-100 border-r border-border"
      {...props}
    >
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Image
            src="/orange_logo.png"
            alt="Logo"
            width={2000}
            height={300}
            className="h-8 w-auto"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar menu</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="scrollbar">
        {data.map((item) => {
          if (item.session && !session) {
            return null;
          }
          return (
            <SidebarGroup key={item.title} className="mt-2">
              <SidebarGroupLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider px-3 py-2">
                {item.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((subItem) => {
                    const isActive = pathname === subItem.url;
                    return (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          asChild
                          className={`
                            rounded-lg transition-all duration-200
                            ${
                              isActive
                                ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }
                          `}
                        >
                          <Link
                            href={subItem.url}
                            onClick={() => setOpen(false)}
                            className="flex items-center w-full px-3 py-5"
                          >
                            {subItem.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
        {categories && (
          <SidebarGroup key="Todas as Editorias" className="mt-2">
            <SidebarGroupLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider px-3 py-2">
              Todas as Editorias
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.data.data.map((category) => (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton
                      asChild
                      className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                    >
                      <Link
                        href="#"
                        onClick={() => setOpen(false)}
                        className="flex items-center w-full px-3 py-5"
                      >
                        {category.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
