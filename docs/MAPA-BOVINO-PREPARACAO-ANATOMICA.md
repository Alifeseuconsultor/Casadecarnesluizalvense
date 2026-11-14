# Prepara��o do modelo anat�mico bovino

## Estado em 14/11/2026

Esta entrega prepara a entrada de um modelo segmentado. **N�o inclui um novo bovino 3D, m�sculos modelados nem desossa virtual funcionando.** O visualizador existente continua na branch `feature/mapa-bovino-3d-196a432`, base `d7a8974`. Nenhum componente da loja foi alterado nesta etapa.

## Material entregue

- `assets/bovine/manifest.draft.json`: cadastro inicial de 18 pe�as, com IDs est�veis. Os nomes t�m refer�ncia na Embrapa; todas as liga��es a malhas e aprova��es anat�micas est�o vazias. O arquivo n�o � importado pelo aplicativo.
- `tools/validate-bovine-asset.mjs`: verifica o v�nculo entre pe�as e n�s de um GLB, nomes amb�guos, n�s ausentes ou fora da cena, uso duplicado do mesmo n�, depend�ncias externas e registro de licen�a/revis�o.
- `tools/blender/`: corre��o candidata para o script de textura, com testes e aplica��o local com backup.

## Pr�xima entrega visual

Come�ar por picanha, maminha, cora��o da alcatra, fil�-mignon, fil� de costela e fil� de lombo. A divis�o � uma proposta t�cnica para reduzir o primeiro lote de modelagem. Expandir depois para as demais pe�as do manifesto.

O modelo precisa de:

1. Arquivo-fonte `.blend` e exporta��o `.glb`, em metros, com orienta��o documentada.
2. Superf�cie externa, ossos e volumes de cortes separados. Cada corte remov�vel precisa de faces internas fechadas; pintura sobre a pele n�o basta.
3. Nomes �nicos, por exemplo `cut_picanha_L` e `cut_picanha_R`. Uma pe�a pode agrupar v�rios n�s. A malha da pele deve permanecer separada.
4. Transforma��es e piv�s que permitam remover e recolocar as pe�as na posi��o original.
5. Materiais e texturas pr�prios para WebGL. Preservar os n�s individuais ao otimizar; n�o unir todos os cortes numa �nica malha.
6. Revis�o de limites e correspond�ncia anat�mica por profissional de desossa. Registrar a evid�ncia no manifesto antes de liberar a intera��o como anatomia validada.
7. Autoriza��o de uso do arquivo em uma aplica��o web. Uma licen�a para visualizar um software de anatomia n�o � automaticamente uma licen�a para redistribuir os modelos.

N�o representar alcatra inteira e suas subdivis�es como volumes sobrepostos remov�veis no mesmo estado. O cat�logo usa pe�as individuais; grupos comerciais podem reunir IDs. N�o relacionar automaticamente um nome comercial a um �nico m�sculo: h� cortes compostos e cortes que usam apenas parte de um m�sculo.

## Fontes verificadas

- [Padroniza��o dos cortes - Embrapa](https://old.cnpgc.embrapa.br/publicacoes/naoseriadas/cortes/): nomes e hierarquia de cortes; a publica��o hist�rica n�o substitui a valida��o do modelo.
- [Alcatra - Embrapa](https://old.cnpgc.embrapa.br/publicacoes/naoseriadas/cortes/textos/alcatra.html): composi��o e subdivis�es.
- [Fil�-mignon - Embrapa](https://old.cnpgc.embrapa.br/publicacoes/naoseriadas/cortes/textos/filemignon.html): localiza��o e composi��o.
- [Contrafil� - Embrapa](https://old.cnpgc.embrapa.br/publicacoes/naoseriadas/cortes/textos/contrafile.html): limites e subdivis�es.
- [Bovine Myology - University of Nebraska](https://bovine.unl.edu/): refer�ncia anat�mica; n�o foi obtido um GLB redistribu�vel.
- [Anatomia Bovina - Biosphera](https://biosphera3d.com.br/produto/software-anatomia-bovina-3d/): software de consulta; n�o foi confirmado fornecimento de malhas para incorporar ao site.
- [glTF 2.0 - Khronos](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html): formato do GLB.

O bovino externo j� usado no site n�o cont�m os volumes necess�rios. N�o foi localizado e licenciado nesta etapa um arquivo que entregue os cortes brasileiros individualizados. Ser� necess�rio fornecer/adquirir um arquivo adequado ou produzir essa modelagem.

## Verifica��o de entrada

Ap�s receber o GLB e preencher o manifesto:

```powershell
node tools/validate-bovine-asset.mjs assets/bovine/manifest.json caminho/modelo.glb
```

O comando verifica metadados e v�nculos. Ele **n�o certifica anatomia, superf�cies fechadas, aus�ncia de interse��es, validade jur�dica da licen�a ou renderiza��o**. Tamb�m executar o Khronos glTF Validator e conferir visualmente o modelo no Blender e no navegador.

O manifesto de rascunho deve ser rejeitado: ainda n�o tem geometria, licen�a ou revis�o. Isso impede trat�-lo como uma entrega anat�mica pronta.

