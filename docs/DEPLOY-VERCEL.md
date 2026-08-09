# Deploy na Vercel

## Pré-requisitos

- Repositório do cliente já criado a partir do template (ver
  `docs/ONBOARDING-CLIENTE.md`).
- `npm run build` passando localmente sem erros.
- Conteúdo revisado (`documents/checklist-qa.md`).

## Conectar o repositório

1. Acesse [vercel.com](https://vercel.com) e faça login com a conta que
   terá acesso ao projeto.
2. **Add New… → Project**.
3. Selecione o repositório do cliente (ex:
   `bio-que-vende-nome-do-cliente`) na lista do GitHub. Se o repositório
   não aparecer, autorize a Vercel a acessar a organização/conta no
   GitHub primeiro.
4. A Vercel detecta automaticamente que é um projeto Next.js — não é
   necessário configurar build command nem output directory
   manualmente (`next build` / `.next` são o padrão).
5. **Variáveis de ambiente:** nesta v1 nenhuma é obrigatória (sem banco,
   sem autenticação, sem integração externa). Deixe em branco.
6. Clique em **Deploy**.

Ao final, a Vercel entrega uma URL própria no formato
`nome-do-projeto.vercel.app`.

## Deploys subsequentes

Cada `git push` para o branch de produção (por padrão `main`) do
repositório do cliente dispara um novo deploy automaticamente. Pull
requests geram *preview deployments* com URL própria, úteis para revisão
antes de publicar.

## Configurar domínio próprio (depois)

1. No projeto na Vercel, vá em **Settings → Domains**.
2. Adicione o domínio do cliente (ex: `bio.nomedocliente.com.br` ou o
   domínio raiz).
3. A Vercel mostra os registros DNS necessários (geralmente um `CNAME`
   apontando para `cname.vercel-dns.com`, ou registros `A`/`ALIAS` para
   domínio raiz).
4. Configure esses registros no provedor de DNS do cliente (Registro.br,
   Cloudflare, GoDaddy, etc.).
5. Aguarde a propagação e a emissão automática do certificado SSL pela
   Vercel (geralmente minutos, pode levar até 24–48h em casos raros de
   propagação DNS lenta).
6. Depois de confirmado, atualize `seo.urlCanonica` em
   `content/client.config.ts` para o domínio final e faça um novo deploy
   — isso mantém a URL canônica e as tags de Open Graph consistentes com
   o domínio real.

## Isolamento entre clientes

Cada cliente tem seu próprio projeto Vercel, vinculado ao seu próprio
repositório — não há compartilhamento de configuração, variáveis de
ambiente ou domínio entre clientes diferentes.
