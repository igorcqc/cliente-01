import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getClientConfig } from "@/lib/getClientConfig";
import { getThemeCssVariables } from "@/lib/theme";
import "./globals.css";

/**
 * Metadados de SEO e Open Graph, gerados a partir do `client.config.ts`.
 * Se o conteúdo for inválido, `getClientConfig()` lança e o build falha
 * antes de gerar qualquer página.
 */
export function generateMetadata(): Metadata {
  const config = getClientConfig();
  const { seo, identidade } = config;

  return {
    title: seo.titulo,
    description: seo.descricao,
    metadataBase: new URL(seo.urlCanonica),
    alternates: {
      canonical: seo.urlCanonica,
    },
    openGraph: {
      title: seo.titulo,
      description: seo.descricao,
      url: seo.urlCanonica,
      siteName: identidade.nomeDaMarca,
      images: [{ url: seo.ogImageUrl, alt: seo.ogImageAlt }],
      locale: seo.idioma,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.titulo,
      description: seo.descricao,
      images: [seo.ogImageUrl],
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const config = getClientConfig();
  const themeVars = getThemeCssVariables(config.tema);

  return (
    <html lang={config.seo.idioma}>
      <body style={themeVars as React.CSSProperties}>{children}</body>
    </html>
  );
}
