import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import type { ProvaSocial } from "@/lib/validation/schema";

interface ProvasSociaisProps {
  provas: ProvaSocial[];
}

const TIPO_LABEL: Record<ProvaSocial["tipo"], string> = {
  depoimento: "Depoimento",
  resultado: "Resultado",
  selo: "Selo",
  midia: "Mídia",
};

/** Ícone decorativo por tipo de prova, usado só quando não há `imagemUrl`. */
const TIPO_ICONE: Record<ProvaSocial["tipo"], string> = {
  depoimento: "“",
  resultado: "✓",
  selo: "★",
  midia: "▶",
};

/**
 * Provas sociais em grade de cartões (2 colunas a partir de `sm`) — cada
 * uma com ícone/foto, tipo e texto. Direção "Comercial de Alta
 * Conversão": tratar prova como bloco de credibilidade visualmente
 * consistente (cartão com borda), não como citação solta, ajuda a
 * "escanear" resultados rapidamente.
 */
export function ProvasSociais({ provas }: ProvasSociaisProps) {
  if (provas.length === 0) return null;

  return (
    <Section className="py-6" ariaLabel="Provas sociais">
      <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
        Provas
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {provas.map((prova) => (
          <li key={prova.id} className="rounded-theme border border-border bg-background p-4">
            <div className="flex items-start gap-3">
              {prova.imagemUrl ? (
                <Image
                  src={prova.imagemUrl}
                  alt={prova.imagemAlt ?? ""}
                  width={36}
                  height={36}
                  className="mt-0.5 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary"
                >
                  {TIPO_ICONE[prova.tipo]}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  {TIPO_LABEL[prova.tipo]}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-text">{prova.texto}</p>
                {(prova.autor || prova.papel) && (
                  <p className="mt-2 text-xs font-medium text-text-secondary">
                    {prova.autor}
                    {prova.autor && prova.papel ? " — " : ""}
                    {prova.papel}
                  </p>
                )}
                {prova.ehFicticio && (
                  <div className="mt-2">
                    <Badge>Exemplo demonstrativo</Badge>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
