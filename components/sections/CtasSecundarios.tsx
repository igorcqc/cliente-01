import { LinkRow } from "@/components/ui/LinkRow";
import { Section } from "@/components/ui/Section";
import type { CtaSecundario } from "@/lib/validation/schema";

interface CtasSecundariosProps {
  ctas: CtaSecundario[];
}

/**
 * Caminhos secundários — chips (`LinkRow`) empilhados com espaçamento
 * próprio, para nunca competir em peso visual com o CTA principal
 * (`Button`, em `OfertaPrincipal`), mas sem parecer uma lista de rodapé
 * esquecida.
 */
export function CtasSecundarios({ ctas }: CtasSecundariosProps) {
  if (ctas.length === 0) return null;

  return (
    <Section className="py-6">
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
        Outros caminhos
      </h2>
      <ul className="flex flex-col gap-2.5">
        {ctas.map((cta) => (
          <li key={cta.id}>
            <LinkRow
              href={cta.url}
              kind="secundario"
              trackingId={cta.id}
              trackingEvent={cta.trackingEvent}
              icone={cta.icone}
              descricao={cta.descricao}
            >
              {cta.label}
            </LinkRow>
          </li>
        ))}
      </ul>
    </Section>
  );
}
