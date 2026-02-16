# ============================================================
# PREMUNIA CRM - VERIFICATION SCRIPT (Windows PowerShell)
# Vérifie que tout est prêt pour le déploiement
# ============================================================

Write-Host "🔍 PREMUNIA CRM - Verification Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour vérifier les fichiers
function Check-File {
    param([string]$FilePath)
    if (Test-Path $FilePath) {
        Write-Host "✓ $FilePath exists" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ $FilePath missing" -ForegroundColor Red
        return $false
    }
}

# Fonction pour vérifier les dossiers
function Check-Dir {
    param([string]$DirPath)
    if (Test-Path $DirPath -PathType Container) {
        Write-Host "✓ $DirPath/ directory exists" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ $DirPath/ directory missing" -ForegroundColor Red
        return $false
    }
}

Write-Host "📁 Checking project structure..." -ForegroundColor Yellow
Check-File "package.json"
Check-File ".env.local"
Check-File ".env.example"
Check-File "netlify.toml"
Check-File "vite.config.ts"
Check-File "tsconfig.json"
Check-File "server.ts"
Check-Dir "src"
Check-Dir "scripts"
Check-Dir "netlify/functions"

Write-Host ""
Write-Host "📄 Checking migration files..." -ForegroundColor Yellow
Check-File "scripts/01-init-neon.sql"
Check-File "scripts/init-neon.ts"
Check-File "scripts/test-neon-connection.ts"

Write-Host ""
Write-Host "📚 Checking documentation..." -ForegroundColor Yellow
Check-File "MIGRATION_GUIDE.md"
Check-File "DEPLOYMENT_CHECKLIST.md"
Check-File "README_NEON_NETLIFY.md"

Write-Host ""
Write-Host "🔧 Checking critical source files..." -ForegroundColor Yellow
Check-File "src/lib/postgres-client.ts"
Check-File "src/utils/postgres.tsx"
Check-File "src/app/pages/LandingPage.tsx"
Check-File "src/app/pages/SignUp.tsx"
Check-File "src/app/pages/SignIn.tsx"
Check-File "src/app/pages/AdminLeads.tsx"
Check-File "netlify/functions/api.ts"

Write-Host ""
Write-Host "🔐 Checking environment variables..." -ForegroundColor Yellow
$envContent = Get-Content ".env.local" -ErrorAction SilentlyContinue

if ($envContent -match "DATABASE_URL") {
    Write-Host "✓ DATABASE_URL configured" -ForegroundColor Green
} else {
    Write-Host "✗ DATABASE_URL not found in .env.local" -ForegroundColor Red
}

if ($envContent -match "JWT_SECRET") {
    Write-Host "✓ JWT_SECRET configured" -ForegroundColor Green
} else {
    Write-Host "✗ JWT_SECRET not found in .env.local" -ForegroundColor Red
}

if ($envContent -match "VITE_API_URL") {
    Write-Host "✓ VITE_API_URL configured" -ForegroundColor Green
} else {
    Write-Host "✗ VITE_API_URL not found in .env.local" -ForegroundColor Red
}

Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules" -PathType Container) {
    Write-Host "✓ node_modules/ exists" -ForegroundColor Green
} else {
    Write-Host "! node_modules/ not found - run 'npm install'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Verification complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review MIGRATION_GUIDE.md"
Write-Host "2. Run: npm run init-db"
Write-Host "3. Run: npm run dev"
Write-Host "4. Test the application"
Write-Host "5. Follow DEPLOYMENT_CHECKLIST.md to deploy"
Write-Host ""
