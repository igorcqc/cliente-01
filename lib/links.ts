/**
 * Esquemas que abrem um app externo (e-mail, telefone) em vez de navegar
 * para uma página web — `target="_blank"` não faz sentido para eles (não
 * há "nova aba" a abrir) e pode gerar uma aba em branco em alguns
 * navegadores. Usado por todo link renderizado a partir do conteúdo do
 * cliente (`components/ui/Button.tsx`, `components/sections/RedesSociais.tsx`).
 */
const ESQUEMAS_SEM_NOVA_ABA = ["mailto:", "tel:"];

/** Se um link deve abrir em nova aba (com `rel="noopener noreferrer"`). */
export function deveAbrirNovaAba(href: string): boolean {
  return !ESQUEMAS_SEM_NOVA_ABA.some((esquema) => href.startsWith(esquema));
}

/** Atributos de anchor prontos para spread — `{}` quando não deve abrir nova aba. */
export function novaAbaProps(href: string): { target?: "_blank"; rel?: "noopener noreferrer" } {
  return deveAbrirNovaAba(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
