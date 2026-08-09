# Prompt — Implementação do config de um cliente

Use este prompt para transformar o material já levantado em
`client/*.md` em um `content/client.config.ts` válido.

---

Com base nos arquivos `client/briefing.md`, `client/oferta.md`,
`client/publico.md`, `client/links.md` e `client/depoimentos.md` deste
repositório (Bio que Vende), preencha `content/client.config.ts`
seguindo exatamente o schema de `lib/validation/schema.ts`
(`clientConfigSchema`).

Regras obrigatórias:

1. Use `templates/client.config.template.ts` como esqueleto — não invente
   estrutura nova.
2. Preencha apenas com dados presentes nos arquivos `client/*.md`.
   Nunca invente depoimento, resultado, número, link ou credencial que
   não esteja documentado ali.
3. Se algum campo obrigatório não tiver dado real disponível, não
   preencha com um placeholder plausível — sinalize a lacuna e liste em
   `client/pendencias.md`.
4. Ao final, rode (ou peça para rodar) `npm run validate` e corrija
   qualquer erro apontado.
5. Deixe `demonstracao.ehDemonstracao` como `true` até que todo o
   conteúdo seja confirmado como real; só então mude para `false`.

Ao terminar, resuma quais campos foram preenchidos com dado real e quais
ficaram pendentes.
