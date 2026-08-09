interface CredenciaisProps {
  credenciais?: string[];
}

/** Espaço inquebrável colado ao "·" — evita que o separador fique órfão
 * sozinho numa linha ao quebrar em telas estreitas (problema real
 * encontrado em 320px durante a revisão visual). */
const SEPARADOR = " · ";

/**
 * Sinais de autoridade — uma linha compacta de texto (não mais um bloco
 * de badges/tags), renderizada dentro de `OfertaPrincipal`, logo acima
 * do CTA. A posição é deliberada: na jornada de conversão, o reforço de
 * autoridade funciona melhor como o último empurrão de confiança antes
 * do clique, não como o primeiro elemento da página (ver
 * docs/VISUAL-DEMONSTRATIVO.md).
 */
export function Credenciais({ credenciais }: CredenciaisProps) {
  if (!credenciais || credenciais.length === 0) return null;

  return (
    <p className="text-xs text-text-secondary">
      {credenciais.map((credencial, index) => (
        <span key={credencial}>
          {index > 0 && <span aria-hidden="true">{SEPARADOR}</span>}
          {credencial}
        </span>
      ))}
    </p>
  );
}
