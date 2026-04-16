# 🔐 Fix: Admin & User Account Separation

## Tổng quan vấn đề đã fix

Dự án đã được cập nhật để phân tách hoàn toàn quyền hạn giữa tài khoản **Admin** và tài khoản **User** thông qua hệ thống role trong database.

### Vấn đề cũ:
- ❌ Kiểm tra admin chỉ dựa trên email (`ADMIN_EMAILS` env var)
- ❌ Không có trường `role` trong database
- ❌ Người dùng bình thường có thể truy cập một số chức năng admin
- ❌ Không có sự phân tách rõ ràng giữa quyền hạn

### Giải pháp mới:
- ✅ Thêm trường `role` vào User model (USER, ADMIN)
- ✅ Cập nhật NextAuth để lưu role vào session
- ✅ Tạo middleware `requireAdminRole` để bảo vệ routes
- ✅ Cập nhật tất cả API endpoints admin

---

## 📋 Các thay đổi được thực hiện

### 1. Schema Changes

**Files modified:**
- `web/prisma/schema.prisma`
- `backend/prisma/schema.prisma`

**Thay đổi:**
```prisma
enum UserRole {
  USER
  ADMIN
}

model User {
  // ... existing fields ...
  role  UserRole  @default(USER)
}
```

### 2. Authentication Config

**File: `web/libs/authOptions.ts`**
- Thêm `signIn` callback để tự động set role ADMIN cho email trong ADMIN_EMAILS
- Cập nhật JWT callback để lưu role vào token
- Cập nhật session callback để lưu role vào session object

### 3. Role Middleware

**New file: `web/libs/roleAuthMiddleware.ts`**
- `requireAdminRole()` - Middleware kiểm tra ADMIN role
- `requireUserAuth()` - Middleware kiểm tra user authenticated

### 4. Updated Endpoints

**Files updated:**
- `web/pages/api/profile.ts` - Kiểm tra role, không email
- `web/pages/api/comments/delete.ts` - Kiểm tra role
- `web/pages/api/comments/check-auth.ts` - Return role info
- `web/libs/adminVerify.ts` - Verify role thay vì email

---

## 🚀 Cách sử dụng

### 1. Chạy Prisma Migration

```bash
# Vào backend hoặc web folder
cd web

# Tạo migration
npx prisma migrate dev --name add_user_role

# Seed dữ liệu (set role cho admin emails)
npm run seed
```

### 2. Thiết lập ADMIN_EMAILS

Đảm bảo file `.env.local` của `web/` có:

```env
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

Những email này sẽ tự động nhận role ADMIN khi đăng nhập.

### 3. Kiểm tra Role trong API

```typescript
// Cách cũ (KHÔNG sử dụng nữa)
import { isAdminEmail } from '@/libs/adminAuth';
if (isAdminEmail(currentUser.email)) { }

// Cách mới (SỬ DỤNG)
const userRole = (currentUser as any).role;
if (userRole === 'ADMIN') { }
```

### 4. Bảo vệ Admin Routes

```typescript
import { requireAdminRole } from '@/libs/roleAuthMiddleware';

export default async function handler(req, res) {
  // Kiểm tra admin role
  const isAdmin = await requireAdminRole(req, res);
  if (!isAdmin) return; // Response đã gửi
  
  // Admin code here
}
```

---

## 🧪 Testing

### Test 1: Admin User Login
```bash
# 1. Đảm bảo email trong ADMIN_EMAILS
# 2. Tạo user hoặc OAuth login
# 3. Kiểm tra session:
#    - Phải có field `role: 'ADMIN'`
#    - Có thể truy cập admin endpoints
```

### Test 2: Regular User Login
```bash
# 1. Đăng nhập với email không trong ADMIN_EMAILS
# 2. Kiểm tra session:
#    - Phải có field `role: 'USER'`
#    - KHÔNG thể truy cập admin endpoints (403 Forbidden)
```

### Test 3: Access Control
```bash
# Admin endpoint test:
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Cookie: next-auth.session-token=XXX"

# Kết quả:
# - Admin user: 200 OK
# - Regular user: 403 Forbidden
# - No auth: 401 Unauthorized
```

---

## 📝 API Changes

### GET /api/comments/check-auth
**Response cũ:**
```json
{
  "isAuthenticated": true,
  "isAdmin": false
}
```

**Response mới:**
```json
{
  "isAuthenticated": true,
  "userId": "123",
  "userName": "John",
  "userEmail": "john@example.com",
  "userRole": "USER",
  "isAdmin": false
}
```

---

## 🔄 Migration Path

Nếu bạn đã có dữ liệu cũ, hãy:

1. Chạy migration Prisma
2. Tạo script seed để update existing users:

```typescript
// backend/src/seed.ts hoặc web seed
import { prisma } from '@/libs/prismadb';
import { isAdminEmail } from '@/libs/adminAuth';

async function updateUserRoles() {
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    if (isAdminEmail(user.email)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' }
      });
      console.log(`✅ Set ${user.email} as ADMIN`);
    }
  }
}

updateUserRoles();
```

---

## 🛡️ Security Notes

1. **Không bao giờ tin client**: Role luôn được xác thực từ session/JWT
2. **Kiểm tra role ở backend**: Mọi thay đổi dữ liệu phải xác thực role
3. **ADMIN_EMAILS**: Chỉ sử dụng cho xác định role ban đầu, không phải nhân dạng
4. **Database là source of truth**: Role trong database là giá trị chính thức

---

## 📚 File References

- Schema: `web/prisma/schema.prisma`
- Auth Config: `web/libs/authOptions.ts`
- Middleware: `web/libs/roleAuthMiddleware.ts`
- Verify: `web/libs/adminVerify.ts`
- Updated endpoints: `web/pages/api/**/*.ts`

---

## ❓ FAQ

**Q: Làm cách nào để thay đổi user từ USER thành ADMIN?**
```typescript
await prisma.user.update({
  where: { email: 'user@example.com' },
  data: { role: 'ADMIN' }
});
```

**Q: Làm cách nào để revoke admin access?**
```typescript
await prisma.user.update({
  where: { id: userId },
  data: { role: 'USER' }
});
```

**Q: Có cách nào để xem role của user hiện tại?**
```typescript
// Frontend
const session = await getSession();
const role = session?.user?.role; // 'ADMIN' hoặc 'USER'
```

**Q: Tôi cần cập nhật ADMIN_EMAILS, có cần restart?**
Có, cần restart ứng dụng để ADMIN_EMAILS mới được đọc từ .env.local
