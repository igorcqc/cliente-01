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

/**
 * Provas sociais tratadas como bloco editorial (citações), separadas por
 * um traço fino entre itens — não cartões empilhados com fundo e borda
 * repetidos, que pesam visualmente e lembram uma lista de dashboard.
 */
export function ProvasSociais({ provas }: ProvasSociaisProps) {
  if (provas.length === 0) return null;

  return (
    <Section className="py-6" ariaLabel="Provas sociais">
      <h2 className="mb-5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        Provas
      </h2>
      <ul className="space-y-6">
        {provas.map((prova, index) => (
          <li
            key={prova.id}
            className={index > 0 ? "border-t border-border pt-6" : ""}
          >
            <div className="flex items-start gap-3">
              {prova.imagemUrl && (
                <Image
                  src={prova.imagemUrl}
                  alt={prova.imagemAlt ?? ""}
                  width={40}
                  height={40}
                  className="mt-0.5 shrink-0 rounded-theme object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  {TIPO_LABEL[prova.tipo]}
                </p>
                <p className="mt-1.5 text-base leading-relaxed text-text">&ldquo;{prova.texto}&rdquo;</p>
                {(prova.autor || prova.papel) && (
                  <p className="mt-2 text-xs text-text-secondary">
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
