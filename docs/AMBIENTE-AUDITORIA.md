# Preparar outra conta ou máquina

1. Obtenha a branch indicada em [STATUS.md](STATUS.md) e leia [AGENTS.md](../AGENTS.md).
2. Na raiz do checkout, execute `node tools/verify-skills.mjs` para conferir o pacote.
3. Use um ambiente Python 3.13 separado para instalar o Playwright. Se já houver um ambiente válido, use o executável Python dele.

Windows PowerShell:

```powershell
uv venv .venv-web-audit --python 3.13
uv pip install --python .venv-web-audit playwright==1.65.2
& ".\.venv-web-audit\Scripts\python.exe" -m playwright install chromium
& ".\.venv-web-audit\Scripts\python.exe" -c "from playwright.sync_api import sync_playwright; p=sync_playwright().start(); b=p.chromium.launch(); print(b.version); b.close(); p.stop()"
```

Em Linux ou macOS, execute os dois comandos finais com `.venv-web-audit/bin/python`. No Linux, siga as orientações da documentação do Playwright se houver bibliotecas de sistema ausentes.

Para rodar a vitrine Next.js, use `npm install` e `npm run dev` e confira a porta informada. Para o aplicativo Replit, consulte `package.json`, `pnpm-workspace.yaml` e `replit.md` da branch operacional e use a configuração de banco do ambiente.

Se precisar do motor do Impeccable, consulte o SKILL.md. O launcher pode baixar o binário com verificação de checksum. Se ele estiver indisponível, use o procedimento de leitura direta documentado na skill.

- [Ambientes Python com uv](https://docs.astral.sh/uv/pip/environments/)
- [Navegadores do Playwright](https://playwright.dev/python/docs/browsers)
