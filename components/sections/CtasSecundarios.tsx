import { LinkRow } from "@/components/ui/LinkRow";
import { Section } from "@/components/ui/Section";
import type { CtaSecundario } from "@/lib/validation/schema";

interface CtasSecundariosProps {
  ctas: CtaSecundario[];
}

/**
 * Caminhos secundários — uma lista de texto discreta (`LinkRow`), sem
 * preenchimento nem borda ao redor de cada item, para nunca competir em
 * peso visual com o CTA principal (`Button`, em `OfertaPrincipal`).
 */
export function CtasSecundarios({ ctas }: CtasSecundariosProps) {
  if (ctas.length === 0) return null;

  return (
    <Section className="py-6">
      <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        Outros caminhos
      </h2>
      <ul className="divide-y divide-border">
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
