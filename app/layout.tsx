import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casa de Carnes Luiz Alvense | Seleção especial",
  description: "Cortes selecionados, cuidado em cada detalhe. Escolha seus cortes favoritos e agende sua retirada.",
  applicationName: "Casa de Carnes Luiz Alvense"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}