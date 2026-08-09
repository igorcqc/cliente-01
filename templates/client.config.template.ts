import type { ClientConfig } from "@/lib/validation/schema";

/**
 * MODELO para um novo cliente.
 *
 * Como usar:
 *   1. Copie este arquivo para `content/client.config.ts` no repositório
 *      do cliente (sobrescrevendo o conteúdo de demonstração).
 *   2. Substitua cada valor entre [COLCHETES] pelo dado real do cliente.
 *   3. Rode `npm run validate` — os erros apontam exatamente o campo que
 *      ainda precisa de atenção. Isso é intencional: campos genuinamente
 *      obrigatórios (como a URL do CTA principal) devem falhar até serem
 *      preenchidos com um valor real — nunca publique um [COLCHETE].
 *   4. Quando terminar, mude `demonstracao.ehDemonstracao` para `false`.
 *
 * Campos como `identidade.credenciais` são opcionais de verdade: pode
 * deixar `[]` (vazio) se o cliente ainda não tiver credenciais para
 * exibir — isso passa na validação normalmente e a seção simplesmente
 * não aparece na página.
 *
 * Não deixe nenhum [COLCHETE] no conteúdo publicado.
 *
 * ---
 * Resumo — obrigatório vs. opcional (a validação (`npm run validate`)
 * é sempre a fonte da verdade; isto é só um resumo de leitura rápida):
 *
 * OBRIGATÓRIOS para qualquer cliente: `demonstracao.ehDemonstracao`,
 * todo `identidade.*` exceto `credenciais`, todo `posicionamento.*`,
 * todo `oferta.*` (incluindo `oferta.ctaPrincipal.*` exceto
 * `descricao`), todo `seo.*`, `rastreamento.habilitado`.
 *
 * OPCIONAIS (podem ficar `[]`/ausentes/`undefined` sem quebrar nada):
 * `identidade.credenciais`, `oferta.ctaPrincipal.descricao`,
 * `ctasSecundarios` (array inteiro, e `icone`/`descricao` de cada
 * item), `provasSociais` (array inteiro, e `autor`/`papel`/
 * `imagemUrl`/`imagemAlt`/`ehFicticio` de cada item — mas se preencher
 * `imagemUrl`, `imagemAlt` passa a ser obrigatório junto),
 * `redesSociais` (array inteiro), `demonstracao.aviso`,
 * `rastreamento.observacoes`.
 * ---
 */
export const clientConfig: ClientConfig = {
  demonstracao: {
    ehDemonstracao: false,
    // Remova este campo (ou deixe undefined) quando não for mais demonstração.
    aviso: undefined,
  },

  identidade: {
    nome: "[NOME COMPLETO DO EXPERT]",
    nomeDaMarca: "[NOME DA MARCA/NEGÓCIO]",
    avatarUrl: "/images/client/[ARQUIVO-DA-FOTO].jpg",
    avatarAlt: "[DESCRIÇÃO CURTA DA FOTO PARA LEITORES DE TELA]",
    posicionamento: "[1–2 frases: quem é, o que faz, para quem]",
    // Opcional de verdade — deixe como [] se ainda não houver
    // credenciais reais para exibir. Nunca invente uma.
    credenciais: [
      // "[Credencial real 1]",
      // "[Credencial real 2]",
    ],
  },

  posicionamento: {
    publico: "[Quem esse expert atende — específico, não genérico]",
    transformacao: "[Qual mudança concreta a pessoa vive ao trabalhar com o expert]",
    headline: "[Frase de maior destaque da página — a promessa central]",
    subtitulo: "[Complemento curto da headline]",
  },

  oferta: {
    titulo: "[Nome da oferta/produto principal]",
    descricao: "[O que a pessoa recebe ao aceitar a oferta]",
    ctaPrincipal: {
      id: "cta-principal",
      label: "[Texto do botão principal, ex: Quero começar agora]",
      // Apenas https:, http:, mailto: ou tel: são aceitos.
      url: "[URL real de destino do CTA principal, ex: https://...]",
      trackingEvent: "cta_principal_click",
      // Opcional — legenda curta abaixo do botão (ex: "Sem compromisso, 20 minutos").
      // descricao: "[legenda curta, opcional]",
    },
  },

  ctasSecundarios: [
    // {
    //   id: "cta-secundario-1",
    //   label: "[Texto do link secundário]",
    //   url: "[URL real — https:, http:, mailto: ou tel:]",
    //   trackingEvent: "cta_secundario_1_click",
    //   icone: "[emoji opcional, ex: ⬇️]",
    // },
  ],

  provasSociais: [
    // {
    //   id: "prova-1",
    //   tipo: "depoimento", // "depoimento" | "resultado" | "selo" | "midia"
    //   autor: "[Nome real ou iniciais autorizadas pelo cliente]",
    //   papel: "[Cargo/contexto]",
    //   texto: "[Depoimento real — nunca invente]",
    //   ehFicticio: false,
    // },
  ],

  redesSociais: [
    // { plataforma: "instagram", label: "Instagram", url: "[URL real]" },
  ],

  tema: {
    corFundo: "#FFFFFF",
    corSuperficie: "#F5F5F5",
    corPrimaria: "#111111",
    corTexto: "#111111",
    corTextoSecundario: "#555555",
    raio: "md",
    estiloBotao: "solid",
    // Tipografia limitada a "sans" | "serif" | "mono" nesta v1 — não há
    // carregamento de fonte customizada (ver docs/CORRECOES-FUNDACAO.md,
    // item I5). Cada opção já usa fontes de sistema seguras.
    fonteTitulo: "sans",
    fonteCorpo: "sans",
  },

  seo: {
    titulo: "[Título da aba do navegador / SEO]",
    descricao: "[Descrição curta para buscadores e compartilhamento]",
    urlCanonica: "https://[dominio-do-cliente].vercel.app",
    // PNG ou JPG apenas — SVG não é aceito aqui (não renderiza como
    // preview em WhatsApp/Facebook/LinkedIn). Recomendado 1200×630px.
    ogImageUrl: "/images/client/[IMAGEM-OG].jpg",
    ogImageAlt: "[Descrição da imagem de compartilhamento]",
    idioma: "pt-BR",
  },

  rastreamento: {
    // false desliga o disparo de rastreamento (hoje só console.debug em
    // dev) sem afetar a navegação dos CTAs.
    habilitado: true,
    observacoes: undefined,
  },
};

export default clientConfig;
