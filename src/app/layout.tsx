import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "NegociAí — A resposta certa na hora da negociação",
  description:
    "Configure seu WhatsApp para vender mais em menos de 5 minutos. Respostas prontas para negociar, quebrar objeções e fechar mais negócios.",
  openGraph: {
    title: "NegociAí — Transforme seu WhatsApp em uma máquina de fechar negócios",
    description:
      "Receba um sistema completo de negociação personalizado para seu WhatsApp Business.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
