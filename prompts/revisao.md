# Prompt — Revisão pré-publicação

Use este prompt como última revisão antes do deploy final, junto com
`documents/checklist-qa.md`.

---

Revise este repositório do Bio que Vende antes da publicação:

1. Rode (ou peça para rodar) `npm run validate`, `npm run typecheck` e
   `npm run build`. Reporte qualquer falha com a mensagem completa.
2. Percorra `documents/checklist-qa.md` item a item e marque o que já
   está atendido; liste o que falta.
3. Releia `content/client.config.ts` procurando por: texto de
   demonstração esquecido, `[COLCHETES]`, URLs para `example.com`, ou
   `ehFicticio: true` em provas que deveriam ser reais.
4. Confirme que não há segredos, chaves ou tokens em nenhum arquivo do
   repositório (`.env`, código, `client/`).
5. Confirme que `demonstracao.ehDemonstracao` está `false` para um
   cliente real.

Liste os bloqueadores (o que impede publicar) separado dos itens
"desejável, mas não bloqueante".
