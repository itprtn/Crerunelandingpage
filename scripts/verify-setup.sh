#!/bin/bash

# Premunia CRM - Setup Verification Script
# Vérifie que tout est correctement configuré

echo "🔍 Vérification de la configuration Premunia CRM..."
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2 trouvé"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $2 introuvable"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Fichier trouvé: $1"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} Fichier manquant: $1"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Function to check env variable
check_env() {
    if [ -z "${!1}" ]; then
        echo -e "${YELLOW}⚠${NC}  Var d'env manquante: $1"
        ((CHECKS_FAILED++))
        return 1
    else
        echo -e "${GREEN}✓${NC} Var d'env définie: $1"
        ((CHECKS_PASSED++))
        return 0
    fi
}

echo -e "${BLUE}1️⃣  Vérification des outils...${NC}"
echo ""

# Check Node.js
check_command "node" "Node.js"
check_command "npm" "NPM"
check_command "git" "Git"

echo ""
echo -e "${BLUE}2️⃣  Vérification des fichiers de configuration...${NC}"
echo ""

# Check configuration files
check_file "package.json"
check_file "netlify.toml"
check_file ".env.example"
check_file "tsconfig.json"

echo ""
echo -e "${BLUE}3️⃣  Vérification des scripts SQL...${NC}"
echo ""

check_file "scripts/01-init-supabase.sql"

echo ""
echo -e "${BLUE}4️⃣  Vérification de la structure du projet...${NC}"
echo ""

# Check directories
check_file "src/app/App.tsx"
check_file "src/app/pages/LandingPage.tsx"
check_file "src/app/pages/SignIn.tsx"
check_file "src/app/pages/SignUp.tsx"
check_file "src/app/pages/Admin.tsx"
check_file "supabase/functions/server/index.tsx"

echo ""
echo -e "${BLUE}5️⃣  Vérification des dépendances installées...${NC}"
echo ""

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules trouvé"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠${NC}  node_modules non trouvé - exécuter 'npm install'"
    ((CHECKS_FAILED++))
fi

echo ""
echo -e "${BLUE}6️⃣  Vérification des variables d'environnement...${NC}"
echo ""

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} Fichier .env.local trouvé"
    ((CHECKS_PASSED++))
    
    # Load env file
    source .env.local 2>/dev/null
    
    # Check env vars
    check_env "VITE_SUPABASE_URL"
    check_env "VITE_SUPABASE_ANON_KEY"
    check_env "VITE_API_URL"
else
    echo -e "${YELLOW}⚠${NC}  Fichier .env.local manquant"
    echo -e "${YELLOW}   Créez-le en copiant .env.example${NC}"
    ((CHECKS_FAILED++))
fi

echo ""
echo -e "${BLUE}7️⃣  Vérification de Git...${NC}"
echo ""

if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Repo Git détecté"
    ((CHECKS_PASSED++))
    
    # Check if files are committed
    if git status --porcelain | grep -q "^?? scripts/01-init-supabase.sql"; then
        echo -e "${YELLOW}⚠${NC}  scripts/01-init-supabase.sql non commité"
        ((CHECKS_FAILED++))
    else
        echo -e "${GREEN}✓${NC} Fichiers de config commitées"
        ((CHECKS_PASSED++))
    fi
else
    echo -e "${RED}✗${NC} Repo Git non trouvé"
    ((CHECKS_FAILED++))
fi

echo ""
echo "=================================================="
echo -e "${BLUE}📊 RÉSUMÉ:${NC}"
echo -e "${GREEN}✓ Vérifications réussies: $CHECKS_PASSED${NC}"

if [ $CHECKS_FAILED -gt 0 ]; then
    echo -e "${RED}✗ Vérifications échouées: $CHECKS_FAILED${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Certaines vérifications ont échoué.${NC}"
    echo "Consultez le guide SETUP_COMPLETE.md pour des instructions."
    exit 1
else
    echo ""
    echo -e "${GREEN}🎉 Tout est prêt !${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "1. Créer un projet Supabase: https://supabase.com"
    echo "2. Exécuter le script SQL dans Supabase SQL Editor"
    echo "3. Lancer le serveur de dev: npm run dev"
    echo "4. Configurer Netlify: https://netlify.com"
    echo ""
    echo "Documentation:"
    echo "- Setup: SETUP_COMPLETE.md"
    echo "- Deployment: DEPLOYMENT_NETLIFY.md"
    echo "- Database: DATABASE_SCHEMA.md"
    exit 0
fi
