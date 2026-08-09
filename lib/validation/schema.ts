import { z } from "zod";

/**
 * Contrato único do conteúdo de um cliente do Bio que Vende.
 *
 * Este schema é a fronteira formal entre:
 *  - o motor fixo (app/, components/, lib/) — nunca deve conhecer texto
 *    específico de um expert;
 *  - o conteúdo variável (content/client.config.ts) — nunca deve conter
 *    lógica de apresentação.
 *
 * Qualquer campo ausente ou mal formatado em `client.config.ts` deve falhar
 * aqui, com uma mensagem que aponte exatamente o campo problemático — tanto
 * em `npm run validate` quanto durante `next build` (o build importa e
 * valida o config antes de renderizar).
 *
 * Todo campo aceito aqui precisa ter um uso real em algum componente —
 * ver `docs/CORRECOES-FUNDACAO.md` (item I2) para o histórico dessa regra.
 */

const nonEmpty = (label: string) =>
  z.string().trim().min(1, { message: `${label}: é obrigatório e não pode estar vazio.` });

/**
 * Esquemas de URL aceitos em qualquer link configurável pelo cliente
 * (CTAs, redes sociais). Existe deliberadamente como allowlist — qualquer
 * esquema fora desta lista é rejeitado, incluindo `javascript:`, `data:`,
 * `vbscript:` e `file:`, que nunca fazem sentido num link de bio e são
 * vetores conhecidos de XSS/abuso se um valor malformado ou malicioso
 * chegar até aqui (ver docs/CORRECOES-FUNDACAO.md, item I3).
 */
const ALLOWED_URL_SCHEMES = new Set(["https:", "http:", "mailto:", "tel:"]);

const urlField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label}: é obrigatório e não pode estar vazio.` })
    .superRefine((value, ctx) => {
      let parsed: URL;
      try {
        parsed = new URL(value);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label}: precisa ser uma URL válida (ex: https://..., mailto:..., tel:...).`,
        });
        return;
      }
      if (!ALLOWED_URL_SCHEMES.has(parsed.protocol)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label}: esquema "${parsed.protocol}" não é permitido. Use https:, http:, mailto: ou tel:.`,
        });
      }
    });

const hexColor = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
      message: `${label}: precisa ser uma cor hexadecimal válida (ex: #0F172A).`,
    });

const IMAGE_EXTENSION_REGEX = /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i;

/**
 * Caminho de imagem aceito pela aplicação: um caminho local dentro de
 * `public/` (começando com "/") ou uma URL http(s) absoluta. Em ambos os
 * casos, exige uma extensão de imagem reconhecida — evita que um caminho
 * digitado errado (ex: sem a barra inicial, ou apontando para um arquivo
 * que não existe) passe pela validação silenciosamente e só quebre em
 * produção (ver docs/CORRECOES-FUNDACAO.md, item I4).
 *
 * `disallowSvg` bloqueia SVG especificamente — usado em `seo.ogImageUrl`,
 * porque WhatsApp/Facebook/LinkedIn/Twitter não renderizam SVG como
 * imagem de Open Graph (item I6).
 */
const imagePathField = (label: string, options?: { disallowSvg?: boolean }) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label}: é obrigatório e não pode estar vazio.` })
    .superRefine((value, ctx) => {
      const isLocalPath = value.startsWith("/");

      if (!isLocalPath) {
        try {
          const parsed = new URL(value);
          if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${label}: use um caminho local iniciado por "/" (ex: /images/client/foto.jpg) ou uma URL http(s) válida.`,
            });
            return;
          }
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${label}: use um caminho local iniciado por "/" (ex: /images/client/foto.jpg) ou uma URL http(s) válida.`,
          });
          return;
        }
      }

      if (!IMAGE_EXTENSION_REGEX.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label}: o caminho precisa terminar em .png, .jpg, .jpeg, .webp ou .gif${
            options?.disallowSvg ? "" : " (ou .svg)"
          }.`,
        });
        return;
      }

      if (options?.disallowSvg && /\.svg(\?.*)?$/i.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label}: SVG não é aceito aqui — a maioria dos apps de compartilhamento (WhatsApp, Facebook, LinkedIn) não renderiza SVG como imagem de Open Graph. Use PNG ou JPG.`,
        });
      }
    });

/**
 * Tipografia limitada a uma lista fixa de famílias seguras (todas
 * disponíveis via fontes de sistema, sem nenhum carregamento externo).
 * Nesta v1, o cliente escolhe uma destas opções — não uma string livre —
 * porque não há mecanismo de carregamento de fonte customizada (ver
 * docs/CORRECOES-FUNDACAO.md, item I5). Cada opção já tem um fallback
 * seguro embutido na própria pilha de fontes.
 */
export const FONTE_OPCOES = ["sans", "serif", "mono"] as const;
export type FonteOpcao = (typeof FONTE_OPCOES)[number];

export const FONTE_STACKS: Record<FonteOpcao, string> = {
  sans: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  serif: "ui-serif, Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
};

const fonteField = (label: string) =>
  z.enum(FONTE_OPCOES, {
    errorMap: () => ({
      message: `${label}: use uma das opções suportadas: ${FONTE_OPCOES.join(", ")}.`,
    }),
  });

/** Identidade básica e posicionamento do expert. */
export const identidadeSchema = z.object({
  nome: nonEmpty("identidade.nome"),
  nomeDaMarca: nonEmpty("identidade.nomeDaMarca"),
  avatarUrl: imagePathField("identidade.avatarUrl"),
  avatarAlt: nonEmpty("identidade.avatarAlt"),
  posicionamento: nonEmpty("identidade.posicionamento"),
  // Opcional e sem mínimo: um cliente pode legitimamente não ter
  // credenciais para exibir ainda. Se a chave estiver presente, cada
  // item precisa ser um texto não vazio; um array vazio é válido e
  // simplesmente não renderiza a seção (ver components/sections/Credenciais.tsx).
  credenciais: z.array(nonEmpty("identidade.credenciais[]")).optional(),
});

/** Público e transformação prometida — a essência da proposta de valor. */
export const posicionamentoSchema = z.object({
  publico: nonEmpty("posicionamento.publico"),
  transformacao: nonEmpty("posicionamento.transformacao"),
  headline: nonEmpty("posicionamento.headline"),
  subtitulo: nonEmpty("posicionamento.subtitulo"),
});

/** Um CTA (chamada para ação), com metadados de rastreamento. */
export const ctaSchema = z.object({
  id: nonEmpty("cta.id").regex(/^[a-z0-9-]+$/, {
    message: "cta.id: use apenas letras minúsculas, números e hífen (ex: cta-agendar-diagnostico).",
  }),
  label: nonEmpty("cta.label"),
  url: urlField("cta.url"),
  trackingEvent: nonEmpty("cta.trackingEvent"),
  // Legenda curta e opcional exibida abaixo do botão (ex: "Sem
  // compromisso, 20 minutos"). Renderizada em OfertaPrincipal/
  // CtasSecundarios — ver docs/CORRECOES-FUNDACAO.md, item I2.
  descricao: z.string().trim().max(140, { message: "cta.descricao: mantenha até 140 caracteres." }).optional(),
});

/** Oferta principal do expert. */
export const ofertaSchema = z.object({
  titulo: nonEmpty("oferta.titulo"),
  descricao: nonEmpty("oferta.descricao"),
  ctaPrincipal: ctaSchema,
});

/**
 * Link secundário (redes, whatsapp, outras páginas, etc.).
 * `icone` é um emoji decorativo opcional (ex: "⬇️") exibido antes do
 * texto do botão — é sempre `aria-hidden`, então nunca precisa de texto
 * alternativo próprio (o nome acessível do botão continua sendo `label`).
 */
export const ctaSecundarioSchema = ctaSchema.extend({
  icone: z
    .string()
    .trim()
    .max(4, { message: "cta.icone: use um único emoji curto (até 4 caracteres)." })
    .optional(),
});

/** Prova social — depoimento, resultado, selo, etc. */
export const provaSocialSchema = z
  .object({
    id: nonEmpty("provaSocial.id"),
    tipo: z.enum(["depoimento", "resultado", "selo", "midia"], {
      errorMap: () => ({ message: "provaSocial.tipo: use 'depoimento', 'resultado', 'selo' ou 'midia'." }),
    }),
    autor: z.string().trim().optional(),
    papel: z.string().trim().optional(),
    texto: nonEmpty("provaSocial.texto"),
    imagemUrl: imagePathField("provaSocial.imagemUrl").optional(),
    imagemAlt: z.string().trim().optional(),
    ehFicticio: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.imagemUrl && !value.imagemAlt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "provaSocial.imagemAlt: obrigatório quando provaSocial.imagemUrl está presente.",
        path: ["imagemAlt"],
      });
    }
  });

/** Rede social exibida no rodapé/seção de redes. */
export const redeSocialSchema = z.object({
  plataforma: z.enum(["instagram", "linkedin", "youtube", "tiktok", "whatsapp", "email", "site", "outro"], {
    errorMap: () => ({ message: "redeSocial.plataforma: valor não suportado." }),
  }),
  label: nonEmpty("redeSocial.label"),
  url: urlField("redeSocial.url"),
});

/** Tema visual — tokens tipados, nunca strings livres viram classes Tailwind dinâmicas. */
export const temaSchema = z.object({
  corFundo: hexColor("tema.corFundo"),
  corSuperficie: hexColor("tema.corSuperficie"),
  corPrimaria: hexColor("tema.corPrimaria"),
  corTexto: hexColor("tema.corTexto"),
  corTextoSecundario: hexColor("tema.corTextoSecundario"),
  raio: z.enum(["none", "sm", "md", "lg", "full"], {
    errorMap: () => ({ message: "tema.raio: use 'none', 'sm', 'md', 'lg' ou 'full'." }),
  }),
  estiloBotao: z.enum(["solid", "outline", "soft"], {
    errorMap: () => ({ message: "tema.estiloBotao: use 'solid', 'outline' ou 'soft'." }),
  }),
  fonteTitulo: fonteField("tema.fonteTitulo"),
  fonteCorpo: fonteField("tema.fonteCorpo"),
});

/** Metadados de SEO e Open Graph. */
export const seoSchema = z.object({
  titulo: nonEmpty("seo.titulo"),
  descricao: nonEmpty("seo.descricao"),
  urlCanonica: urlField("seo.urlCanonica"),
  // SVG proibido especificamente aqui — ver imagePathField e item I6.
  ogImageUrl: imagePathField("seo.ogImageUrl", { disallowSvg: true }),
  ogImageAlt: nonEmpty("seo.ogImageAlt"),
  idioma: z.string().trim().default("pt-BR"),
});

/**
 * Configuração de rastreamento — apenas estrutura, sem chaves/segredos.
 * `habilitado` controla de fato se `trackClick` dispara algo (ver
 * `lib/tracking/trackClick.ts`) — deixar `false` desliga o rastreamento
 * sem quebrar a navegação dos CTAs.
 */
export const rastreamentoSchema = z.object({
  habilitado: z.boolean(),
  observacoes: z.string().trim().optional(),
});

/** Marcação explícita de conteúdo de demonstração. */
export const demonstracaoSchema = z.object({
  ehDemonstracao: z.boolean(),
  aviso: z.string().trim().optional(),
});

export const clientConfigSchema = z.object({
  demonstracao: demonstracaoSchema,
  identidade: identidadeSchema,
  posicionamento: posicionamentoSchema,
  oferta: ofertaSchema,
  ctasSecundarios: z.array(ctaSecundarioSchema).default([]),
  provasSociais: z.array(provaSocialSchema).default([]),
  redesSociais: z.array(redeSocialSchema).default([]),
  tema: temaSchema,
  seo: seoSchema,
  rastreamento: rastreamentoSchema,
});

export type ClientConfig = z.infer<typeof clientConfigSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type CtaSecundario = z.infer<typeof ctaSecundarioSchema>;
export type ProvaSocial = z.infer<typeof provaSocialSchema>;
export type RedeSocial = z.infer<typeof redeSocialSchema>;
export type Tema = z.infer<typeof temaSchema>;
