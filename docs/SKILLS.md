# Catálogo das skills

Abra a skill pertinente pelo link abaixo. Cada pasta contém instruções, referências e scripts conforme a fonte. Se o agente não descobrir a skill automaticamente, forneça o caminho do SKILL.md.

| Skill | Quando usar |
| --- | --- |
| [impeccable](../.agents/skills/impeccable/SKILL.md) | Crítica visual e UX, superfícies administrativas, Design System e refinamento. Use `critique` para design e `audit` para qualidade técnica. |
| [storefront-best-practices](../.agents/skills/storefront-best-practices/SKILL.md) | Navegação, catálogo, vitrines, produto, carrinho e checkout. Aplique as sugestões à stack existente. |
| [web-quality-audit](../.agents/skills/web-quality-audit/SKILL.md) | Auditoria técnica e coleta de evidências. |
| [performance](../.agents/skills/performance/SKILL.md) | Medição e diagnóstico de desempenho. Diferencie teste de laboratório de dados reais de uso. |
| [web-design-guidelines](../.agents/skills/web-design-guidelines/SKILL.md) | Revisão da interface. A consulta às diretrizes atuais requer rede. |
| [vercel-react-best-practices](../.agents/skills/vercel-react-best-practices/SKILL.md) | Revisão React/Next.js e performance. Confira a versão em uso. |
| [vercel-composition-patterns](../.agents/skills/vercel-composition-patterns/SKILL.md) | Composição de componentes e consistência do Design System. |
| [webapp-testing](../.agents/skills/webapp-testing/SKILL.md) | Evidências e verificação de jornadas com Playwright e Chromium. |

Complementos do Web Quality: [accessibility](../.agents/skills/accessibility/SKILL.md), [best-practices](../.agents/skills/best-practices/SKILL.md), [core-web-vitals](../.agents/skills/core-web-vitals/SKILL.md) e [seo](../.agents/skills/seo/SKILL.md). Há três links de regras no AGENTS.md compilado de React que chegaram da origem sem o prefixo correto. Os arquivos estão em `rules/` na mesma skill.

O [manifesto](../.agents/skills-manifest.json) guarda a origem, o commit de origem e o SHA-256 de cada arquivo. O verificador `node tools/verify-skills.mjs` confere a cópia. As licenças e avisos disponíveis foram mantidos. O Impeccable inclui LICENSE e NOTICE.md, Web Quality inclui a licença MIT e Webapp Testing inclui LICENSE.txt. As skills Vercel declaram MIT em seus metadados. A origem consultada de Storefront Best Practices não incluía um arquivo de licença.

Atualize as skills em uma mudança própria, conferindo os arquivos e regenerando o manifesto. Para executar as ferramentas de auditoria, siga o [guia de ambiente](AMBIENTE-AUDITORIA.md).
