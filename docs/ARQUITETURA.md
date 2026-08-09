# Arquitetura

## Modelo adotado

**Template Repository + repositório independente por cliente.**

- Este repositório (`bio-que-vende-base`) é o motor + demonstração.
- Cada cliente nasce de "Use this template" no GitHub → repositório
  próprio, histórico Git próprio.
- Cada cliente tem um projeto Vercel independente, com URL e (quando
  aplicável) domínio próprios.
- Não há roteamento por slug nem múltiplos clientes num mesmo build —
  cada instância publicada serve **um único expert**.

Isso foi uma decisão explícita: descartamos deliberadamente um modelo
multi-tenant (um único deploy servindo vários clientes por
subdomínio/slug) em favor de isolamento total por repositório. Ver
"Compatibilidade futura" abaixo para como isso pode evoluir sem reescrever
o motor.

## Separação motor × conteúdo

| Camada | Onde vive | O que é |
|---|---|---|
| Motor fixo | `app/`, `components/`, `lib/`, `config/` | Como a página se comporta: layout, hierarquia visual, validação, tema, rastreamento |
| Conteúdo variável | `content/client.config.ts`, `public/images/client/` | O que aparece: nome, oferta, links, provas, cores |

O contrato entre as duas camadas é `lib/validation/schema.ts`
(`clientConfigSchema`, Zod). Nenhum componente deve importar
`content/client.config` diretamente — todos passam por
`lib/getClientConfig.ts`, o ponto único de leitura do conteúdo.

`content/client.config.ts` (o conteúdo ativo) e `content/client.example.ts`
(a referência demonstrativa) são arquivos **independentes**: nenhum
importa o outro, cada um define seu próprio objeto de dados.
`scripts/check-content-independence.ts` (rodado dentro de `npm run
validate`) garante isso automaticamente — falha o build se
`client.config.ts` voltar a importar `client.example.ts`. Essa
independência foi um bug real da fundação inicial, corrigido no item C1
de `docs/CORRECOES-FUNDACAO.md`.

## Por que isso importa para replicabilidade

- Corrigir um bug ou melhorar um componente no motor é replicável
  manualmente cliente a cliente (ver `docs/ATUALIZAR-BASE.md`), mas nunca
  acidental — o conteúdo de um cliente nunca vaza para outro porque cada
  um vive em seu próprio repositório.
- Criar um cliente novo é, no caso comum, só preencher
  `content/client.config.ts` e trocar imagens — sem tocar em código.

## Tema visual — por que CSS variables, não classes dinâmicas

O Tailwind precisa ver o nome completo de uma classe em algum arquivo
escaneado (`content` em `tailwind.config.ts`) para incluí-la no CSS
final. Uma string como `` `bg-${cor}` `` nunca é vista inteira pelo
compilador e desaparece no build de produção.

Por isso:

1. `content/client.config.ts.tema` guarda valores tipados (cores hex,
   enum de raio, enum de estilo de botão, enum de tipografia).
2. `lib/theme.ts` traduz esses valores em **variáveis CSS com canais RGB
   separados** (`--color-primary-rgb: 124 58 237`, não a string hex
   direta), aplicadas via `style` inline no `<body>` (`app/layout.tsx`).
3. `tailwind.config.ts` mapeia tokens **fixos** (`bg-primary`,
   `text-text-secondary`, `rounded-theme`...) para
   `rgb(var(--color-primary-rgb) / <alpha-value>)` etc. — esse é o padrão
   oficial do Tailwind para cores baseadas em variável CSS, e é o que
   permite que classes com modificador de opacidade (`bg-primary/10`,
   `hover:bg-primary/20`) sejam calculadas em CSS puro e apareçam no
   build de produção.
4. Para variações que exigem selecionar um conjunto inteiro de classes
   (ex: estilo de botão solid/outline/soft), usamos um `Record` tipado
   (`BOTAO_ESTILO_CLASSES` em `lib/theme.ts`) com as classes escritas por
   extenso — nunca concatenadas a partir de dado do cliente.

**Armadilhas já encontradas e corrigidas nesta fundação** (histórico
completo em `docs/CORRECOES-FUNDACAO.md`):

- O `content` do Tailwind inicialmente só escaneava `app/` e
  `components/`. Como `BOTAO_ESTILO_CLASSES` vive em `lib/theme.ts`, as
  classes do botão principal foram removidas (purge) no primeiro build
  de produção. Corrigido incluindo `./lib/**/*.{ts,tsx}` no `content`.
  Ao adicionar novos arquivos com classes Tailwind fora de
  `app/`/`components/`/`lib/`, adicione o glob correspondente.
- Depois disso, as classes com modificador de opacidade (`bg-primary/10`,
  `hover:bg-primary/20`, usadas pelos estilos de botão `soft` e
  `outline`) continuavam ausentes do CSS de produção — o Tailwind não
  consegue gerar variantes de opacidade para uma cor exposta como
  `var(--x)` puro (item C3). Corrigido migrando para o formato de canais
  RGB descrito acima. **Se você reintroduzir uma cor de tema como
  `var(--x)` puro (sem o padrão `rgb(var(--x-rgb) / <alpha-value>)`),
  qualquer classe com `/opacidade` sobre ela volta a desaparecer
  silenciosamente do build de produção** — sempre confira o CSS
  compilado (`.next/static/css/*.css`) ao mexer em `tailwind.config.ts`
  ou `lib/theme.ts`, não confie apenas no `next dev`.

## Tipografia

`tema.fonteTitulo`/`fonteCorpo` são um enum fechado
(`"sans" | "serif" | "mono"`, `FONTE_OPCOES`/`FONTE_STACKS` em
`lib/validation/schema.ts`) — não uma string livre. Cada opção mapeia
para uma pilha de fontes de sistema já segura (sem carregamento
externo). Isso é deliberado: não há mecanismo de carregamento de fonte
customizada nesta v1 (`next/font`, `<link>` para Google Fonts, etc.); uma
string livre como `"'Poppins', sans-serif"` passaria na validação mas
nunca carregaria a fonte de verdade, caindo silenciosamente no fallback
do navegador (item I5). Se o produto precisar de fontes de marca
customizadas no futuro, isso exige uma decisão explícita de como
carregá-las (provavelmente `next/font/google` com uma lista fixa de
fontes aprovadas) — não é só "aceitar mais uma string".

## Rastreamento de cliques

`lib/tracking/events.ts` define o formato do evento
(`TrackClickPayload`: id, nome do evento, tipo principal/secundário,
url). `lib/tracking/trackClick.ts` é o único ponto de disparo — hoje
apenas loga em desenvolvimento, sem nenhum provedor externo conectado.
Todo CTA (`components/ui/Button.tsx`) já chama `trackClick` no clique,
então conectar um provedor no futuro é uma mudança só em
`trackClick.ts`. `rastreamento.habilitado` (do config) controla de fato
se `trackClick` faz algo — com `false`, a função retorna sem disparar
nada, sem afetar a navegação do link.

## Links e esquemas de URL

Todo link configurável pelo cliente (`cta.url`, `redeSocial.url`) passa
por uma allowlist de esquemas em `lib/validation/schema.ts`
(`https:`, `http:`, `mailto:`, `tel:`) — qualquer outro esquema
(`javascript:`, `data:`, `vbscript:`, `file:`, etc.) é rejeitado na
validação, antes de qualquer renderização (item I3). `lib/links.ts`
decide, a partir do esquema, se o link deve abrir em nova aba
(`target="_blank" rel="noopener noreferrer"`, para `http(s)`) ou não
(`mailto:`/`tel:`, que abrem um app do sistema).

## Imagens

`identidade.avatarUrl`, `seo.ogImageUrl` e `provaSocial.imagemUrl`
aceitam um caminho local (começando com `/`, servido de `public/`) ou
uma URL `http(s)` absoluta, sempre terminando numa extensão de imagem
reconhecida (item I4). `seo.ogImageUrl` rejeita especificamente `.svg`
— a maioria dos apps de compartilhamento (WhatsApp, Facebook, LinkedIn)
não renderiza SVG como imagem de Open Graph (item I6). Se um cliente
usar uma URL externa para imagem, o domínio precisa ser adicionado em
`next.config.ts` (`images.remotePatterns`) para que `next/image`
consiga otimizá-la — a validação do schema garante o *formato* do
caminho, não que o domínio esteja liberado no Next.

## Favicon

`app/icon.png` (ícone moderno, detectado automaticamente pelo Next.js
App Router) e `app/favicon.ico` (compatibilidade com navegadores que
pedem `/favicon.ico` diretamente) são assets fixos do motor — um
monograma neutro "B", não associado a nenhum cliente. Um cliente que
quiser favicon próprio substitui esses dois arquivos diretamente; não há
campo no schema para isso (é um asset de código, não conteúdo de dados)
— ver item I1.

## SEO e Open Graph

`app/layout.tsx` gera `Metadata` (`generateMetadata`) inteiramente a
partir de `client.config.ts.seo`. Como a leitura do config já valida via
Zod, um SEO incompleto derruba o build antes de gerar qualquer HTML.

## Compatibilidade futura (não implementada agora)

A arquitetura foi desenhada para que, se um dia for necessário migrar
para multi-tenant ou banco de dados, a mudança fique concentrada em:

- `lib/getClientConfig.ts` — trocar o `import` estático por uma busca
  assíncrona (por slug, domínio ou tenant) em uma API/banco.
- Possivelmente tornar `app/page.tsx` e `app/layout.tsx` assíncronos para
  aguardar essa busca.

`components/`, `lib/theme.ts`, `lib/tracking/` e `lib/validation/` não
precisariam mudar, pois conhecem apenas o tipo `ClientConfig`, nunca a
origem do dado. Isso é uma decisão de design, não uma implementação —
nada disso foi construído nesta v1.

## Limitações conhecidas desta v1

- Sem banco de dados, autenticação, painel administrativo ou integração
  externa com credenciais — por decisão de escopo.
- Atualizações no repositório-base não se propagam automaticamente para
  clientes já criados (ver `docs/ATUALIZAR-BASE.md` para o processo
  manual).
- Três vulnerabilidades "high" reportadas por `npm audit` nesta v1 vêm de
  dependências transitivas de build (`postcss`/`sharp` usados
  internamente pelo Next.js 15) — corrigi-las exige subir para o Next.js
  16 (mudança de major version), fora do escopo desta fundação. Ver
  `docs/IMPLEMENTACAO-BASE.md`.
- A validação de `avatarUrl`/`ogImageUrl`/`imagemUrl` confirma o
  *formato* do caminho (esquema, extensão), não que o arquivo realmente
  existe em `public/` nem que uma URL externa responde. Um caminho local
  sintaticamente válido mas para um arquivo nunca commitado ainda passa
  na validação e só aparece como imagem quebrada em produção.
- Tipografia é limitada a três opções de sistema (`sans`/`serif`/`mono`)
  — não há carregamento de fonte de marca customizada nesta v1 (item
  I5 em `docs/CORRECOES-FUNDACAO.md`).
- O favicon é um asset fixo do motor (`app/icon.png`, `app/favicon.ico`),
  substituível manualmente por cliente, mas sem campo no schema —
  trocar o favicon de um cliente é uma edição de arquivo, não de dado.
