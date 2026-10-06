#!/bin/bash
# Quick setup & test script for EFFETMER local development

echo "🚀 EFFETMER Local Setup & Test"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files exist
echo -e "${YELLOW}Checking environment files...${NC}"

if [ ! -f "server/.env" ]; then
    echo -e "${RED}✗ server/.env not found${NC}"
    echo "  Copy server/.env.example to server/.env and fill in values"
    exit 1
fi

if [ ! -f "my-app/.env" ]; then
    echo -e "${RED}✗ my-app/.env not found${NC}"
    echo "  Copy my-app/.env.example to my-app/.env"
    exit 1
fi

echo -e "${GREEN}✓ Environment files found${NC}"

# Install backend dependencies
echo -e "\n${YELLOW}Installing backend dependencies...${NC}"
cd server
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..

# Install frontend dependencies
echo -e "\n${YELLOW}Installing frontend dependencies...${NC}"
cd my-app
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..

echo -e "\n${GREEN}=================================${NC}"
echo -e "${GREEN}✓ Setup complete!${NC}"
echo -e "${GREEN}=================================${NC}"

echo -e "\n${YELLOW}To start development:${NC}"
echo -e "  Terminal 1: cd server && npm run dev"
echo -e "  Terminal 2: cd my-app && npm start"

echo -e "\n${YELLOW}Verify backend health:${NC}"
echo -e "  curl http://localhost:5000/api/health"

echo -e "\n${YELLOW}Frontend will open at:${NC}"
echo -e "  http://localhost:3000"
