# Auditoria inicial — site Gourmet

Data: 2026-11-17  
Base examinada: `preview/homepage-gourmet` (`196a432`)  
Método: **leitura estática de arquivos no GitHub**; sem execução local, screenshots atuais ou teste de navegação. As prioridades são provisórias até verificação visual.

## Inventário confirmado

- Entrada da vitrine: `app/page.tsx` (página única com seções ancoradas).
- Navegação desktop/mobile: `app/components/SiteHeader.tsx`.
- Hero: `app/components/Hero.tsx`.
- Catálogo, filtros e pesos: `app/components/CutsShowcase.tsx` e `app/components/data.ts`.
- Mapa bovino atual: `app/components/InteractiveBeefMap.tsx` (SVG com quatro regiões). A frente 3D está em outra branch e não foi integrada.
- Dry Aged: `app/components/DryAgedTimeline.tsx`.
- Complementos: `app/components/KitsChurrasco.tsx`.
- Seleção e encaminhamento por WhatsApp: `app/components/CartDrawer.tsx`.
- Layout e SEO básico: `app/layout.tsx`; tokens e responsividade: `app/globals.css`.

## Achados e prioridades

| Prioridade | Achado e evidência | Impacto | Ação/validação |
| --- | --- | --- | --- |
| Alta | `CartDrawer.tsx` define `role=dialog` e Escape, mas na base não controlava foco inicial, Tab ou retorno de foco | Pessoas que usam teclado podem navegar fora do carrinho ou perder seu lugar | Corrigido em branch desta auditoria; testar Tab/Shift+Tab/Escape e retorno ao acionador |
| Alta | `page.tsx` não oferecia link para pular cabeçalho | Navegação repetitiva | Corrigido; testar com teclado e leitor de tela |
| Média | `SiteHeader.tsx` mostrava contador sem região viva | Mudanças de itens pouco perceptíveis a leitores de tela | Corrigido; testar anúncio em leitor de tela |
| Média | `globals.css` contém vários textos de 6–10px, sobretudo no cabeçalho | Legibilidade possivelmente inadequada em telas pequenas | Medir tipografia computada nos breakpoints e revisar escala; não afirmar WCAG sem teste |
| Alta | `data.ts` contém seis cortes e três complementos com imagens Unsplash, dados demonstrativos e sem preço/estoque confirmado | Site não deve representar produtos como disponibilidade comercial real | Conferir fotos, produtos, endereço, telefone, horários e preços com a operação antes da publicação |
| Média | `CutsShowcase.tsx` mostra imagem bruta/preparada via URLs externas e com `onError` que esconde imagem | Pode gerar cartão sem referência visual | Criar fallback visual e otimizar imagens com teste de rede |
| Média | `page.tsx` mantém seleção apenas em estado React, sem persistência | Seleção pode se perder ao atualizar a página | Avaliar persistência local com aviso de caráter não confirmado |
| Média | `CartDrawer.tsx` calcula pessoas por 400g e peso inteiro aproximado fixo de 1200g | Estimativa genérica pode não servir para todos os cortes | Avaliar texto orientativo e peso por produto quando houver catálogo validado |
| Média | `InteractiveBeefMap.tsx` usa SVG de quatro regiões orientativas | Não cobre mapa de desossa detalhado; integrar 3D sem afirmar precisão anatômica | Validar branch 3D com especialista e navegador antes de integrar |
| Alta | Não há evidência de teste visual atual em 360/390/768/1440px nem Lighthouse | Layout e desempenho atuais não podem ser certificados | Rodar build/lint/TS, Playwright, acessibilidade e capturas comparáveis |

## Decisões desta entrega

- Preservar paleta e tipografia existentes e não migrar para o aplicativo operacional Replit.
- Não adicionar preços, avaliações, depoimentos ou disponibilidade fictícios.
- Manter a saída WhatsApp como **consulta sujeita a confirmação humana**.
- Aplicar melhorias de teclado e movimentação sem alterar estrutura comercial.
- Separar achados de código de resultados comprovados em navegador.

## Próximas validações

1. Executar `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run build` na branch.
2. Executar Playwright com viewport mobile e desktop; verificar se foco fica preso no carrinho, fechamento e retorno ao acionador.
3. Conferir rolagem, menu, busca/filtros, imagens, pesos e WhatsApp.
4. Medir contraste, tamanhos, CLS/LCP/INP e registrar screenshots do antes/depois.
5. Validar catálogo e dados da empresa antes de propor publicação.

**Limitação:** este inventário cobre a estrutura de página e componentes consultados, não constitui auditoria de produção nem certificação de acessibilidade.
