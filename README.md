# Casa de Carnes Luiz Alvense

Primeira base visual do storefront, desenvolvida em Next.js 15 + React 19 + TypeScript.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Build

```bash
npm run build
```

## Escopo desta entrega

- Home premium responsiva.
- Navegação por categorias.
- Vitrine com busca e filtros.
- Favoritos e sacola demonstrativos no navegador.
- Seção institucional e contato via WhatsApp (link ainda precisa do número oficial).

## Importante

Esta é uma primeira versão visual (frontend demonstrativo). Os produtos, preços e imagens são dados provisórios. Ainda não há banco de dados, autenticação, checkout real, pagamentos, agenda de retirada ou painel operacional. Não aceitar pedidos ou pagamentos reais até integrar e validar esses serviços.

Consulte `docs/BRIEF-MVP.md` para os requisitos completos.

Para continuar com outro agente, comece por [AGENTS.md](AGENTS.md). Ele aponta para o
[plano](docs/PLANO.md), o [status](docs/STATUS.md) e o [catálogo de skills](docs/SKILLS.md).
Confira o pacote com `node tools/verify-skills.mjs`.
