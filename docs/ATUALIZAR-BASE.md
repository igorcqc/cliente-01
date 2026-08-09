# Atualizar um cliente a partir da base

Como o modelo é **um repositório independente por cliente**, melhorias
feitas em `bio-que-vende-base` (correção de bug, novo componente,
ajuste de acessibilidade) **não se propagam automaticamente** para
clientes já criados. Este documento descreve o processo manual para
quando você quiser trazer uma atualização da base para um cliente
específico.

## Quando fazer isso

- Correção de bug no motor (ex: algo em `components/` ou `lib/`).
- Melhoria de acessibilidade, performance ou SEO que deveria valer para
  todos os clientes.
- Nunca para levar *conteúdo* — conteúdo é sempre específico do cliente
  e nunca deve vir da base.

## Passo a passo (via git remote)

No repositório do **cliente** (não na base):

```bash
# 1. Adicione a base como remote (uma vez só, por repositório de cliente)
git remote add base git@github.com:<sua-conta>/bio-que-vende-base.git

# 2. Busque as atualizações da base
git fetch base

# 3. Mescle o histórico da base (permite históricos não relacionados,
#    já que o repositório do cliente nasceu sem herdar o histórico da base)
git merge base/main --allow-unrelated-histories
```

Isso provavelmente vai gerar conflitos em `content/client.config.ts` (já
que o cliente tem conteúdo próprio e a base tem o conteúdo de
demonstração). Resolva sempre **mantendo a versão do cliente** nesse
arquivo — os conflitos que importam resolver a favor da base são os de
`app/`, `components/`, `lib/`, `config/`.

```bash
# Ao resolver, para content/client.config.ts:
git checkout --ours content/client.config.ts
git add content/client.config.ts

# Revise manualmente os demais arquivos em conflito
git status
```

## Alternativa (mudança pontual e pequena)

Para uma correção pequena e isolada, muitas vezes é mais simples copiar
manualmente o(s) arquivo(s) específico(s) da base para o repositório do
cliente (ex: um único componente corrigido) em vez de fazer merge
completo. Use o bom senso pelo tamanho da mudança.

## Depois de atualizar

1. Rode `npm install` (a base pode ter atualizado dependências).
2. Rode `npm run validate && npm run build` para confirmar que nada
   quebrou.
3. Revise visualmente (`npm run dev`, mobile).
4. Commit e push no repositório do cliente.

## Limitação conhecida

Não existe automação para isso nesta v1 (sem CI de propagação, sem
ferramenta de sincronização) — é um processo manual, por decisão de
escopo. Caso o número de clientes cresça a ponto de tornar isso custoso,
essa é uma das razões que justificaria reavaliar o modelo (ver "Compatibilidade
futura" em `docs/ARQUITETURA.md`), mas isso é uma decisão consciente para
depois, não desta v1.
