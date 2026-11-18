# Casa de Carnes Luiz Alvense — consolidação das versões
Data: 18/11/2026. Estado: análise de código, ainda sem validação funcional no navegador.

## Fontes conferidas
- `main`: vitrine demonstrativa Next.js; `app/page.tsx`, `app/globals.css`, `docs/BRIEF-MVP.md`.
- `codex/site-sacola-revisao-20261118`: sacola revisável demonstrativa, pendente de merge.
- `preview/homepage-gourmet`: composição premium com `Hero`, `CutsShowcase`, `InteractiveBeefMap`, `DryAgedTimeline`, `KitsChurrasco`, `CartDrawer`; dados ainda estáticos em `app/components/data.ts`.
- `import/replit-casa-de-carnes/replit-app`: código completo importado do Replit (337 arquivos), incluindo `artifacts/acougue-ops`, `artifacts/api-server`, `lib/db` e `lib/api-spec`.

## Decisões de produto e composição
| Jornada | Base escolhida | O que preservar | Dependência antes de ativar |
| --- | --- | --- | --- |
| Identidade visual e primeira impressão | Gourmet | hero, tipografia, fotografia, componentes e animações acessíveis | conferência de imagens, textos e dados reais |
| Navegação e busca | Replit + simplicidade da main | categorias reais, busca, filtros e estados de erro/vazio | API do catálogo e responsividade |
| Produtos e detalhes | Replit | informações editoriais, preço por unidade de venda, disponibilidade, promoções por vigência | catálogo real, regras de peso e imagens |
| Carrinho | Replit + acabamento visual Gourmet | pesos/gramas/unidades, total estimado, edição de itens | validação de cálculo e de contrato da API |
| Pedido e agendamento | Replit | formulário, retirada/entrega, métodos permitidos, criação de pedido | autenticação, segurança, horários/capacidade e testes de ponta a ponta |
| Painel da equipe | Replit | catálogo, pedidos, preparação, pesagem, clientes, relatórios, permissões | manter isolado e auditar acessos |
| Mapa bovino e conteúdo educativo | Gourmet | experiência exploratória | revisão anatômica; sem confundir com disponibilidade de compra |
| Kits e harmonização | Gourmet + catálogo Replit | apresentação e recomendação de combos | somente anunciar itens existentes/ativos no catálogo |
| Contato | Dados reais da loja | WhatsApp, telefone, endereço e horários | confirmar dados antes de exibir ou receber pedidos |

## Regras obrigatórias
1. Catálogo e painel compartilham **uma única fonte de dados**, sem duplicar preços no frontend.
2. Não copiar diretamente os produtos fictícios da Gourmet ou da main para a vitrine comercial.
3. Preservar a compatibilidade de `pricePerKg`: produtos kg/g usam preço/kg; produtos por unidade, preço/unidade. Converter gramas antes de calcular o valor.
4. Nunca considerar Pix/cartão como pagos sem retorno confirmado do provedor.
5. Não abrir endpoints administrativos sem verificar autenticação e autorização no servidor.
6. Não alterar `main`, o deploy Vercel ou o painel Replit enquanto não houver teste do fluxo cliente → pedido → operação.
7. Preservar originais no histórico Git; `lixeira/` é uma área de quarentena reversível, não autorização para apagar.

## Etapas para conclusão
- [x] Importação integral da fonte do Replit na branch isolada.
- [x] Inventário inicial das três vitrines e regras principais.
- [x] Criar a área `lixeira/` e preservar referência da vitrine demonstrativa.
- [ ] Adaptar componentes premium para dados dinâmicos e design system compartilhado.
- [ ] Integrar catálogo público seguro e estados de loading/erro.
- [ ] Unificar seleção por peso, personalização, carrinho e checkout no contrato existente.
- [ ] Confirmar dados comerciais reais, permissões, URLs e ambientes.
- [ ] Executar lint, typecheck, build e testes responsivos/integração.
- [ ] Aprovação visual e funcional; publicar; somente então revisar a exclusão da lixeira.

**Atenção:** a presença de código de checkout e API no Replit não comprova que o backend esteja pronto para conexão pública com a Vercel.
