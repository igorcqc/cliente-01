import { Section } from "@/components/ui/Section";
import type { ClientConfig } from "@/lib/validation/schema";
import { siteConfig } from "@/config/site";

interface FooterProps {
  identidade: ClientConfig["identidade"];
  demonstracao: ClientConfig["demonstracao"];
}

export function Footer({ identidade, demonstracao }: FooterProps) {
  const ano = new Date().getFullYear();

  return (
    <Section as="footer" className="border-t border-border py-6 text-center">
      <p className="text-xs text-text-secondary">
        © {ano} {identidade.nomeDaMarca}. Página criada com {siteConfig.produto}.
      </p>
      {demonstracao.ehDemonstracao && (
        <p className="mt-1 text-xs font-medium text-text-secondary">
          {demonstracao.aviso ?? "Conteúdo de demonstração — dados fictícios."}
        </p>
      )}
    </Section>
  );
}
