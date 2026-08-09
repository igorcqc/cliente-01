import type { NextConfig } from "next";

/**
 * Configuração técnica do motor fixo.
 * Não deve ser editada por cliente — mudanças aqui afetam a base como um todo.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Nesta v1 as imagens do cliente vivem em /public/images/client,
    // então não há necessidade de domínios remotos configurados.
    remotePatterns: [],
    // Os placeholders de demonstração são SVG; clientes reais devem
    // preferir PNG/JPG/WebP otimizados por next/image.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
