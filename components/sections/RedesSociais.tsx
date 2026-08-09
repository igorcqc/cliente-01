import { Section } from "@/components/ui/Section";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { novaAbaProps } from "@/lib/links";
import type { RedeSocial } from "@/lib/validation/schema";

interface RedesSociaisProps {
  redes: RedeSocial[];
}

/**
 * Redes sociais como uma linha discreta de ícones — sem texto visível,
 * sem borda/cartão por item — para não repetir o padrão de "lista de
 * botões" já usado pelo CTA principal e pelos caminhos secundários.
 * Área de toque de 44×44px por ícone; nome acessível vem de
 * `rede.label` via `aria-label` (o ícone em si é `aria-hidden`).
 */
export function RedesSociais({ redes }: RedesSociaisProps) {
  if (redes.length === 0) return null;

  return (
    <Section className="py-6" ariaLabel="Redes sociais">
      <nav aria-label="Redes sociais">
        <ul className="flex flex-wrap items-center justify-center gap-1">
          {redes.map((rede) => (
            <li key={rede.url}>
              <a
                href={rede.url}
                {...novaAbaProps(rede.url)}
                aria-label={rede.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface hover:text-primary"
              >
                <SocialIcon plataforma={rede.plataforma} />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}
