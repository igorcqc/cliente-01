import type { ClientConfig } from "@/lib/validation/schema";

/**
 * ⚠️ CONTEÚDO 100% FICTÍCIO — ARQUIVO DE REFERÊNCIA, NÃO É O CONTEÚDO ATIVO.
 *
 * "Marina Dantas" não é uma pessoa real. Nomes, credenciais, oferta,
 * depoimentos e números abaixo são inventados apenas para demonstrar o
 * formato esperado por `lib/validation/schema.ts`.
 *
 * Este arquivo **não é importado por nenhum código da aplicação** — quem
 * alimenta a página é exclusivamente `content/client.config.ts`, que
 * contém seu próprio conteúdo, independente deste. Editar este arquivo
 * nunca afeta a página publicada; editar `client.config.ts` nunca afeta
 * este arquivo. Essa independência é verificada automaticamente por
 * `scripts/check-content-independence.ts`, rodado a cada
 * `npm run validate` (ver docs/CORRECOES-FUNDACAO.md, item C1).
 *
 * Use-o como referência de preenchimento — para criar um cliente novo,
 * prefira copiar `templates/client.config.template.ts`.
 *
 * URLs usam o domínio reservado `example.com` (RFC 2606), nunca links
 * reais, para não sugerir que qualquer destino aqui é funcional.
 */
export const clientConfigExample: ClientConfig = {
  demonstracao: {
    ehDemonstracao: true,
    aviso:
      "Esta é uma página de referência do Bio que Vende. 'Marina Dantas' é uma expert fictícia — todos os dados, depoimentos e resultados são exemplos.",
  },

  identidade: {
    nome: "Marina Dantas",
    nomeDaMarca: "Marina Dantas Mentoria",
    avatarUrl: "/images/client/avatar-demo.svg",
    avatarAlt: "Foto ilustrativa de perfil de Marina Dantas (expert fictícia de demonstração)",
    posicionamento:
      "Ajudo consultoras autônomas a saírem da troca de hora por dinheiro e estruturarem uma mentoria em grupo previsível, sem precisar aparecer o tempo todo nas redes.",
    credenciais: [
      "Exemplo: +8 anos de experiência (fictício)",
      "Exemplo: Metodologia própria (fictício)",
    ],
  },

  posicionamento: {
    publico: "Consultoras autônomas que já têm clientes, mas vivem no limite da própria agenda.",
    transformacao:
      "Sair do atendimento 1:1 ilimitado e estruturar uma oferta em grupo que sustenta a agenda e o faturamento.",
    headline: "Pare de vender sua hora. Estruture uma mentoria que vende sozinha.",
    subtitulo: "Um método simples para consultoras que querem crescer sem se esgotar.",
  },

  oferta: {
    titulo: "Diagnóstico gratuito de posicionamento (exemplo)",
    descricao:
      "Uma conversa de 20 minutos para mapear se sua oferta atual está pronta para escalar. (Conteúdo demonstrativo.)",
    ctaPrincipal: {
      id: "cta-diagnostico-gratuito",
      label: "Quero meu diagnóstico gratuito",
      url: "https://example.com/agendar-diagnostico",
      trackingEvent: "cta_principal_click",
      descricao: "Exemplo: sem compromisso, leva cerca de 20 minutos.",
    },
  },

  ctasSecundarios: [
    {
      id: "cta-materia-gratuita",
      label: "Baixar guia gratuito (exemplo)",
      url: "https://example.com/guia-gratuito",
      trackingEvent: "cta_secundario_guia_click",
      icone: "⬇️",
    },
    {
      id: "cta-conhecer-metodo",
      label: "Conhecer o método (exemplo)",
      url: "https://example.com/metodo",
      trackingEvent: "cta_secundario_metodo_click",
    },
  ],

  provasSociais: [
    {
      id: "prova-depoimento-1",
      tipo: "depoimento",
      autor: "Cliente fictícia A.",
      papel: "Consultora de carreira (exemplo)",
      texto:
        "Depoimento fictício de demonstração: 'Consegui organizar minha oferta em grupo em poucas semanas.'",
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
    corSuperficie: "#F5F3FF",
    corPrimaria: "#7C3AED",
    corTexto: "#1E1B2E",
    corTextoSecundario: "#6B7280",
    raio: "lg",
    estiloBotao: "solid",
    fonteTitulo: "sans",
    fonteCorpo: "sans",
  },

  seo: {
    titulo: "Marina Dantas — Mentoria para consultoras (demonstração)",
    descricao:
      "Página de demonstração do Bio que Vende com dados fictícios de uma expert exemplo.",
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
