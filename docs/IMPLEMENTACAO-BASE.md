# Relatório — Implementação da fundação (Bio que Vende base)

Data: 2026-08-09

> **Nota de atualização:** este relatório documenta o estado da
> fundação no momento em que foi implementada. Três etapas posteriores
> mudaram esse estado: uma revisão técnica (`docs/REVISAO-FUNDACAO.md`)
> encontrou 3 problemas críticos e 6 importantes, corrigidos em
> `docs/CORRECOES-FUNDACAO.md`; depois, o visual foi refinado
> (`docs/VISUAL-DEMONSTRATIVO.md`) — reorganizando componentes de
> seção, criando `components/ui/LinkRow.tsx`, e movendo a renderização
> de credenciais para dentro de `OfertaPrincipal`. A árvore de pastas e
> as seções sobre `content/client.example.ts` (independência do
> conteúdo ativo) e sobre o CSS de tema (`bg-primary/10` etc.) abaixo
> descrevem o estado **anterior** a essas mudanças — não confie nelas
> para entender a estrutura ou o comportamento atual; use `README.md`
> (árvore de pastas atual), `docs/ARQUITETURA.md`,
> `docs/CORRECOES-FUNDACAO.md` e `docs/VISUAL-DEMONSTRATIVO.md` para o
> estado corrigido/atual, e `docs/PRONTIDAO-TEMPLATE.md` para a
> verificação de prontidão mais recente.

## Resumo do que foi criado

Fundação completa do template-base do Bio que Vende: aplicação
Next.js (App Router) + TypeScript + Tailwind CSS, com conteúdo do
cliente separado do motor via um contrato Zod único, tema visual
orientado a variáveis CSS (sem classes Tailwind dinâmicas), estrutura de
rastreamento de cliques sem provedor externo, SEO/Open Graph gerados a
partir do conteúdo, e documentação operacional completa para replicar o
projeto por cliente via GitHub Template Repository + deploy Vercel
independente.

Nenhum banco de dados, autenticação, painel administrativo ou integração
externa com credenciais foi criado — conforme escopo definido.

O conteúdo ativo (`content/client.config.ts`) usa uma expert fictícia
("Marina Dantas"), claramente marcada como demonstração
(`demonstracao.ehDemonstracao: true`), com todos os links apontando para
o domínio reservado `example.com` (RFC 2606) e todas as provas sociais
marcadas com `ehFicticio: true`.

## Árvore final de pastas

```
bio-que-vende-base/
├── app/
│   ├── globals.css
│   ├── layout.tsx            # SEO/OG + aplica tema (CSS vars) no <body>
│   └── page.tsx               # monta a página a partir do config validado
├── components/
│   ├── sections/               # Hero, Credenciais, Posicionamento, OfertaPrincipal,
│   │                            # CtasSecundarios, ProvasSociais, RedesSociais, Footer
│   └── ui/                     # Section, Avatar, Button, Badge, SocialIcon
├── config/
│   └── site.ts                 # constantes técnicas fixas (não é conteúdo do cliente)
├── content/
│   ├── client.config.ts        # ⭐ arquivo ATIVO (hoje = demo Marina Dantas)
│   └── client.example.ts       # referência de preenchimento (fictícia)
├── lib/
│   ├── getClientConfig.ts      # ponto único de leitura do conteúdo
│   ├── theme.ts                 # tema (dados) → variáveis CSS
│   ├── tracking/
│   │   ├── events.ts
│   │   └── trackClick.ts       # disparo central, sem provedor externo
│   └── validation/
│       ├── schema.ts            # clientConfigSchema (Zod)
│       └── validateClientConfig.ts
├── public/images/
│   ├── client/avatar-demo.svg   # placeholder da demonstração
│   └── shared/og-default.svg    # placeholder de OG da demonstração
├── templates/
│   └── client.config.template.ts  # esqueleto para clientes novos
├── client/                      # contexto estratégico (não lido pela app)
│   ├── briefing.md, oferta.md, publico.md, links.md,
│   │   depoimentos.md, pendencias.md
│   └── referencias/, identidade-visual/, imagens/, entregaveis/  (README cada)
├── docs/
│   ├── ARQUITETURA.md
│   ├── ONBOARDING-CLIENTE.md
│   ├── DEPLOY-VERCEL.md
│   ├── ATUALIZAR-BASE.md
│   └── IMPLEMENTACAO-BASE.md    # este relatório
├── documents/
│   ├── briefing-template.md, links-template.md, depoimentos-template.md
│   └── checklist-qa.md, checklist-entrega.md
├── prompts/
│   └── auditoria.md, estrategia.md, implementacao.md, revisao.md, refinamento.md
├── scripts/
│   └── validate-content.ts      # roda `npm run validate`
├── CLAUDE.md
├── README.md
├── .env.example                  # nenhuma variável obrigatória nesta v1
├── next.config.ts, tailwind.config.ts, tsconfig.json, eslint.config.mjs
└── package.json
```

## Decisões técnicas

1. **Ponto único de leitura de conteúdo** (`lib/getClientConfig.ts`):
   nenhum componente importa `content/client.config` diretamente. Isso é
   o que torna a futura migração para multi-tenant/banco uma mudança
   concentrada nesse arquivo, sem tocar componentes.

2. **Tema via variáveis CSS, nunca classes Tailwind dinâmicas**:
   `lib/theme.ts` traduz `tema` do config em `--color-primary`,
   `--radius`, etc., aplicadas inline no `<body>`. `tailwind.config.ts`
   mapeia tokens estáticos (`bg-primary`, `rounded-theme`...) para essas
   variáveis. Nenhuma string do cliente é concatenada para formar nome
   de classe.

3. **Estilo de botão como `Record` tipado** (`BOTAO_ESTILO_CLASSES` em
   `lib/theme.ts`): evita concatenar classes a partir de enum do
   cliente — cada variação (`solid`/`outline`/`soft`) tem sua string de
   classes escrita por extenso.

4. **Validação centralizada com mensagens por campo**
   (`ClientConfigValidationError`): tanto `npm run validate` quanto
   `next build` (via `getClientConfig` → `layout.tsx`) usam o mesmo
   caminho de validação, garantindo que um build nunca gere uma página
   com conteúdo inválido.

5. **`npm run build` roda a validação antes do `next build`**
   (`"build": "npm run validate && next build"` em `package.json`) — a
   validação em `getClientConfig` sozinha já bloquearia a geração da
   página, mas o script falha mais cedo e com saída mais legível.

6. **Rastreamento sem provedor externo**: `trackClick` é o único ponto
   de disparo; hoje só loga em desenvolvimento. Todo CTA já carrega
   `data-cta-id`/`data-cta-kind` no HTML e chama `trackClick` no clique.

7. **Placeholders de imagem em SVG inline** (não PNG/JPG): usados
   apenas para a demonstração rodar sem depender de assets binários
   externos. `next.config.ts` habilita `dangerouslyAllowSVG` para isso;
   um cliente real deve preferir PNG/JPG/WebP.

## Comandos de validação executados e resultado

| Comando | Resultado |
|---|---|
| `npm install` | ✅ 362 pacotes instalados. 3 vulnerabilidades "high" reportadas (ver Limitações). |
| `npm run validate` | ✅ `content/client.config.ts é válido.` (Marina Dantas, demonstração) |
| `npm run typecheck` | ✅ sem erros |
| `npm run build` | ✅ build de produção gerado (rota `/` estática, ~5.9kB / 108kB First Load JS), sem warnings de lint |
| Teste de falha proposital | ✅ conteúdo inválido testado manualmente (`identidade.nome` vazio + campos obrigatórios ausentes) → `npm run validate` e `npm run build` falharam com exit code 1 e lista de campos ausentes/inválidos (ex: `[identidade.nome] identidade.nome: é obrigatório e não pode estar vazio.`) |
| `npm run start` + `curl` | ✅ HTTP 200, HTML com `<title>`, meta description, Open Graph e canonical corretos |
| Screenshot mobile (390×844, Playwright/Chromium) | ✅ revisado visualmente — hierarquia correta, CTA principal dominante, CTAs secundários discretos, provas marcadas como demonstrativas |
| Varredura de segredos (`grep` por api key/secret/token/password) | ✅ nenhuma ocorrência real — apenas menções textuais a "design tokens" em prosa/CSS |
| Verificação de `.env` | ✅ apenas `.env.example` existe (sem valores reais); `.env*.local` no `.gitignore` |

### Bug encontrado e corrigido durante a validação

O primeiro build de produção gerou o botão de CTA principal **sem cor de
fundo** — o Tailwind fez *purge* das classes `bg-primary` /
`text-primary-foreground` porque elas só apareciam em
`lib/theme.ts` (`BOTAO_ESTILO_CLASSES`), fora do `content` escaneado
pelo `tailwind.config.ts` (que só incluía `app/` e `components/`).
Corrigido adicionando `./lib/**/*.{ts,tsx}` ao `content`. Também
corrigido `--color-primary-foreground`, que estava mapeado
incorretamente para a cor de texto principal (dark) em vez de uma cor
com contraste sobre o botão preenchido — agora usa `corFundo` como
aproximação. Documentado em `docs/ARQUITETURA.md` como armadilha
conhecida para quem adicionar novas classes fora de `app/`/`components/`/`lib/`.

## Como substituir a demonstração por um cliente real

Passo a passo completo em `docs/ONBOARDING-CLIENTE.md`. Resumo:

1. Tornar este repositório um Template Repository no GitHub (Settings →
   Template repository).
2. "Use this template" → novo repositório do cliente.
3. Copiar `templates/client.config.template.ts` para
   `content/client.config.ts` e preencher com dados reais (apoiado pelos
   arquivos em `client/*.md`).
4. Trocar imagens em `public/images/client/`.
5. `npm run validate` → `npm run build` → revisão mobile.
6. Mudar `demonstracao.ehDemonstracao` para `false`.
7. Deploy na Vercel (`docs/DEPLOY-VERCEL.md`) + domínio próprio quando
   aplicável.

## Limitações conhecidas

- **`npm audit`**: 3 vulnerabilidades "high" em dependências transitivas
  de build do Next.js 15 (`postcss`, `sharp`). A correção automática
  (`npm audit fix --force`) exige subir para Next.js 16 (major version),
  o que está fora do escopo desta fundação — não fiz essa migração sem
  autorização. Recomendo avaliar isso como um próximo passo dedicado,
  com teste completo de regressão.
- Sem testes automatizados (unitários/e2e) nesta v1 — não foram
  solicitados; a validação desta entrega foi manual (build, typecheck,
  validação de conteúdo, screenshot mobile).
- `client/*.md` e `documents/*-template.md` são material de apoio, não
  validado por schema — dependem de disciplina de preenchimento.
- Atualizações na base não se propagam automaticamente para clientes já
  criados (processo manual documentado em `docs/ATUALIZAR-BASE.md`).
- Placeholders de imagem da demonstração são SVG; um cliente real deve
  usar PNG/JPG/WebP (o `next.config.ts` permite ambos).

## Próximos passos recomendados (não executados agora)

1. Avaliar a migração para Next.js 16 isoladamente, para resolver as
   vulnerabilidades de `npm audit` (mudança de major version — testar à
   parte).
2. Revisão visual mais refinada (espaçamento, microinterações) — o
   pedido explícito desta etapa foi entregar a fundação funcional, não o
   desenvolvimento visual refinado.
3. Quando o primeiro cliente real for criado a partir deste template,
   validar na prática o fluxo completo de `docs/ONBOARDING-CLIENTE.md`
   e ajustar a documentação com qualquer atrito encontrado.
4. Decidir, com uso real, se algum campo de tema adicional é necessário
   (ex: cor de texto específica sobre o botão primário, hoje aproximada
   por `corFundo`).

## Não commitado

Conforme instrução, nada foi commitado nem enviado (`push`) — a
fundação está implementada e validada localmente, aguardando revisão.
