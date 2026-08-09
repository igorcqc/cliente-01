# CLAUDE.md

Guia rápido para agentes (Claude ou outros) trabalhando neste repositório.

## O que é este repositório

`bio-que-vende-base` é o **Template Repository** do produto Bio que Vende:
uma página de conversão mobile-first para o link da bio de experts,
mentores, consultores e infoprodutores.

Modelo adotado: **um repositório independente por cliente**, criado a
partir deste template ("Use this template" no GitHub). Não é
multi-tenant — cada instância publicada serve exatamente um expert, com
seu próprio deploy Vercel.

## Regra mais importante

**Nunca misture motor e conteúdo.**

- Motor fixo (não deveria mudar por cliente): `app/`, `components/`,
  `lib/`, `config/`.
- Conteúdo variável (o que muda por cliente): `content/client.config.ts`
  e as imagens em `public/images/client/`.

Se uma tarefa pede para "mudar o texto/cor/link/oferta", a mudança
pertence a `content/client.config.ts` — não a um componente.

## Contrato de conteúdo

`lib/validation/schema.ts` define o Zod schema `clientConfigSchema` — o
contrato único entre motor e conteúdo. `lib/getClientConfig.ts` é o
único ponto de leitura do conteúdo em toda a aplicação; nenhum
componente deve importar `content/client.config` diretamente.

`content/client.config.ts` (ativo) e `content/client.example.ts`
(referência) são **independentes** — `client.config.ts` nunca deve
importar `client.example.ts`. `npm run validate` reforça isso
automaticamente via `scripts/check-content-independence.ts`; se você
precisar copiar conteúdo de um para o outro, copie os *valores*, nunca
adicione um `import`.

Todo campo do schema precisa ter um uso real em algum componente — não
adicione um campo "para o futuro" que nada renderiza ou lê (isso já foi
um problema real, ver `docs/CORRECOES-FUNDACAO.md`, item I2).

`npm run validate` valida o conteúdo isoladamente; `npm run build`
sempre roda a validação antes do `next build` (ver `package.json`), então
um conteúdo inválido (ou não independente do exemplo) derruba o build.

## Tema

As cores/tema do cliente NUNCA viram classes Tailwind dinâmicas (nunca
`bg-${cor}`). `lib/theme.ts` traduz `tema` (do config) em variáveis CSS
com **canais RGB separados** (`--color-primary-rgb: 124 58 237`, não a
string hex direta), aplicadas no `<body>` via `layout.tsx`;
`tailwind.config.ts` mapeia tokens fixos (`bg-primary`, etc.) para
`rgb(var(--x-rgb) / <alpha-value>)`. Esse formato é obrigatório para que
classes com modificador de opacidade (`bg-primary/10`,
`hover:bg-primary/20`) sejam realmente geradas no CSS de produção — uma
cor exposta como `var(--x)` puro (a abordagem anterior a esta correção)
faz o Tailwind descartar essas variantes silenciosamente. Ver
`docs/CORRECOES-FUNDACAO.md` (item C3) antes de mexer em cores de tema.

Ao adicionar uma nova classe Tailwind que dependa de um token de tema,
garanta que o arquivo onde ela é escrita esteja no `content` do
`tailwind.config.ts` — do contrário o Tailwind faz purge da classe no
build de produção.

Tipografia (`tema.fonteTitulo`/`fonteCorpo`) é um enum fechado
(`"sans" | "serif" | "mono"`, ver `FONTE_STACKS` em
`lib/validation/schema.ts`) — não aceite string livre aqui, não há
mecanismo de carregamento de fonte customizada nesta v1 (item I5).

## Escopo desta v1 (não expandir sem pedido explícito)

- Sem banco de dados.
- Sem autenticação/painel administrativo.
- Sem integrações externas que dependam de credenciais (sem GA, Meta
  Pixel, Vercel Analytics).
- Sem arquitetura multi-tenant — um cliente por repositório/deploy.

`lib/tracking/` já está estruturado para receber um provedor de
analytics no futuro sem alterar componentes — ver `lib/tracking/trackClick.ts`.

## Comandos

```bash
npm run dev        # desenvolvimento local
npm run validate   # valida content/client.config.ts contra o schema
npm run typecheck  # checagem de tipos
npm run build      # valida + build de produção
npm run start       # serve o build de produção
```

## Documentação completa

- `docs/ARQUITETURA.md` — arquitetura e decisões técnicas.
- `docs/ONBOARDING-CLIENTE.md` — passo a passo (22 etapas) para criar um cliente novo.
- `docs/CHECKLIST-NOVO-CLIENTE.md` — checklist objetivo para o mesmo processo.
- `docs/DEPLOY-VERCEL.md` — deploy e domínio próprio.
- `docs/ATUALIZAR-BASE.md` — como propagar melhorias da base a um cliente.
- `docs/IMPLEMENTACAO-BASE.md` — relatório da implementação inicial.
- `docs/REVISAO-FUNDACAO.md` — revisão técnica que encontrou C1–C3/I1–I6.
- `docs/CORRECOES-FUNDACAO.md` — correções aplicadas a partir da revisão.
- `docs/VISUAL-DEMONSTRATIVO.md` — refinamento visual da página demonstrativa.
- `docs/PRONTIDAO-TEMPLATE.md` — verificação de prontidão para uso como Template Repository.
