#!/bin/bash
# Build script cho Netflix Clone

echo "======================================"
echo "Netflix Clone - Build All"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function để cài npm dependencies
install_deps() {
    local dir=$1
    local name=$2
    
    echo -e "${YELLOW}Installing $name dependencies...${NC}"
    cd "$dir"
    
    if [ "$dir" = "backend" ]; then
        npm install --legacy-peer-deps --no-optional
    else
        npm install
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $name installed successfully${NC}"
    else
        echo -e "${RED}✗ $name installation failed${NC}"
        return 1
    fi
    cd ..
}

# Function để build
build_project() {
    local dir=$1
    local name=$2
    
    echo -e "${YELLOW}Building $name...${NC}"
    cd "$dir"
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $name built successfully${NC}"
    else
        echo -e "${RED}✗ $name build failed${NC}"
        return 1
    fi
    cd ..
}

# Cài dependencies cho cả 3 phần
echo "Step 1: Installing dependencies..."
echo ""

install_deps "backend" "Backend"
install_deps "frontend" "Frontend"
install_deps "admin" "Admin"

echo ""
echo "Step 2: Building projects..."
echo ""

# Build cả 3 phần
build_project "backend" "Backend"
build_project "frontend" "Frontend"
build_project "admin" "Admin"

echo ""
echo -e "${GREEN}======================================"
echo "Build completed successfully!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Configure .env.local files in each directory"
echo "2. Setup MongoDB local"
echo "3. Setup Google OAuth"
echo "4. Setup GitHub OAuth"
echo "5. Run: npm run dev in each terminal"
echo "======================================"
