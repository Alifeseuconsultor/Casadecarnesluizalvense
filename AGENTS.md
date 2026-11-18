# Casa de Carnes Luiz Alvense — instruções para agentes

1. Abra [STATUS.md](docs/STATUS.md) para localizar a frente de trabalho e saber qual etapa está pendente.
2. Confira `git status --short`, `git branch --show-current` e `git log -1 --oneline`.
3. Leia [PLANO.md](docs/PLANO.md) e consulte [DECISOES.md](docs/DECISOES.md) conforme a tarefa.
4. Carregue as skills relevantes pelo [catálogo](docs/SKILLS.md). Para preparar a máquina, siga o [guia de ambiente](docs/AMBIENTE-AUDITORIA.md).

A Casa de Carnes já tem uma vitrine, uma frente Gourmet e um aplicativo operacional. A `main` contém a vitrine demonstrativa Next.js. O aplicativo com frontend, API e banco está em `replit/acougue-operacao`. Confirme a branch, o commit e a URL da superfície antes de avaliar uma função.

- Preserve a identidade visual e os fluxos aprovados. Confira os dados comerciais na implementação existente, incluindo venda por kg/unidade, preço, peso solicitado e peso final. Na frente Replit, consulte `.agents/memory/catalog-price-basis.md`.
- Use os arquivos `.agents/skills/<nome>/SKILL.md`. Resolva scripts e referências a partir da pasta da própria skill. Leia apenas o material pertinente.
- Siga o escopo dado pelo usuário. As recomendações das skills servem de apoio e a stack, os contratos e as regras do produto orientam sua aplicação.
- Registre cada achado com tela ou fluxo, evidência, arquivo quando aplicável, impacto e como verificar a melhoria. Diferencie o que foi observado no código do que foi testado no navegador.
- Separe as mudanças por frente em branches próprias. Na vitrine, execute `npm run lint`, `npx tsc --noEmit` e `npm run build` conforme o escopo. No Replit, siga o workspace pnpm e os scripts da branch.
- Mantenha credenciais, dados de clientes, ambientes virtuais e navegadores fora do Git.

Ao passar o trabalho, atualize STATUS com branch, commit, escopo, resultados das verificações, limitações e próxima ação. Marque a etapa correspondente no PLANO e registre novas decisões em DECISOES. Se houver agentes em paralelo, cada um entrega suas evidências e um responsável consolida o status.
