# Casa de Carnes Luiz Alvense — Brief do MVP

> Documento de continuidade criado em 13/11/2026 a partir das decisões confirmadas pelo responsável do projeto. Não representa código já implementado nem substitui arquivos que possam existir no ChatGPT Work.

## 1. Objetivo do produto

Criar uma loja digital web, responsiva e mobile-first para uma casa de carnes gourmet. A prioridade do produto é o **catálogo online e a experiência de compra do cliente**. O painel do açougue é o segundo ambiente e deve ser operacionalmente simples.

Não criar apenas uma lista de produtos, nem transformar a experiência principal em um ERP.

## 2. Dois ambientes integrados

### 2.1 Loja do cliente — prioridade principal

Uma experiência de e-commerce gourmet moderna, atual, visualmente rica e fácil de explorar.

Requisitos confirmados:
- Catálogo com fotos de qualidade, categorias, descrição e preços por kg, gramas ou unidade.
- Home com banner principal, vitrines, carrosséis, destaques, ofertas, novidades, mais vendidos e combos.
- Navegação simples por categorias, busca com sugestões, filtros e ordenação.
- Páginas de produto com opções de peso/quantidade e personalização do corte.
- Preferências de corte: espessura, limpeza, gordura e observações; salvar preferências para recompra.
- Favoritos, carrinho e checkout.
- Agendamento de retirada com horários e limite de pedidos por faixa.
- Histórico de pedidos e opção de repetir pedido.
- Acompanhamento de status.
- Pagamento online (PIX e cartão, mediante integração real com gateway) e possibilidade de pagamento na retirada se a loja habilitar.
- Pedido/compartilhamento direto pelo WhatsApp, inclusive envio do carrinho.
- Área do cliente com cadastro, dados e preferências.

Direção visual:
- Aparência premium, contemporânea, gastronômica e confiável, inspirada em boutiques de carne e empórios gourmet.
- Fotografias grandes e apetitosas dos cortes.
- Paleta sugerida anteriormente: preto/grafite com vinho ou verde-escuro e detalhes cobre/dourado; validar contra a identidade real da marca antes de fixar.
- Tipografia legível, cards bem organizados e hierarquia visual clara.
- Carrosséis horizontais, transições suaves, microinterações, feedback ao adicionar ao carrinho, skeleton loading e hover discreto no desktop.
- Efeitos devem valorizar a experiência sem prejudicar desempenho ou acessibilidade.
- Mobile-first, com excelente adaptação para tablet e desktop.
- Busca, categorias e carrinho devem ser fáceis de encontrar.

Estrutura inicial de navegação sugerida:
1. Início
2. Catálogo
3. Categorias
4. Ofertas
5. Monte seu churrasco (melhoria sugerida; confirmar se entra no MVP)
6. Favoritos
7. Carrinho
8. Meus pedidos
9. Minha conta

### 2.2 Painel do açougue — simplicidade operacional

O painel deve permitir que a equipe gerencie catálogo e receba/prepare pedidos com poucos cliques. Não deve virar um ERP complexo.

Três áreas principais:
1. Início: resumo do dia e pedidos que exigem atenção.
2. Pedidos: central de recebimento e preparação.
3. Produtos: catálogo, preços e disponibilidade.

Gestão de produtos:
- Cadastrar/editar produto, foto, categoria, descrição e preço.
- Definir unidade de venda (kg, g ou unidade).
- Ativar/desativar e marcar como esgotado sem apagar o cadastro.
- Atualizar preço rapidamente.
- Controle opcional de estoque.
- Cadastrar combos e promoções.
- Duplicar produto.

Gestão de pedidos:
- Todos os pedidos feitos na loja online devem aparecer automaticamente no painel.
- Quadro com etapas: Novos, Em preparo, Prontos para retirada e Concluídos.
- Exibir cliente, telefone, itens, quantidades, preferências de corte, observações, horário de retirada/entrega, pagamento e total.
- Ações rápidas para aceitar, iniciar preparo, marcar pronto e concluir.
- Notificações de novos pedidos, com opção de alerta sonoro configurável.
- Tela/visão de preparação com detalhes de cada item e opção de marcar item preparado.

Pesagem e ajuste:
- Como produtos são vendidos por peso, permitir informar peso final após o corte.
- Recalcular o valor definitivo com transparência.
- Se houver diferença em relação ao valor pré-pago, tratar complementação ou estorno/ajuste conforme as capacidades reais do gateway. Não marcar pagamento como confirmado sem confirmação do provedor.

Clientes:
- Consultar cadastro, telefone, histórico e preferências.
- Registrar observações internas.
- Repetir pedido anterior.

Configurações:
- Horário de funcionamento.
- Janelas e capacidade de retirada.
- Tempo de preparo.
- Formas de pagamento.
- WhatsApp da loja.
- Regras de entrega, caso a loja decida oferecer entrega no MVP.

Relatórios básicos:
- Vendas e pedidos do dia.
- Pedidos pendentes.
- Produtos mais vendidos.
- Ticket médio e faturamento por período.

## 3. Fluxo esperado

1. Cliente encontra produto no catálogo.
2. Escolhe peso/quantidade e personaliza o corte.
3. Adiciona ao carrinho.
4. Seleciona retirada e horário.
5. Escolhe pagamento ou opção autorizada pela loja.
6. Confirma o pedido.
7. Pedido aparece no painel do açougue.
8. Equipe aceita e prepara os itens.
9. Equipe informa peso final quando aplicável e ajusta o total.
10. Cliente recebe atualização de status.
11. Pedido fica pronto para retirada.
12. Equipe conclui a entrega e o pedido entra no histórico.

Pedidos originados por WhatsApp podem começar como atendimento externo; avaliar se o MVP deve permitir que a equipe registre manualmente esses pedidos no painel para manter uma fila única.

## 4. Melhorias sugeridas — não assumir como escopo obrigatório

- Monte seu churrasco por número de pessoas.
- Combos e kits temáticos.
- Clube de vantagens, pontos ou cashback.
- Receitas e dicas de preparo.
- Ofertas personalizadas com base no histórico.
- Entrega em domicílio.
- Encomendas especiais e pedidos para eventos.
- Recomendações inteligentes.

## 5. Prioridades de implementação

### P0 — núcleo do MVP
- Loja web responsiva e catálogo.
- Busca, categorias e página de produto.
- Personalização de cortes.
- Carrinho e checkout.
- Pedidos e agendamento de retirada.
- Painel simples para catálogo e pedidos.
- Status e histórico do pedido.
- WhatsApp como canal de contato/compartilhamento.

### P1 — completar a operação comercial
- Integração real com PIX/cartão.
- Preferências salvas e recompra.
- Notificações.
- Ajuste de peso final e valor.
- Relatórios básicos.
- Registro no painel de pedidos recebidos por telefone/WhatsApp.

### P2 — evolução
- Monte seu churrasco.
- Clube de vantagens.
- Entrega.
- Receitas e recomendações personalizadas.

## 6. Requisitos técnicos e de qualidade

- Aplicação web responsiva; PWA pode ser avaliado.
- Dados persistidos em banco de dados.
- Autenticação e permissões para cliente e equipe.
- Segurança e privacidade dos dados pessoais.
- Integrações externas reais somente após configuração de credenciais.
- Estados de carregamento, vazio, sucesso e erro.
- Acessibilidade, desempenho e SEO básico para catálogo público.
- Preços, disponibilidade e status devem vir de dados reais, não de conteúdo hardcoded.
- Pagamentos nunca devem ser simulados como confirmados.

## 7. Decisões técnicas ainda não confirmadas

Não presumir framework, banco, provedor de hospedagem, gateway de pagamento, provedor de WhatsApp ou identidade visual definitiva. Antes de implementar essas escolhas, recuperar o material produzido no ChatGPT Work e verificar se já existem decisões ou código.

## 8. Situação do repositório no momento da criação deste documento

- Repositório: `Alifeseuconsultor/Casadecarnesluizalvense`
- Branch principal: `main`
- Branch de trabalho isolada: `continuacao-chatgpt`
- Ponto de partida: commit inicial `4755fa0bce914b79aece950365f7cbcdf487e35d`
- O README era o único arquivo identificado no branch principal durante a auditoria inicial.
- Este documento foi criado em branch separada para não sobrescrever o trabalho do outro agente.
- Ainda é necessário importar e auditar os arquivos reais do ChatGPT Work antes de iniciar implementação que possa duplicar ou conflitar com aquele trabalho.
