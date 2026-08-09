# Bio que Vende — base do template

Página de conversão mobile-first para o link da bio de experts, mentores,
consultores e infoprodutores. Não é um Linktree genérico: apresenta quem
é o expert, quem ele ajuda, qual transformação oferece, qual é a oferta
principal, qual é a ação desejada, quais são os caminhos secundários e
quais provas sustentam a decisão.

Este repositório é a **base reutilizável** (Template Repository do
GitHub). Cada cliente é publicado a partir de um repositório próprio,
criado a partir deste template, com deploy independente na Vercel — não
há multi-tenant nesta versão.

> ⚠️ O conteúdo ativo (`content/client.config.ts`) traz uma expert
> **fictícia** ("Marina Dantas") apenas para demonstrar o formato. Veja
> `docs/ONBOARDING-CLIENTE.md` para substituir por um cliente real.
>
> `content/client.config.ts` (ativo) e `content/client.example.ts`
> (referência) são arquivos **independentes** — nenhum importa o outro.
> Editar um nunca afeta o outro; isso é verificado automaticamente a cada
> `npm run validate` (`scripts/check-content-independence.ts`).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS (tokens de tema via CSS variables, nunca classes dinâmicas)
- Zod (validação do conteúdo do cliente)
- Deploy: Vercel

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # valida content/client.config.ts
npm run typecheck
npm run build       # valida + build de produção
npm run start
```

## Estrutura

```
app/                 rotas e layout (motor fixo); app/icon.png e app/favicon.ico (favicon)
components/
  ui/                 primitivos reutilizáveis
  sections/            blocos da página (Hero, Oferta, CTAs, Provas...)
config/               constantes técnicas fixas (não é conteúdo do cliente)
content/
  client.config.ts     ⭐ conteúdo ATIVO do cliente (editar por cliente) — independente do exemplo
  client.example.ts    referência de preenchimento (dados fictícios) — não é importado pela app
lib/
  validation/           schema Zod + validação (URLs, imagens, tipografia)
  tracking/              estrutura de rastreamento de cliques (sem provedor externo)
  getClientConfig.ts     ponto único de leitura do conteúdo
  theme.ts               traduz tema do cliente em variáveis CSS (canais RGB)
  links.ts               regra de target=_blank por esquema de URL
public/images/
  client/                imagens do cliente (foto)
  shared/og-default.png  imagem OG de demonstração (PNG, não SVG)
templates/               modelo em branco para criar um cliente novo
scripts/
  validate-content.ts             roda npm run validate
  check-content-independence.ts   prova que client.config.ts ≠ client.example.ts
client/                  contexto estratégico do cliente (briefing, oferta, provas...)
docs/                     documentação operacional
documents/                templates reutilizáveis (briefing, QA, entrega)
prompts/                  prompts de apoio (auditoria, estratégia, implementação...)
```

## Documentação

- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — arquitetura e decisões técnicas.
- [`docs/ONBOARDING-CLIENTE.md`](docs/ONBOARDING-CLIENTE.md) — criar um cliente novo, passo a passo (22 etapas).
- [`docs/CHECKLIST-NOVO-CLIENTE.md`](docs/CHECKLIST-NOVO-CLIENTE.md) — checklist objetivo para o mesmo processo.
- [`docs/DEPLOY-VERCEL.md`](docs/DEPLOY-VERCEL.md) — deploy e domínio próprio.
- [`docs/ATUALIZAR-BASE.md`](docs/ATUALIZAR-BASE.md) — propagar melhorias da base para um cliente já criado.
- [`docs/IMPLEMENTACAO-BASE.md`](docs/IMPLEMENTACAO-BASE.md) — relatório desta fundação (o que foi feito, validado e o que falta).
- [`docs/REVISAO-FUNDACAO.md`](docs/REVISAO-FUNDACAO.md) — revisão técnica que encontrou os problemas C1–C3/I1–I6.
- [`docs/CORRECOES-FUNDACAO.md`](docs/CORRECOES-FUNDACAO.md) — o que foi corrigido a partir dessa revisão, arquivo por arquivo.
- [`docs/VISUAL-DEMONSTRATIVO.md`](docs/VISUAL-DEMONSTRATIVO.md) — refinamento visual da página demonstrativa.
- [`docs/PRONTIDAO-TEMPLATE.md`](docs/PRONTIDAO-TEMPLATE.md) — verificação de prontidão para uso como Template Repository.

## Licença de uso do conteúdo demonstrativo

Todo texto, depoimento, número e credencial de "Marina Dantas" é
fictício e existe apenas para validar o schema e o layout. Nunca publique
esta demonstração como se fosse um cliente real.
