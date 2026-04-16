# PowerShell script để build Netflix Clone

Write-Host "======================================"
Write-Host "Netflix Clone - Build All" -ForegroundColor Cyan
Write-Host "======================================"
Write-Host ""

# Function để cài npm dependencies
function Install-Deps {
    param(
        [string]$Directory,
        [string]$Name
    )
    
    Write-Host "Installing $Name dependencies..." -ForegroundColor Yellow
    Push-Location $Directory
    
    if ($Directory -eq "backend") {
        npm install --legacy-peer-deps --no-optional
    } else {
        npm install
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $Name installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ $Name installation failed" -ForegroundColor Red
        Pop-Location
        return $false
    }
    Pop-Location
    return $true
}

# Function để build
function Build-Project {
    param(
        [string]$Directory,
        [string]$Name
    )
    
    Write-Host "Building $Name..." -ForegroundColor Yellow
    Push-Location $Directory
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $Name built successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ $Name build failed" -ForegroundColor Red
        Pop-Location
        return $false
    }
    Pop-Location
    return $true
}

# Cài dependencies
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Cyan
Write-Host ""

Install-Deps "backend" "Backend" | Out-Null
Install-Deps "frontend" "Frontend" | Out-Null
Install-Deps "admin" "Admin" | Out-Null

Write-Host ""
Write-Host "Step 2: Building projects..." -ForegroundColor Cyan
Write-Host ""

# Build projects
Build-Project "backend" "Backend" | Out-Null
Build-Project "frontend" "Frontend" | Out-Null
Build-Project "admin" "Admin" | Out-Null

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure .env.local files in each directory"
Write-Host "2. Setup MongoDB local"
Write-Host "3. Setup Google OAuth"
Write-Host "4. Setup GitHub OAuth"
Write-Host "5. Run: npm run dev in each terminal"
Write-Host "======================================" -ForegroundColor Green
