# Estado da consolidação — 18/11/2026

## Revisão visual concluída na branch de consolidação

A implementação está em `589301a` e as 19 capturas verificadas estão em `959f282`, na branch `consolidacao/site-final-20261118`, PR #11. A [comparação por seção](auditoria/REVISAO-VISUAL-VITRINE.md) reúne os registros de desktop e celular. Lint e TypeScript passaram e o site compilou. O lint local registrou dois avisos. O [teste de navegador](https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/actions/runs/44248197058) e a [validação da vitrine](https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/actions/runs/44248203943) passaram.

A próxima etapa depende da confirmação dos contatos e horários da loja e da URL pública do catálogo Replit. A seção da loja usa a marca, a foto do balcão e a cidade. O catálogo foi exercitado com amostras controladas. A prévia da Vercel redireciona para autenticação. Checkout, pedidos e aprovação para produção seguem pendentes.

### Histórico anterior à revisão

## Entregue nesta branch
- Fonte operacional Replit importada e preservada integralmente em `replit-app/`.
- Vitrine demonstrativa original `main` copiada sem alteração binária para `lixeira/vitrine-main-demonstrativa/`.
- Site Gourmet escolhido como **base visual em trabalho**: `app/` contém os componentes premium e dependências correspondentes.
- Critérios de fusão e lista de itens candidatos à remoção documentados.

## Não concluído / bloqueadores
- A versão Gourmet contém produtos, imagens, quantidades e contato definidos diretamente no frontend; **não é catálogo real**.
- Carrinho Gourmet atualmente encaminha uma consulta por WhatsApp e não cria pedidos no banco.
- A versão Replit tem fluxo de catálogo/pedido e autenticação, mas precisa confirmar URL e controles de acesso antes de expor a Vercel.
- Não existe nesta branch um contrato integrado e validado entre Next.js e o backend Replit.
- Build visual e integração precisam de validação; mudança de branch não é publicação de produção.

## Ordem de implementação
1. Testar build da nova base visual e validar a prévia Vercel.
2. Criar adaptador `CatalogProduct` para o frontend premium usando API de catálogo (sem copiar seed/mock).
3. Trocar carrinho estático por seleção de peso/unidade compatível com `OrderInput`.
4. Reutilizar fluxo de checkout do Replit com autorização, horários e validação de pagamento.
5. Validar pedidos em ambiente de teste, inclusive peso final e status no painel.
6. Reunir screenshots comparáveis de desktop/mobile, validar e só então mesclar à `main`.
7. Revisar e esvaziar `lixeira/` após aprovação.

## Integridade
Não excluir `replit-app` nem atualizar arquivos operacionais a partir da vitrine sem testes. Branch `main` permanece intocada.
