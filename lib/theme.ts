import { FONTE_STACKS, type Tema } from "./validation/schema";

/**
 * Traduz o tema do cliente (dados) em variáveis CSS (custom properties).
 *
 * Importante: isto NUNCA gera nomes de classes Tailwind dinamicamente
 * (nada como `bg-${cor}`), porque o Tailwind precisa enxergar o nome
 * completo da classe em tempo de build para incluí-la no CSS final — uma
 * string interpolada não seria detectada e sumiria no build de produção
 * da Vercel.
 *
 * Correção de C3 (docs/CORRECOES-FUNDACAO.md): as cores são expostas como
 * variáveis CSS com os **canais RGB separados** (ex: `--color-primary-rgb:
 * 124 58 237`), não como a string hex direta. `tailwind.config.ts` usa
 * essas variáveis dentro de `rgb(var(--x) / <alpha-value>)` — esse é o
 * padrão oficial do Tailwind para permitir que classes com modificador de
 * opacidade (`bg-primary/10`, `hover:bg-primary/20`, etc.) sejam geradas
 * corretamente no build de produção. Uma cor exposta como `var(--x)` puro
 * (a abordagem anterior) não permite ao Tailwind calcular opacidade —
 * essas classes desapareciam silenciosamente do CSS final.
 */

const RAIO_PX: Record<Tema["raio"], string> = {
  none: "0px",
  sm: "6px",
  md: "12px",
  lg: "20px",
  full: "9999px",
};

export type ThemeCssVariables = Record<string, string>;

/** Converte "#RGB" ou "#RRGGBB" em canais separados por espaço: "R G B". */
export function hexToRgbChannels(hex: string): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Luminância relativa (fórmula WCAG) de uma cor hex, 0 (preto) a 1
 * (branco) — usada só para decidir se o texto sobre a cor primária deve
 * ser claro ou escuro (ver `getThemeCssVariables`).
 */
function relativeLuminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = hexToRgbChannels(hex)
    .split(" ")
    .map((channel) => {
      const c = Number(channel) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getThemeCssVariables(tema: Tema): ThemeCssVariables {
  return {
    "--color-background-rgb": hexToRgbChannels(tema.corFundo),
    "--color-surface-rgb": hexToRgbChannels(tema.corSuperficie),
    "--color-primary-rgb": hexToRgbChannels(tema.corPrimaria),
    // Texto sobre o botão primário: calculado pela luminância relativa da
    // própria cor primária (WCAG), não mais aproximado a partir de
    // `corFundo`. A abordagem antiga assumia implicitamente "fundo claro
    // + primária saturada" — funcionava em temas claros, mas gerava texto
    // escuro sobre botão em qualquer tema escuro (fundo escuro usado como
    // "cor clara" do texto). Calcular a partir da própria cor do botão
    // funciona nos dois casos, sem precisar de um campo novo no schema.
    "--color-primary-foreground-rgb":
      relativeLuminance(tema.corPrimaria) > 0.5 ? "17 17 17" : "255 255 255",
    "--color-text-rgb": hexToRgbChannels(tema.corTexto),
    "--color-text-secondary-rgb": hexToRgbChannels(tema.corTextoSecundario),
    "--color-border-rgb": hexToRgbChannels(tema.corTextoSecundario),
    "--radius": RAIO_PX[tema.raio],
    "--font-heading": FONTE_STACKS[tema.fonteTitulo],
    "--font-body": FONTE_STACKS[tema.fonteCorpo],
  };
}

/**
 * Classes estáticas (conhecidas em build-time) para cada estilo de botão.
 * Nunca combine strings do cliente para formar nomes de classe — o estilo
 * escolhido pelo cliente (`solid` | `outline` | `soft`) apenas seleciona
 * qual conjunto fixo de classes é usado.
 *
 * As variantes com opacidade (`/10`, `/20`) funcionam em produção porque
 * `primary` é definida em `tailwind.config.ts` como
 * `rgb(var(--color-primary-rgb) / <alpha-value>)` — ver comentário acima.
 */
export const BOTAO_ESTILO_CLASSES: Record<Tema["estiloBotao"], string> = {
  solid: "bg-primary text-primary-foreground border border-transparent hover:opacity-90",
  outline: "bg-transparent text-primary border border-primary hover:bg-primary/10",
  soft: "bg-primary/10 text-primary border border-transparent hover:bg-primary/20",
};
