/**
 * Prova, de duas formas independentes, que `content/client.config.ts`
 * (o conteúdo ATIVO) nunca compartilha dados com `content/client.example.ts`
 * (a referência demonstrativa):
 *
 *  1. Análise estática: o código-fonte de `client.config.ts` não pode
 *     conter nenhuma referência a `client.example` — ou seja, não pode
 *     importar, reexportar ou de qualquer forma depender daquele arquivo.
 *  2. Verificação em runtime: os dois módulos, uma vez carregados, não
 *     podem ser o mesmo objeto na memória — editar um nunca muda o outro.
 *
 * Isso corrige e previne a regressão do problema crítico C1 (ver
 * docs/CORRECOES-FUNDACAO.md): `client.config.ts` reexportava
 * `client.example.ts` por referência direta, então editar o "exemplo"
 * editava a página publicada.
 *
 * Roda como parte de `npm run validate` (e portanto de `npm run build`,
 * que executa `validate` antes do `next build`).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import clientConfig from "../content/client.config";
import { clientConfigExample } from "../content/client.example";

export class ContentIndependenceError extends Error {}

export function checkContentIndependence(): void {
  const configPath = resolve(__dirname, "../content/client.config.ts");
  const source = readFileSync(configPath, "utf-8");

  // Procura só por importações/requires reais (`from "...client.example..."`,
  // `require("...client.example...")`, `import("...client.example...")`) —
  // não por qualquer menção à string em comentários/documentação, que é
  // esperada e correta (ex: este próprio arquivo, ou o cabeçalho de
  // `client.config.ts`, mencionam "client.example" em prosa).
  const importsExample =
    /from\s+["'][^"']*client\.example[^"']*["']/.test(source) ||
    /require\(\s*["'][^"']*client\.example[^"']*["']\s*\)/.test(source) ||
    /import\(\s*["'][^"']*client\.example[^"']*["']\s*\)/.test(source);

  if (importsExample) {
    throw new ContentIndependenceError(
      "content/client.config.ts não pode importar content/client.example.ts " +
        "(import, reexport ou qualquer outra dependência de código). O conteúdo ativo " +
        "precisa ser autocontido — copie os valores, não importe o arquivo de exemplo. " +
        "Veja docs/CORRECOES-FUNDACAO.md (item C1)."
    );
  }

  if ((clientConfig as unknown) === (clientConfigExample as unknown)) {
    throw new ContentIndependenceError(
      "content/client.config.ts e content/client.example.ts resolvem para o mesmo " +
        "objeto em memória — eles precisam ser independentes. Veja docs/CORRECOES-FUNDACAO.md (item C1)."
    );
  }
}

if (require.main === module) {
  try {
    checkContentIndependence();
    console.log("✅ content/client.config.ts é independente de content/client.example.ts.");
  } catch (error) {
    console.error("❌ " + (error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}
