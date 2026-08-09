import type { ElementType, ReactNode } from "react";
import { siteConfig } from "@/config/site";

interface SectionProps {
  children: ReactNode;
  className?: string;
  /** Usado para landmarks de acessibilidade (ex: "Provas sociais"). */
  ariaLabel?: string;
  /** Tag semântica do wrapper — `section` por padrão, `footer` no rodapé. */
  as?: ElementType;
}

/**
 * Wrapper padrão de seção — garante container, espaçamento e largura
 * consistentes (mobile-first) em toda a página, sem que cada seção
 * precise repetir essas classes.
 */
export function Section({ children, className = "", ariaLabel, as: Tag = "section" }: SectionProps) {
  return (
    <Tag
      aria-label={ariaLabel}
      className={`w-full ${siteConfig.containerMaxWidth} mx-auto px-5 py-6 ${className}`}
    >
      {children}
    </Tag>
  );
}
