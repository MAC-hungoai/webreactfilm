# PowerShell script để chạy cả 3 phần dự án

Write-Host "======================================"
Write-Host "Netflix Clone - Multi-part Startup"
Write-Host "======================================"
Write-Host ""

# Kiểm tra nếu các thư mục tồn tại
if (-not (Test-Path "backend") -or -not (Test-Path "frontend") -or -not (Test-Path "admin")) {
    Write-Host "Error: Missing backend, frontend, or admin directories" -ForegroundColor Red
    exit 1
}

# Function để mở terminal mới
function Start-DevServer {
    param(
        [string]$Name,
        [string]$Path,
        [int]$Port
    )
    
    $scriptBlock = {
        param($p, $n)
        Push-Location $p
        Write-Host "Starting $n (Port $port)..." -ForegroundColor Green
        npm run dev
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $scriptBlock, $Path, $Name
}

Write-Host "Starting services in separate terminals..." -ForegroundColor Cyan
Write-Host ""

Start-DevServer -Name "Backend" -Path "backend" -Port 3001
Start-Sleep -Seconds 2

Start-DevServer -Name "Frontend" -Path "frontend" -Port 3000
Start-Sleep -Seconds 2

Start-DevServer -Name "Admin" -Path "admin" -Port 3002

Write-Host ""
Write-Host "======================================"
Write-Host "All services started!" -ForegroundColor Green
Write-Host "======================================"
Write-Host ""
Write-Host "Frontend:  http://localhost:3000"
Write-Host "Backend:   http://localhost:3001"
Write-Host "Admin:     http://localhost:3002"
Write-Host ""
Write-Host "Check the terminal windows for each service"
Write-Host ""
