import { Button } from "@/components/ui/Button";
import { Credenciais } from "@/components/sections/Credenciais";
import { Section } from "@/components/ui/Section";
import type { ClientConfig } from "@/lib/validation/schema";

interface OfertaPrincipalProps {
  oferta: ClientConfig["oferta"];
  estiloBotao: ClientConfig["tema"]["estiloBotao"];
  credenciais?: string[];
}

/**
 * Oferta principal + CTA primário — o único elemento "elevado" da
 * página (sombra suave em vez de borda, marcador de destaque na cor
 * primária no topo do cartão). É a única seção com esse tratamento —
 * é o que garante que ela funcione como o clímax visual da jornada, não
 * mais um cartão entre outros.
 *
 * As credenciais (sinais de autoridade) aparecem aqui, logo acima do
 * CTA — o último reforço de confiança antes do clique.
 */
export function OfertaPrincipal({ oferta, estiloBotao, credenciais }: OfertaPrincipalProps) {
  return (
    <Section className="py-4" ariaLabel="Oferta principal">
      <div className="rounded-theme bg-surface p-6 text-center shadow-sm">
        <div aria-hidden="true" className="mx-auto mb-4 h-1 w-10 rounded-full bg-primary" />
        <h2 className="font-heading text-xl font-bold leading-snug text-text">{oferta.titulo}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{oferta.descricao}</p>

        {credenciais && credenciais.length > 0 && (
          <div className="mt-4">
            <Credenciais credenciais={credenciais} />
          </div>
        )}

        <div className="mt-5">
          <Button
            href={oferta.ctaPrincipal.url}
            estilo={estiloBotao}
            kind="principal"
            trackingId={oferta.ctaPrincipal.id}
            trackingEvent={oferta.ctaPrincipal.trackingEvent}
            size="lg"
          >
            {oferta.ctaPrincipal.label}
          </Button>
          {oferta.ctaPrincipal.descricao && (
            <p className="mt-2.5 text-xs text-text-secondary">{oferta.ctaPrincipal.descricao}</p>
          )}
        </div>
      </div>
    </Section>
  );
}
