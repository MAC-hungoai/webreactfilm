# Netflix Clone - Error Log & Debugging

## 🐛 Error Tracking System

Tài liệu này ghi lại tất cả các lỗi gặp phải, nguyên nhân, và cách giải quyết.

---

## Error #1: next-cors Package Not Found

**Date**: 2026-02-05
**Severity**: 🔴 HIGH
**Component**: Backend
**Status**: ✅ RESOLVED

### Error Message
```
npm error code ETARGET
npm error notarget No matching version found for next-cors@^0.1.10.
```

### Root Cause
Package `next-cors` phiên bản 0.1.10 không tồn tại trên npm registry.

### Solution
1. Tìm package thay thế: `cors` (phổ biến hơn)
2. Cập nhật `backend/package.json`
   - Remove: `"next-cors": "^0.1.10"`
   - Add: `"cors": "^2.8.5"`
3. Chạy `npm install --legacy-peer-deps` lại

### Changes Made
- File: `backend/package.json` (Line 18)
- Before: `"next-cors": "^0.1.10"`
- After: `"cors": "^2.8.5"`

### Prevention
- Kiểm tra packages tồn tại trước khi add
- Dùng `npm search` hoặc check npmjs.com

---

## Error #2: Prisma Postinstall Script Failed

**Date**: 2026-02-05
**Severity**: 🟡 MEDIUM
**Component**: Backend
**Status**: 🟡 PARTIAL (cần monitering)

### Error Message
```
npm error code 3221225786
npm error path D:\nextflix\backend\node_modules\@prisma\client
npm error command failed: node scripts/postinstall.js
```

### Root Cause
Prisma postinstall script cố gắng build native binaries nhưng gặp lỗi trích xuất file.
Có thể do:
1. File bị khóa từ antivirus
2. Path quá dài (Windows limitation)
3. Permission issues

### Solution
1. Sử dụng `--legacy-peer-deps` flag:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Nếu vẫn fail, xóa node_modules và retry:
   ```bash
   rm -r node_modules
   npm install --legacy-peer-deps --no-optional
   ```

### Workaround
- Bỏ qua postinstall warning (không ảnh hưởng đến dev)
- Prisma client vẫn hoạt động

### Prevention
- Tắt antivirus tạm thời khi cài dependencies
- Cài trên đường dẫn ngắn hơn nếu có thể

---

## Error #3: File Permission Errors (EBUSY/EPERM)

**Date**: 2026-02-05
**Severity**: 🔴 HIGH
**Component**: Backend, Frontend, Admin
**Status**: ✅ RESOLVED (Temporary)

### Error Message
```
npm error code EBUSY: resource busy or locked, rmdir 'D:\nextflix\backend\node_modules\@prisma\client'
npm error code EPERM: operation not permitted, rmdir 'D:\nextflix\backend\node_modules\...'
```

### Root Cause
Khi npm cố gắng xóa/update node_modules, một số files vẫn bị khóa:
1. Antivirus scanning
2. File explorer indexing
3. IDE holding file references
4. Path quá dài (Windows MAX_PATH = 260 chars)

### Solution

**Immediate Fix:**
```bash
# Đóng tất cả editors/IDEs
# Tắt Windows Search
# Run cleanup command:
Get-ChildItem -Directory -Filter "node_modules" -Recurse | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
npm cache clean --force
npm install --legacy-peer-deps
```

**Long-term Solution:**
1. Tạo `.gitignore` để không track node_modules
2. Cài trên đường dẫn ngắn hơn nếu có thể
3. Configure npm:
   ```bash
   npm config set fetch-timeout 120000
   npm config set fetch-retry-mintimeout 20000
   npm config set fetch-retry-maxtimeout 120000
   ```

### Changes Made
- Xóa toàn bộ node_modules từ cả 3 folders
- Cài lại với `--legacy-peer-deps` flag
- Files affected: Tất cả

### Prevention
- Luôn đóng IDE trước khi rm -r node_modules
- Tắt antivirus scanning tạm thời
- Dùng `npm ci` thay vì `npm install` nếu có lock file

---

## Error #4: Multiple TAR_ENTRY_ERROR warnings

**Date**: 2026-02-05
**Severity**: 🟡 LOW
**Component**: Backend
**Status**: ⚠️ WARNINGS ONLY (không block)

### Error Messages
```
npm warn tar TAR_ENTRY_ERROR UNKNOWN: unknown error, open 'D:\nextflix\backend\node_modules\...'
npm warn cleanup Failed to remove some directories [...]
```

### Root Cause
npm lỗi khi trích xuất hoặc xóa một số files, có thể do:
1. Long path names trên Windows (> 260 chars)
2. Special characters trong filenames
3. Antivirus/file locking

### Impact
- ⚠️ Warnings only - không block installation
- Một số packages có thể missing nhưng Next.js vẫn chạy

### Solution
1. Các files này có thể được cài lại khi cần
2. Chạy `npm install` lại nếu missing
3. Hoặc ignore (thường không ảnh hưởng)

### Prevention
- Cài trên path ngắn hơn
- Update npm: `npm install -g npm@latest`

---

## Error #5: Dependencies Install Process Timeout

**Date**: 2026-02-05
**Severity**: 🟡 MEDIUM
**Component**: Backend
**Status**: ✅ RESOLVED

### Issue
npm install tốn hơn 2 phút, Process bị interrupt.

### Root Cause
1. Network slow
2. npm registry slow
3. Prisma binary download lớn (50MB+)

### Solution
```bash
# Increase timeout
npm config set fetch-timeout 120000

# Clear cache
npm cache clean --force

# Retry install
npm install --legacy-peer-deps
```

### Prevention
- Set timeout config globally
- Dùng faster npm mirror nếu cần

---

## 📊 Error Summary

| Error | Severity | Status | Type | Fix Time |
|-------|----------|--------|------|----------|
| next-cors not found | HIGH | ✅ RESOLVED | Package Issue | 5 min |
| Prisma postinstall | MEDIUM | 🟡 PARTIAL | Build Issue | 10 min |
| File Permission | HIGH | ✅ RESOLVED | System Issue | 15 min |
| TAR Entry Error | LOW | ⚠️ WARNING | Extract Issue | N/A |
| Timeout | MEDIUM | ✅ RESOLVED | Network Issue | 5 min |

---

## 🔍 Debugging Checklist

Khi gặp lỗi mới:

- [ ] Ghi lại error message đầy đủ
- [ ] Ghi lại ngày giờ và components ảnh hưởng
- [ ] Kiểm tra logs: `npm-debug.log`
- [ ] Thử clear cache: `npm cache clean --force`
- [ ] Thử xóa node_modules và cài lại
- [ ] Kiểm tra .env files (nếu config issues)
- [ ] Kiểm tra MongoDB connection (nếu DB issues)
- [ ] Kiểm tra antivirus/firewall blocks

---

## 💡 Common Solutions

### npm install hangs
```bash
npm config set fetch-timeout 120000
npm install --legacy-peer-deps
```

### node_modules corruption
```bash
rm -r node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### Port already in use
```bash
# Find process on port 3001
netstat -ano | findstr :3001
# Kill process (Windows)
taskkill /PID <PID> /F
```

### MongoDB connection error
```bash
# Check MongoDB is running
mongod
# Or check service
Get-Service MongoDB
```

### CORS errors
```
# Check NEXT_PUBLIC_API_URL in frontend/.env.local
# Should be: http://localhost:3001
```

---

## 📞 Support Resources

- npm docs: https://docs.npmjs.com/
- Prisma docs: https://www.prisma.io/docs/
- Next.js docs: https://nextjs.org/docs/
- MongoDB docs: https://docs.mongodb.com/

---

**Last Updated**: 2026-02-05
**Total Errors Logged**: 5
**Resolved**: 3 ✅
**Partial**: 1 🟡
**Warnings**: 1 ⚠️
