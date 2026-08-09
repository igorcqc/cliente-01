import { z } from "zod";
import { clientConfigSchema, type ClientConfig } from "./schema";

export class ClientConfigValidationError extends Error {
  issues: z.ZodIssue[];

  constructor(issues: z.ZodIssue[]) {
    const formatted = ClientConfigValidationError.format(issues);
    super(formatted);
    this.name = "ClientConfigValidationError";
    this.issues = issues;
  }

  static format(issues: z.ZodIssue[]): string {
    const lines = issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "(raiz)";
      return `  • [${path}] ${issue.message}`;
    });
    return [
      "Conteúdo do cliente inválido (content/client.config.ts).",
      "Corrija os campos abaixo antes de continuar:",
      ...lines,
    ].join("\n");
  }
}

/**
 * Valida um objeto de conteúdo bruto contra o contrato do cliente.
 * Lança `ClientConfigValidationError` com mensagens indicando exatamente
 * qual campo está ausente ou inválido — usada tanto por `npm run validate`
 * quanto pelo carregamento em `lib/getClientConfig.ts` (e portanto pelo
 * `next build`, que falha se o conteúdo for inválido).
 */
export function validateClientConfig(raw: unknown): ClientConfig {
  const result = clientConfigSchema.safeParse(raw);

  if (!result.success) {
    throw new ClientConfigValidationError(result.error.issues);
  }

  return result.data;
}
