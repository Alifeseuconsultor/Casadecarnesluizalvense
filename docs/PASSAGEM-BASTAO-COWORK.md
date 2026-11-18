# PASSAGEM DE BASTÃO — Casa de Carnes Luiz Alvense

Data: 18/11/2026. Destino: próximo agente com acesso a Cowork/computador/navegador. Este documento é ponto de continuidade, **não representa conclusão do site**.

## Pedido do proprietário
“Agora vamos pegar a melhor de cada versão do site pra finalizar. O que não for utilizar, junta num arquivo 'lixeira' pra quando finalizarmos jogarmos fora.”
Depois: “Faz print de todas as partes do site pra você analisar e se corrigir.”
Por último: “Terminando passa o bastão pra outro agente. Vou mudar para agente com acesso ao cowork.”

## Repositório e proteção
- GitHub: https://github.com/Alifeseuconsultor/Casadecarnesluizalvense
- Branch ativa de consolidação: `consolidacao/site-final-20261118`.
- Pull request rascunho: https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/pull/11
- **Não** mesclar na `main` nem alterar a produção até aprovar a experiência visual e a integração real.
- `lixeira/` é quarentena reversível. Não excluir até a aprovação explícita do usuário.
- A versão Replit importada está em `replit-app/`, 337 arquivos do pacote original limpo; não mexer no backend operacional sem verificar segurança, ambiente e regras de negócio.

## Versões disponíveis
- `main`: vitrine inicial estática do Next.js.
- `preview/homepage-gourmet`: componentes visuais premium, mapa do boi, Dry Aged, kits, carrinho consultivo; contém produtos de exemplo e dados fixos.
- `codex/site-sacola-revisao-20261118`: variação de sacola demonstrativa.
- `import/replit-casa-de-carnes`: código do Replit, integrado como fonte isolada.
- `consolidacao/site-final-20261118`: trabalho atual; `app/` usa a direção Gourmet, backend Replit mantido na subpasta.

## Implementações de consolidação
1. Copiamos a base visual Gourmet para `app/`.
2. Criamos `lixeira/vitrine-main-demonstrativa/` com cópias exatas da página, CSS e layout antigos. `lixeira/MANIFESTO.md` registra candidatos sem exclusões.
3. Criamos `app/api/catalog/route.ts`: adaptador servidor do Next.js para catálogo público do backend. Exige `REPLIT_CATALOG_API_URL` com URL HTTPS do endpoint público. Sem configuração, responde 503; erros de upstream retornam 502.
4. Criamos `app/components/LiveCatalog.tsx` e alteramos `app/page.tsx` para utilizar produtos da API, com busca, categorias, unidade de venda, promoções e tratamento de erro/vazio.
5. Tiramos botões de pedido de produtos fictícios da vitrine; o carrinho Gourmet e a integração de checkout **ainda não estão prontos**. Kits são apresentados como referências ilustrativas.
6. Ajustamos ESLint e TypeScript para não tratar `replit-app/` e `lixeira/` como o próprio projeto Next.js.
7. A CI `Validate storefront` alcançou **success** no run 44241703464 (lint, TypeScript e build). Confirmar novamente após alterações subsequentes.

## Auditoria visual — situação e local das capturas
- A URL do preview criada pela Vercel é https://casadecarnesluizalvense-git-con-debb34-alifes-projects-601748ef.vercel.app
- **A Vercel protege a prévia por login**. Playwright recebeu “Login – Vercel”, portanto não considerá-la captura válida do produto.
- Automatização em `.github/workflows/auditoria-visual.yml` e `scripts/audit-site.mjs`.
- Execução inicial: https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/actions/runs/44243023111 — falhou por autenticação Vercel.
- Correção: iniciar o Next.js local no GitHub Actions e capturar localhost:3000. Execução iniciada: https://github.com/Alifeseuconsultor/Casadecarnesluizalvense/actions/runs/44243295353
- O script tenta capturar 14 PNGs: desktop/mobile × {página completa, início, cortes, mapa-do-boi, dry-aged, kits-churrasco, contato}, além de `.audit/site-report.json`.
- Se o run concluir com sucesso, as imagens serão commitadas em `.audit/screenshots/` nesta branch e poderão ser visualizadas no GitHub. Se falhar, inspecione logs e corrija; **não afirme que fez análise visual sem abrir efetivamente os arquivos**.
- O procedimento com localhost captura o mesmo código da branch, mas não prova o comportamento da implantação Vercel nem dos dados reais de API.

## Pendências prioritárias para o Cowork
1. **Primeiro**: examinar imagens completas e por seção, desktop/mobile. Avaliar cortes, imagens, overflow horizontal, navegação, contraste, textos, responsividade, estados vazios e inconsistências.
2. Corrigir problemas objetivos com commits na branch, repetindo imagens comparáveis depois.
3. Verificar funcionamento real da prévia Vercel com sessão autenticada, se necessário, e comparar à execução local.
4. Confirmar com o proprietário o telefone, WhatsApp, endereço, horários e disponibilidade de itens antes de divulgar dados fixos da Gourmet como oficiais.
5. Obter endpoint público do Replit e conectar `REPLIT_CATALOG_API_URL` no preview Vercel. Evitar expor tokens/segredos no browser.
6. Segurança: revisar autenticação/autorização do backend para catálogo, pedidos, clientes e administração. Não expor rotas internas.
7. Implementar carrinho/checkout para kg, g e unidade compatíveis com `OrderInput` e `pricePerKg`; preço e pesos definitivos calculados no backend. Só depois habilitar pedidos reais.
8. Validar casos reais e de erro de ponta a ponta; lint, TypeScript, build e testes visuais; então pedir aprovação antes do merge.
9. Revisar `lixeira/MANIFESTO.md` somente após site final testado e publicado; exclusão apenas com autorização.

## Documentos existentes
- `docs/CONSOLIDACAO-VERSOES.md`
- `docs/STATUS-CONSOLIDACAO.md`
- `docs/INTEGRACAO-CATALOGO.md`
- `lixeira/README.md`
- `lixeira/MANIFESTO.md`

## Regras de continuidade
Evitar recomeçar do zero, evitar retrabalhar arquivos já importados, validar cada mudança, não passar tarefas complexas para agentes com capacidade limitada, e entregar links de prints/preview com indicação clara do que foi realmente testado. Nenhum commit da branch de trabalho equivale a uma publicação em produção.
