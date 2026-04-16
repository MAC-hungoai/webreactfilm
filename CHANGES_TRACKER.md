# Netflix Clone - Change Tracking Template

Dùng template này để ghi lại mỗi lần cập nhật dự án.

---

## 📝 Template - Change Log Entry

```markdown
## [Version/Date] - [Description]

**Date**: YYYY-MM-DD
**Time**: HH:MM
**Component(s)**: Backend / Frontend / Admin
**Type**: ✨ Feature | 🐛 Bug Fix | 🔧 Refactor | 📚 Docs | 🚀 Performance

### What Changed
- [ ] Describe change 1
- [ ] Describe change 2
- [ ] Describe change 3

### Files Modified
- `path/to/file1.ts`
- `path/to/file2.tsx`
- `path/to/file3.json`

### Errors/Issues
- Issue 1: Description
  - Solution: ...
  - Status: ✅ Fixed / 🟡 Partial / ❌ Pending

### Dependencies Changed
- Added: package@^1.0.0
- Removed: old-package@1.0.0
- Updated: existing-package: ^2.0.0 → ^3.0.0

### Testing Done
- [ ] Frontend tested at http://localhost:3000
- [ ] Backend tested at http://localhost:3001
- [ ] Admin tested at http://localhost:3002

### Next Steps
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Notes
Additional notes or concerns...

---
```

---

## 📊 Change Summary Format

```
Total Files Changed: X
Lines Added: +YYY
Lines Deleted: -ZZZ
```

---

## 🎯 Useful Commands

### Check Git Status
```bash
git status
```

### See Recent Changes
```bash
git log --oneline -10
git log --all --graph --oneline
```

### Diff Specific File
```bash
git diff path/to/file.ts
```

### Check file size
```bash
du -sh backend node_modules  # Unix
Get-ChildItem -Recurse backend | Measure-Object -Property Length -Sum  # PowerShell
```

---

## 📈 Project Statistics

### Current Size Breakdown

```
frontend/
├── source code:    ~200 files   (~2-3 MB)
└── node_modules/   ~2000 files  (~35 MB)  ← IGNORED

backend/
├── source code:    ~150 files   (~2-3 MB)
└── node_modules/   ~2000 files  (~40 MB)  ← IGNORED

admin/
├── source code:    ~100 files   (~1-2 MB)
└── node_modules/   ~2000 files  (~30 MB)  ← IGNORED

docs/              ~10 files    (~500 KB)
```

### Actual Tracked Size
Only source code without node_modules:
- ~400 source files
- ~5-10 MB (rough estimate)

### In Git (After .gitignore)
- node_modules: ❌ IGNORED
- .next: ❌ IGNORED
- .prisma: ❌ IGNORED
- build/dist: ❌ IGNORED
- .env files: ❌ IGNORED
- logs: ❌ IGNORED

**Expected Git Size**: 5-10 MB (vs 105+ MB without .gitignore)

---

## 🔐 Why 10k Files Before

### Before .gitignore
- Backend node_modules: ~2000+ files
- Frontend node_modules: ~2000+ files
- Admin node_modules: ~2000+ files
- Build artifacts: ~1000+ files
- Cache files: ~1000+ files
- **Total**: ~8000-10000 files

### Reason
npm packages tương tác/phụ thuộc lẫn nhau:
- 1 package = nhiều files
- Dependencies of dependencies = more files
- Build outputs = more files

Example:
```
react/
├── package.json
├── index.js
├── lib/
│   ├── component1.js
│   ├── component2.js
│   └── ... (many more)
├── dist/
│   └── ... (compiled output)
└── ... (more files)

And react depends on 10+ packages
Which each depend on 5+ packages
= thousands of files
```

---

## ✅ Solution Applied

Created `.gitignore` to exclude:
```
node_modules/         ← 6000+ files
.next/               ← 1000+ files  
.prisma/             ← 100+ files
build/dist/          ← 500+ files
logs/                ← auto-generated
.env.local           ← security
```

**Result**: Only source code is tracked (~400 files, 5-10 MB)

---

## 📋 Change Log Start

Update this section as you make changes:

### 2026-02-05 - Initial Setup Complete
- ✅ Cloned original repository
- ✅ Tách thành 3 parts (backend, frontend, admin)
- ✅ Cài dependencies (with .gitignore)
- ✅ Created documentation
- 🔄 Next: Setup environment & OAuth

---

## 🚀 Ready for Updates!

Mỗi lần bạn update dự án, ghi lại theo format trên.
Tôi sẽ tự động update files này.

**Last Updated**: 2026-02-05
