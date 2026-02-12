#!/bin/bash

# Supabase Migration Runner
# This script helps you run the database migration on Supabase
# 
# Options:
#   run       - Display SQL to copy/paste into Supabase dashboard
#   auto      - Run migration automatically via Supabase CLI (if installed)
#   help      - Show this help message

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MIGRATION_FILE="$SCRIPT_DIR/01-init-supabase.sql"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Supabase Database Migration Runner              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
  echo -e "${RED}✗ Migration file not found: $MIGRATION_FILE${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Found migration file: 01-init-supabase.sql${NC}"
echo ""

# Show help
show_help() {
  echo -e "${YELLOW}Usage:${NC} bash $0 [OPTION]"
  echo ""
  echo -e "${YELLOW}Options:${NC}"
  echo "  run      Display SQL to copy/paste into Supabase dashboard (default)"
  echo "  auto     Run migration automatically via Supabase CLI"
  echo "  help     Show this help message"
  echo ""
  echo -e "${YELLOW}Examples:${NC}"
  echo "  bash $0              # Shows SQL code to copy"
  echo "  bash $0 run          # Shows SQL code to copy"
  echo "  bash $0 auto         # Runs via Supabase CLI (if installed)"
  echo "  bash $0 help         # Shows this help"
  echo ""
  echo -e "${YELLOW}Manual Steps:${NC}"
  echo "  1. Run: bash $0 run"
  echo "  2. Copy the SQL code displayed"
  echo "  3. Go to: https://supabase.com/dashboard"
  echo "  4. Open your project > SQL Editor"
  echo "  5. Create a new query and paste the SQL"
  echo "  6. Run the query"
  echo ""
}

# Run migration via manual copy/paste
run_manual() {
  echo -e "${YELLOW}📋 Manual Migration Instructions${NC}"
  echo ""
  echo -e "${YELLOW}Follow these steps:${NC}"
  echo "  1. Go to: https://supabase.com/dashboard"
  echo "  2. Select your project (gfedfklnzkgifpdxrybh)"
  echo "  3. Click 'SQL Editor' in the left sidebar"
  echo "  4. Click 'New Query'"
  echo "  5. Copy the SQL code below"
  echo "  6. Paste it into the SQL Editor"
  echo "  7. Click 'Run'"
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}SQL CODE - Copy everything below this line:${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  cat "$MIGRATION_FILE"
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}End of SQL Code${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${GREEN}✓ SQL code displayed above${NC}"
  echo -e "${YELLOW}📌 Next:${NC} Copy the SQL and paste it into your Supabase SQL Editor"
  echo ""
}

# Run migration via Supabase CLI
run_auto() {
  echo -e "${YELLOW}🤖 Automatic Migration via Supabase CLI${NC}"
  echo ""

  # Check if supabase CLI is installed
  if ! command -v supabase &> /dev/null; then
    echo -e "${RED}✗ Supabase CLI is not installed${NC}"
    echo ""
    echo -e "${YELLOW}Install it with:${NC}"
    echo "  npm install -g supabase"
    echo ""
    echo -e "${YELLOW}Or use manual migration:${NC}"
    echo "  bash $0 run"
    echo ""
    exit 1
  fi

  echo -e "${GREEN}✓ Supabase CLI found${NC}"
  echo ""

  # Check if linked to Supabase
  if ! supabase projects list &> /dev/null; then
    echo -e "${RED}✗ Not linked to a Supabase project${NC}"
    echo ""
    echo -e "${YELLOW}Link your project:${NC}"
    echo "  supabase link --project-ref gfedfklnzkgifpdxrybh"
    echo ""
    exit 1
  fi

  echo -e "${GREEN}✓ Linked to Supabase project${NC}"
  echo ""
  echo -e "${YELLOW}Running migration...${NC}"
  echo ""

  # Run the migration
  if supabase db push "$MIGRATION_FILE"; then
    echo ""
    echo -e "${GREEN}✓ Migration completed successfully!${NC}"
  else
    echo ""
    echo -e "${RED}✗ Migration failed${NC}"
    exit 1
  fi

  echo ""
}

# Parse command line arguments
case "${1:-run}" in
  help)
    show_help
    ;;
  run)
    run_manual
    ;;
  auto)
    run_auto
    ;;
  *)
    echo -e "${RED}Unknown option: $1${NC}"
    echo ""
    show_help
    exit 1
    ;;
esac
