/**
 * Nomes de eventos e tipos de rastreamento de cliques.
 *
 * Esta v1 não integra nenhum provedor de analytics (sem GA, Meta Pixel,
 * Vercel Analytics, etc.) — apenas define a estrutura para que a
 * instrumentação futura seja um `trackClick` (`./trackClick.ts`) e
 * pronto, sem precisar tocar nos componentes de seção.
 */

export type CtaKind = "principal" | "secundario";

export interface TrackClickPayload {
  /** Identificador estável do CTA, definido no client.config.ts (`cta.id`). */
  id: string;
  /** Nome descritivo do evento, definido no client.config.ts (`cta.trackingEvent`). */
  event: string;
  /** Diferencia CTA principal de CTAs secundários. */
  kind: CtaKind;
  /** URL de destino do CTA, útil para depuração. */
  url: string;
}
