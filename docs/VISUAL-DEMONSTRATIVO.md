# Visual demonstrativo — refinamento

Data: 2026-08-09
Escopo: refinamento visual da página demonstrativa (expert fictícia
"Marina Dantas"). Nenhuma mudança de arquitetura, conteúdo do schema,
multi-tenant ou analytics externo.

## 1. Avaliação da interface antes do refinamento

### O que preservar
- CTA principal já usava tamanho (`lg`) e peso (`font-semibold`)
  maiores que os secundários — a base da hierarquia já estava correta,
  só precisava de mais contraste de composição ao redor.
- Container mobile-first (`max-w-md` centralizado) — adequado ao
  produto, mantido.
- Sistema de tema via variáveis CSS (sem classes Tailwind dinâmicas) —
  preservado integralmente, nenhum novo token foi necessário.

### Problemas de hierarquia
- Avatar, nome, marca, headline e subtítulo tinham pesos tipográficos
  parecidos — nada "gritava" como o elemento mais importante da
  primeira tela.
- As credenciais apareciam logo após o Hero, competindo por atenção
  antes mesmo do visitante entender a oferta — sinal de autoridade
  "gasto" cedo demais na jornada.

### Problemas de composição
- Toda seção usava o mesmo tratamento (`rounded-theme border
  border-border bg-surface p-4/5`) — Posicionamento, Oferta e Provas
  Sociais eram visualmente idênticas: um empilhado de cartões
  cinza-claro com borda, sem nenhum elemento se destacando como o
  centro da página. Isso é, estruturalmente, a "aparência de Linktree"
  citada no briefing.
- Os CTAs secundários eram botões de pílula com borda cheia,
  quase do mesmo formato do CTA principal — só menores. Perto um do
  outro, liam-se como "mais uma fileira de botões", não como um caminho
  claramente subordinado.
- Redes sociais eram botões com texto ("Instagram", "WhatsApp") dentro
  de caixas com borda — de novo, o padrão pílula-com-borda repetido
  pela quarta vez na página.

### Problemas de clareza
- "Para quem" / "Transformação" eram renderizados como uma lista de
  definição (`<dl>`) dentro de um cartão — lia-se como uma ficha técnica
  ("specs"), não como texto persuasivo.
- O parágrafo de posicionamento (`identidade.posicionamento`) e os
  campos `publico`/`transformacao` ficavam soltos dentro do mesmo
  cartão sem nenhuma diferenciação tipográfica entre "texto corrido" e
  "resumo estruturado".

### Oportunidades de refinamento
- Dar à oferta um tratamento visual **exclusivo** (o único elemento
  "elevado" da página), para que o olho pare ali.
- Tratar as provas sociais como citações editoriais, não cartões.
- Substituir os botões de pílula dos caminhos secundários por uma lista
  de texto discreta.
- Substituir os ícones de rede social (texto em caixa) por ícones de
  linha minimalistas, sem caixa.
- Recolocar as credenciais como reforço de confiança logo acima do CTA
  principal, não como primeiro elemento da página.

### Limitações técnicas respeitadas
- Nenhuma cor/token do cliente virou classe Tailwind dinâmica — toda
  cor continua vindo de `bg-primary`, `text-text-secondary`,
  `rounded-theme` etc., mapeados para variáveis CSS.
- Nenhum novo token de tema foi necessário — o refinamento inteiro usa
  os tokens já existentes (`background`, `surface`, `primary`,
  `primary-foreground`, `text`, `text-secondary`, `border`, `radius`,
  fontes) mais utilitários **estáticos** do Tailwind (`text-2xl`,
  `shadow-sm`, `divide-y`, `rounded-full` em elementos puramente
  decorativos como o avatar/ícones sociais).
- `estiloBotao: "soft"` (corrigido no ciclo anterior, item C3) foi
  testado no build de produção com o novo visual — continua
  funcionando (ver seção 6).
- Nenhum texto específico da expert foi movido para dentro de um
  componente — todo o conteúdo textual de "Marina Dantas" continua
  exclusivamente em `content/client.config.ts`.

## 2. Principais decisões de hierarquia

1. **Headline como âncora visual.** Aumentada para o maior elemento
   tipográfico da primeira tela (`text-[1.65rem]`/`sm:text-[1.85rem]`,
   `font-bold`, `tracking-tight`, `leading-[1.2]`), com largura máxima
   (`max-w-[19rem]`) para manter linhas curtas e legíveis.
2. **Um único elemento "elevado".** Só `OfertaPrincipal` usa sombra
   (`shadow-sm`) e preenchimento — nenhuma outra seção tem cartão. Um
   traço curto na cor primária no topo do cartão marca visualmente "isto
   é o centro da página".
3. **Credenciais movidas para dentro da oferta**, como última linha de
   confiança antes do botão — não mais um bloco isolado no topo.
4. **CTA principal vs. secundários com tratamento estruturalmente
   diferente**, não só menor: o principal é um botão preenchido
   (`Button`); os secundários são uma lista de texto com seta
   (`LinkRow`, novo componente) — impossível confundir os dois.
5. **Redes sociais como camada final e discreta**: ícones sem caixa,
   sem texto visível, abaixo dos caminhos secundários.

## 3. Seções — criadas, removidas, reorganizadas

Nenhuma seção foi removida da página (todas as informações
continuam presentes), mas a **ordem e a composição** mudaram:

| Antes | Depois |
|---|---|
| Hero → **Credenciais** → Posicionamento → Oferta → CTAs secundários → Provas → Redes → Rodapé | Hero → Posicionamento → **Oferta (com credenciais embutidas)** → **Provas** → CTAs secundários → Redes → Rodapé |

- **Credenciais** deixou de ser uma seção de página independente e
  passou a ser renderizada *dentro* de `OfertaPrincipal`, logo acima do
  CTA — reflete a ordem estratégica pedida (autoridade como último
  reforço antes do clique, não como primeira coisa vista).
- **Provas sociais** subiu para logo depois da oferta (reforça a decisão
  imediatamente após ela ser apresentada), antes dos caminhos
  secundários — mantém o CTA principal e seu contexto de confiança
  próximos, sem caminhos secundários "diluindo" o foco entre os dois.
- Nenhuma seção nova de conteúdo foi criada; nenhuma foi removida.

## 4. Componentes alterados ou criados

**Criado:**
- `components/ui/LinkRow.tsx` — linha de link minimalista para
  caminhos secundários. Criado porque `Button` está estruturalmente
  ligado ao estilo de tema do cliente (`solid`/`outline`/`soft`, sempre
  com preenchimento ou borda) — correto para o CTA principal, mas pesado
  demais para uma lista de links secundários que precisa perder em peso
  visual de forma inequívoca. Reaproveita a mesma lógica de
  rastreamento (`trackClick`) e de abertura de link (`novaAbaProps`) que
  `Button` já usa — só a apresentação (texto + seta, sem caixa) é
  diferente.

**Alterados (visual, sem mudança de contrato de props além do listado):**
- `components/ui/Avatar.tsx` — anel decorativo sutil (`bg-primary/10`).
- `components/ui/Badge.tsx` — sem preenchimento de fundo (contorno +
  texto pequeno em caixa alta), evita se confundir com cartões que
  também usam `bg-surface`.
- `components/ui/SocialIcon.tsx` — ícones de linha SVG desenhados à mão
  (pictogramas genéricos, sem biblioteca externa), substituindo o texto
  do nome da plataforma.
- `components/sections/Hero.tsx` — hierarquia tipográfica reforçada;
  byline (nome/marca) compacta acima da headline.
- `components/sections/Posicionamento.tsx` — texto editorial corrido em
  vez de cartão com lista de definição; "para quem"/"transformação"
  como bloco com traço lateral na cor primária.
- `components/sections/Credenciais.tsx` — de lista de badges para linha
  de texto compacta; **prop/API preservada** (`credenciais?: string[]`),
  só a renderização interna mudou; agora invocado por
  `OfertaPrincipal`, não mais por `app/page.tsx` diretamente.
- `components/sections/OfertaPrincipal.tsx` — único cartão elevado da
  página; ganhou a prop opcional `credenciais` para renderizar
  `Credenciais` internamente.
- `components/sections/CtasSecundarios.tsx` — usa `LinkRow` em vez de
  `Button`; perdeu a prop `estiloBotao` (não é mais necessária, já que
  `LinkRow` não depende do estilo de botão do tema).
- `components/sections/ProvasSociais.tsx` — citações editoriais
  separadas por traço fino, com rótulo de tipo (`Depoimento`/
  `Resultado`/`Selo`/`Mídia`) em vez de cartões com fundo.
- `components/sections/RedesSociais.tsx` — ícones sem caixa, área de
  toque de 44×44px por item (antes ~38px).
- `components/sections/Footer.tsx` — divisor superior sutil (`border-t`).
- `app/page.tsx` — nova ordem de composição (ver seção 3); passa
  `credenciais` para `OfertaPrincipal` em vez de renderizar
  `<Credenciais />` isoladamente.
- `app/globals.css` — bloco `@media (prefers-reduced-motion: reduce)`.

**Identificadores de rastreamento, comportamento de link e
acessibilidade preservados em todos os componentes acima** — ver seção
6 (validações).

## 5. Tokens de tema utilizados ou adicionados

**Nenhum token novo foi adicionado.** O refinamento inteiro usa os
tokens já existentes de `tailwind.config.ts`/`lib/theme.ts`:
`bg-background`, `bg-surface`, `bg-primary` (incluindo `/10`, `/20`),
`text-text`, `text-text-secondary`, `text-primary`, `border-border`,
`border-primary`, `rounded-theme`, `font-heading`, `font-body`.

Utilitários **estáticos** do Tailwind (não ligados a tema/cliente,
portanto seguros) foram usados livremente para tipografia e ritmo:
escalas de `text-*`, `leading-*`, `tracking-*`, `shadow-sm`, `divide-y`,
`space-y-*`, e `rounded-full` (só em elementos puramente decorativos —
o avatar continua usando `rounded-theme`, respeitando o `raio` do
cliente).

## 6. Validações executadas e resultado

| Validação | Resultado |
|---|---|
| `npm run validate` | ✅ passa |
| `npm run typecheck` | ✅ sem erros |
| `npm run lint` | ✅ sem warnings |
| `npm run build` | ✅ build de produção limpo |
| `npm run start` + inspeção de console/rede (Playwright) | ✅ nenhum erro |
| Overflow horizontal em 320/375/390/768/1024/1440px | ✅ nenhum (`scrollWidth === clientWidth` em todas) |
| Tema padrão (`solid`) em produção | ✅ screenshot revisado em todas as larguras |
| Tema `soft` em produção | ✅ testado temporariamente (`estiloBotao: "soft"`), CTA principal com fundo lilás claro visível + hover mais escuro confirmados; config restaurado via `git checkout` logo em seguida (diff conferido, idêntico ao original) |
| Foco visível | ✅ CTA principal é o primeiro elemento focável via Tab; anel de foco visível confirmado em screenshot |
| Navegação por teclado | ✅ CTA principal alcançável via Tab |
| Favicon | ✅ `GET /favicon.ico` → 200 |
| Metadados Open Graph | ✅ title/description/canonical/og:image (PNG, URL absoluta) intactos |
| Links (href, target, rel, data-cta-*) | ✅ conferidos via DOM: CTA principal e secundários mantêm `data-cta-id`/`data-cta-kind`, `target="_blank"`/`rel="noopener noreferrer"` corretos |
| Hierarquia de headings | ✅ um único `h1` (headline), seguido de `h2` em Oferta/Provas/Outros caminhos — sem saltos de nível |
| Conteúdo fictício claramente identificado | ✅ aviso de demonstração no rodapé preservado; selo "Exemplo demonstrativo" preservado em cada prova social |
| Varredura de segredos | ✅ nenhuma ocorrência real |

## 7. Tamanhos de tela revisados

320px, 375px, 390px, 768px, 1024px, 1440px — screenshots de página
inteira gerados via Playwright/Chromium para cada largura, revisados
visualmente. Nenhum overflow horizontal em nenhuma; hierarquia e
legibilidade preservadas do menor ao maior.

## 8. Problemas encontrados e corrigidos durante a implementação

- **Separador "·" órfão em 320px:** a linha de credenciais
  (`components/sections/Credenciais.tsx`) usava `flex`+`gap`, e em
  telas estreitas o marcador "·" podia quebrar para uma linha sozinho,
  separado do texto ao redor. Corrigido trocando para um parágrafo
  único com o separador colado ao texto vizinho por espaços
  inquebráveis — confirmado corrigido em novo screenshot de 320px.

Nenhum outro problema de layout, contraste ou hierarquia foi encontrado
nas revisões visuais realizadas.

## 9. Limitações conhecidas

- Os ícones de rede social são pictogramas genéricos desenhados à mão
  (não logotipos oficiais das marcas) — suficientes para reconhecimento
  visual sem depender de biblioteca externa nem risco de uso indevido
  de marca registrada.
- O refinamento foi validado nos breakpoints listados na seção 7;
  breakpoints intermediários não testados individualmente (o container
  responsivo já garante comportamento previsível entre eles).
- Assim como no restante da fundação, a validação de imagem confirma
  formato, não a existência real do arquivo (limitação já documentada
  em `docs/CORRECOES-FUNDACAO.md`, item I4) — inalterada por este
  refinamento.
- Este refinamento é sobre **apresentação**; não foram adicionados
  novos campos ao schema, nem alterado nenhum dado de
  `content/client.config.ts`.

## 10. Como substituir o conteúdo demonstrativo por um cliente real

Nenhuma mudança em relação ao processo já documentado — o visual
refinado é inteiramente orientado por dados, então nenhum passo novo é
necessário:

1. Siga `docs/ONBOARDING-CLIENTE.md` normalmente: copie
   `templates/client.config.template.ts` para
   `content/client.config.ts` e preencha com os dados reais do cliente.
2. A nova composição visual (ordem das seções, tratamento do CTA
   principal, credenciais dentro da oferta, etc.) se aplica
   automaticamente — nenhum componente precisa ser tocado para um
   cliente comum.
3. Se o cliente não tiver `credenciais`, a linha de confiança dentro da
   oferta simplesmente não aparece (`array` vazio ou ausente é válido,
   como já era).
4. Se o cliente não tiver `provasSociais` ou `ctasSecundarios`, essas
   seções inteiras não renderizam (comportamento preservado).
5. O tema (`tema.*` no config) continua controlando cores, raio,
   estilo de botão e tipografia normalmente — nenhum token novo precisa
   ser preenchido, e os três estilos de botão (`solid`/`outline`/`soft`)
   continuam funcionando em produção.
