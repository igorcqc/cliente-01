# Checklist de QA — antes de publicar

## Conteúdo

- [ ] `npm run validate` passa sem erros
- [ ] Nenhum `[COLCHETE]` de placeholder restante em `client.config.ts`
- [ ] `demonstracao.ehDemonstracao` = `false`
- [ ] Nenhum depoimento, resultado ou número inventado
- [ ] Todos os links testados manualmente (principal, secundários, redes)
- [ ] Textos revisados (ortografia, tom de voz)

## Visual

- [ ] Testado em largura mobile (~375–390px)
- [ ] CTA principal claramente dominante em relação aos secundários
- [ ] Cores/tema aprovados pelo cliente
- [ ] Avatar e imagem de Open Graph carregando corretamente
- [ ] Nenhuma imagem sem `alt`

## Técnico

- [ ] `npm run build` passa sem erros
- [ ] `npm run typecheck` sem erros
- [ ] `npm run lint` sem erros/avisos
- [ ] Testado localmente com `npm run start` (build de produção)
- [ ] Sem segredos/chaves commitados no repositório
- [ ] Sem `console.log` de depuração esquecido em código novo

## SEO

- [ ] Título e descrição preenchidos e coerentes
- [ ] `urlCanonica` aponta para o domínio final
- [ ] Imagem de Open Graph testada em um preview de compartilhamento
