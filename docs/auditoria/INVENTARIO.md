# Inventário do site e do aplicativo

A Casa de Carnes tem três frentes verificadas no navegador local. A vitrine Gourmet é a base mais desenvolvida para apresentar a marca. O aplicativo operacional contém a loja com pedidos e o painel da equipe.

| Frente | Branch e versão | Acesso verificado | Finalidade |
| --- | --- | --- | --- |
| Vitrine inicial | [main, 1fb5cdc](https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/blob/1fb5cdc7a0d93c0d63026e46c4fa4e08bd9702bf/app/page.tsx) | Local `http://127.0.0.1:3101/` | Página comercial e catálogo demonstrativo. Busca, favoritos e contador de sacola em memória. |
| Prévia Gourmet | [preview/homepage-gourmet, 196a432](https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/blob/196a4323297db5ff1d2459afe176785ab39559b9/app/page.tsx) | Local `http://127.0.0.1:3102/` | Apresentação editorial, catálogo demonstrativo, sacola e consulta via WhatsApp. |
| App operacional | [replit/acougue-operacao, a35d9f6](https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/blob/a35d9f656cd8c8a9cc3e73597bbce4de92faa277/artifacts/acougue-ops/src/App.tsx#L427) | Local `http://127.0.0.1:3103/` e `/loja` | Loja com API compartilhada e painel web para pedidos, pesagem e gestão. |

O [PR #5](https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/pull/5) indica uma prévia Gourmet na Vercel. Ao verificar seu link, recebi redirecionamento para login. Nenhuma URL online utilizável do painel operacional foi confirmada. A entrada do painel no código é `/` da aplicação Replit. O site Gourmet tem navegação própria e não liga ao painel. O mapa 3D está em outra frente, no [PR #6](https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/pull/6). O modelo presente na prévia Gourmet testada é SVG 2D.

## O que cada pessoa encontra

| Pessoa | Rota ou superfície | Fluxos |
| --- | --- | --- |
| Cliente da vitrine | Vitrine inicial `/` | Hero, categorias, catálogo, qualidade e contato. |
| Cliente da prévia Gourmet | Gourmet `/` | Início, catálogo de seis cortes de demonstração, busca e categorias, peso, mapa do boi em quatro regiões, Dry Aged, kits e contato. A sacola gera uma consulta para a equipe. |
| Cliente da loja operacional | `/loja` | Catálogo da API, busca, categorias, peso/quantidade, sacola e encaminhamento do pedido. Pode selecionar retirada ou entrega e informar telefone, horário e observações. |
| Atendente, preparo e retirada | Operação `/` | Pedidos por etapa, busca, filtros, detalhes, novo pedido no balcão, visão de preparo, pesagem final e conclusão. Balcão e Preparação são modos da tela de pedidos. |
| Gestão | `/catalog`, `/customers`, `/reports`, `/settings` | Catálogo, clientes, relatórios e regras de atendimento. As quatro rotas renderizaram no teste local. |

## Identidade e regras que sustentam a evolução

- A vitrine inicial usa creme, vinho e dourado com títulos serifados. Gourmet usa carvão, cobre e creme, com história de origem, mapa e fichas de corte. A loja operacional usa um fundo escuro e detalhes em latão, enquanto o painel usa verde profundo e creme para hierarquia funcional. A preferência visual desta análise é preservar a composição Gourmet e aproximar os pontos de contato da marca sem importar a densidade da vitrine para o painel.
- Os nomes e símbolos divergem. Gourmet exibe “LUIZ ALVENSE”, a loja operacional “LUISALVENSE” e o painel “Açougue Operação”. Confirmar a grafia, os ativos, as fotos e contatos oficiais antes de publicar.
- O [contrato de preço](https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/blob/a35d9f656cd8c8a9cc3e73597bbce4de92faa277/.agents/memory/catalog-price-basis.md) usa o campo histórico `pricePerKg` como preço por kg para produtos por peso e por unidade para os unitários. A quantidade pode ser digitada em gramas. O total final varia com a pesagem. Escolher Pix, cartão ou dinheiro registra a preferência de pagamento.
- Na base descartável, a loja exibiu 96 itens do catálogo de seed. Esse número e os preços usados no ensaio descrevem a cópia local.

Para resultados, limitações e ações propostas, veja [ACHADOS.md](ACHADOS.md) e [EVOLUCAO.md](EVOLUCAO.md).
