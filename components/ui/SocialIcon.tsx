import type { RedeSocial } from "@/lib/validation/schema";

/**
 * Ícones de linha minimalistas, desenhados à mão em SVG inline — sem
 * biblioteca de ícones externa (nenhuma dependência nova). São
 * pictogramas genéricos (não reproduções de logo de marca), consistentes
 * com o restante da linguagem visual (`currentColor`, traço fino).
 * `aria-hidden` sempre — o nome acessível do link vem de `aria-label` no
 * `<a>` que envolve o ícone (ver `components/sections/RedesSociais.tsx`).
 */

const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ICONS: Record<RedeSocial["plataforma"], React.ReactNode> = {
  instagram: (
    <svg {...ICON_PROPS}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg {...ICON_PROPS}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <line x1="7.8" y1="10" x2="7.8" y2="16.2" />
      <circle cx="7.8" cy="7.3" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11.6 16.2v-4c0-1.2.9-2.2 2.1-2.2s2.1 1 2.1 2.2v4" />
    </svg>
  ),
  youtube: (
    <svg {...ICON_PROPS}>
      <rect x="3" y="5.5" width="18" height="13" rx="4" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg {...ICON_PROPS}>
      <path d="M13 4v10.2a2.8 2.8 0 1 1-2.3-2.75" />
      <path d="M13 4c.4 2 2 3.5 4 3.8" />
    </svg>
  ),
  whatsapp: (
    <svg {...ICON_PROPS}>
      <path d="M6.5 17.5 4.5 20l2.6-.7A8 8 0 1 0 5 12a7.9 7.9 0 0 0 1.5 5.5z" />
      <path d="M9 10.3c0 3 2.2 5.3 5.3 5.3.6 0 1-.5.9-1.1l-.2-.9a.8.8 0 0 0-.9-.6l-1 .2a4.6 4.6 0 0 1-2.6-2.6l.2-1a.8.8 0 0 0-.6-.9l-.9-.2c-.6-.1-1.2.3-1.2.9z" />
    </svg>
  ),
  email: (
    <svg {...ICON_PROPS}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="M4.5 7l7.5 6 7.5-6" />
    </svg>
  ),
  site: (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="8.5" />
      <ellipse cx="12" cy="12" rx="3.4" ry="8.5" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" />
    </svg>
  ),
  outro: (
    <svg {...ICON_PROPS}>
      <path d="M9.5 14.5l5-5" />
      <path d="M11 8.5l1.1-1.1a3 3 0 1 1 4.5 4l-1.1 1.1" />
      <path d="M13 15.5l-1.1 1.1a3 3 0 1 1-4.5-4l1.1-1.1" />
    </svg>
  ),
};

export function SocialIcon({ plataforma }: { plataforma: RedeSocial["plataforma"] }) {
  return <span aria-hidden="true">{ICONS[plataforma]}</span>;
}
