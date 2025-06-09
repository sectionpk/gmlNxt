#!/bin/bash

echo "🧪 Testing Next.js Migration..."
echo "================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_build() {
    echo -e "${YELLOW}Testing build process...${NC}"
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Build successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Build failed${NC}"
        return 1
    fi
}

test_server_start() {
    echo -e "${YELLOW}Testing server startup...${NC}"
    # Start server in background
    npm run dev > /dev/null 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Check if server is running
    if curl -s http://localhost:4000 > /dev/null; then
        echo -e "${GREEN}✅ Server started successfully${NC}"
        kill $SERVER_PID 2>/dev/null
        return 0
    else
        echo -e "${RED}❌ Server failed to start${NC}"
        kill $SERVER_PID 2>/dev/null
        return 1
    fi
}

test_routes() {
    echo -e "${YELLOW}Testing route accessibility...${NC}"
    
    # Start server for testing
    npm run dev > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 5
    
    routes=("/" "/error" "/backend" "/load" "/userentry" "/lettus" "/codeload")
    failed_routes=()
    
    for route in "${routes[@]}"; do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:4000$route | grep -q "200\|404"; then
            echo -e "${GREEN}✅ Route $route accessible${NC}"
        else
            echo -e "${RED}❌ Route $route failed${NC}"
            failed_routes+=($route)
        fi
    done
    
    kill $SERVER_PID 2>/dev/null
    
    if [ ${#failed_routes[@]} -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

test_api_routes() {
    echo -e "${YELLOW}Testing API routes...${NC}"
    
    # Start server for testing
    npm run dev > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 5
    
    api_routes=("/api/backend/check-auth")
    failed_apis=()
    
    for api in "${api_routes[@]}"; do
        response=$(curl -s -w "%{http_code}" http://localhost:4000$api)
        if echo "$response" | grep -q "200\|401\|403"; then
            echo -e "${GREEN}✅ API $api responding${NC}"
        else
            echo -e "${RED}❌ API $api failed${NC}"
            failed_apis+=($api)
        fi
    done
    
    kill $SERVER_PID 2>/dev/null
    
    if [ ${#failed_apis[@]} -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

test_dependencies() {
    echo -e "${YELLOW}Testing dependencies...${NC}"
    
    if npm list > /dev/null 2>&1; then
        echo -e "${GREEN}✅ All dependencies installed${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing dependencies${NC}"
        return 1
    fi
}

test_typescript() {
    echo -e "${YELLOW}Testing TypeScript compilation...${NC}"
    
    if npx tsc --noEmit > /dev/null 2>&1; then
        echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
        return 0
    else
        echo -e "${RED}❌ TypeScript errors found${NC}"
        return 1
    fi
}

# Run all tests
echo "Starting comprehensive migration tests..."
echo ""

total_tests=0
passed_tests=0

# Test 1: Dependencies
((total_tests++))
if test_dependencies; then
    ((passed_tests++))
fi
echo ""

# Test 2: TypeScript
((total_tests++))
if test_typescript; then
    ((passed_tests++))
fi
echo ""

# Test 3: Build
((total_tests++))
if test_build; then
    ((passed_tests++))
fi
echo ""

# Test 4: Server Start
((total_tests++))
if test_server_start; then
    ((passed_tests++))
fi
echo ""

# Test 5: Routes
((total_tests++))
if test_routes; then
    ((passed_tests++))
fi
echo ""

# Test 6: API Routes
((total_tests++))
if test_api_routes; then
    ((passed_tests++))
fi
echo ""

# Summary
echo "================================"
echo "🧪 Test Results Summary"
echo "================================"
echo -e "Total Tests: $total_tests"
echo -e "Passed: ${GREEN}$passed_tests${NC}"
echo -e "Failed: ${RED}$((total_tests - passed_tests))${NC}"

if [ $passed_tests -eq $total_tests ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! Migration successful!${NC}"
    echo ""
    echo "✅ Your Next.js application is ready!"
    echo "🚀 Start with: npm run dev"
    echo "🌐 Access at: http://localhost:4000"
    echo "🔧 Backend at: http://localhost:4000/backend (admin/admin123)"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some tests failed. Please check the issues above.${NC}"
    echo ""
    echo "🔍 Common solutions:"
    echo "- Run: npm install"
    echo "- Check MongoDB is running"
    echo "- Verify port 4000 is available"
    echo "- Check .env.local configuration"
    exit 1
fi