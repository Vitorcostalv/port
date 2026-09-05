import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Spline_Sans } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const sans = Spline_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vitor Costa | Fullstack Developer",
  description:
    "Portfólio de Vitor Costa, fullstack developer focado em React, TypeScript, CRUDs previsíveis e testes E2E.",
};

export const viewport: Viewport = {
  themeColor: "#090b0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Sem JS nem o reveal do Motion nem o `data-in` do IntersectionObserver
            disparam: tudo que nasce oculto precisa voltar ao estado final. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"],.seq>*,.draw-node{opacity:1!important;transform:none!important;animation:none!important}.rule-sweep{transform:none!important}.draw-path{stroke-dashoffset:0!important}`}</style>
        </noscript>
      </head>
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-brass focus:bg-stone focus:min-h-11 focus:items-center focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.18em]"
        >
          Pular para o conteúdo
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
