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
 */
export function Hero({ identidade, posicionamento }: HeroProps) {
  return (
    <Section className="flex flex-col items-center pb-6 pt-14 text-center" ariaLabel="Apresentação">
      <Avatar src={identidade.avatarUrl} alt={identidade.avatarAlt} />
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-text-secondary">
        {identidade.nome} <span aria-hidden="true" className="text-border">·</span> {identidade.nomeDaMarca}
      </p>
      <h1 className="mt-3 max-w-[19rem] font-heading text-[1.65rem] font-bold leading-[1.2] tracking-tight text-text sm:text-[1.85rem]">
        {posicionamento.headline}
      </h1>
      <p className="mt-3 max-w-[22rem] text-base leading-relaxed text-text-secondary">
        {posicionamento.subtitulo}
      </p>
    </Section>
  );
}
