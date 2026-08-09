import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
}

/**
 * Avatar do expert, com um anel decorativo sutil na cor primária
 * (`bg-primary/10`) — um único acabamento de marca no topo da página,
 * sem depender de borda pesada. `alt` é obrigatório e vem do conteúdo
 * do cliente (`identidade.avatarAlt`) — nunca deixamos texto alternativo
 * vazio.
 */
export function Avatar({ src, alt, size = 88 }: AvatarProps) {
  return (
    <div className="inline-flex rounded-theme bg-primary/10 p-1.5">
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority
        className="rounded-theme object-cover"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
