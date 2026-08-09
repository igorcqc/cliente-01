import { Hero } from "@/components/sections/Hero";
import { Posicionamento } from "@/components/sections/Posicionamento";
import { OfertaPrincipal } from "@/components/sections/OfertaPrincipal";
import { ProvasSociais } from "@/components/sections/ProvasSociais";
import { CtasSecundarios } from "@/components/sections/CtasSecundarios";
import { RedesSociais } from "@/components/sections/RedesSociais";
import { Footer } from "@/components/sections/Footer";
import { getClientConfig } from "@/lib/getClientConfig";

/**
 * Página única do cliente. Não recebe nenhum texto específico do expert
 * diretamente — tudo vem de `getClientConfig()`, que valida o conteúdo
 * contra o schema Zod antes de chegar aqui.
 *
 * Ordem deliberada (ver docs/VISUAL-DEMONSTRATIVO.md): quem é a expert →
 * quem ela ajuda e a transformação → a oferta (com os sinais de
 * autoridade logo acima do CTA, como último reforço de confiança) →
 * provas sociais → caminhos secundários → redes → rodapé.
 */
export default function Home() {
  const config = getClientConfig();

  return (
    <main>
      <Hero identidade={config.identidade} posicionamento={config.posicionamento} />
      <Posicionamento identidade={config.identidade} posicionamento={config.posicionamento} />
      <OfertaPrincipal
        oferta={config.oferta}
        estiloBotao={config.tema.estiloBotao}
        credenciais={config.identidade.credenciais}
      />
      <ProvasSociais provas={config.provasSociais} />
      <CtasSecundarios ctas={config.ctasSecundarios} />
      <RedesSociais redes={config.redesSociais} />
      <Footer identidade={config.identidade} demonstracao={config.demonstracao} />
    </main>
  );
}
