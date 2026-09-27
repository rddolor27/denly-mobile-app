# Build the installable Denly demo APK on Windows (arm64-v8a, production JS embedded, debug-signed).
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\build-android-apk.ps1
#
# Why the debug variant: from this workspace path the release (RelWithDebInfo) native build
# exceeds Windows' 260-character path limit (see plugins/with-short-native-build-dirs.js). The
# Debug native build fits, and -PdenlyEmbedJs makes it embed the production JS bundle, so the APK
# runs without Metro. Build from a shorter folder or enable Windows long paths to use
# assembleRelease instead. Output: dist/denly-demo-<version>-arm64.apk (git-ignored).
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo
if (-not $env:EXPO_PUBLIC_API_URL) { $env:EXPO_PUBLIC_API_URL = 'https://api.example.invalid' }  # frontend-only demo
$env:CI = '1'

pnpm exec expo prebuild --platform android --clean --no-install
if ($LASTEXITCODE -ne 0) { throw 'expo prebuild failed' }

Push-Location android
try {
  .\gradlew.bat assembleDebug --no-daemon '-PreactNativeArchitectures=arm64-v8a' '-PdenlyEmbedJs'
  if ($LASTEXITCODE -ne 0) { throw 'gradle assembleDebug failed' }
} finally { Pop-Location }

$version = (Get-Content app.json -Raw | ConvertFrom-Json).expo.version
New-Item -ItemType Directory -Force dist | Out-Null
$out = "dist\denly-demo-$version-arm64.apk"
Copy-Item android\app\build\outputs\apk\debug\app-debug.apk $out -Force
Write-Host "APK: $out"
