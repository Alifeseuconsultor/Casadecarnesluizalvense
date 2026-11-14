param(
    [string]$BlenderPath = 'blender',
    [string]$SkillDirectory = (Join-Path $env:USERPROFILE '.agents\skills\blender-texture-baking')
)
$ErrorActionPreference = 'Stop'
$target = Join-Path $SkillDirectory 'scripts\bake_maps.py'
$source = Join-Path $PSScriptRoot 'bake_maps.py'
$originalHash = '16B27115C8BB19F9D4B2162A67467DF9B3F9F720DCC365497A7443BE9CAB5E0A'
if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
    throw "Skill instalada n�o encontrada em: $target"
}
$newHash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
$currentHash = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
if ($currentHash -eq $newHash) {
    Write-Output 'Esta corre��o j� est� aplicada.'
    exit 0
}
if ($currentHash -ne $originalHash) {
    throw 'A skill instalada mudou desde a revis�o. Interrompido para preservar suas altera��es.'
}
if (-not (Get-Command $BlenderPath -ErrorAction SilentlyContinue)) {
    throw 'Blender n�o encontrado. Informe -BlenderPath com o caminho completo do blender.exe para validar antes de aplicar.'
}
$testFile = Join-Path $PSScriptRoot 'tests\blender_integration.py'
& $BlenderPath --background --factory-startup --python-exit-code 1 --python $testFile
if ($LASTEXITCODE -ne 0) { throw 'A valida��o no Blender falhou. A instala��o foi preservada.' }
# Recheck after the test so an update running concurrently is not overwritten.
if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $originalHash) {
    throw 'A instala��o mudou durante a valida��o. Nenhum arquivo ser� substitu�do.'
}
$backup = "$target.before-state-fix-$(Get-Date -Format 'yyyyMMdd-HHmmss-fff').bak"
$staging = "$target.staging-$([guid]::NewGuid().ToString('N'))"
try {
    Copy-Item -LiteralPath $source -Destination $staging -ErrorAction Stop
    if ((Get-FileHash -LiteralPath $staging -Algorithm SHA256).Hash -ne $newHash) {
        throw 'A c�pia tempor�ria n�o corresponde � corre��o. Instala��o preservada.'
    }
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $originalHash) {
        throw 'A instala��o mudou antes da substitui��o. Instala��o preservada.'
    }
    # Same-directory atomic replacement: failed copying never truncates the installed file.
    [System.IO.File]::Replace($staging, $target, $backup)
} finally {
    if (Test-Path -LiteralPath $staging) { Remove-Item -LiteralPath $staging -Force }
}
if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $newHash) {
    throw "O arquivo mudou ap�s a substitui��o. Backup original preservado em: $backup"
}
Write-Output "Corre��o aplicada. Backup: $backup"
Write-Output 'O selo p�blico do Snyk depende de uma nova auditoria no reposit�rio original.'
