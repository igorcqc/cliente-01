# Pendências

> Lista viva de itens em aberto antes de publicar este cliente.
> Marque explicitamente o que ainda é placeholder/demonstração.

⚠️ **`cliente-01` é um cliente fictício de demonstração** (a pedido do
responsável pelo projeto, para validar o fluxo de onboarding descrito em
`docs/ONBOARDING-CLIENTE.md`), não um cliente real a ser publicado.
`demonstracao.ehDemonstracao` permanece `true` em
`content/client.config.ts` e **não deve** virar `false` até que um
cliente real substitua este conteúdo.

## Conteúdo

- [x] `identidade` preenchida (dados fictícios — "Rafael Andrade")
- [x] `posicionamento` preenchido (dados fictícios)
- [x] `oferta` e CTA principal preenchidos (fictícios, sem confirmação de
      cliente real)
- [x] CTAs secundários preenchidos (fictícios)
- [x] Provas sociais preenchidas e marcadas `ehFicticio: true`
- [x] Redes sociais preenchidas (fictícias, domínio example.com)

## Visual

- [x] Avatar de demonstração reaproveitado (`avatar-demo.svg`) — não é
      foto real de ninguém; segue com a cor roxa original do asset, que
      não acompanha o tema (limitação do SVG estático, não do tema)
- [x] Imagem de Open Graph reaproveitada (`og-default.png` compartilhada)
- [x] Direção visual **"Comercial de Alta Conversão"** aprovada e
      implementada (auditoria + 4 direções propostas na conversa; ver
      histórico) — navy (`#0F172A`) para texto/autoridade, verde
      (`#16A34A`) como cor de ação isolada (CTA, selo de verificação,
      acentos), `raio: lg`. Componentes tocados nesta iteração:
      `Avatar` (selo de verificado), `Hero` (chips de credenciais
      cedo), `OfertaPrincipal` (sombra colorida, sem repetir
      credenciais), `ProvasSociais` (grid de cartões), `Button`/
      `LinkRow`/`CtasSecundarios` (CTA com hover elevado, chips com
      ícone). Screenshots mobile (390px) e desktop conferidos.
- [x] Avatar de demonstração roxo destoa da paleta navy/verde — quando
      um cliente real assumir o repositório, a foto real substitui isso
      automaticamente (não é um problema a corrigir agora).

## Técnico

- [x] `npm run validate` passando
- [x] `npm run build` passando
- [ ] Revisão em largura mobile
- [x] `demonstracao.ehDemonstracao` = `true` (intencional — cliente
      fictício, nunca deve ir para `false` sem um cliente real)

## Publicação

- [ ] Projeto criado na Vercel — N/A enquanto for cliente fictício
- [ ] Domínio configurado — N/A enquanto for cliente fictício

## Quando um cliente real assumir este repositório

1. Substituir cada campo fictício em `content/client.config.ts` por
   dados reais (ver `docs/ONBOARDING-CLIENTE.md`, passo 4).
2. Reescrever `client/*.md` com o briefing real.
3. Trocar avatar e imagem de Open Graph por assets reais do cliente.
4. Mudar `demonstracao.ehDemonstracao` para `false`.
