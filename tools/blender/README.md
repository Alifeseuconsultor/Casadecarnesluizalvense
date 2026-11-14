# Corre��o candidata: preserva��o de estado do bake

Origem: [EL4CTEO/blender-skills](https://github.com/EL4CTEO/blender-skills), skill `blender-texture-baking` vers�o 1.2.0. Licen�a MIT em `LICENSE.upstream`. O helper `_bpyx.py` foi copiado sem altera��es.

O script instalado analisado tinha SHA-256 `16B27115C8BB19F9D4B2162A67467DF9B3F9F720DCC365497A7443BE9CAB5E0A`.

## Altera��o

- Preserva engine, configura��es de Cycles/bake, UV ativa, sele��o de objetos, objeto ativo, modo e sele��o/n� ativo dos materiais.
- Usa apenas GPUs j� habilitadas nas prefer�ncias; caso contr�rio usa CPU, sem mudar o backend ou a sele��o global de dispositivos.
- Registra limpeza imediatamente ap�s criar materiais, slots e n�s tempor�rios; executa a limpeza tamb�m em falhas parciais.
- Restaura os links de sa�da e seu estado silenciado.
- Mant�m as texturas geradas como resultados. Arquivos j� gravados antes de uma falha n�o s�o revertidos. N�o h� transa��o de arquivos de imagem.
- Materiais preexistentes sem n�s s�o rejeitados, sem convers�o silenciosa.

## Valida��o e limite

Seis testes de controle de estado reproduziram falhas no original e passaram na corre��o; um s�timo verifica a preserva��o de links silenciados. Eles usam uma fronteira simulada de `bpy`, n�o o renderizador. A compila��o Python passou.

**A integra��o com Blender real ainda n�o foi executada neste ambiente**, pois n�o foi encontrado Blender instalado. A revis�o independente encontrou dois problemas (links silenciados e c�pia n�o at�mica); ambos foram tratados. A revis�o foi interrompida antes de uma aprova��o completa.

A skill global em `C:\Users\PC\.agents\skills\blender-texture-baking` **n�o foi alterada**: o ambiente recusou grava��o nesse local. Esta pasta cont�m a corre��o candidata versionada, n�o uma instala��o conclu�da.

## Aplicar no computador

Com Blender instalado, executar na raiz deste reposit�rio:

```powershell
& .\tools\blender\Apply-TextureBakingFix.ps1 -BlenderPath 'C:\caminho\do\Blender\blender.exe'
```

O caminho acima � um exemplo: substituir pelo execut�vel instalado. O aplicador verifica a vers�o original, roda um bake pequeno num processo separado com configura��o de f�brica e s� substitui o script se a valida��o passar. Faz substitui��o at�mica com backup no mesmo diret�rio. N�o abre arquivos do projeto e n�o instala Blender.

A corre��o local n�o muda automaticamente o selo p�blico do Snyk, que depende da publica��o e reauditoria do pacote original. Atualiza��es futuras via `npx skills add` podem substituir a corre��o local.

## Testes

```powershell
python -m unittest discover -s tools/blender/tests -p test_bake_state.py -v
blender --background --factory-startup --python-exit-code 1 --python tools/blender/tests/blender_integration.py
```

