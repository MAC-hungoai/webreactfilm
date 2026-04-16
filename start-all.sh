#!/bin/bash
# Script để chạy cả 3 phần dự án cùng lúc

echo "======================================"
echo "Netflix Clone - Multi-part Startup"
echo "======================================"
echo ""

# Kiểm tra nếu các thư mục tồn tại
if [ ! -d "backend" ] || [ ! -d "frontend" ] || [ ! -d "admin" ]; then
    echo "Error: Missing backend, frontend, or admin directories"
    exit 1
fi

echo "Starting Backend (Port 3001)..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "Starting Frontend (Port 3000)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Starting Admin (Port 3002)..."
cd ../admin
npm run dev &
ADMIN_PID=$!

echo ""
echo "======================================"
echo "All services started!"
echo "======================================"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:3001"
echo "Admin:     http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID $ADMIN_PID" EXIT

# Wait for all processes
wait
