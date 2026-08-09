/**
 * `npm run validate`
 *
 * Valida `content/client.config.ts` contra o schema Zod de
 * `lib/validation/schema.ts` e imprime, de forma legível, qual campo está
 * ausente ou inválido. Também verifica que `client.config.ts` é
 * independente de `client.example.ts` (ver
 * `scripts/check-content-independence.ts` e docs/CORRECOES-FUNDACAO.md,
 * item C1). Sai com código de erro != 0 se qualquer verificação falhar —
 * usado também dentro de `npm run build` (ver package.json), então um
 * conteúdo inválido ou não independente impede o build de produção.
 */
import { validateClientConfig, ClientConfigValidationError } from "../lib/validation/validateClientConfig";
import { checkContentIndependence, ContentIndependenceError } from "./check-content-independence";
import clientConfigRaw from "../content/client.config";

function main() {
  try {
    checkContentIndependence();
    console.log("✅ content/client.config.ts é independente de content/client.example.ts.");

    const config = validateClientConfig(clientConfigRaw);
    console.log("✅ content/client.config.ts é válido.");
    console.log(`   Cliente: ${config.identidade.nome} (${config.identidade.nomeDaMarca})`);
    if (config.demonstracao.ehDemonstracao) {
      console.log("   ⚠️  Marcado como DEMONSTRAÇÃO — substitua antes de publicar um cliente real.");
    }
    process.exit(0);
  } catch (error) {
    if (error instanceof ContentIndependenceError) {
      console.error("❌ " + error.message);
    } else if (error instanceof ClientConfigValidationError) {
      console.error("❌ " + error.message);
    } else {
      console.error("❌ Erro inesperado ao validar o conteúdo do cliente:");
      console.error(error);
    }
    process.exit(1);
  }
}

main();
