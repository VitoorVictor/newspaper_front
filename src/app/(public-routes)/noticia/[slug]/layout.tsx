import type { ReactNode } from "react";

export const metadata = {
  title: "Notícia",
  description: "Veja a notícia completa.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
