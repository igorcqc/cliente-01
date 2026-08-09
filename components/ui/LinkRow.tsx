"use client";

import { trackClick } from "@/lib/tracking/trackClick";
import { novaAbaProps } from "@/lib/links";
import type { CtaKind } from "@/lib/tracking/events";

interface LinkRowProps {
  href: string;
  children: React.ReactNode;
  kind: CtaKind;
  trackingId: string;
  trackingEvent: string;
  icone?: string;
  descricao?: string;
}

/**
 * Linha de link minimalista para caminhos secundários.
 *
 * Por que existe (em vez de reaproveitar `Button`): `Button` sempre
 * renderiza um bloco com preenchimento/borda ligado ao estilo de tema do
 * cliente (`solid`/`outline`/`soft`) — correto para o CTA principal, mas
 * pesado demais para uma lista de caminhos secundários, que precisa
 * claramente perder para o CTA principal em peso visual (ver
 * docs/VISUAL-DEMONSTRATIVO.md). `LinkRow` reaproveita a mesma lógica de
 * rastreamento e de abertura de link (`trackClick`, `novaAbaProps`) que
 * `Button` já usa — só a apresentação é diferente: texto + seta, sem
 * preenchimento nem borda ao redor de cada item.
 */
export function LinkRow({
  href,
  children,
  kind,
  trackingId,
  trackingEvent,
  icone,
  descricao,
}: LinkRowProps) {
  return (
    <a
      href={href}
      {...novaAbaProps(href)}
      data-cta-id={trackingId}
      data-cta-kind={kind}
      onClick={() => trackClick({ id: trackingId, event: trackingEvent, kind, url: href })}
      className="group flex min-h-[44px] items-center justify-between gap-3 py-3 text-text transition-colors hover:text-primary"
    >
      <span className="flex flex-col">
        <span className="flex items-center gap-2 text-sm font-medium">
          {icone && (
            <span aria-hidden="true" className="text-base leading-none">
              {icone}
            </span>
          )}
          {children}
        </span>
        {descricao && <span className="mt-0.5 text-xs text-text-secondary">{descricao}</span>}
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 text-text-secondary transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </a>
  );
}
