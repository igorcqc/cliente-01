# Prontidão do template — verificação final

Data: 2026-08-09
Escopo: preparação operacional para uso como GitHub Template
Repository. Nenhuma mudança de arquitetura, visual, schema, escopo
funcional (sem multi-tenant, banco, autenticação, painel ou analytics
externo).

## 1. Resultado da verificação de prontidão

**A base está pronta.** Um cliente padrão pode ser criado alterando
apenas:

- `content/client.config.ts` (conteúdo, links, oferta, provas, tema, SEO)
- `public/images/client/` (avatar e demais imagens do cliente)
- opcionalmente `app/icon.png`/`app/favicon.ico` (só se o cliente
  quiser favicon próprio — não é obrigatório)

Confirmado por análise estática + testes executados (seção 6):

- Nenhum componente (`components/`) ou rota (`app/`) importa
  `content/client.config` diretamente — só `lib/getClientConfig.ts` (o
  ponto único de leitura) e os dois scripts de validação
  (`scripts/validate-content.ts`, `scripts/check-content-independence.ts`,
  que precisam importar diretamente por natureza).
- Nenhum texto específico da expert "Marina Dantas" (nome, oferta,
  provas) existe fora de `content/`, `client/` ou `docs/` — varredura
  em `app/`, `components/`, `lib/`, `config/`, `templates/`, `scripts/`
  não encontrou nenhuma ocorrência.
- Copiar `templates/client.config.template.ts` sem edição falha
  **somente** nos dois campos genuinamente obrigatórios para qualquer
  cliente (`oferta.ctaPrincipal.url`, `seo.urlCanonica` — ambos com
  placeholder `[COLCHETE]`); nenhum campo opcional (`credenciais`,
  `ctasSecundarios`, `provasSociais`, `redesSociais`) bloqueia a
  validação.
- Um template preenchido com dados de um cliente fictício de teste
  ("Cliente Piloto") passa 100% em `validateClientConfig` sem tocar em
  nenhum arquivo de motor.

## 2. Arquivos editáveis por cliente

| Arquivo/pasta | Quando editar |
|---|---|
| `content/client.config.ts` | Sempre — é o conteúdo inteiro do cliente |
| `public/images/client/` | Sempre — avatar, imagem OG, imagens de prova |
| `app/icon.png`, `app/favicon.ico` | Só se o cliente quiser favicon próprio (opcional) |
| `client/*.md` | Material estratégico de apoio (briefing, oferta, público, links, depoimentos) — não lido pela aplicação, mas ajuda a preencher o config |

## 3. Arquivos do motor fixo (não editar num cliente comum)

`app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/`,
`lib/`, `config/`, `tailwind.config.ts`, `next.config.ts`,
`tsconfig.json`, `package.json`, `eslint.config.mjs`,
`postcss.config.mjs`, `scripts/`.

Se um cliente pedir uma personalização real de layout, isso é uma
mudança nesse repositório específico do cliente — nunca afeta a base
nem outros clientes (modelo de repositório independente).

## 4. Inconsistências encontradas

| # | Inconsistência | Onde |
|---|---|---|
| 1 | `docs/ONBOARDING-CLIENTE.md` não cobria `npm run typecheck`/`npm run lint` como passos explícitos, nem commit/push, nem revisão final antes da entrega — faltavam ~8 dos 22 passos agora exigidos | `docs/ONBOARDING-CLIENTE.md` |
| 2 | Seção "quais arquivos editar" dizia genericamente "não editar `app/`", mas a mesma documentação (seção de favicon) já instruía substituir `app/icon.png`/`app/favicon.ico` — contradição direta | `docs/ONBOARDING-CLIENTE.md` |
| 3 | `docs/IMPLEMENTACAO-BASE.md` tinha uma árvore de pastas e descrições de comportamento (independência de conteúdo, CSS de tema) que ficaram desatualizadas depois das correções C1–C3/I1–I6 e do refinamento visual — o aviso no topo do arquivo só mencionava a primeira rodada de correções, não o refinamento visual | `docs/IMPLEMENTACAO-BASE.md` |
| 4 | `README.md` e `CLAUDE.md` não listavam `docs/VISUAL-DEMONSTRATIVO.md` (já existente) nem os dois documentos novos desta etapa | `README.md`, `CLAUDE.md` |
| 5 | `documents/checklist-qa.md` cobria `build`/`typecheck` mas não `lint` — inconsistente com o fluxo de validação completo já em uso (`npm run lint` faz parte da suíte obrigatória desde o refinamento visual) | `documents/checklist-qa.md` |
| 6 | `docs/CHECKLIST-NOVO-CLIENTE.md` não existia | — |
| 7 | `templates/client.config.template.ts` não tinha um resumo único de "obrigatório vs. opcional" — a informação existia espalhada em comentários por campo, mas não um resumo de leitura rápida | `templates/client.config.template.ts` |

Nenhum caminho de arquivo incorreto, nome de arquivo desatualizado ou
comando de validação incorreto foi encontrado além do listado acima —
os comandos documentados (`npm install`, `npm run validate`,
`npm run typecheck`, `npm run lint`, `npm run build`, `npm run dev`,
`npm run start`) correspondem exatamente aos scripts reais em
`package.json`.

## 5. Correções aplicadas

1. **`docs/ONBOARDING-CLIENTE.md` reescrito** seguindo exatamente a
   ordem de 22 passos (Template Repository → clonar → identificar
   demonstração → conteúdo → SEO → imagens → Open Graph → links →
   provas sociais → tema → `npm install` → `validate` → `typecheck` →
   `lint` → `build` → rodar local → revisão mobile → commit/push →
   Vercel → domínio → placeholders → revisão final), com seção separada
   de "quais arquivos editar" já corrigida (item 2 acima).
2. **`docs/CHECKLIST-NOVO-CLIENTE.md` criado**, com as quatro seções
   (Conteúdo, Imagens, Visual, Técnico) e os itens exatamente como
   especificado, cross-referenciando os checklists já existentes
   (`documents/checklist-qa.md`, `documents/checklist-entrega.md`).
3. **`docs/IMPLEMENTACAO-BASE.md`**: nota de atualização expandida para
   cobrir também o refinamento visual, apontando explicitamente para
   `README.md` (árvore de pastas atual) e `docs/PRONTIDAO-TEMPLATE.md`
   (este arquivo).
4. **`README.md`/`CLAUDE.md`**: listas de documentação atualizadas com
   `docs/VISUAL-DEMONSTRATIVO.md`, `docs/CHECKLIST-NOVO-CLIENTE.md` e
   `docs/PRONTIDAO-TEMPLATE.md`.
5. **`documents/checklist-qa.md`**: adicionado item `npm run lint`.
6. **`templates/client.config.template.ts`**: adicionado resumo
   "obrigatório vs. opcional" no comentário de topo (só comentário —
   nenhuma mudança de schema).

Nenhuma correção tocou `lib/validation/schema.ts`, `app/`,
`components/`, `tailwind.config.ts` ou `next.config.ts` — não foi
encontrado nenhum problema funcional real que justificasse mexer neles
nesta etapa.

## 6. Validações executadas e resultado

| Validação | Resultado |
|---|---|
| `npm run validate` | ✅ passa |
| `npm run typecheck` | ✅ sem erros |
| `npm run lint` | ✅ sem warnings |
| `npm run build` | ✅ build de produção limpo |
| Inicialização local (`npm run start`) | ✅ HTTP 200 |
| Links (CTA principal, secundários, redes) | ✅ `href`/`target`/`rel`/`data-cta-*` corretos via inspeção DOM |
| Favicon | ✅ `GET /favicon.ico` → 200, `GET /icon.png` → 200 |
| Metadados Open Graph | ✅ title/description/canonical/og:image (PNG, URL absoluta) intactos |
| Visual em 320px/390px/desktop (1280px) | ✅ sem overflow horizontal, hierarquia preservada, idêntico ao refinamento aprovado |
| Varredura de segredos | ✅ nenhuma ocorrência real; sem `.env` no repositório |
| Cópia do template para configuração temporária de cliente | ✅ template cru falha só nos 2 campos genuinamente obrigatórios; template preenchido com dados de um "Cliente Piloto" de teste passa 100% |
| Nenhuma alteração temporária deixada em `content/client.config.ts` | ✅ confirmado via `git diff --stat` (sem alterações) |

Todos os testes de cópia de template foram feitos em um script isolado,
fora do repositório (`/tmp`), sem alterar `content/client.config.ts` do
repositório real em nenhum momento.

## 7. Comandos para iniciar um cliente

```bash
# 1. No GitHub: "Use this template" → criar repositório do cliente
git clone git@github.com:<sua-conta>/bio-que-vende-nome-do-cliente.git
cd bio-que-vende-nome-do-cliente
npm install

# 2. Copiar o modelo e preencher com os dados reais do cliente
cp templates/client.config.template.ts content/client.config.ts
# ... editar content/client.config.ts, adicionar imagens em public/images/client/ ...

# 3. Validar
npm run validate
npm run typecheck
npm run lint
npm run build

# 4. Revisar localmente
npm run dev   # ou npm run start, para testar o build de produção

# 5. Publicar
git add -A && git commit -m "Configura conteúdo do cliente" && git push
# conectar o repositório na Vercel (ver docs/DEPLOY-VERCEL.md)
```

Passo a passo completo: `docs/ONBOARDING-CLIENTE.md`. Checklist
objetivo: `docs/CHECKLIST-NOVO-CLIENTE.md`.

## 8. Limitações conhecidas

Nenhuma limitação nova nesta etapa — as já documentadas em
`docs/ARQUITETURA.md` (seção "Limitações conhecidas desta v1") seguem
válidas e inalteradas:

- Sem banco de dados, autenticação, painel administrativo ou
  integração externa com credenciais (decisão de escopo).
- Atualização de um cliente já publicado com melhorias da base é
  manual (`docs/ATUALIZAR-BASE.md`).
- 3 vulnerabilidades "high" em dependências transitivas de build
  (`postcss`/`sharp`, via Next.js 15) — corrigir exige Next.js 16,
  fora de escopo.
- Validação de imagem confirma formato, não existência real do
  arquivo.
- Tipografia limitada a `sans`/`serif`/`mono` (sem fonte de marca
  customizada).
- Favicon é asset de código (não campo do schema) — trocar por
  cliente é edição de arquivo, documentada.

## 9. Confirmação

**A base `bio-que-vende-base` está pronta para ser usada como GitHub
Template Repository.** Um cliente padrão — sem personalização de
layout — pode ser criado e publicado alterando somente
`content/client.config.ts` e `public/images/client/`, seguindo
`docs/ONBOARDING-CLIENTE.md` e `docs/CHECKLIST-NOVO-CLIENTE.md`, sem
tocar em `app/`, `components/`, `lib/`, schema, configuração do Next.js
ou do Tailwind, nem nos scripts principais.

Nenhum cliente real foi criado nesta etapa. Nenhuma mudança de direção
visual, arquitetura, multi-tenant, banco de dados, autenticação, painel
administrativo ou analytics externo foi feita.
