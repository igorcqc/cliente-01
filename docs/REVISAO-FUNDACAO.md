# Revisão técnica da fundação — antes do visual demonstrativo

Data: 2026-08-09
Escopo: revisão de leitura/validação apenas. Nenhum arquivo foi alterado
e nenhum commit adicional foi feito nesta etapa.

## Status das correções (atualizado em 2026-08-09)

Todos os problemas críticos (C1–C3) e importantes (I1–I6) listados
abaixo foram corrigidos. Detalhes de causa, correção, arquivos alterados
e validação de cada item estão em `docs/CORRECOES-FUNDACAO.md`.

| Item | Status |
|---|---|
| C1 — `client.config.ts` reexportava `client.example.ts` | ✅ Corrigido |
| C2 — template inválido após copiado (`credenciais: []`) | ✅ Corrigido |
| C3 — classes de opacidade ausentes no CSS de produção | ✅ Corrigido |
| I1 — favicon ausente | ✅ Corrigido |
| I2 — campos aceitos pelo schema e ignorados | ✅ Corrigido (implementados) |
| I3 — URLs com esquemas perigosos aceitas | ✅ Corrigido |
| I4 — `avatarUrl`/`ogImageUrl` sem validação de formato | ✅ Corrigido |
| I5 — tipografia customizada sem mecanismo de carregamento | ✅ Corrigido |
| I6 — imagem Open Graph em SVG | ✅ Corrigido |

As melhorias M1–M10 permanecem em aberto (fora do escopo desta rodada de
correção, por decisão explícita) — o restante deste documento preserva a
análise original, como registro histórico do que foi encontrado.

## 1. Resumo executivo

A fundação está estruturalmente correta na decisão mais importante — o
motor não conhece texto do expert, o contrato Zod existe, o tema não usa
classes Tailwind dinâmicas — mas a revisão encontrou **3 problemas
críticos** que quebram, na prática, promessas centrais já documentadas
como resolvidas:

1. `content/client.config.ts` **não é um arquivo independente** — ele
   reexporta `content/client.example.ts` por referência direta. Editar o
   "exemplo" edita a página ativa. Isso contradiz a separação
   exemplo/ativo descrita em `README.md`, `CLAUDE.md` e no próprio
   comentário de `client.example.ts`.
2. `templates/client.config.template.ts`, o arquivo que a documentação
   manda copiar para começar um cliente novo, **falha em `npm run
   validate` assim que copiado**, por um campo (`identidade.credenciais:
   []`) que nem é um placeholder — é a forma "vazia" default do próprio
   template.
3. As classes Tailwind com modificador de opacidade usadas no motor de
   tema (`bg-primary/10`, `hover:bg-primary/10`, `bg-primary/20`,
   `hover:bg-primary/20`) **não são geradas no CSS de produção**.
   Confirmado inspecionando o CSS compilado real. Isso significa que o
   estilo de botão `"soft"` (uma opção válida e documentada de
   `tema.estiloBotao`) deixa o **CTA principal sem cor de fundo** em
   produção — o elemento mais importante da página fica praticamente
   invisível sob essa configuração.

Nenhum desses três é um problema de "polimento visual" — são bugs de
comportamento/dados que a demonstração atual não expõe por acidente (o
tema demo usa `estiloBotao: "solid"` e nunca testa `"soft"`/`"outline"`
de verdade, e ninguém ainda tentou seguir o onboarding do zero copiando
o template).

Fora esses três, o restante da fundação é sólido: validação com
mensagens por campo funciona, build falha corretamente com conteúdo
inválido, não há segredos no repositório, não há hidratação quebrada,
Server/Client Components estão bem segmentados, e a hierarquia visual
do CTA principal (no tema demo, `solid`) é claramente dominante.

**Recomendação:** corrigir os 3 problemas críticos antes de avançar
para o visual demonstrativo — todos afetam diretamente o que o visual
vai construir em cima (tema e onboarding). Os problemas "importantes"
podem ser corrigidos junto ou logo em seguida; as "melhorias" podem
ficar para depois.

## 2. Validações executadas

| Comando/verificação | Resultado |
|---|---|
| `npm run validate` (conteúdo ativo) | ✅ passa — `content/client.config.ts` válido |
| `npm run typecheck` | ✅ sem erros |
| `npm run build` (conteúdo ativo) | ✅ build de produção gerado, rota `/` estática |
| `npm run validate` contra `templates/client.config.template.ts` (teste isolado, sem alterar arquivos do repo) | ❌ falha com 3 erros — ver Crítico #2 |
| Corrupção controlada de `content/client.config.ts` e restauração (mesmo teste do relatório anterior, refeito para confirmar) | ✅ `validate` e `build` falham com exit code 1 e mensagens por campo |
| `npm run dev` + inspeção de console do navegador (Playwright/Chromium) | ⚠️ 1 erro de rede: `GET /favicon.ico` → 404 |
| `npm run build && npm run start` + inspeção do CSS compilado | ❌ confirma ausência de `bg-primary/10`, `hover:bg-primary/10`, `bg-primary/20`, `hover:bg-primary/20` no CSS final |
| Medição de área de toque dos CTAs e ícones sociais (Playwright, viewport 390×844) | CTA principal 308×82px, CTA secundário 350×46px, ícone social 97×38px |
| Contraste de cor do tema de demonstração (WCAG, cálculo manual) | ✅ branco sobre primária 5.7:1, texto sobre fundo 16.8:1, texto secundário sobre fundo 4.8:1 — todos acima do mínimo AA |
| Varredura de segredos (`grep` por api key/secret/token/password/URLs suspeitas) | ✅ nenhuma ocorrência real |
| `npm audit` | ⚠️ 3 vulnerabilidades "high" em `postcss`/`sharp` (transitivas do Next 15) — já registrado como risco conhecido, sem mudança |
| `npm run test` | não existe script de teste — nenhum teste automatizado no projeto |
| `git status` ao final | limpo — nenhuma alteração deixada |

Servidores locais iniciados para os testes (`next dev`, `next start`) foram
encerrados ao final de cada verificação.

## 3. Problemas críticos

### C1 — `client.config.ts` não é independente de `client.example.ts`

- **Severidade:** crítico
- **Arquivo:** `content/client.config.ts:22`, `content/client.example.ts:10`
- **Problema:** `client.config.ts` faz `export const clientConfig:
  ClientConfig = clientConfigExample;` — ele não copia o conteúdo, ele
  **reexporta o mesmo objeto** de `client.example.ts`. O comentário no
  topo de `client.example.ts` afirma "Este arquivo NÃO é importado pela
  aplicação" — isso é falso no estado atual do repositório.
- **Cenário de falha:** alguém (humano ou IA) lê o comentário de
  `client.example.ts`, acredita que é seguro editá-lo como "referência",
  e sem querer altera o conteúdo publicado em produção — ou o inverso,
  alguém tenta usar `client.example.ts` como sandbox para testar
  variações e quebra a página ativa sem perceber.
- **Impacto:** quebra a separação motor/conteúdo que é o pilar central
  da arquitetura aprovada (isolamento por cliente). Também é
  especificamente o risco que este ciclo de revisão pediu para checar
  ("se o conteúdo de `client.example.ts` pode ser confundido com o
  conteúdo ativo") — a resposta é sim, e não por confusão de leitura, mas
  porque o código faz exatamente isso.
- **Correção recomendada:** `client.config.ts` deve conter o conteúdo
  literal (copiado), não um `import` de `client.example.ts`. Bastaria
  colar o objeto diretamente em `client.config.ts` como uma constante
  própria (`export const clientConfig: ClientConfig = { ... }`, com os
  mesmos valores), eliminando o `import { clientConfigExample }`.
  `client.example.ts` continua existindo como referência, mas deixa de
  ser importado por qualquer coisa que a aplicação carregue.

### C2 — `templates/client.config.template.ts` falha em `npm run validate` assim que copiado

- **Severidade:** crítico
- **Arquivo:** `templates/client.config.template.ts:29-32`; regra em
  `lib/validation/schema.ts:43-46`
- **Problema:** o template define
  ```ts
  credenciais: [
    // "[Credencial real 1]",
    // "[Credencial real 2]",
  ],
  ```
  ou seja, a chave `credenciais` está presente com um **array vazio**
  (os itens estão comentados). O schema define
  `credenciais: z.array(nonEmpty).min(1).optional()` — o `.optional()`
  permite omitir a chave inteiramente, mas se ela estiver presente, exige
  pelo menos 1 item. Um array vazio presente viola essa regra.
- **Cenário de falha:** confirmado por teste direto — copiar o template
  como documentado e rodar `npm run validate` produz:
  ```
  ❌ [identidade.credenciais] identidade.credenciais: informe ao menos
     uma credencial ou remova a seção.
  ```
  junto com os erros esperados dos campos `[COLCHETE]` (esses são
  intencionais — fazem parte do fluxo de preenchimento). O erro de
  `credenciais`, porém, não é sobre um placeholder esquecido: é uma
  incompatibilidade entre a forma "ainda não tenho credenciais" que o
  template representa e a regra do schema.
- **Impacto:** todo cliente novo criado seguindo `docs/ONBOARDING-CLIENTE.md`
  passo a passo esbarra nesse erro, mesmo que já tenha preenchido tudo
  corretamente — porque o erro não está ligado a nenhum `[COLCHETE]`
  visível, é fácil de não entender de onde vem.
- **Correção recomendada:** duas opções, qualquer uma resolve:
  - (a) no template, comentar/remover a chave `credenciais` inteira em
    vez de deixá-la como array vazio; ou
  - (b) no schema, trocar `.min(1)` por permitir array vazio (a UI já
    trata `credenciais.length === 0` corretamente em
    `components/sections/Credenciais.tsx`, retornando `null`), mantendo
    a validação de que cada item individual não seja string vazia.
  Recomendo (b) — é mais robusto a longo prazo, porque também remove o
  mesmo risco de qualquer cliente real que decida remover todas as
  credenciais depois de já ter publicado algumas.

### C3 — Classes de opacidade do tema (`bg-primary/10`, `bg-primary/20` e variantes `hover:`) não existem no CSS de produção

- **Severidade:** crítico
- **Arquivo:** `lib/theme.ts:53-57` (`BOTAO_ESTILO_CLASSES`), configuração
  de cor em `tailwind.config.ts:26-38`
- **Problema:** `tailwind.config.ts` define a cor `primary` apontando
  diretamente para `var(--color-primary)` (uma string CSS pura, não o
  formato de canais separados que o Tailwind precisa para calcular
  modificadores de opacidade via `color-mix()`). Como resultado, o
  Tailwind **não consegue gerar** utilitários como `bg-primary/10` para
  essa cor — a classe não aparece no CSS final, silenciosamente, mesmo
  com `lib/**` corretamente incluído no `content` do Tailwind (o mesmo
  arquivo gera `bg-primary`, `text-primary`, `border-primary` sem
  problema — só as variantes com `/opacidade` falham).
- **Cenário de falha (confirmado, não hipotético):** rodei
  `npm run build && npm run start` e inspecionei o CSS compilado real
  servido em produção. Ele contém `.bg-primary{...}`, `.text-primary{...}`,
  `.border-primary{...}`, mas **nenhuma** regra para `.bg-primary\/10`,
  `.hover\:bg-primary\/10`, `.bg-primary\/20` ou `.hover\:bg-primary\/20`.
  Essas são exatamente as classes usadas por:
  - `BOTAO_ESTILO_CLASSES.soft` → `"bg-primary/10 text-primary border
    border-transparent hover:bg-primary/20"` — usado quando um cliente
    configura `tema.estiloBotao: "soft"` (opção válida do schema, usada
    diretamente no **CTA principal** via `OfertaPrincipal.tsx`).
  - `BOTAO_ESTILO_CLASSES.outline` → inclui `hover:bg-primary/10` —
    usado quando `tema.estiloBotao: "outline"`, e também internamente
    por `CtasSecundarios.tsx` como fallback.
- **Impacto:** se um cliente (ou você, testando temas) escolher
  `estiloBotao: "soft"`, o botão do CTA principal renderiza **sem
  nenhuma cor de fundo** — resta só o texto colorido sobre fundo
  transparente e borda transparente, o que viola diretamente o
  requisito "CTA principal deve ser claramente dominante" e pode tornar
  o botão praticamente imperceptível dependendo do fundo da página. Com
  `estiloBotao: "outline"`, o efeito é menos grave mas ainda real: o
  hover do botão simplesmente não faz nada (sem feedback visual ao
  passar o mouse).
- **Correção recomendada:** trocar a estratégia de opacidade por uma que
  o Tailwind consiga resolver estaticamente. Duas abordagens
  razoáveis:
  - (a) declarar as variantes de opacidade como classes literais fixas
    no `safelist` do `tailwind.config.ts` (`safelist: ["bg-primary/10",
    "hover:bg-primary/10", "bg-primary/20", "hover:bg-primary/20"]`) —
    mais simples, mantém a abordagem atual;
  - (b) definir uma segunda variável CSS dedicada por estado (ex:
    `--color-primary-soft` calculada a partir da primária, ou fixada
    pelo próprio `lib/theme.ts` combinando a cor com transparência via
    CSS `color-mix()` direto no `style` inline, sem depender do
    Tailwind para o cálculo de opacidade) — mais robusto a longo prazo.
  Recomendo (a) como correção imediata (baixo risco, resolve o bug
  agora) e considerar (b) se o produto crescer em variações de tema.

## 4. Problemas importantes

### I1 — Favicon ausente

- **Severidade:** importante
- **Arquivo:** `app/` (arquivo ausente); nenhuma referência em
  `next.config.ts` ou `app/layout.tsx`
- **Problema:** não existe `app/favicon.ico`, `app/icon.*` nem campo
  `icons` em `generateMetadata`. Confirmado: `GET /favicon.ico` retorna
  **404** tanto em `next dev` quanto em `next start` (produção).
- **Cenário de falha:** qualquer visitante vê o ícone genérico do
  navegador na aba, e o console do navegador registra um erro de rede
  404 a cada carregamento.
- **Impacto:** item de SEO/branding básico explicitamente pedido na
  especificação original ("SEO e Open Graph básicos") e nesta revisão.
- **Correção recomendada:** adicionar um favicon básico do produto (ou
  um placeholder neutro para a base, substituível por cliente) em
  `app/icon.png` ou `app/favicon.ico` — Next.js App Router detecta
  automaticamente esses arquivos sem configuração adicional.

### I2 — Campos aceitos pelo schema, mas nunca lidos pela aplicação

- **Severidade:** importante
- **Arquivo:** `lib/validation/schema.ts` (definição dos campos);
  `lib/tracking/trackClick.ts`, `components/sections/CtasSecundarios.tsx`
  (onde deveriam ser usados e não são)
- **Problema:** três campos existem no schema, podem ser preenchidos
  pelo cliente, passam na validação, mas não têm nenhum efeito na
  página renderizada:
  - `rastreamento.habilitado` e `rastreamento.observacoes` —
    `trackClick.ts` nunca lê `config.rastreamento.habilitado`; o
    rastreamento (hoje, um `console.debug`) roda incondicionalmente.
  - `cta.descricao` (presente em `ctaPrincipal` e em cada item de
    `ctasSecundarios`) — nenhum componente renderiza esse texto.
  - `ctaSecundario.icone` — `CtasSecundarios.tsx` nunca lê `cta.icone`.
- **Cenário de falha:** quem preenche o `client.config.ts` de um cliente
  real pode legitimamente achar que `rastreamento.habilitado: false`
  desliga o rastreamento, ou que `icone: "download"` faz um ícone
  aparecer no botão — nenhum dos dois acontece.
- **Impacto:** falsa sensação de controle sobre o conteúdo; divergência
  entre o que o schema promete e o que o motor entrega.
- **Correção recomendada:** para cada campo, ou (a) implementar o
  comportamento esperado (ex: `trackClick` checar `habilitado` antes de
  disparar; `CtasSecundarios` renderizar `cta.icone` se presente,
  `oferta.ctaPrincipal.descricao` ganhar um lugar no layout), ou (b)
  remover o campo do schema até que haja uma implementação real. Não
  deixar campos "decorativos" no contrato.

### I3 — `cta.url` e `redeSocial.url` aceitam esquemas perigosos (`javascript:`, `data:`)

- **Severidade:** importante
- **Arquivo:** `lib/validation/schema.ts:21-26` (`urlField`)
- **Problema:** `urlField` usa `z.string().url()`, que valida apenas que
  a string é um URL bem formado segundo o parser WHATWG — não restringe
  o esquema. Testado diretamente: `"javascript:alert(1)"`,
  `"data:text/html,<script>..."` e `"vbscript:msgbox(1)"` passam todos
  na validação.
- **Cenário de falha:** um erro de copiar/colar, ou uma fonte de
  conteúdo futura menos confiável (ex: se o config algum dia vier de um
  formulário ou CMS), poderia inserir um link com esquema `javascript:`
  em um CTA. Como o valor vai direto para `href` em
  `components/ui/Button.tsx` e `components/sections/RedesSociais.tsx`
  sem nenhuma outra checagem, o link seria renderizado clicável.
- **Impacto:** hoje o risco é baixo (conteúdo é escrito por
  desenvolvedor, TypeScript-checked, e navegadores modernos já
  restringem bastante `javascript:` em navegação de âncora), mas é uma
  lacuna real de validação — o schema deveria ser a linha de defesa
  aqui e não é.
- **Correção recomendada:** restringir `urlField` a um allowlist de
  esquemas plausíveis para este produto (`http:`, `https:`, `mailto:`,
  `tel:`), com uma mensagem de erro clara para esquemas fora da lista.

### I4 — Formato de `avatarUrl`/`ogImageUrl`/`imagemUrl` não é validado, só presença

- **Severidade:** importante
- **Arquivo:** `lib/validation/schema.ts` (`identidadeSchema.avatarUrl`,
  `seoSchema.ogImageUrl`, `provaSocialSchema.imagemUrl`)
- **Problema:** esses campos usam apenas `nonEmpty` (qualquer string não
  vazia), sem checar se é um caminho relativo válido (começando com
  `/`) ou uma URL absoluta bem formada. `next/image` e `next build`
  **não** buscam a imagem local durante o build — a checagem de que o
  arquivo existe/está no formato certo só acontece em runtime, no
  navegador.
- **Cenário de falha:** um erro comum como esquecer a barra inicial
  (`"images/client/avatar.jpg"` em vez de `"/images/client/avatar.jpg"`)
  ou apontar para um arquivo que não foi commitado passa em
  `npm run validate` e em `npm run build` sem nenhum aviso, e só aparece
  como imagem quebrada depois de publicado.
- **Impacto:** contradiz a garantia (documentada em
  `docs/IMPLEMENTACAO-BASE.md`) de que "conteúdo inválido derruba o
  build" — isso é verdade para texto/URLs de CTA, mas não para este
  tipo específico de erro de imagem.
- **Correção recomendada:** adicionar uma validação de formato (regex
  simples: começa com `/` ou é uma URL `http(s)://` válida) nesses três
  campos. Verificar a existência real do arquivo fica fora do escopo do
  Zod, mas pelo menos a forma do valor pode ser garantida.

### I5 — Tipografia customizada não tem mecanismo de carregamento

- **Severidade:** importante
- **Arquivo:** `lib/theme.ts` (`--font-heading`, `--font-body`);
  ausente em toda a documentação
- **Problema:** `tema.fonteTitulo`/`fonteCorpo` aceitam qualquer string
  de `font-family`, mas nada no projeto carrega uma fonte que não seja
  do sistema (sem `next/font`, sem `<link>` para Google Fonts, sem
  `@font-face`). Se um cliente definir `"'Poppins', sans-serif"`, o
  navegador simplesmente cai no fallback `sans-serif` — a fonte
  "configurada" nunca é usada de fato.
- **Cenário de falha:** identidade visual do cliente pede uma fonte de
  marca; ela é preenchida no config, passa na validação, mas a página
  publicada usa a fonte do sistema mesmo assim — sem nenhum erro ou
  aviso que aponte a causa.
- **Impacto:** a promessa "tipografia, quando possível" fica incompleta
  e essa limitação não está documentada em nenhum lugar — quem for
  configurar um cliente não tem como saber, sem ler o código, que
  precisa de um passo extra (ou que esse passo não existe ainda).
- **Correção recomendada:** documentar explicitamente essa limitação em
  `docs/ONBOARDING-CLIENTE.md` (só fontes do sistema funcionam nesta
  v1), ou implementar um mecanismo simples de carregamento (ex:
  `next/font/google` com uma lista fixa de fontes suportadas
  selecionável por enum, em vez de string livre).

### I6 — Imagem de Open Graph de demonstração é SVG, formato não suportado pela maioria das plataformas de compartilhamento

- **Severidade:** importante
- **Arquivo:** `public/images/shared/og-default.svg`;
  `next.config.ts:15` (`dangerouslyAllowSVG`)
- **Problema:** WhatsApp, Facebook, LinkedIn e Twitter/X normalmente não
  renderizam SVG como imagem de preview de Open Graph (esperam
  JPG/PNG). A imagem OG da demonstração é SVG.
- **Cenário de falha:** se a URL de demonstração for compartilhada em
  qualquer uma dessas plataformas, o preview provavelmente aparece sem
  imagem.
- **Impacto:** os docs já recomendam PNG/JPG/WebP "para um cliente
  real", mas não alertam que SVG **não funciona** para OG
  especificamente — só que não é o ideal.
- **Correção recomendada:** trocar o placeholder de OG por um PNG/JPG
  gerado (ainda que simples), e adicionar uma nota explícita em
  `docs/ONBOARDING-CLIENTE.md`: "a imagem de Open Graph precisa ser
  PNG/JPG — SVG não é exibido pela maioria dos apps de compartilhamento."

## 5. Melhorias recomendadas

- **M1 — Token único de raio aplicado a elementos de escalas muito
  diferentes.** `--radius` (`lib/theme.ts:18-24`) é usado via
  `rounded-theme` tanto no avatar (96×96px) e badges pequenos quanto em
  cards grandes (`OfertaPrincipal`, `Posicionamento`, `ProvasSociais`).
  Se um cliente escolher `raio: "full"` (9999px), os cards grandes
  ficam com formato de "pílula" desproporcional. Sugestão: separar em
  dois tokens (ex: raio para elementos pequenos vs. cards) ou limitar a
  opção `"full"` a um subconjunto de componentes.

- **M2 — Comentário desatualizado em `CtasSecundarios.tsx:11-13`.** O
  comentário diz que o estilo secundário é "outline fixo, independente
  do estilo do botão principal", mas o código de fato alterna entre
  `"outline"` e `"soft"` dependendo de `estiloBotao`. Corrigir o
  comentário para refletir o comportamento real.

- **M3 — Ano do rodapé fica congelado no build.** `Footer.tsx:11` usa
  `new Date().getFullYear()` num componente de servidor de uma página
  100% estática (confirmado: `○ (Static) prerendered as static
  content`). Sem redeploy após a virada do ano, o copyright mostra o
  ano do último build. Não é erro de hidratação (não há mismatch
  cliente/servidor), é uma questão de atualização. Considerar aceitar
  como está (redeploys são frequentes na prática) ou documentar a
  limitação.

- **M4 — Landmarks em excesso.** Toda seção usa `<Section
  ariaLabel="...">`, e cada `<section>` com nome acessível vira uma
  landmark "region". A página gera 8 regiões nomeadas para uma rolagem
  linear curta, o que sobrecarrega a navegação por landmarks em
  leitores de tela. Sugestão: manter `aria-label` só onde há valor real
  de navegação (ex: já está correto em `<nav aria-label="Redes
  sociais">`) e remover das seções puramente estruturais.

- **M5 — Área de toque dos ícones de rede social.** Medido:
  97×38px. Está acima do mínimo WCAG 2.2 AA (24×24px) mas abaixo da
  recomendação comum de 44px de altura. Ajuste de padding melhoraria a
  usabilidade em telas de toque.

- **M6 — Badge "Exemplo demonstrativo" usa a mesma cor de fundo do
  card que a envolve.** `Badge.tsx` usa `bg-surface`, igual aos cards de
  `ProvasSociais.tsx` — a distinção depende inteiramente da borda. No
  tema de demonstração funciona (contraste adequado), mas é frágil para
  temas customizados com baixo contraste entre superfície e borda.

- **M7 — Sem validação de contraste entre cores do tema.** O schema
  aceita qualquer par de cores hex válidas, mesmo que resultem em
  contraste insuficiente entre texto e fundo. No tema de demonstração
  os contrastes são bons (verificado manualmente), mas nada no
  `npm run validate` alertaria sobre um tema futuro com baixo
  contraste.

- **M8 — Tokens Tailwind não utilizados.** A cor `background` (classe
  `bg-background`) e a fonte `font-body` estão definidas em
  `tailwind.config.ts` mas nunca usadas como classes utilitárias — o
  fundo do body e a fonte são aplicados via CSS global direto em
  `globals.css`. Não é um bug funcional, é configuração redundante.

- **M9 — `target="_blank"` incondicional em todos os links,
  inclusive `mailto:`/`tel:`.** Não é um problema de segurança
  (`rel="noopener noreferrer"` já está presente corretamente), mas abrir
  "nova aba" para um link `mailto:`/`tel:` é logicamente desnecessário e
  pode gerar uma aba em branco em alguns navegadores desktop.

- **M10 — Sem testes automatizados.** Consistente com a decisão de
  escopo já registrada; vale deixar explícito que a única rede de
  segurança automática hoje é schema + typecheck + build, sem testes de
  regressão de comportamento/UI.

## 6. Pontos que estão corretos

- CTA principal claramente dominante em relação aos secundários no tema
  de demonstração (`estiloBotao: "solid"`): medido 308×82px vs.
  350×46px, com peso de fonte e presença de card reforçando a
  hierarquia.
- Nenhum erro ou aviso de hidratação observado ao carregar a página
  (inspecionado via console do navegador); a segmentação Server/Client
  Component é mínima e correta — só `components/ui/Button.tsx` é
  Client Component, e por um motivo real (`onClick`).
- Nenhum segredo, chave ou token exposto no repositório; `.env.example`
  não contém valores reais; `.env*.local` está no `.gitignore`.
- `npm run validate` falha corretamente com mensagens específicas por
  campo quando o conteúdo ativo está malformado (testado com corrupção
  controlada e revertido).
- `npm run build` falha pelo mesmo motivo, porque roda `npm run
  validate` antes do `next build` — nenhuma página é gerada com
  conteúdo inválido.
- `rel="noopener noreferrer"` presente em todos os links externos.
- Nenhum uso de `dangerouslySetInnerHTML`, `eval` ou `new Function()`
  em todo o código.
- Listas vazias tratadas corretamente: `Credenciais`, `CtasSecundarios`,
  `ProvasSociais` e `RedesSociais` retornam `null` quando o array
  correspondente está vazio, sem gerar markup fantasma nem erro.
- `alt` é obrigatório e está sempre presente no avatar
  (`identidade.avatarAlt` é exigido pelo schema e usado corretamente).
- SEO/Open Graph são gerados corretamente a partir do conteúdo: title,
  description, canonical, `og:image` (resolve caminho relativo via
  `metadataBase` corretamente), Twitter Card.
- Nenhuma classe Tailwind é montada por concatenação de string com
  valor do cliente (nunca `` `bg-${cor}` ``) — a arquitetura de tema é
  fundamentalmente correta; o problema encontrado (C3) é uma limitação
  específica do Tailwind com variáveis CSS puras, não uma violação da
  regra "nunca concatenar classe dinâmica".
- A separação motor/conteúdo é real e consistente em todos os outros
  arquivos além do par `client.config.ts`/`client.example.ts` (achado
  C1) — nenhum componente importa conteúdo diretamente, todos passam
  por `getClientConfig()`.

## 7. Riscos conhecidos

- `npm audit`: 3 vulnerabilidades "high" em dependências transitivas de
  build do Next.js 15 (`postcss`, `sharp`). Já registrado em
  `docs/IMPLEMENTACAO-BASE.md`; corrigir exige subir para Next.js 16
  (mudança de major version) — decisão consciente de não fazer isso
  ainda, mantida nesta revisão.
- Atualização de um cliente já publicado com melhorias feitas na base
  depois é um processo manual (`docs/ATUALIZAR-BASE.md`), sem
  automação — aceito por design do modelo de repositórios
  independentes.
- Sem banco de dados, autenticação ou painel administrativo — por
  decisão de escopo desta v1, não um problema em si.

## 8. Decisão recomendada antes do visual demonstrativo

**Não avançar para o visual demonstrativo antes de corrigir C1, C2 e
C3.** Os três afetam diretamente a base sobre a qual o trabalho visual
seria construído:

- C1 (exemplo vs. ativo confundidos) significa que, ao personalizar
  visualmente "a página de demonstração", não fica claro qual arquivo
  está de fato sendo editado.
- C2 (template quebrado) vai se repetir a cada cliente novo criado a
  partir de agora, incluindo qualquer cliente de demonstração adicional
  que se queira criar para testar o visual.
- C3 (variantes de tema quebradas em produção) significa que testar o
  visual com `estiloBotao: "soft"` ou `"outline"` hoje mostraria um
  resultado quebrado que não tem relação com o trabalho visual em si —
  só atrapalharia a avaliação de qualquer refinamento feito por cima.

Os itens "importantes" (I1–I6) valem a pena corrigir na mesma leva,
porque são rápidos e vários também tocam tema/imagens — mexer nisso
duas vezes (uma para corrigir bug, outra para refinar visual) é
retrabalho evitável. As "melhorias" (M1–M10) podem esperar: nenhuma
delas bloqueia ou distorce o próximo passo, e algumas (M1, M4) fazem
mais sentido decidir já olhando para o visual refinado.

Nenhuma correção foi aplicada nesta etapa, conforme solicitado.
