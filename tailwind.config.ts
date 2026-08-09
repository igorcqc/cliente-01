import type { Config } from "tailwindcss";

/**
 * Configuração técnica do motor fixo.
 *
 * As cores do tema NÃO são geradas dinamicamente a partir do conteúdo do
 * cliente (nunca `bg-${color}`). Em vez disso, o Tailwind aponta para
 * variáveis CSS (custom properties) que são escritas em runtime por
 * `lib/theme.ts` a partir de `content/client.config.ts`. Isso mantém todas
 * as classes estáticas e detectáveis pelo compilador do Tailwind, o que é
 * obrigatório para funcionar corretamente no build de produção da Vercel
 * (o Tailwind não gera classes que não aparecem literalmente no código).
 *
 * As cores usam o padrão `rgb(var(--x-rgb) / <alpha-value>)` (com os
 * canais RGB separados por espaço na variável, não a string hex direta).
 * É o padrão oficial do Tailwind para permitir que classes com modificador
 * de opacidade (`bg-primary/10`, `hover:bg-primary/20`, etc.) sejam
 * calculadas em CSS puro e apareçam no build de produção — ver
 * `docs/CORRECOES-FUNDACAO.md` (item C3) para o histórico do bug que isso
 * corrige: com a cor exposta como `var(--x)` puro, o Tailwind não
 * conseguia gerar as variantes de opacidade e elas desapareciam
 * silenciosamente do CSS final.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // BOTAO_ESTILO_CLASSES (lib/theme.ts) monta classes Tailwind a partir de
    // um Record fixo — o Tailwind só as inclui no CSS final se este
    // diretório também for escaneado. Sem isto, as classes de botão somem
    // silenciosamente no build de produção (purge).
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background-rgb) / <alpha-value>)",
        surface: "rgb(var(--color-surface-rgb) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--color-primary-rgb) / <alpha-value>)",
          foreground: "rgb(var(--color-primary-foreground-rgb) / <alpha-value>)",
        },
        text: {
          DEFAULT: "rgb(var(--color-text-rgb) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary-rgb) / <alpha-value>)",
        },
        border: "rgb(var(--color-border-rgb) / <alpha-value>)",
      },
      borderRadius: {
        theme: "var(--radius)",
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
    },
  },
  plugins: [],
};

export default config;
