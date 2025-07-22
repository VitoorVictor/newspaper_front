import type { ReactNode } from "react";

export const metadata = {
  title: "Notícias",
  description: "Fique por dentro das últimas notícias.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
