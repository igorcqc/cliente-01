# Checklist — novo cliente

Checklist operacional para criar e publicar um cliente novo a partir
deste template. Use junto com `docs/ONBOARDING-CLIENTE.md` (o passo a
passo) — este documento é só a lista de verificação objetiva.

Complementa (não substitui) `documents/checklist-qa.md` e
`documents/checklist-entrega.md`, que cobrem QA e entrega de forma mais
geral e reutilizável entre projetos.

## Conteúdo

- [ ] Nome confirmado
- [ ] Posicionamento confirmado
- [ ] Público confirmado
- [ ] Transformação confirmada
- [ ] Oferta principal confirmada
- [ ] CTA principal confirmado
- [ ] CTAs secundários revisados
- [ ] Preços confirmados (se exibidos na página)
- [ ] Links oficiais confirmados
- [ ] Provas aprovadas
- [ ] Credenciais aprovadas
- [ ] Informações fictícias removidas (nenhum "Marina Dantas",
      "(exemplo)", "(fictício)" restante em `content/client.config.ts`)
- [ ] Placeholders removidos (nenhum `[COLCHETE]` restante)
- [ ] `demonstracao.ehDemonstracao` = `false`

## Imagens

- [ ] Avatar substituído
- [ ] Imagens corretas adicionadas (`public/images/client/`)
- [ ] Textos alternativos revisados (`avatarAlt`, `imagemAlt` de cada
      prova social)
- [ ] Imagem Open Graph substituída (PNG ou JPG, não SVG)
- [ ] Favicon revisado (`app/icon.png`/`app/favicon.ico` — genérico da
      base ou substituído pelo do cliente, por decisão consciente)
- [ ] Imagens carregando corretamente (conferido em `npm run dev` e no
      deploy de produção)

## Visual

- [ ] Identidade visual aprovada (cores, tipografia)
- [ ] Tema revisado (`tema.*` em `content/client.config.ts`)
- [ ] CTA principal destacado
- [ ] CTAs secundários hierarquizados (claramente menores/discretos em
      relação ao principal)
- [ ] Mobile revisado (320px, 375px, 390px)
- [ ] Desktop revisado (768px+)
- [ ] Sem overflow horizontal em nenhuma largura testada
- [ ] Estados de foco revisados (navegação por teclado, `Tab`)
- [ ] Contraste revisado (texto sobre fundo, botão sobre fundo)

## Técnico

- [ ] `npm run validate`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Links testados (CTA principal, secundários, redes sociais —
      abrem o destino correto)
- [ ] Favicon testado (`/favicon.ico` não retorna 404)
- [ ] Metadados SEO testados (title, description, canonical)
- [ ] Imagem Open Graph testada (preview real num app de mensagem, se
      possível)
- [ ] Ausência de segredos confirmada (nenhuma chave/token/senha no
      repositório)
- [ ] Deploy da Vercel validado (build de produção sem erro, URL final
      acessível)
- [ ] Domínio validado, se aplicável (DNS propagado, SSL ativo,
      `seo.urlCanonica` atualizado para o domínio final)
