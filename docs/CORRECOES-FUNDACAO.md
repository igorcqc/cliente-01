# Correções aplicadas à fundação (C1–C3, I1–I6)

Data: 2026-08-09
Escopo: correção dos 3 problemas críticos e 6 importantes identificados
em `docs/REVISAO-FUNDACAO.md`. Nenhuma melhoria (M1–M10), funcionalidade
nova, arquitetura, oferta ou escopo visual foi alterada nesta etapa.

---

## C1 — Independência entre `client.config.ts` e `client.example.ts`

**Causa:** `content/client.config.ts` fazia `export const clientConfig =
clientConfigExample;`, importando e reexportando o mesmo objeto de
`content/client.example.ts`. Editar o "exemplo" editava a página ativa
em produção. O comentário de `client.example.ts` afirmava o contrário
(falso no estado anterior).

**Correção aplicada:**
- `content/client.config.ts` agora define seu próprio objeto literal
  (`ClientConfig`), sem nenhum `import` de `client.example.ts`.
- `content/client.example.ts` continua com seu próprio objeto literal
  (mesmo conteúdo de demonstração, mas como dado independente).
- Criado `scripts/check-content-independence.ts`, que prova a
  independência de duas formas: (a) análise estática — o código-fonte de
  `client.config.ts` não pode conter um `import`/`require` de
  `client.example`; (b) verificação em runtime — os dois módulos
  carregados não podem ser o mesmo objeto em memória.
- Essa verificação roda a cada `npm run validate` (e portanto a cada
  `npm run build`), então uma regressão futura quebra o build
  imediatamente.
- Comentários e documentação (`README.md`, `CLAUDE.md`,
  `docs/ARQUITETURA.md`, `docs/ONBOARDING-CLIENTE.md`) atualizados para
  descrever o comportamento real.

**Arquivos alterados:**
- `content/client.config.ts` (reescrito, conteúdo literal)
- `content/client.example.ts` (reescrito, conteúdo literal, comentário corrigido)
- `scripts/check-content-independence.ts` (novo)
- `scripts/validate-content.ts` (chama a nova verificação)
- `package.json` (novo script `check:independence`)
- `README.md`, `CLAUDE.md`, `docs/ARQUITETURA.md`, `docs/ONBOARDING-CLIENTE.md`

**Como foi validado:**
- `npm run validate` agora imprime "✅ content/client.config.ts é
  independente de content/client.example.ts." antes da validação de
  schema.
- Teste negativo: reintroduzi temporariamente um `import` de
  `client.example` em `client.config.ts` (fora do repositório, em
  arquivo de teste isolado) e confirmei que `checkContentIndependence()`
  rejeita com a mensagem esperada.
- `npm run build` passa com a verificação incluída.

**Limitação restante:** nenhuma. A verificação é estática + runtime, sem
depender de convenção manual.

---

## C2 — Template de novo cliente inválido após copiado

**Causa:** `templates/client.config.template.ts` definia
`identidade.credenciais: []` (array presente, vazio). O schema exigia
`.min(1)` quando a chave estava presente, então um cliente novo, ao
copiar o template sem nenhuma edição na seção de credenciais, já
começava com um erro de validação não relacionado a nenhum
`[COLCHETE]` visível.

**Correção aplicada:**
- `lib/validation/schema.ts`: `identidade.credenciais` agora é
  `z.array(nonEmpty).optional()`, sem `.min(1)`. Um array vazio ou a
  chave ausente são ambos válidos; cada item, se presente, ainda precisa
  ser um texto não vazio. `components/sections/Credenciais.tsx` já
  tratava array vazio corretamente (retorna `null`), então nenhuma
  mudança de componente foi necessária.
- `templates/client.config.template.ts` atualizado com um comentário
  explicando que `credenciais: []` é válido e não precisa virar dado
  inventado.
- `docs/ONBOARDING-CLIENTE.md` atualizado explicando que campos como
  `credenciais` são opcionais de verdade, e que os erros que
  **permanecem** ao copiar o template (URL do CTA principal, domínio
  canônico) são intencionais — apontam campos genuinamente obrigatórios
  para qualquer cliente, guiando o preenchimento.

**Arquivos alterados:**
- `lib/validation/schema.ts` (regra de `credenciais`)
- `templates/client.config.template.ts` (comentário, valores atualizados
  para o novo enum de fonte — ver I5)
- `docs/ONBOARDING-CLIENTE.md`

**Como foi validado:**
1. Copiei `templates/client.config.template.ts` para um arquivo
   temporário fora do repositório e rodei `validateClientConfig` contra
   ele sem nenhuma edição: o erro de `identidade.credenciais`
   desapareceu; restaram apenas os dois erros esperados e intencionais
   (`oferta.ctaPrincipal.url` e `seo.urlCanonica`, ambos com
   `[COLCHETE]` não preenchido).
2. Preenchi um clone do template com valores realistas (nome, oferta,
   URLs `https://example.com/...`, SEO) e confirmei que
   `validateClientConfig` aceita o resultado sem nenhum erro.
3. `npm run validate` e `npm run build` no conteúdo ativo (que também
   usa a mesma estrutura de credenciais) continuam passando.

**Limitação restante:** o schema valida a *forma* de um campo, não sua
veracidade — copiar o template e substituir `[URL real...]` por
qualquer URL sintaticamente válida passa na validação mesmo que a URL
não leve a lugar nenhum de verdade. Isso é inerente a qualquer validação
de schema e está coberto pelo processo humano em
`documents/checklist-qa.md` (testar links manualmente).

---

## C3 — Classes de tema com opacidade ausentes no CSS de produção

**Causa:** `tailwind.config.ts` definia a cor `primary` apontando
diretamente para `var(--color-primary)` (uma string CSS pura). O
Tailwind não consegue calcular modificadores de opacidade (`/10`,
`/20`) para uma cor nesse formato — as classes `bg-primary/10`,
`hover:bg-primary/10`, `bg-primary/20`, `hover:bg-primary/20` (usadas
pelos estilos de botão `"outline"` e `"soft"` em
`BOTAO_ESTILO_CLASSES`) simplesmente não eram geradas no CSS final.
Sob `tema.estiloBotao: "soft"`, isso deixava o **CTA principal sem cor
de fundo** em produção.

**Correção aplicada (sem safelist):** migrado para o padrão oficial do
Tailwind para cores baseadas em variável CSS com suporte a opacidade:
- `lib/theme.ts`: as cores agora são expostas como variáveis CSS com os
  **canais RGB separados por espaço** (`hexToRgbChannels`, ex:
  `--color-primary-rgb: 124 58 237`), não a string hex direta.
- `tailwind.config.ts`: cada cor do tema é definida como
  `rgb(var(--color-x-rgb) / <alpha-value>)`. O placeholder
  `<alpha-value>` é substituído pelo próprio Tailwind com o valor de
  opacidade de qualquer modificador (`/10`, `/20`, etc.), calculado em
  CSS puro — nenhuma lista de classes fixas foi adicionada.
- `app/globals.css`: valores de fallback (`:root`) atualizados para o
  novo formato de canais RGB; `body`/`:focus-visible` atualizados para
  usar `rgb(var(--x-rgb))`.

**Arquivos alterados:**
- `lib/theme.ts` (nova função `hexToRgbChannels`, variáveis renomeadas)
- `tailwind.config.ts` (cores redefinidas com `rgb(... / <alpha-value>)`)
- `app/globals.css` (fallbacks e usos atualizados)

**Como foi validado (build de produção real, não só `next dev`):**
1. `rm -rf .next && npm run build` e inspecionei diretamente o CSS
   compilado em `.next/static/css/*.css`. Confirmado: `.bg-primary\/10`,
   `.hover\:bg-primary\/10:hover`, `.hover\:bg-primary\/20:hover` estão
   presentes, cada um resolvendo para
   `rgb(var(--color-primary-rgb)/<opacidade>)`.
2. Alterei temporariamente `tema.estiloBotao` do conteúdo ativo para
   `"soft"`, rodei `npm run build && npm run start`, e tirei um
   screenshot real do CTA principal em `http://localhost:3303`: o botão
   aparece com fundo lilás claro (`bg-primary/10`) e texto na cor
   primária — visível e funcional. Restaurei o arquivo ao valor original
   (`"solid"`) logo em seguida e confirmei com `diff` que voltou ao
   estado exato de antes do teste.
3. `estiloBotao: "solid"` (o padrão do conteúdo ativo) continua
   funcionando sem nenhuma mudança visual — usa apenas `bg-primary`
   sólido e `hover:opacity-90`, que não dependiam de opacidade de cor.
4. Foco visível (`:focus-visible`, global) e hover continuam
   funcionando em todos os estilos de botão — testado via inspeção do
   CSS compilado (`outline`, `hover:opacity-90` presentes) e
   visualmente.

**Limitação restante:** nenhuma conhecida. O padrão `rgb(var(...) /
<alpha-value>)` é a recomendação oficial do Tailwind v3 para este caso
de uso e cobre qualquer combinação futura de opacidade sobre as cores do
tema, sem precisar prever cada classe manualmente.

---

## I1 — Favicon ausente

**Causa:** nenhum `app/favicon.ico`/`app/icon.*` existia; `GET
/favicon.ico` retornava 404 tanto em desenvolvimento quanto em produção.

**Correção aplicada:**
- Adicionado `app/icon.png` (512×512, monograma "B" neutro sobre fundo
  escuro) — convenção de arquivo do Next.js App Router, detectada e
  servida automaticamente (gera as tags `<link rel="icon">` sem
  nenhuma mudança de código).
- Adicionado `app/favicon.ico` (multi-resolução: 16/32/48px) para
  navegadores que ainda pedem `/favicon.ico` diretamente, independente
  das tags `<link>`.
- O ícone é neutro — não usa a identidade visual de nenhum cliente
  específico (não é a cor/marca de "Marina Dantas") — e documentado
  como asset do motor, substituível por cliente.

**Arquivos alterados:**
- `app/icon.png` (novo)
- `app/favicon.ico` (novo)
- `docs/ARQUITETURA.md`, `docs/ONBOARDING-CLIENTE.md` (documentação de
  como substituir por cliente)

**Como foi validado:**
- `npm run build && npm run start`, depois `curl -o /dev/null -w
  "%{http_code}" http://localhost/favicon.ico` → `200` (antes: `404`).
- Build gera explicitamente a rota `/icon.png` (visível na saída do
  `next build`: `○ /icon.png`).
- Inspeção visual do ícone gerado (PNG 512×512) antes de commitá-lo.

**Limitação restante:** o favicon não é um campo do schema — trocá-lo
por cliente é uma substituição de arquivo (documentada), não uma edição
de `client.config.ts`. Isso é intencional (não é conteúdo de dados do
expert, é um asset de branding do produto/repositório).

---

## I2 — Campos aceitos pelo schema e não utilizados

**Causa:** três campos existiam no schema, passavam na validação, mas
não tinham nenhum efeito na página: `rastreamento.habilitado`,
`cta.descricao`, `ctaSecundario.icone`.

**Decisão:** implementar o uso real dos três (em vez de removê-los) —
todos têm valor de produto real e implementação simples.

**Correção aplicada:**
- `rastreamento.habilitado`: `lib/tracking/trackClick.ts` agora lê
  `getClientConfig().rastreamento.habilitado` e retorna imediatamente,
  sem logar nada, quando `false`. Nunca afeta a navegação do link (o
  `href` do `<a>` não depende do rastreamento).
- `cta.descricao`: renderizado como legenda curta (`<p>` discreto)
  abaixo do botão, tanto para o CTA principal
  (`components/sections/OfertaPrincipal.tsx`) quanto para cada CTA
  secundário (`components/sections/CtasSecundarios.tsx`). Limite de 140
  caracteres adicionado ao schema para manter a legenda curta por
  design.
- `ctaSecundario.icone`: renderizado por `components/ui/Button.tsx`
  como um emoji decorativo antes do texto do botão, sempre com
  `aria-hidden="true"` — o nome acessível do link continua vindo do
  texto visível (`label`), então não precisa (nem deve) de texto
  alternativo próprio. Campo limitado a 4 caracteres (um emoji).

**Arquivos alterados:**
- `lib/tracking/trackClick.ts` (lê `rastreamento.habilitado`)
- `components/sections/OfertaPrincipal.tsx` (renderiza `descricao`)
- `components/sections/CtasSecundarios.tsx` (renderiza `descricao` e `icone`)
- `components/ui/Button.tsx` (prop `icone`)
- `lib/validation/schema.ts` (limites de tamanho em `descricao`/`icone`)
- `content/client.config.ts`, `content/client.example.ts` (exemplos
  preenchidos: `descricao` no CTA principal, `icone: "⬇️"` num CTA
  secundário — para que o comportamento fique visível na demonstração)
- `templates/client.config.template.ts` (comentários explicando os
  novos campos)

**Como foi validado:**
- `npm run build && npm run start` com o conteúdo ativo (que já usa
  `descricao` e `icone`) + screenshot: a legenda "Exemplo: sem
  compromisso, leva cerca de 20 minutos." aparece abaixo do CTA
  principal, e o emoji ⬇️ aparece antes de "Baixar guia gratuito" — ambos
  confirmados visualmente no mesmo teste usado para validar C3.
- Confirmado por inspeção de código que `trackClick` retorna antes de
  qualquer log quando `habilitado: false` (o conteúdo ativo usa
  `habilitado: true`, então o comportamento default do log em dev
  continua o mesmo).

**Limitação restante:** nenhum provedor de analytics real está
conectado (fora de escopo desta v1) — `rastreamento.habilitado`
controla apenas o `console.debug` atual e qualquer disparo futuro que
for adicionado em `trackClick.ts`.

---

## I3 — URLs com esquemas perigosos

**Causa:** `urlField` (usado em `cta.url` e `redeSocial.url`) validava
apenas que a string era um URL bem formado (`z.string().url()`), sem
restringir o esquema — `javascript:`, `data:`, `vbscript:` e `file:`
passavam na validação.

**Correção aplicada:**
- `lib/validation/schema.ts`: `urlField` agora usa `superRefine` para
  fazer parse com `new URL(...)` e checar o `protocol` contra uma
  allowlist (`https:`, `http:`, `mailto:`, `tel:`). Qualquer outro
  esquema, ou uma URL malformada, é rejeitado com mensagem específica.
- `components/ui/Button.tsx` e `components/sections/RedesSociais.tsx`
  não mudaram sua forma de renderizar `href` — não há
  `dangerouslySetInnerHTML` nem interpretação de HTML em nenhum lugar do
  projeto (confirmado por varredura), então a validação de esquema no
  schema é a barreira correta e suficiente.
- `lib/links.ts` (novo): centraliza a regra de `target="_blank"` — só
  abre nova aba para esquemas de navegação web (`http`/`https`); para
  `mailto:`/`tel:` não adiciona `target`/`rel` (abrem o app do sistema,
  não uma aba). `rel="noopener noreferrer"` continua presente sempre que
  `target="_blank"` é usado.

**Arquivos alterados:**
- `lib/validation/schema.ts` (`urlField` com allowlist de esquema)
- `lib/links.ts` (novo)
- `components/ui/Button.tsx` (usa `novaAbaProps`)
- `components/sections/RedesSociais.tsx` (usa `novaAbaProps`)

**Como foi validado:** suíte de testes negativos/positivos rodada
diretamente contra `validateClientConfig` (script isolado, não
commitado):

| Entrada | Resultado |
|---|---|
| `javascript:alert(1)` | ❌ rejeitado — "esquema `javascript:` não é permitido" |
| `data:text/html,<script>...` | ❌ rejeitado — "esquema `data:` não é permitido" |
| `vbscript:msgbox(1)` | ❌ rejeitado |
| `file:///etc/passwd` | ❌ rejeitado |
| `"não é uma url"` | ❌ rejeitado — "precisa ser uma URL válida" |
| `redeSocial.url = javascript:...` | ❌ rejeitado (mesma regra aplicada) |
| `https://example.com/x` | ✅ aceito |
| `mailto:contato@example.com` | ✅ aceito |
| `tel:+5511999999999` | ✅ aceito |
| `https://wa.me/5511999999999` | ✅ aceito (WhatsApp via link https padrão) |

Também confirmado por inspeção de código: nenhum uso de
`dangerouslySetInnerHTML`, `eval` ou `new Function()` em todo o projeto.

**Limitação restante:** nenhuma para o conjunto de esquemas usado por
este produto. Se um cliente precisar de um esquema fora da allowlist no
futuro (ex: um deep link de app específico), isso exige uma decisão
explícita de expandir a allowlist — não deve ser feito silenciosamente.

---

## I4 — Validação de `avatarUrl` e `ogImageUrl`

**Causa:** `avatarUrl`, `ogImageUrl` e `provaSocial.imagemUrl` eram
validados apenas como texto não vazio (`nonEmpty`), sem checar formato.
Um erro comum (caminho sem barra inicial, arquivo inexistente) passava
em `npm run validate` e `npm run build` e só quebrava em produção, como
imagem faltando.

**Correção aplicada:**
- `lib/validation/schema.ts`: novo `imagePathField`, usado nos três
  campos. Aceita: caminho local começando com `/` (servido de
  `public/`), ou URL absoluta `http(s)://`; em ambos os casos, exige uma
  extensão de imagem reconhecida (`.png`, `.jpg`, `.jpeg`, `.webp`,
  `.gif`, e `.svg` exceto onde proibido — ver I6).
  `provaSocial.imagemAlt` passou a ser obrigatório quando
  `imagemUrl` está presente (a UI já dependia disso para acessibilidade,
  agora o schema garante).
- `docs/ONBOARDING-CLIENTE.md`: documentado o formato aceito e a
  necessidade de configurar `next.config.ts` → `images.remotePatterns`
  se uma URL externa for usada (a validação do schema confirma o
  formato, não que o domínio esteja liberado para `next/image`).

**Arquivos alterados:**
- `lib/validation/schema.ts` (`imagePathField`, aplicado em
  `identidade.avatarUrl`, `seo.ogImageUrl`, `provaSocial.imagemUrl`;
  `provaSocialSchema` ganhou um `superRefine` exigindo `imagemAlt`
  junto de `imagemUrl`)
- `docs/ONBOARDING-CLIENTE.md`, `docs/ARQUITETURA.md`

**Como foi validado:** mesma suíte de testes da seção I3, casos de
imagem:

| Entrada | Resultado |
|---|---|
| `avatarUrl = "images/client/avatar.jpg"` (sem barra) | ❌ rejeitado |
| `avatarUrl = "/images/client/avatar"` (sem extensão) | ❌ rejeitado |
| `avatarUrl = ""` (vazio) | ❌ rejeitado |
| `ogImageUrl` em `.svg` | ❌ rejeitado (ver I6) |
| `ogImageUrl = "javascript:alert(1)"` | ❌ rejeitado |
| `avatarUrl = "/images/client/foto.jpg"` | ✅ aceito |
| `avatarUrl = "https://images.example.com/foto.png"` (externa) | ✅ aceito |
| `ogImageUrl = "/images/client/og.png"` | ✅ aceito |

**Limitação restante (documentada, não escondida):** a validação
confirma a *forma* do caminho — não busca o arquivo real. Um caminho
sintaticamente válido para um arquivo nunca commitado ainda passa na
validação e só aparece como imagem quebrada em produção. Verificar
visualmente (`npm run dev`) continua sendo necessário antes de publicar.

---

## I5 — Tipografia customizada sem mecanismo de carregamento

**Causa:** `tema.fonteTitulo`/`fonteCorpo` aceitavam qualquer string de
`font-family`, mas nada no projeto carregava uma fonte que não fosse do
sistema — uma fonte de marca configurada nunca era realmente usada, sem
nenhum aviso.

**Correção aplicada:** tipografia limitada a uma lista fechada de três
opções seguras, cada uma já mapeada para uma pilha de fontes de sistema:
- `lib/validation/schema.ts`: `FONTE_OPCOES = ["sans", "serif", "mono"]`
  e `FONTE_STACKS` (o `Record` com a pilha CSS de cada opção).
  `tema.fonteTitulo`/`fonteCorpo` agora são `z.enum(FONTE_OPCOES)` — uma
  string fora dessas três é rejeitada com mensagem clara.
- `lib/theme.ts`: usa `FONTE_STACKS[tema.fonteTitulo]` para escrever a
  variável CSS `--font-heading`/`--font-body` — o cliente escolhe o
  token (`"sans"`), a aplicação decide a pilha real de fontes.
- `templates/client.config.template.ts`, `content/client.config.ts`,
  `content/client.example.ts`: atualizados para usar os novos valores
  (`"sans"` em vez da string livre `"system-ui, sans-serif"`).

**Arquivos alterados:**
- `lib/validation/schema.ts` (`FONTE_OPCOES`, `FONTE_STACKS`, `fonteField`)
- `lib/theme.ts` (usa `FONTE_STACKS`)
- `templates/client.config.template.ts`, `content/client.config.ts`,
  `content/client.example.ts`
- `docs/ARQUITETURA.md`, `docs/ONBOARDING-CLIENTE.md`

**Como foi validado:**
- `npm run typecheck` confirma que o tipo `FonteOpcao` é respeitado em
  todo o projeto.
- `npm run build` gera o CSS com `--font-heading`/`--font-body`
  resolvidos para a pilha de sistema correta (inspecionado no HTML/CSS
  de produção).
- Testado no schema: um valor como `"'Poppins', sans-serif"` em
  `fonteTitulo` é rejeitado por `npm run validate` com a mensagem "use
  uma das opções suportadas: sans, serif, mono."

**Limitação restante:** nenhuma fonte de marca customizada pode ser
usada nesta v1 — é uma limitação deliberada, documentada, não um bug.
Se o produto precisar disso no futuro, é uma decisão de escopo separada
(provavelmente `next/font/google` com uma lista fixa de fontes
aprovadas, não string livre).

---

## I6 — Imagem Open Graph em SVG

**Causa:** a imagem OG de demonstração (`public/images/shared/og-default.svg`)
era SVG; a maioria dos apps de compartilhamento (WhatsApp, Facebook,
LinkedIn, Twitter/X) não renderiza SVG como preview de Open Graph.

**Correção aplicada:**
- Gerada uma nova imagem `public/images/shared/og-default.png`
  (1200×630, PNG raster), com o mesmo conteúdo de aviso ("Bio que Vende
  — Imagem de demonstração — substitua pela do cliente" + selo
  "CONTEÚDO DEMONSTRATIVO").
- `public/images/shared/og-default.svg` **removido** — nenhuma
  referência obsoleta restante (confirmado por busca em todo o
  repositório).
- `content/client.config.ts` e `content/client.example.ts` atualizados
  para apontar `seo.ogImageUrl` para o novo arquivo `.png`.
- `lib/validation/schema.ts`: `seo.ogImageUrl` agora usa
  `imagePathField(..., { disallowSvg: true })` — SVG é **rejeitado pelo
  schema** especificamente neste campo, prevenindo a regressão para
  qualquer cliente futuro (não só a demonstração).

**Arquivos alterados:**
- `public/images/shared/og-default.png` (novo)
- `public/images/shared/og-default.svg` (removido)
- `content/client.config.ts`, `content/client.example.ts`
- `lib/validation/schema.ts` (`disallowSvg` em `seo.ogImageUrl`)

**Como foi validado:**
- `npm run build && npm run start`, inspecionei a tag `<meta
  property="og:image">` gerada: aponta para
  `/images/shared/og-default.png`, resolvida como URL absoluta via
  `metadataBase` (`seo.urlCanonica`).
- Teste negativo: tentar configurar `ogImageUrl` para um `.svg`
  qualquer é rejeitado por `npm run validate` com a mensagem "SVG não é
  aceito aqui — a maioria dos apps de compartilhamento... não renderiza
  SVG."
- Confirmado que não existe mais nenhuma referência a
  `og-default.svg` em código ou documentação (`grep` no repositório).
- A imagem de avatar da demonstração (`avatar-demo.svg`) permanece SVG —
  fora do escopo deste item (que trata especificamente da imagem Open
  Graph) e continua funcionando normalmente (`next.config.ts` mantém
  `dangerouslyAllowSVG` para esse caso, que não é afetado pela nova
  restrição em `ogImageUrl`).

**Limitação restante:** nenhuma. A regra agora é estrutural (schema),
não depende de lembrança humana ao configurar um cliente novo.

---

## Resumo de arquivos alterados nesta etapa

**Novos:**
- `app/icon.png`, `app/favicon.ico`
- `lib/links.ts`
- `scripts/check-content-independence.ts`
- `public/images/shared/og-default.png`
- `docs/CORRECOES-FUNDACAO.md` (este arquivo)

**Removidos:**
- `public/images/shared/og-default.svg`

**Modificados:**
- `lib/validation/schema.ts`, `lib/theme.ts`, `lib/tracking/trackClick.ts`
- `tailwind.config.ts`, `app/globals.css`
- `components/ui/Button.tsx`, `components/sections/CtasSecundarios.tsx`,
  `components/sections/OfertaPrincipal.tsx`,
  `components/sections/RedesSociais.tsx`
- `content/client.config.ts`, `content/client.example.ts`,
  `templates/client.config.template.ts`
- `scripts/validate-content.ts`, `package.json`
- `README.md`, `CLAUDE.md`, `docs/ARQUITETURA.md`,
  `docs/ONBOARDING-CLIENTE.md`, `docs/IMPLEMENTACAO-BASE.md`,
  `docs/REVISAO-FUNDACAO.md`

## O que não foi tocado (fora do escopo autorizado)

- Nenhuma melhoria M1–M10 (raio único por escala, landmarks em excesso,
  ano do rodapé, área de toque, badge sobre `bg-surface`, contraste de
  tema, tokens Tailwind não usados, `target="_blank"` remanescente em
  âncoras que já não usam mais essa lógica, ausência de testes
  automatizados) foi implementada.
- Nenhuma mudança de arquitetura, multi-tenant, banco de dados,
  autenticação, painel administrativo ou analytics externo.
- Nenhum avanço para o refinamento visual da página demonstrativa.
