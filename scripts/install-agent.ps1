param([string]$Component="dev-ai-fullstack-engineer",[string]$TargetRoot=(Get-Location).Path,[switch]$Force)
$ErrorActionPreference="Stop"
$Base="https://raw.githubusercontent.com/chetan11fb/dev-ai-agents/main"
$registry=(Invoke-WebRequest -UseBasicParsing "$Base/registry/marketplace.json").Content|ConvertFrom-Json
$item=$registry.components|Where-Object id -eq $Component|Select-Object -First 1
if(-not $item){throw "Unknown DEV-AI component: $Component"}
$target=Join-Path $TargetRoot $item.target
New-Item -ItemType Directory -Force -Path (Split-Path $target)|Out-Null
if((Test-Path $target)-and-not $Force){throw "Target exists: $target. Use -Force only after review."}
$content=(Invoke-WebRequest -UseBasicParsing "$Base/$($item.path)").Content
Set-Content -Path $target -Value $content -Encoding utf8
Write-Host "Installed $Component -> $target"
