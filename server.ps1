# PowerShell Lightweight Web Server + MicroSIP Live Ingestion API
$port = 5000
$path = $PSScriptRoot
if (-not $path) { $path = (Get-Location).Path }

$recordingsPath = "C:\Users\wed\Desktop\Recordings"
if (-not (Test-Path $recordingsPath)) {
    New-Item -ItemType Directory -Path $recordingsPath -Force | Out-Null
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " HomeCare AI Copilot Server + MicroSIP Bridge is running!" -ForegroundColor Cyan
    Write-Host " URL: $prefix" -ForegroundColor Yellow
    Write-Host " MicroSIP Recordings Folder: $recordingsPath" -ForegroundColor Green
    Write-Host " Press Ctrl+C in this window to stop the server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Green

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $rawUrl = $request.Url.LocalPath

            # Handle API: Get Latest MicroSIP Recording
            if ($rawUrl -eq "/api/latest-recording") {
                $response.ContentType = "application/json; charset=utf-8"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Cache-Control", "no-cache")

                $files = Get-ChildItem -Path $recordingsPath -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -in @(".mp3", ".wav", ".ogg", ".m4a") } | Sort-Object LastWriteTime -Descending

                if ($files -and $files.Count -gt 0) {
                    $latest = $files[0]
                    $bytes = [System.IO.File]::ReadAllBytes($latest.FullName)
                    $b64 = [System.Convert]::ToBase64String($bytes)
                    $mime = if ($latest.Extension -eq ".mp3") { "audio/mp3" } elseif ($latest.Extension -eq ".wav") { "audio/wav" } else { "audio/ogg" }

                    $jsonObj = @{
                        success = $true
                        fileName = $latest.Name
                        fileSize = $latest.Length
                        lastModified = $latest.LastWriteTime.ToString("o")
                        mimeType = $mime
                        base64 = $b64
                    }
                } else {
                    $jsonObj = @{
                        success = $false
                        message = "No recording files found in Desktop/Recordings folder yet. Make sure MicroSIP is recording calls."
                    }
                }
                $jsonStr = ConvertTo-Json $jsonObj
                $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                $response.ContentLength64 = $jsonBytes.Length
                $response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
                $response.Close()
                continue
            }

            # Handle API: Check MicroSIP Status
            if ($rawUrl -eq "/api/microsip-status") {
                $response.ContentType = "application/json; charset=utf-8"
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Cache-Control", "no-cache")

                $proc = Get-Process -Name 'microsip' -ErrorAction SilentlyContinue
                $files = Get-ChildItem -Path $recordingsPath -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -in @(".mp3", ".wav", ".ogg", ".m4a") } | Sort-Object LastWriteTime -Descending

                $latestInfo = $null
                if ($files -and $files.Count -gt 0) {
                    $latestInfo = @{
                        name = $files[0].Name
                        size = $files[0].Length
                        time = $files[0].LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
                    }
                }

                $statusObj = @{
                    isMicroSipRunning = [bool]$proc
                    recordingsFolder = $recordingsPath
                    totalRecordings = if ($files) { $files.Count } else { 0 }
                    latest = $latestInfo
                }

                $jsonStr = ConvertTo-Json $statusObj
                $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                $response.ContentLength64 = $jsonBytes.Length
                $response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
                $response.Close()
                continue
            }

            # Static File Serving
            if ($rawUrl -eq "/") { $rawUrl = "/index.html" }
            $filePath = Join-Path $path $rawUrl.TrimStart('/')

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = "text/plain"
                switch ($ext) {
                    ".html" { $mime = "text/html; charset=utf-8" }
                    ".css"  { $mime = "text/css; charset=utf-8" }
                    ".js"   { $mime = "application/javascript; charset=utf-8" }
                    ".json" { $mime = "application/json; charset=utf-8" }
                    ".png"  { $mime = "image/png" }
                    ".svg"  { $mime = "image/svg+xml" }
                    ".ico"  { $mime = "image/x-icon" }
                }

                $response.ContentType = $mime
                $response.AddHeader("Cache-Control", "no-cache")
                $response.AddHeader("Access-Control-Allow-Origin", "*")

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
            $response.Close()
        } catch {
            Write-Host "Request error: $_" -ForegroundColor Yellow
            try { $response.Close() } catch {}
        }
    }
} catch {
    Write-Host "Server stopped: $_" -ForegroundColor Red
} finally {
    try { $listener.Stop() } catch {}
}
