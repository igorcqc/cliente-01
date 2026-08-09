import { getClientConfig } from "@/lib/getClientConfig";
import type { TrackClickPayload } from "./events";

/**
 * Ponto único de disparo de rastreamento de cliques.
 *
 * Hoje não há nenhum provedor de analytics conectado (por decisão de
 * escopo desta v1 — sem GA, sem Meta Pixel, sem Vercel Analytics). O
 * evento é apenas registrado no console em desenvolvimento, para que a
 * estrutura de dados (`TrackClickPayload`) já esteja validada.
 *
 * `rastreamento.habilitado` (em `content/client.config.ts`) controla de
 * fato se isto dispara algo: com `false`, a função retorna sem logar e
 * sem preparar nada — a navegação do link nunca depende deste resultado,
 * então desligar o rastreamento nunca quebra um clique.
 *
 * Quando um provedor for adicionado no futuro, esta é a única função que
 * precisa mudar — os componentes de CTA já chamam `trackClick` em cada
 * clique e não precisam ser alterados.
 */
export function trackClick(payload: TrackClickPayload): void {
  const { habilitado } = getClientConfig().rastreamento;
  if (!habilitado) return;

  if (process.env.NODE_ENV !== "production") {
    console.debug("[bio-que-vende] trackClick", payload);
  }

  // Ponto de extensão futuro, por exemplo:
  // window.gtag?.("event", payload.event, { cta_id: payload.id, cta_kind: payload.kind });
}
