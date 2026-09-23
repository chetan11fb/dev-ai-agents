# DEV-AI Node.js bootstrap for Windows
# Run from an elevated PowerShell when machine-level installation is required.
$ErrorActionPreference = "Stop"

function Test-Node {
  $node = Get-Command node -ErrorAction SilentlyContinue
  $npm = Get-Command npm -ErrorAction SilentlyContinue
  if ($node -and $npm) {
    Write-Host "Node: $(& node -v)"
    Write-Host "npm : $(& npm -v)"
    return $true
  }
  return $false
}

if (-not (Test-Node)) {
  $winget = Get-Command winget -ErrorAction SilentlyContinue
  if (-not $winget) {
    throw "Node.js/npm are missing and winget is unavailable. Install Node.js LTS from the official Node.js distribution, then reopen VS Code."
  }

  Write-Host "Installing Node.js LTS with winget..."
  winget install --id OpenJS.NodeJS.LTS --exact --silent --accept-package-agreements --accept-source-agreements

  # Refresh PATH for the current PowerShell process.
  $machinePath = [Environment]::GetEnvironmentVariable("Path","Machine")
  $userPath = [Environment]::GetEnvironmentVariable("Path","User")
  $env:Path = "$machinePath;$userPath"
}

if (-not (Test-Node)) {
  throw "Node.js installation completed but node/npm are not visible in this terminal. Close and reopen the VS Code terminal and run the verification again."
}

Write-Host ""
Write-Host "DEV-AI runtime verification:"
node -v
npm -v
where.exe node
where.exe npm
