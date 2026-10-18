import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dulce | Desayunos que abrazan",
  description: "Desayunos, meriendas, picadas y regalos preparados con amor.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
