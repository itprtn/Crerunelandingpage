#!/bin/bash

# ============================================================
# PREMUNIA CRM - VERIFICATION SCRIPT
# Vérifie que tout est prêt pour le déploiement
# ============================================================

echo "🔍 PREMUNIA CRM - Verification Script"
echo "======================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour vérifier les fichiers
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 missing"
        return 1
    fi
}

# Fonction pour vérifier les dossiers
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/ directory exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ directory missing"
        return 1
    fi
}

echo "📁 Checking project structure..."
check_file "package.json"
check_file ".env.local"
check_file ".env.example"
check_file "netlify.toml"
check_file "vite.config.ts"
check_file "tsconfig.json"
check_file "server.ts"
check_dir "src"
check_dir "scripts"
check_dir "netlify/functions"

echo ""
echo "📄 Checking migration files..."
check_file "scripts/01-init-neon.sql"
check_file "scripts/init-neon.ts"
check_file "scripts/test-neon-connection.ts"

echo ""
echo "📚 Checking documentation..."
check_file "MIGRATION_GUIDE.md"
check_file "DEPLOYMENT_CHECKLIST.md"
check_file "README_NEON_NETLIFY.md"

echo ""
echo "🔧 Checking critical source files..."
check_file "src/lib/postgres-client.ts"
check_file "src/utils/postgres.tsx"
check_file "src/app/pages/LandingPage.tsx"
check_file "src/app/pages/SignUp.tsx"
check_file "src/app/pages/SignIn.tsx"
check_file "src/app/pages/AdminLeads.tsx"
check_file "netlify/functions/api.ts"

echo ""
echo "🔐 Checking environment variables..."
if grep -q "DATABASE_URL" .env.local; then
    echo -e "${GREEN}✓${NC} DATABASE_URL configured"
else
    echo -e "${RED}✗${NC} DATABASE_URL not found in .env.local"
fi

if grep -q "JWT_SECRET" .env.local; then
    echo -e "${GREEN}✓${NC} JWT_SECRET configured"
else
    echo -e "${RED}✗${NC} JWT_SECRET not found in .env.local"
fi

if grep -q "VITE_API_URL" .env.local; then
    echo -e "${GREEN}✓${NC} VITE_API_URL configured"
else
    echo -e "${RED}✗${NC} VITE_API_URL not found in .env.local"
fi

echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules/ exists"
else
    echo -e "${YELLOW}!${NC} node_modules/ not found - run 'npm install'"
fi

echo ""
echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Review MIGRATION_GUIDE.md"
echo "2. Run: npm run init-db"
echo "3. Run: npm run dev"
echo "4. Test the application"
echo "5. Follow DEPLOYMENT_CHECKLIST.md to deploy"
echo ""
