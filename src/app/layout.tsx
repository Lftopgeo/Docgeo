import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientOnly } from "@/components/ClientOnly";
import { TempoInit } from "@/components/tempo-init";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Docgeo",
  description: "Sistema de gerenciamento de documentos, tarefas e ferramentas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="description" content="Docgeo - Sistema de gerenciamento de documentos, tarefas e ferramentas" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <ClientOnly>
          <TempoInit />
          <Toaster />
        </ClientOnly>
      </body>
    </html>
  );
}
