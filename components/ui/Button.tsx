"use client";

import type { AnchorHTMLAttributes } from "react";
import { BOTAO_ESTILO_CLASSES } from "@/lib/theme";
import { trackClick } from "@/lib/tracking/trackClick";
import { novaAbaProps } from "@/lib/links";
import type { CtaKind } from "@/lib/tracking/events";
import type { Tema } from "@/lib/validation/schema";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  estilo: Tema["estiloBotao"];
  /** Diferencia visualmente e no rastreamento o CTA principal dos secundários. */
  kind: CtaKind;
  trackingId: string;
  trackingEvent: string;
  /** Tamanho — o CTA principal deve ser claramente dominante na hierarquia visual. */
  size?: "lg" | "md";
  /**
   * Emoji decorativo opcional exibido antes do texto (`cta.icone`).
   * Sempre `aria-hidden` — o nome acessível do link continua vindo de
   * `children`, então não precisa (nem deve) ter texto alternativo próprio.
   */
  icone?: string;
}

/**
 * Botão/link usado por todos os CTAs (principal e secundários).
 * Nenhum texto é fixo aqui — `children`, `href` e os identificadores de
 * rastreamento vêm sempre do `client.config.ts`.
 */
export function Button({
  href,
  children,
  estilo,
  kind,
  trackingId,
  trackingEvent,
  size = "md",
  icone,
  className = "",
  ...rest
}: ButtonProps) {
  const sizeClasses =
    size === "lg" ? "text-base py-4 px-6 font-bold" : "text-sm py-3 px-4 font-semibold";
  // Direção "Comercial de Alta Conversão": o CTA principal ganha um leve
  // "levante" + sombra mais forte no hover — reforço tátil de que é o
  // elemento clicável dominante da página. `prefers-reduced-motion`
  // continua desativando a transição via regra global (app/globals.css).
  const principalClasses =
    kind === "principal" ? "hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0" : "";

  return (
    <a
      href={href}
      {...novaAbaProps(href)}
      data-cta-id={trackingId}
      data-cta-kind={kind}
      onClick={() =>
        trackClick({ id: trackingId, event: trackingEvent, kind, url: href })
      }
      className={`inline-flex w-full items-center justify-center gap-2 rounded-theme transition-all duration-150 ${BOTAO_ESTILO_CLASSES[estilo]} ${sizeClasses} ${principalClasses} ${className}`}
      {...rest}
    >
      {icone && (
        <span aria-hidden="true" className="mr-0.5">
          {icone}
        </span>
      )}
      {children}
      {kind === "principal" && (
        <span aria-hidden="true" className="text-lg leading-none">
          →
        </span>
      )}
    </a>
  );
}
