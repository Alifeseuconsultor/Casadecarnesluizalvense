# Plano de auditoria e evolução

O objetivo é elevar a qualidade do site, da compra e da operação administrativa da Casa de Carnes Luiz Alvense, preservando a identidade visual e aproveitando a implementação atual.

## 0. Compartilhar o ponto de partida

- [x] Reunir as oito skills escolhidas com scripts, referências e quatro complementos do pacote Web Quality.
- [x] Registrar fontes e hashes e documentar como outro agente prepara o ambiente.
- [x] Criar as instruções, o plano, as decisões e o status.

A entrega desta etapa é a branch com o pacote e a documentação. As etapas abaixo orientam a auditoria e o redesign quando forem solicitados.

## 1. Identificar o que está em uso

Mapear branch, commit, URL, rotas e papéis de cliente e equipe. Distinguir a vitrine, o preview Gourmet e o aplicativo operacional. Registrar a identidade visual e as regras comerciais encontradas. Entrega em `docs/auditoria/INVENTARIO.md`.

## 2. Auditar as jornadas existentes

| Frente | O que avaliar |
| --- | --- |
| UI e UX | Hierarquia, composição, densidade, textos, estados e interação |
| Identidade visual | Coerência da marca, fotografia, tipografia e acabamento |
| Design System | Tokens, componentes, variantes, estados e padrões duplicados |
| Navegação | Categorias, busca, filtros e orientação no percurso |
| Catálogo e produto | Vitrines, disponibilidade, fotos, preço, peso, corte e ação de compra |
| Carrinho e checkout | Itens, totais, entrega ou retirada, erros e confirmação |
| Administração | Pedidos prioritários, preparação, pesagem, status e gestão de produtos |
| Qualidade técnica | Responsividade, teclado, foco, contraste e performance |
| Código | Componentes, contratos, duplicações e riscos de refatoração |

Entregar `docs/auditoria/ACHADOS.md` com evidência por fluxo, impacto e forma de validar. Identificar pontos que dependeram de leitura estática ou ficaram sem teste. Usar dados de teste nos fluxos que geram registros.

## 3. Priorizar a evolução

Preparar `docs/auditoria/EVOLUCAO.md` com prioridades por impacto, esforço e dependência. Definir a direção visual a partir dos padrões aprovados. Traduzir a proposta em jornadas, mudanças delimitadas e critérios de aceite.

## 4. Implementar e verificar

Após a solicitação de implementação, trabalhar por jornada na branch correspondente. Comparar antes e depois nas mesmas condições. Verificar as rotas, estados e integrações alteradas e registrar os resultados em STATUS.

### Vitrine pública da consolidação

- [x] Inspecionar as 14 capturas iniciais e corrigir os problemas de apresentação encontrados na vitrine.
- [x] Incluir navegação por categorias no cabeçalho, com filtro compartilhado e rolagem lateral no celular.
- [ ] Conferir no ambiente comercial os produtos reais e os contatos oficiais.
- [ ] Aprovação visual do proprietário e decisão de publicação.
