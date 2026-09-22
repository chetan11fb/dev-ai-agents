[CmdletBinding()]
param(
    [switch]$All
)

$ErrorActionPreference = "Stop"

Write-Host "Installing Microsoft Agent Skills..." -ForegroundColor Cyan

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    throw "Node.js/npm/npx is required. Install Node.js 20+ and retry."
}

if ($All) {
    & npx skills add microsoft/skills --all
} else {
    Write-Host "Launching the Microsoft skills selector. Choose only skills required by this repo." -ForegroundColor Yellow
    & npx skills add microsoft/skills
}

if ($LASTEXITCODE -ne 0) {
    throw "Microsoft skills installation failed with exit code $LASTEXITCODE."
}

Write-Host "Microsoft Agent Skills installation completed." -ForegroundColor Green
Write-Host "Restart/reload VS Code if the new skills are not immediately visible."
