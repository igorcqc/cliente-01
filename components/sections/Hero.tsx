import { Avatar } from "@/components/ui/Avatar";
import { Section } from "@/components/ui/Section";
import type { ClientConfig } from "@/lib/validation/schema";

interface HeroProps {
  identidade: ClientConfig["identidade"];
  posicionamento: ClientConfig["posicionamento"];
}

/**
 * Hero: quem é a expert (avatar + nome + marca) e a promessa central
 * (headline + subtítulo). A headline é deliberadamente o maior elemento
 * tipográfico da primeira tela — é a âncora visual da página, antes de
 * qualquer cartão ou botão.
 *
 * Direção "Comercial de Alta Conversão": sinais de credibilidade
 * (`identidade.credenciais`) aparecem cedo, como chips logo abaixo da
 * promessa — não só no fim da jornada, perto do CTA — para que a
 * autoridade já esteja estabelecida antes da pessoa rolar a página.
 */
export function Hero({ identidade, posicionamento }: HeroProps) {
  return (
    <Section className="flex flex-col items-center pb-6 pt-14 text-center" ariaLabel="Apresentação">
      <Avatar src={identidade.avatarUrl} alt={identidade.avatarAlt} />
      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {identidade.nome} <span aria-hidden="true" className="text-border">·</span> {identidade.nomeDaMarca}
      </p>
      <h1 className="mt-3 max-w-[20rem] font-heading text-[1.85rem] font-extrabold leading-[1.15] tracking-tight text-text sm:text-[2.1rem]">
        {posicionamento.headline}
      </h1>
      <p className="mt-3 max-w-[22rem] text-base leading-relaxed text-text-secondary">
        {posicionamento.subtitulo}
      </p>
      {identidade.credenciais && identidade.credenciais.length > 0 && (
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {identidade.credenciais.map((credencial) => (
            <li
              key={credencial}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium text-text-secondary"
            >
              <span aria-hidden="true" className="text-primary">✓</span>
              {credencial}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
