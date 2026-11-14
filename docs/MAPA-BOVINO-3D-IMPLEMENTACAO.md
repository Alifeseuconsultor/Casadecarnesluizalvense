# Mapa bovino 3D — especificação de implementação

## Contexto do repositório
Projeto Next.js 15 / React 19. A página inicial já inclui `InteractiveBeefMap.tsx`, atualmente uma ilustração SVG 2D com quatro regiões genéricas. O objetivo é substituir essa experiência por um visualizador 3D real sem alterar a vitrine, o carrinho ou as demais seções.

## Objetivo
Criar um módulo de anatomia bovina 3D interativo, com rotação livre, zoom, seleção de peças e painel informativo. O modelo deve ser uma malha 3D real em GLB/GLTF, não SVG, imagem com parallax ou formas geométricas improvisadas.

## Regras anatômicas inegociáveis
- Usar nomenclatura comercial brasileira e documentar sinônimos regionais.
- Validar limites e localização de cada corte com referências técnicas de desossa e anatomia muscular bovina.
- Não atribuir ao modelo uma precisão anatômica que a malha não possua.
- Distinguir cortes primários, subdivisões comerciais e músculos; documentar relações de inclusão/sobreposição.
- Não apresentar uma região genérica como se fosse um corte individual.
- Antes de habilitar um corte no seletor, registrar sua fonte e validação.

## Escopo visual
1. Modo externo: bovino inteiro com pele/pelagem realistas, vista lateral e rotação livre.
2. Modo anatômico: musculatura e peças comerciais individualizadas, cada uma como mesh/nó identificável.
3. Alternância explícita entre os modos; não mostrar cortes internos como se fossem visíveis através da pele.
4. Controles: orbit 360°, inclinação, zoom, reset, vistas laterais, frontal, traseira e superior.
5. Hover/foco: destaque dourado e nome da peça.
6. Clique: selecionar/realçar a peça e atualizar painel com nome, região anatômica, descrição, características, preparo e foto do produto quando houver imagem cadastrada.
7. Mobile: gestos de toque e controles acessíveis por teclado.

## Integração
- Implementar com `three`, `@react-three/fiber` e `@react-three/drei`, compatíveis com React 19.
- Carregar o GLB sob demanda; usar Suspense e estado de carregamento/erro.
- Manter o módulo isolado e preservar a API de integração da página.
- O CTA de produto só deve aparecer quando houver correspondência real com item do catálogo; não inventar preço, estoque ou disponibilidade.
- Otimizar geometria, texturas e tamanho do arquivo; avaliar Draco/Meshopt se necessário.

## Entrega incremental
### Fase 1 — visualizador
- Integrar dependências e criar componente 3D isolado.
- Carregar um modelo bovino GLB licenciado e de qualidade adequada.
- Implementar rotação, zoom, reset, presets de câmera, acessibilidade e responsividade.
- Se o modelo não estiver disponível, mostrar placeholder honesto e manter a experiência marcada como protótipo; não simular um modelo real com SVG.

### Fase 2 — anatomia
- Obter/criar modelo anatômico com peças separadas.
- Validar peça por peça com especialista/referência técnica.
- Criar manifesto de IDs, nomes brasileiros, região, fonte e status de validação.
- Só liberar seleção individual após validação.

### Fase 3 — catálogo
- Mapear IDs anatômicos para IDs reais de produtos.
- Integrar imagens e CTA com catálogo existente.

## Critérios de aceite
- O boi gira de forma contínua em 360° e responde a mouse/toque.
- Zoom e reset funcionam sem quebrar layout.
- Os modos externo e anatômico são distintos e explícitos.
- Cada peça selecionável corresponde a uma malha própria e a um registro validado.
- Painel e destaque permanecem sincronizados.
- Build e lint passam.
- A loja, navegação, catálogo e carrinho existentes continuam funcionando.
- Nenhuma alteração é feita diretamente em `main`; entregar por pull request para revisão.

## Referências técnicas a consultar
Priorizar publicações técnicas brasileiras sobre padronização de cortes, materiais de instituições de pesquisa agropecuária e manuais de desossa industrial. Registrar título, instituição, URL e quais limites anatômicos cada referência sustenta. Não usar imagens aleatórias ou diagramas estrangeiros como única fonte de verdade.
