param(
  [Parameter(Mandatory = $true)][string]$Url,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Width = 1440,
  [int]$Height = 1000,
  [int]$Wait = 8000
)

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outPath = [System.IO.Path]::GetFullPath($Out)
$dir = Split-Path -Parent $outPath
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
if (Test-Path $outPath) { Remove-Item $outPath -Force }

$ud = Join-Path $env:TEMP ("edge-shot-" + [guid]::NewGuid().ToString("N"))
$sep = if ($Url.Contains("?")) { "&" } else { "?" }
$target = $Url + $sep + "shot=" + [guid]::NewGuid().ToString("N")

& $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
  --force-prefers-reduced-motion --user-data-dir="$ud" --window-size="$Width,$Height" `
  --virtual-time-budget=$Wait --screenshot="$outPath" "$target" 2>$null | Out-Null

$deadline = (Get-Date).AddSeconds(45)
while (-not (Test-Path $outPath) -and (Get-Date) -lt $deadline) {
  Start-Sleep -Milliseconds 250
}

if (Test-Path $outPath) {
  $size = (Get-Item $outPath).Length
  Remove-Item $ud -Recurse -Force -ErrorAction SilentlyContinue
  "captured $outPath ($size bytes)"
} else {
  throw "capture failed: $outPath"
}
