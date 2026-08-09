import { Section } from "@/components/ui/Section";
import type { ClientConfig } from "@/lib/validation/schema";

interface PosicionamentoProps {
  identidade: ClientConfig["identidade"];
  posicionamento: ClientConfig["posicionamento"];
}

/**
 * Quem é o expert, quem ele ajuda e qual transformação oferece —
 * tratado como texto editorial corrido, não como uma tabela de dados.
 * Sem cartão/borda ao redor: o parágrafo de posicionamento fala por si,
 * e a linha "para quem / transformação" ganha destaque só com um traço
 * fino na cor primária, não uma caixa cheia.
 */
export function Posicionamento({ identidade, posicionamento }: PosicionamentoProps) {
  return (
    <Section className="pb-10 pt-2">
      <p className="text-base font-medium leading-relaxed text-text">{identidade.posicionamento}</p>
      <div className="mt-5 border-l-[3px] border-primary pl-4">
        <p className="text-sm leading-relaxed text-text-secondary">
          <span className="font-semibold text-text">Para quem: </span>
          {posicionamento.publico}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          <span className="font-semibold text-text">A transformação: </span>
          {posicionamento.transformacao}
        </p>
      </div>
    </Section>
  );
}
