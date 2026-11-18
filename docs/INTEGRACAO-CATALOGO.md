# Integração do catálogo público — etapa de leitura

## O que foi implementado
- `GET /api/catalog` na vitrine Next.js consulta a API de catálogo do Replit a partir do servidor (sem colocar URL/credenciais no bundle do navegador).
- `app/components/LiveCatalog.tsx` renderiza apenas produtos retornados pela API, com busca, categorias, imagem, unidade de venda e preços vigentes.
- O mock Gourmet deixou de ser utilizado como catálogo comercial. Carrinho e envio de pedidos demonstrativos foram retirados da página, até existir integração segura de checkout.
- A área de kits permanece apenas como inspiração editorial, com aviso de que são sugestões ilustrativas.
- Falhas de conexão exibem mensagem honesta e opção de tentar novamente; não usam dados fictícios como fallback.

## Configuração necessária (somente no ambiente de preview)
Definir `REPLIT_CATALOG_API_URL` como a **URL HTTPS absoluta** do endpoint público GET `/api/catalog` do backend real (não configurar URL de administrador nem tokens no browser). A URL deve estar acessível pelo servidor da Vercel.

Exemplo de formato, **não uma URL real**: `https://SEU-BACKEND.example/api/catalog`.

Sem a variável, o site exibe “O catálogo online ainda não está configurado” e não apresenta produtos fictícios.

## Verificações antes de liberar pedidos
- Conferir que o endpoint retorna apenas itens permitidos e nenhum campo administrativo.
- Validar imagens e imagens quebradas, vigência de promoções, unidades kg/g/unidade e produtos esgotados.
- Garantir autenticação e autorização de `POST /orders` e rotas internas, CORS, limites de requisição e integridade de preço calculada no servidor.
- Confirmar telefone/WhatsApp, endereço e horário antes de publicar (a base Gourmet contém valores fixos).
- Testar no celular e desktop, executar TypeScript, lint, build e fluxo ponta a ponta.

## Nota
A fonte do backend Replit está preservada em `replit-app/`. Nenhum dado real foi alterado ou pedido criado nesta etapa.
