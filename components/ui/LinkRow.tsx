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
 * Linha de link para caminhos secundários, em formato de "chip"
 * (ícone circular + texto + seta) — visivelmente mais leve que o CTA
 * principal (`Button`), mas com peso próprio suficiente para não parecer
 * um link de rodapé esquecido (Direção "Comercial de Alta Conversão").
 *
 * Por que existe (em vez de reaproveitar `Button`): `Button` sempre
 * renderiza um bloco ligado ao estilo de tema do cliente
 * (`solid`/`outline`/`soft`) — correto para o CTA principal, mas
 * `LinkRow` precisa de um tratamento fixo e sempre mais discreto que
 * qualquer configuração de `estiloBotao`. `LinkRow` reaproveita a mesma
 * lógica de rastreamento e de abertura de link (`trackClick`,
 * `novaAbaProps`) que `Button` já usa — só a apresentação muda.
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
      className="group flex min-h-[52px] items-center gap-3 rounded-theme border border-border bg-background px-4 py-3 text-text transition-colors hover:border-primary hover:bg-surface"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base leading-none text-primary"
      >
        {icone ?? "→"}
      </span>
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="text-sm font-semibold leading-snug">{children}</span>
        {descricao && <span className="mt-0.5 truncate text-xs text-text-secondary">{descricao}</span>}
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
