# Prompt — Refinamento pós-lançamento

Use este prompt quando já houver dados de uso reais (cliques, feedback
do cliente, taxa de conversão) e for hora de ajustar a página publicada.

---

A página do Bio que Vende deste cliente já está publicada. Com base no
feedback/dados abaixo (descreva o que foi observado: baixo clique no
CTA principal, confusão sobre a oferta, feedback qualitativo do
cliente, etc.), sugira ajustes específicos em `content/client.config.ts`:

1. Aponte exatamente qual campo mudar (`posicionamento.headline`,
   `oferta.descricao`, `tema.corPrimaria`, etc.) e por quê, ligando cada
   sugestão ao problema observado.
2. Não sugira mudanças em `app/`, `components/` ou `lib/` a menos que o
   problema seja estrutural (ex: falta um tipo de seção que o schema
   ainda não suporta) — nesse caso, sinalize que é uma mudança de motor,
   não de conteúdo, e trate com cautela adicional.
3. Para cada mudança sugerida, indique se ela precisa de validação com o
   cliente antes de publicar (ex: mudança de oferta, preço, prova
   social) ou é puramente de forma (ex: reduzir tamanho de texto).
4. Depois de aplicar as mudanças, rode `npm run validate` e
   `npm run build` antes de publicar.

Não invente nenhum novo depoimento, número ou credencial durante o
refinamento — a mesma regra da implementação inicial se aplica.
