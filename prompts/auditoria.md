# Prompt — Auditoria de conteúdo/página de um cliente

Use este prompt (com um assistente de IA, revisando
`content/client.config.ts` e a página renderizada) para auditar um
cliente antes de publicar ou ao investigar baixa conversão.

---

Audite o conteúdo em `content/client.config.ts` deste repositório
(Bio que Vende) e a página resultante. Verifique:

1. Existe um único CTA principal claramente dominante? Os CTAs
   secundários têm menor destaque visual?
2. A headline comunica a transformação prometida em poucos segundos de
   leitura?
3. O público-alvo (`posicionamento.publico`) está específico o
   suficiente, ou é genérico a ponto de não filtrar ninguém?
4. As provas sociais (`provasSociais`) sustentam a oferta principal, ou
   estão desconectadas dela?
5. Algum campo parece placeholder, texto de demonstração ou dado
   inventado esquecido (`[COLCHETES]`, "exemplo", "lorem ipsum",
   `ehFicticio: true`)?
6. Os links (`oferta.ctaPrincipal.url`, `ctasSecundarios`,
   `redesSociais`) parecem coerentes com o negócio descrito?
7. `demonstracao.ehDemonstracao` está corretamente definido (`false`
   para cliente real)?

Liste os problemas encontrados, ordenados por impacto na conversão,
sem sugerir textos fictícios como correção — aponte a lacuna e peça o
dado real.
