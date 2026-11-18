# Component inventory

Escopo extraído do Catálogo e dos controles reutilizáveis necessários à tela
Configurações. A aplicação de origem compõe a maior parte da interface com
elementos HTML nativos e classes CSS, em vez de uma biblioteca própria de
componentes; os componentes deste pacote dão uma API reutilizável a esses
padrões preservando a semântica nativa.

| Family | Build reference | Dependencies / blockers | Evidence | Chunk | Status |
| --- | --- | --- | --- | --- | --- |
| Button | `components/button.md` | Native button; none | Ações primárias, contorno e seleção são usadas repetidamente no Catálogo | 1 — pilot | implemented |
| Input | `components/input.md` | Native input; none | Busca e campos do editor usam a mesma altura, superfície e foco | 1 — pilot | implemented |
| Select | `components/select.md` | Native select; none | Filtro de categoria e campos do editor usam select nativo | 1 — pilot | implemented |
| Card | `components/card.md` | Native section; none | Cartão de produto é a unidade visual principal da grade | 1 — pilot | implemented |
| Badge | `components/badge.md` | Native span; none | Estados Ativo, Esgotado e Inativo distinguem disponibilidade | 1 — pilot | implemented |
| Checkbox | `components/checkbox.md` | Native input; none | Configurações usa checkboxes para atendimento e pagamentos | 2 | pending |
| Textarea | `components/textarea.md` | Native textarea; none | Editor de produto inclui descrição multilinha | 2 | pending |
