import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa de Carnes Luiz Alvense | Cortes Nobres & Boutique",
  description: "Uma experiência boutique em carnes nobres, cortes selecionados, maturação Dry Aged e atendimento próximo em Luiz Alves, Santa Catarina.",
  applicationName: "Casa de Carnes Luiz Alvense"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}