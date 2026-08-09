import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  /**
   * Selo de verificação sobreposto ao avatar — reforço de credibilidade
   * cedo na página (Direção "Comercial de Alta Conversão"), puramente
   * decorativo, sem depender de nenhum dado adicional do cliente.
   */
  verificado?: boolean;
}

/**
 * Avatar do expert, com um anel decorativo sutil na cor primária
 * (`bg-primary/10`) — um único acabamento de marca no topo da página,
 * sem depender de borda pesada. `alt` é obrigatório e vem do conteúdo
 * do cliente (`identidade.avatarAlt`) — nunca deixamos texto alternativo
 * vazio.
 */
export function Avatar({ src, alt, size = 108, verificado = true }: AvatarProps) {
  return (
    <div className="relative inline-flex rounded-theme bg-primary/10 p-1.5">
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority
        className="rounded-theme object-cover"
        style={{ width: size, height: size }}
      />
      {verificado && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-background"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 13 10 18 19 7" />
          </svg>
        </span>
      )}
    </div>
  );
}
