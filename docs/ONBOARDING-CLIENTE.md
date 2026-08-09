# Onboarding de um cliente novo

Passo a passo completo para criar a página de um cliente a partir desta
base, sem começar do zero. Siga a ordem abaixo.

## 1. Criar um novo repositório usando este repositório como Template Repository

Pré-requisito (fazer uma vez só, na base): em `bio-que-vende-base` →
**Settings** → seção **General** → marque **"Template repository"** →
salve. A partir daí o botão **"Use this template"** aparece na página
principal do repositório.

Para cada cliente novo:

1. Na página do repositório `bio-que-vende-base` no GitHub, clique em
   **"Use this template" → "Create a new repository"**.
2. Escolha o dono (sua conta/organização), o nome do repositório (ex:
   `bio-que-vende-nome-do-cliente`) e a visibilidade.
3. Crie o repositório — ele já nasce com **histórico Git próprio** (não
   é um fork, não carrega o histórico de commits da base).

## 2. Clonar o novo repositório

```bash
git clone git@github.com:<sua-conta>/bio-que-vende-nome-do-cliente.git
cd bio-que-vende-nome-do-cliente
```

## 3. Identificar o conteúdo demonstrativo

Antes de editar qualquer coisa, saiba o que é demonstração e o que é
motor:

- `content/client.config.ts` é o **conteúdo ativo** — é isto que a
  página renderiza. No repositório recém-clonado, ele ainda traz a
  expert fictícia **"Marina Dantas"**, marcada por
  `demonstracao.ehDemonstracao: true`. É este arquivo que você vai
  substituir.
- `content/client.example.ts` é só **referência de preenchimento** —
  nunca é importado pela aplicação (`npm run validate` garante isso a
  cada execução). Não precisa editá-lo; sirva-se dele só para ver o
  formato esperado de cada campo.
- `templates/client.config.template.ts` é o **modelo em branco** — é o
  ponto de partida recomendado para o conteúdo real do cliente (ver
  passo 4).
- Qualquer texto contendo "(exemplo)", "(fictício)", "Marina Dantas" ou
  `ehFicticio: true` em `client.config.ts` é conteúdo de demonstração
  que **precisa** ser substituído antes de publicar.

## 4. Substituir o conteúdo em `content/client.config.ts`

1. Copie `templates/client.config.template.ts` por cima de
   `content/client.config.ts` (sobrescrevendo **por completo** o
   conteúdo de demonstração da "Marina Dantas" — `client.config.ts`
   deve ficar autocontido; nunca deixe um `import` de
   `client.example.ts` nele), OU edite `content/client.config.ts`
   diretamente, campo por campo.
2. Preencha cada `[COLCHETE]` com o dado real do cliente. Use os
   arquivos em `client/` (`briefing.md`, `oferta.md`, `publico.md`,
   `links.md`, `depoimentos.md`) como fonte — preencha-os primeiro se
   ainda não tiver essas informações.
3. Ao terminar, mude `demonstracao.ehDemonstracao` para `false` e
   remova o campo `aviso` (ou deixe `undefined`).
4. **Nunca invente** depoimento, resultado, número, credencial ou link.
   Se faltar informação real, deixe o campo vazio/array vazio (ex:
   `identidade.credenciais: []`) e registre em `client/pendencias.md` —
   não use placeholder na versão publicada. Campos como `credenciais`,
   `ctasSecundarios`, `provasSociais` e `redesSociais` são opcionais de
   verdade: array vazio ou ausente passa na validação normalmente e a
   seção correspondente simplesmente não aparece na página.
5. `npm run validate` (ver passo 12) continua acusando erro em campos
   que **são** obrigatórios para qualquer cliente (ex: a URL do CTA
   principal) até que você substitua o `[COLCHETE]` por um valor real —
   isso é intencional, é o schema guiando o preenchimento, não um bug.

## 5. Substituir o conteúdo de SEO

Dentro de `content/client.config.ts`, preencha o bloco `seo`:

- `seo.titulo` — título da aba do navegador e de buscadores.
- `seo.descricao` — descrição curta (buscadores e compartilhamento).
- `seo.urlCanonica` — a URL final da página (ex:
  `https://bio.nomedocliente.com.br` ou, antes de ter domínio próprio,
  a URL `*.vercel.app`). Atualize este campo de novo se o domínio mudar
  depois (ver passo 20).
- `seo.idioma` — normalmente `"pt-BR"`.

Todos esses campos são obrigatórios — `npm run validate` acusa qualquer
um que faltar.

## 6. Adicionar o avatar e demais imagens

- Coloque a foto/avatar do expert em `public/images/client/` (ex:
  `public/images/client/avatar.jpg`) e referencie em
  `identidade.avatarUrl` (ex: `/images/client/avatar.jpg`).
- Preencha sempre o `*Alt` correspondente (`avatarAlt`) — obrigatório
  no schema e necessário para acessibilidade.
- Formato aceito para qualquer caminho de imagem: começando com `/`
  (arquivo local em `public/`) ou uma URL `http(s)://` absoluta, sempre
  terminando em `.png`, `.jpg`, `.jpeg`, `.webp` ou `.gif` (`.svg`
  também é aceito para o avatar, mas **não** para a imagem de Open
  Graph — ver passo 7). Um caminho sem a barra inicial, ou com a
  extensão errada, é rejeitado por `npm run validate` com uma mensagem
  apontando o campo exato.
- Se usar uma **URL externa** (não um arquivo em `public/`), adicione o
  domínio em `next.config.ts` → `images.remotePatterns` — a validação
  do schema confirma o formato da URL, mas não garante que o domínio
  esteja liberado para o `next/image` otimizar.
- A validação confirma o *formato* do caminho, não que o arquivo
  realmente existe — sempre confira visualmente (passo 15) que a
  imagem carrega antes de publicar.
- Materiais brutos recebidos do cliente antes de tratar (raw, não
  otimizados) podem ficar em `client/imagens/` — não são servidos pela
  aplicação.

## 7. Configurar a imagem Open Graph

- Mesma pasta (`public/images/client/`), referenciada em
  `seo.ogImageUrl`. Recomendado 1200×630px.
- **Formato PNG ou JPG — SVG é rejeitado pela validação** especificamente
  neste campo (a maioria dos apps de compartilhamento, como
  WhatsApp/Facebook/LinkedIn, não renderiza SVG como preview).
- Preencha `seo.ogImageAlt` também (obrigatório).
- O favicon (ícone da aba do navegador) é **separado** da imagem Open
  Graph e não é um campo do schema — ver passo 10.

## 8. Configurar links

- CTA principal: `oferta.ctaPrincipal` (`id`, `label`, `url`,
  `trackingEvent`, e opcionalmente `descricao` — uma legenda curta
  exibida abaixo do botão).
- CTAs secundários: array `ctasSecundarios`, mesmo formato, mais
  `icone` opcional (um único emoji exibido antes do texto, ex: `"⬇️"`).
- Redes sociais: array `redesSociais` (`plataforma`, `label`, `url`).
- Todo `id` de CTA deve ser único, minúsculo, com hífen (ex:
  `cta-agendar-diagnostico`) — é usado também no rastreamento
  (`data-cta-id` no HTML).
- Toda `url` (de CTA ou rede social) só aceita os esquemas `https:`,
  `http:`, `mailto:` ou `tel:` — qualquer outro esquema (`javascript:`,
  `data:`, etc.) é rejeitado pela validação antes mesmo do link chegar
  na página.
- Teste manualmente cada link antes de publicar (passo 21) — registre
  em `client/links.md`.

## 9. Adicionar ou remover provas sociais

- Array `provasSociais`, cada item com `id`, `tipo`
  (`"depoimento" | "resultado" | "selo" | "midia"`), `texto`, e
  opcionalmente `autor`, `papel`, `imagemUrl`/`imagemAlt` (se preencher
  `imagemUrl`, `imagemAlt` passa a ser obrigatório junto).
- **Nunca invente** um depoimento ou resultado. Se o cliente não tiver
  provas reais ainda, deixe `provasSociais: []` — a seção inteira
  simplesmente não aparece na página. Um array vazio é preferível a uma
  prova fabricada.
- Se alguma prova ainda for demonstrativa (ex: durante uma prévia para
  aprovação do cliente), marque `ehFicticio: true` nela.
- Para remover uma prova, apague o item do array — nenhuma outra
  mudança é necessária.

## 10. Configurar tema e identidade visual

- Cores (`tema.corFundo`, `corSuperficie`, `corPrimaria`, `corTexto`,
  `corTextoSecundario`) são hex (`#RRGGBB` ou `#RGB`).
- `tema.raio`: `"none" | "sm" | "md" | "lg" | "full"`.
- `tema.estiloBotao`: `"solid" | "outline" | "soft"` — os três
  funcionam em produção.
- `tema.fonteTitulo`/`fonteCorpo`: **apenas** `"sans"`, `"serif"` ou
  `"mono"` — não é uma string livre de `font-family`. Nesta v1 não há
  carregamento de fonte de marca customizada; cada opção já usa uma
  pilha segura de fontes de sistema.
- **Favicon**: `app/icon.png` e `app/favicon.ico` são assets fixos do
  motor (um monograma neutro "B", não é dado do `client.config.ts`). Se
  o cliente quiser um favicon próprio, substitua os dois arquivos
  diretamente (mesmo formato: PNG quadrado para `icon.png`, `.ico` para
  `favicon.ico`) — é a única edição de arquivo fora de
  `content`/`public/images/client/` esperada num cliente comum. O
  Next.js App Router detecta os arquivos automaticamente, sem precisar
  mudar código.
- Nenhuma dessas mudanças exige tocar em `components/`, `lib/` ou
  `tailwind.config.ts` — tudo é orientado por dados.

## 11. Executar `npm install`

```bash
npm install
```

## 12. Executar `npm run validate`

```bash
npm run validate
```

Roda o schema Zod contra `content/client.config.ts` e imprime, campo a
campo, o que está ausente ou inválido. Também confirma que
`client.config.ts` não importa `client.example.ts` (independência entre
conteúdo ativo e referência). Rode sempre depois de editar o config.

## 13. Executar `npm run typecheck`

```bash
npm run typecheck
```

Confirma que não há erro de tipo em nenhum arquivo TypeScript do
projeto (relevante principalmente se você editou algo fora de
`content/`).

## 14. Executar `npm run lint`

```bash
npm run lint
```

Roda o ESLint (regras do Next.js). Não deve haver erros nem avisos.

## 15. Executar `npm run build`

```bash
npm run build
```

Executa `npm run validate` automaticamente antes do `next build` — se o
conteúdo estiver inválido, o build falha e não gera artefato algum.

## 16. Iniciar a aplicação localmente

```bash
npm run dev        # desenvolvimento, http://localhost:3000
# ou, para testar o build de produção:
npm run start
```

## 17. Revisar a página em dispositivos móveis

- No navegador, abra o DevTools → modo responsivo, e confira em
  ~320px, ~375px e ~390px de largura (a página é mobile-first).
- Confirme: sem overflow horizontal, CTA principal claramente
  dominante, imagens carregando, texto legível.
- Revise também em desktop (768px+) — a página deve continuar coerente
  numa coluna central mais larga.

## 18. Fazer commit e push

```bash
git add -A
git commit -m "Configura conteúdo do cliente <nome>"
git push
```

(Se for o primeiro push do repositório recém-criado, use
`git push -u origin <nome-do-branch-padrão>` — o branch padrão do
repositório do cliente é o mesmo branch padrão configurado neste
repositório-base no momento em que o template foi usado.)

Cada push dispara automaticamente um novo deploy na Vercel, uma vez o
projeto conectado (ver passo 19).

## 19. Conectar o repositório à Vercel

Ver `docs/DEPLOY-VERCEL.md` para o passo a passo completo (import do
repositório, variáveis de ambiente — nenhuma obrigatória nesta v1 — e
deploy).

## 20. Configurar domínio próprio

Ver a seção correspondente em `docs/DEPLOY-VERCEL.md`. Depois de
confirmado o domínio, volte ao passo 5 e atualize `seo.urlCanonica`
para o domínio final, e faça um novo deploy.

## 21. Substituir todos os placeholders antes da publicação

Antes de considerar o cliente pronto para publicar:

- Busque por `[` no arquivo `content/client.config.ts` — não deve
  sobrar nenhum `[COLCHETE]` de placeholder.
- Busque por "exemplo", "fictício", "Marina Dantas" — não deve sobrar
  nenhuma referência à demonstração.
- Confirme `demonstracao.ehDemonstracao: false`.
- Teste manualmente cada link (CTA principal, secundários, redes
  sociais).
- Use `docs/CHECKLIST-NOVO-CLIENTE.md` como checklist objetivo para
  esta etapa.

## 22. Revisão final antes de entregar ao cliente

1. Rode `npm run validate && npm run typecheck && npm run lint && npm run build` uma última vez.
2. Confirme o deploy de produção na Vercel (URL final, não um preview).
3. Abra a URL de produção (não `localhost`) e revise mobile + desktop.
4. Confirme favicon e imagem de Open Graph (compartilhe o link num
   app de mensagem para ver o preview real, se possível).
5. Preencha `documents/checklist-qa.md` e `documents/checklist-entrega.md`.
6. Só então avise o cliente que a página está no ar.

## Quais arquivos editar (e quais não editar)

**Editar (conteúdo do cliente):**
- `content/client.config.ts` — todo o conteúdo textual, links, oferta,
  provas, tema, SEO.
- `public/images/client/` — foto/avatar, imagem de Open Graph, imagens
  de prova social.
- `app/icon.png`/`app/favicon.ico` — **somente** se o cliente quiser um
  favicon próprio (ver passo 10); nenhuma outra mudança em `app/` é
  esperada.
- `client/*.md` — material estratégico de apoio (briefing, oferta,
  público, links, depoimentos, pendências) — não é lido pela aplicação,
  mas ajuda a preencher o config corretamente.

**Não editar num cliente comum (motor fixo):**
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- `components/`, `lib/`, `config/`
- `tailwind.config.ts`, `next.config.ts`, `tsconfig.json`, `package.json`

Se o cliente pedir uma personalização real de layout (uma seção nova,
reordenação), isso é uma mudança nesse repositório específico — não
afeta a base nem outros clientes.

## Documentos de apoio

- `docs/CHECKLIST-NOVO-CLIENTE.md` — checklist objetivo (caixas de
  seleção) para esta etapa inteira.
- `documents/checklist-qa.md` — revisão técnica antes de publicar.
- `documents/checklist-entrega.md` — confirmação de entrega ao cliente.
- `docs/ATUALIZAR-BASE.md` — como atualizar este cliente com melhorias
  feitas na base depois.
- `docs/PRONTIDAO-TEMPLATE.md` — verificação de que a base está pronta
  para ser usada como Template Repository.
