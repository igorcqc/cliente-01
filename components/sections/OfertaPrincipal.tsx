import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import type { ClientConfig } from "@/lib/validation/schema";

interface OfertaPrincipalProps {
  oferta: ClientConfig["oferta"];
  estiloBotao: ClientConfig["tema"]["estiloBotao"];
}

/**
 * Oferta principal + CTA primário — o único elemento "elevado" da
 * página: borda sutil + sombra colorida na cor primária (via variável
 * CSS `--color-primary-rgb`, nunca uma cor de tema fixa no componente),
 * o que garante que ela funcione como o clímax visual da jornada, não
 * mais um cartão entre outros.
 *
 * Direção "Comercial de Alta Conversão": as credenciais (sinais de
 * autoridade) migraram para o Hero (ver `Hero.tsx`) — aparecem cedo, não
 * mais aqui — então este cartão fica só com oferta + CTA, sem repetir
 * informação.
 */
export function OfertaPrincipal({ oferta, estiloBotao }: OfertaPrincipalProps) {
  return (
    <Section className="py-4" ariaLabel="Oferta principal">
      <div
        className="rounded-theme border border-border bg-surface p-7 text-center"
        style={{ boxShadow: "0 24px 48px -20px rgb(var(--color-primary-rgb) / 0.35)" }}
      >
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          Oferta principal
        </span>
        <h2 className="mt-4 font-heading text-2xl font-extrabold leading-snug text-text">{oferta.titulo}</h2>
        <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">{oferta.descricao}</p>

        <div className="mt-6">
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
            <p className="mt-2.5 text-xs font-medium text-text-secondary">{oferta.ctaPrincipal.descricao}</p>
          )}
        </div>
      </div>
    </Section>
  );
}
