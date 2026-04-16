# Netflix Clone - Quick Commands & Cheatsheet

## 🚀 Development Commands

### Start Development Servers

**Cách 1: Chạy riêng lẻ (3 terminals)**
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# http://localhost:3001

# Terminal 2 - Frontend
cd frontend
npm run dev
# http://localhost:3000

# Terminal 3 - Admin
cd admin
npm run dev
# http://localhost:3002
```

**Cách 2: Chạy cùng lúc (PowerShell script)**
```powershell
.\start-all.ps1
# Mở 3 terminal cùng lúc
```

### Build Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start

# Admin
cd admin
npm run build
npm start
```

---

## 🔧 Setup Commands

### First Time Setup

```bash
# 1. Cài dependencies
.\build-all.ps1

# 2. Tạo .env.local files (copy từ .env.example)
copy backend\.env.example backend\.env.local
copy frontend\.env.example frontend\.env.local
copy admin\.env.example admin\.env.local

# 3. Cập nhật .env.local với credentials

# 4. Setup database
cd backend
npx prisma migrate dev --name init
cd ..

# 5. Chạy dev servers
.\start-all.ps1
```

### Install New Package

```bash
# Backend
cd backend
npm install package-name
npm install --legacy-peer-deps package-name

# Frontend / Admin
cd frontend
npm install package-name
```

### Update Dependencies

```bash
# Kiểm tra outdated packages
npm outdated

# Update minor/patch versions
npm update

# Update specific package
npm install package-name@latest

# Update all to latest (caution!)
npm install -g npm-check-updates
ncu -u
npm install
```

### Clean & Reinstall

```bash
# Xóa node_modules toàn bộ
Get-ChildItem -Directory -Filter "node_modules" -Recurse | Remove-Item -Recurse -Force

# Clear npm cache
npm cache clean --force

# Cài lại
.\build-all.ps1
```

---

## 🐛 Debugging Commands

### Check What's Running

```bash
# Find process on port
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Kill process (Windows)
taskkill /PID <PID> /F
```

### View Logs

```bash
# npm debug log
cat C:\Users\<username>\AppData\Local\npm-cache\_logs\*-debug-0.log

# Node.js console
# Chỉ cần xem terminal khi chạy npm run dev
```

### Test API Endpoints

```bash
# PowerShell
Invoke-WebRequest http://localhost:3001/api/movies

# Or use curl (nếu cài)
curl http://localhost:3001/api/movies

# Or use Postman
# https://www.postman.com/
```

### Check Environment Variables

```bash
# PowerShell
$env:DATABASE_URL
$env:NEXTAUTH_SECRET

# Or view .env.local file
type backend\.env.local
```

---

## 🗄️ Database Commands

### MongoDB Commands

```bash
# Start MongoDB server
mongod

# Open MongoDB shell
mongosh

# Or use MongoDB Compass (GUI)
# https://www.mongodb.com/products/compass
```

### Prisma Commands

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Check schema
npx prisma studio

# Reset database
npx prisma migrate reset
```

---

## 📝 Git Commands

### Initialize Git (First Time)

```bash
git init
git config user.name "Your Name"
git config user.email "your@email.com"
git add .
git commit -m "Initial commit: Netflix Clone setup"
```

### Regular Git Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Fix: [description]"
# or
git commit -m "Feature: [description]"
# or
git commit -m "Docs: [description]"

# View log
git log --oneline

# Push (if remote)
git push origin main
```

### Common Git Scenarios

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# See what changed
git diff

# See specific file changes
git diff path/to/file

# Revert to specific version
git checkout <commit-hash> path/to/file
```

---

## 🔍 File Management

### View File/Folder Sizes

```powershell
# Check folder size
(Get-ChildItem -Path "backend" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

# Check specific folder
(Get-ChildItem -Path "backend\node_modules" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
```

### Find Files

```powershell
# Find all .ts files
Get-ChildItem -Filter "*.ts" -Recurse

# Find files modified in last day
Get-ChildItem -Recurse | Where-Object {$_.LastWriteTime -gt (Get-Date).AddDays(-1)}
```

---

## 🧪 Testing

### Manual Testing Checklist

```
Frontend (http://localhost:3000)
- [ ] Page loads
- [ ] Can navigate
- [ ] Can login (after OAuth setup)

Backend (http://localhost:3001)
- [ ] API responds
- [ ] GET /api/movies returns data
- [ ] Database connected

Admin (http://localhost:3002)
- [ ] Dashboard loads
- [ ] Can view movies
- [ ] Can add movie
- [ ] Can edit movie
- [ ] Can delete movie
```

### API Testing (Postman Collection)

```json
{
  "info": {
    "name": "Netflix Clone API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Movies",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/api/movies"
      }
    },
    {
      "name": "Create Movie",
      "request": {
        "method": "POST",
        "url": "http://localhost:3001/api/movies",
        "body": {
          "title": "Test Movie",
          "description": "Test",
          "genreId": "1"
        }
      }
    }
  ]
}
```

---

## 📦 Common Issues & Quick Fixes

### Port Already In Use
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
# Retry npm run dev
```

### Module Not Found
```bash
# Clear cache
rm -r node_modules
npm cache clean --force
npm install --legacy-peer-deps
```

### Build Error
```bash
# Clear next cache
rm -r .next
npm run build
```

### MongoDB Connection Error
```bash
# Check MongoDB running
mongod
# Check connection string in .env.local
```

### CORS Error
```
# Check backend is running
# Check NEXT_PUBLIC_API_URL in frontend .env.local
# Should be: http://localhost:3001
```

---

## 🎯 Development Workflow

### Typical Day

```bash
1. Start day
   .\start-all.ps1

2. Make changes to code

3. Save changes
   git add .
   git commit -m "..."

4. Test changes
   - Check frontend
   - Check admin
   - Check backend logs

5. Fix issues if needed

6. Push when ready
   git push origin main

7. End day
   Press Ctrl+C on terminals
```

---

## 💾 Backup & Restore

### Quick Backup (without node_modules)

```powershell
# Backup source code only
$today = Get-Date -Format "yyyy-MM-dd"
Compress-Archive -Path backend, frontend, admin, *.md -DestinationPath "netflix-clone-backup-$today.zip"

# Exclude node_modules in 7-Zip (if installed)
# 7z a netflix-backup.7z . -xr!node_modules
```

### Restore from Backup

```bash
1. Extract files
2. Run: npm install --legacy-peer-deps (backend)
3. Run: npm install (frontend & admin)
```

---

## 📊 Performance Tips

### Speed Up npm Install

```bash
# Use npm ci instead of npm install
npm ci --legacy-peer-deps

# Or use yarn
yarn install

# Or use pnpm
pnpm install
```

### Faster Builds

```bash
# Build in parallel
npm run build &
cd ../frontend && npm run build &
cd ../admin && npm run build

wait

# Or use turbo (if installed)
npx turbo build
```

---

## 📚 Useful Aliases (Optional)

Create `.bashrc` hoặc PowerShell profile:

```powershell
# PowerShell Profile Location
# $PROFILE

# Add these functions:
function dev-start { .\start-all.ps1 }
function dev-build { .\build-all.ps1 }
function dev-clean { Get-ChildItem -Directory -Filter "node_modules" -Recurse | Remove-Item -Recurse -Force }
function git-status { git status }
function git-commit { param($msg) ; git add . ; git commit -m $msg }
```

Then use:
```bash
dev-start
dev-build
dev-clean
```

---

## 🔗 Useful Links

- **Node.js Docs**: https://nodejs.org/docs/
- **npm CLI Docs**: https://docs.npmjs.com/cli/
- **Next.js Docs**: https://nextjs.org/docs/
- **Prisma Docs**: https://www.prisma.io/docs/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Git Docs**: https://git-scm.com/doc
- **Postman**: https://www.postman.com/
- **VSCode**: https://code.visualstudio.com/docs

---

**Last Updated**: 2026-02-05
