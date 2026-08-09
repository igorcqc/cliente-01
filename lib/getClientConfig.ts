import { validateClientConfig } from "./validation/validateClientConfig";
import type { ClientConfig } from "./validation/schema";
import clientConfigRaw from "@/content/client.config";

/**
 * Ponto único de leitura do conteúdo do cliente.
 *
 * Hoje esta função importa `content/client.config.ts` (um arquivo local,
 * versionado no repositório do cliente). Nenhum componente ou rota deve
 * importar `content/client.config` diretamente — todos passam por aqui.
 *
 * Isso é o que torna a migração futura para multi-tenant/banco de dados
 * simples: no dia em que o conteúdo passar a vir de uma API ou de um banco,
 * apenas esta função muda (por exemplo, para uma versão assíncrona que
 * busca por slug/domínio). `app/`, `components/` e `lib/theme.ts` continuam
 * consumindo o mesmo tipo `ClientConfig`, sem qualquer alteração.
 */
let cached: ClientConfig | null = null;

export function getClientConfig(): ClientConfig {
  if (cached) return cached;
  cached = validateClientConfig(clientConfigRaw);
  return cached;
}
