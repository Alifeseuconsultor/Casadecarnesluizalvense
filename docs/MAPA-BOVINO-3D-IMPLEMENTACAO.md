# Mapa bovino 3D — implementação e limites

## Estado entregue nesta branch

O mapa SVG anterior foi substituído por um visualizador 3D interativo integrado à seção `#mapa-do-boi`.

Arquivos:
- `app/components/InteractiveBeefMap.tsx`: interface, seleção das regiões, painel explicativo e controles.
- `app/components/BeefMap3DCanvas.tsx`: cena Three.js via React Three Fiber, carregamento do GLB, controles de órbita, hotspots e fallback.
- `app/components/data.ts`: conteúdo descritivo das quatro regiões e exemplos de cortes associados.
- `app/globals.css`: layout responsivo e estilo da experiência 3D.
- `package.json`: dependências Three.js, React Three Fiber e Drei.

## Experiência implementada

- Modelo 3D de touro em cena, com iluminação e sombra.
- Rotação 360° com mouse ou toque, zoom e controle de giro automático.
- Reinicialização da câmera.
- Alternância entre visão externa sem marcadores e visão por regiões comerciais.
- Hotspots clicáveis no perfil externo, sincronizados com o painel.
- Navegação alternativa por botões acessíveis, inclusive em telas pequenas.
- Fallback para um segundo GLB mais leve quando o modelo principal não carregar.
- Painel com região, exemplos de cortes associados, preparo e observação de que a lista é orientativa.

## Modelo externo e licenças

Modelo principal: **Black Bull — Grab3D**, GLB otimizado (versão Light).
- URL usada: `https://grab3d.com/dl/bull/bull-light.glb`
- Página e ficha técnica: https://grab3d.com/models/animals/bull/
- Licença declarada pelo fornecedor: CC0 1.0; a página indica uso comercial e redistribuição sem atribuição obrigatória.
- A ficha informa aproximadamente 227 mil triângulos para a versão Light.

Fallback: **bull — 3DAssets.dev**.
- URL usada: `https://cdn.3dassets.dev/assets/5010/v1/model.glb`
- Página: https://3dassets.dev/assets/farm-livestock-and-barnyard-bull-f7c674f7
- Licença declarada: CC0 1.0 Universal.
- Modelo low-poly leve, com eixos Y-up e Z-forward documentados pelo fornecedor.

Os arquivos são carregados diretamente dos respectivos CDNs; não foram copiados para o repositório. Isso reduz o tamanho do bundle, mas cria dependência de disponibilidade e CORS dos fornecedores. Para produção de longo prazo, a recomendação é armazenar uma cópia licenciada e otimizada em hospedagem controlada pelo projeto.

## Limite anatômico importante

O modelo 3D licenciado representa a **aparência externa do animal**. Ele não contém peças comerciais separadas, músculos individualizados nem superfícies de corte. Por isso:
- os quatro hotspots são referências visuais aproximadas para grandes regiões;
- não são polígonos de desossa nem fronteiras anatômicas oficiais;
- a lista de cortes associados é informativa e pode variar conforme o padrão de desossa e a nomenclatura comercial;
- não há promessa de que clicar num hotspot seleciona o volume 3D exato de um corte.

A próxima fase anatômica exige um modelo próprio com objetos/malhas separados por peça, além da conferência dos limites com documentação técnica brasileira e validação de um profissional de desossa. Só então deve ser ativada uma visão interna ou a seleção precisa de cortes.

## Critérios para revisão

- Confirmar carregamento do GLB principal no domínio de produção e funcionamento do fallback.
- Verificar orientação do modelo e posicionamento dos hotspots em monitor e celular.
- Confirmar rotação, zoom, reinício da câmera e seleção por toque/teclado.
- Executar `npm install`, `npm run lint`, `npx tsc --noEmit` e `npm run build`.
- Garantir que vitrine, carrinho, navegação, WhatsApp e seções existentes continuem funcionando.

## Próxima evolução

1. Hospedar um modelo externo e anatômico sob controle do projeto.
2. Criar ou adquirir malhas musculares / comerciais independentes.
3. Criar um manifesto com ID interno, nome comercial brasileiro, sinônimos, região, fonte e status de validação por peça.
4. Conectar cada peça validada a produtos reais do catálogo, sem inventar estoque ou preço.
