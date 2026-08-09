import type { ClientConfig } from "@/lib/validation/schema";

/**
 * ⚠️ ARQUIVO ATIVO — é este que `lib/getClientConfig.ts` carrega e valida.
 * É o único arquivo em `content/` importado por qualquer código da
 * aplicação (`app/`, `components/`, `lib/`).
 *
 * Este arquivo é **independente** de `content/client.example.ts` — ele
 * não importa, reexporta nem compartilha a mesma referência de objeto com
 * aquele arquivo. Editar um nunca afeta o outro. Essa independência é
 * verificada automaticamente a cada `npm run validate`/`npm run build`
 * por `scripts/check-content-independence.ts` (ver
 * docs/CORRECOES-FUNDACAO.md, item C1, para o histórico do bug que isso
 * corrige).
 *
 * ⚠️ Cliente fictício de demonstração. "Rafael Andrade" e "Andrade
 * Tráfego Pago" não são pessoa/negócio reais — foram inventados a
 * pedido do responsável pelo projeto para validar o fluxo completo de
 * onboarding descrito em `docs/ONBOARDING-CLIENTE.md`. Ver
 * `client/pendencias.md` para o que muda quando um cliente real assumir
 * este repositório.
 */
export const clientConfig: ClientConfig = {
  demonstracao: {
    ehDemonstracao: true,
    aviso:
      "Esta é uma página de demonstração do Bio que Vende. 'Rafael Andrade' é um gestor de tráfego pago fictício — todos os dados, depoimentos e resultados são exemplos.",
  },

  identidade: {
    nome: "Rafael Andrade",
    nomeDaMarca: "Andrade Tráfego Pago",
    avatarUrl: "/images/client/avatar-demo.svg",
    avatarAlt: "Foto ilustrativa de perfil de Rafael Andrade (gestor de tráfego pago fictício de demonstração)",
    posicionamento:
      "Ajudo donos de e-commerce e negócios locais a escalarem vendas com tráfego pago previsível, sem depender de sorte no algoritmo.",
    credenciais: [
      "Exemplo: +6 anos gerenciando campanhas de Meta Ads e Google Ads (fictício)",
      "Exemplo: Mais de R$ 2 milhões em verba de mídia gerenciada (fictício)",
    ],
  },

  posicionamento: {
    publico:
      "Donos de e-commerce e negócios locais que já investem em tráfego pago, mas não conseguem consistência de resultado.",
    transformacao:
      "Sair de campanhas soltas e sem estratégia para uma aquisição de clientes previsível, com metas de custo por resultado acompanhadas de perto.",
    headline: "Pare de queimar verba em anúncio. Comece a escalar com estratégia.",
    subtitulo: "Gestão de tráfego pago focada em resultado, não em vaidade.",
  },

  oferta: {
    titulo: "Diagnóstico gratuito de campanhas (exemplo)",
    descricao:
      "Uma análise de 30 minutos das suas campanhas atuais para identificar onde a verba está sendo desperdiçada. (Conteúdo demonstrativo.)",
    ctaPrincipal: {
      id: "cta-diagnostico-gratuito",
      label: "Quero meu diagnóstico gratuito",
      url: "https://example.com/agendar-diagnostico",
      trackingEvent: "cta_principal_click",
      descricao: "Exemplo: sem compromisso, leva cerca de 30 minutos.",
    },
  },

  ctasSecundarios: [
    {
      id: "cta-guia-trafego-pago",
      label: "Baixar guia gratuito de tráfego pago (exemplo)",
      url: "https://example.com/guia-trafego-pago",
      trackingEvent: "cta_secundario_guia_click",
      icone: "⬇️",
    },
    {
      id: "cta-conhecer-metodologia",
      label: "Conhecer a metodologia (exemplo)",
      url: "https://example.com/metodologia",
      trackingEvent: "cta_secundario_metodologia_click",
    },
  ],

  provasSociais: [
    {
      id: "prova-depoimento-1",
      tipo: "depoimento",
      autor: "Cliente fictícia A.",
      papel: "Dona de e-commerce de moda (exemplo)",
      texto:
        "Depoimento fictício de demonstração: 'Triplicamos o faturamento em 3 meses com campanhas mais assertivas.'",
      ehFicticio: true,
    },
    {
      id: "prova-resultado-1",
      tipo: "resultado",
      texto: "Resultado fictício de demonstração — substitua por um dado real e verificável do cliente.",
      ehFicticio: true,
    },
  ],

  redesSociais: [
    { plataforma: "instagram", label: "Instagram (exemplo)", url: "https://example.com/instagram" },
    { plataforma: "whatsapp", label: "WhatsApp (exemplo)", url: "https://example.com/whatsapp" },
  ],

  tema: {
    corFundo: "#FFFFFF",
    corSuperficie: "#EFF6FF",
    corPrimaria: "#2563EB",
    corTexto: "#0F172A",
    corTextoSecundario: "#64748B",
    raio: "md",
    estiloBotao: "solid",
    fonteTitulo: "sans",
    fonteCorpo: "sans",
  },

  seo: {
    titulo: "Rafael Andrade — Gestão de Tráfego Pago (demonstração)",
    descricao:
      "Página de demonstração do Bio que Vende com dados fictícios de um gestor de tráfego pago exemplo.",
    urlCanonica: "https://exemplo-cliente.vercel.app",
    ogImageUrl: "/images/shared/og-default.png",
    ogImageAlt: "Imagem de demonstração do Bio que Vende",
    idioma: "pt-BR",
  },

  rastreamento: {
    habilitado: true,
    observacoes:
      "Estrutura de rastreamento pronta para receber um provedor de analytics no futuro; nenhum provedor está conectado nesta v1.",
  },
};

export default clientConfig;
