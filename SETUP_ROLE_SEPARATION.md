# ⚠️ NEXT STEPS - Admin & User Role Separation Fix

## 🎯 Bạn cần thực hiện những bước sau:

### 1️⃣ Chạy Prisma Migration

Để thêm trường `role` vào database:

```bash
cd web

# Tạo migration
npx prisma migrate dev --name add_user_role

# Hoặc nếu không dùng migration (dev environment):
npx prisma db push
```

### 2️⃣ Seed Database với Admin Roles

Cập nhật role cho tất cả users hiện tại dựa trên `ADMIN_EMAILS`:

```bash
cd web

# Chạy seed script
npm run seed:roles

# Output sẽ tương tự:
# 🌱 Starting user role seed...
# 📧 Admin emails configured: admin@example.com,admin2@example.com
# 👥 Total users in database: 25
# ✅ Updated admin@example.com: USER → ADMIN
# ...
# ✨ Seed completed!
```

### 3️⃣ Cấu hình ADMIN_EMAILS

Đảm bảo file `.env.local` của `web/` có email của admin:

```env
# .env.local (web folder)
ADMIN_EMAILS=admin@example.com,your-admin@gmail.com

# Hoặc nếu sử dụng multiple emails:
ADMIN_EMAILS=admin@example.com,admin2@example.com,superadmin@gmail.com
```

**Lưu ý:** Những email này cần được phân tách bằng dấu phẩy (,) và không có khoảng cách (hoặc có thể trim).

### 4️⃣ Restart Ứng dụng

```bash
# Dừng ứng dụng hiện tại
# Ctrl+C

# Khởi động lại
npm run dev
```

---

## ✅ Kiểm tra hoạt động

### Test 1: Kiểm tra Session Role

1. Đăng nhập với tài khoản admin (email trong ADMIN_EMAILS)
2. Mở Developer Tools → Console
3. Chạy lệnh:
```javascript
const session = await fetch('/api/auth/session').then(r => r.json());
console.log('Role:', session?.user?.role);
console.log('Full user:', session?.user);
```

Expected output: `Role: ADMIN`

### Test 2: Kiểm tra API Access

**Admin có thể access:**
```bash
curl http://localhost:3000/api/users
curl http://localhost:3000/api/analytics
```

**Regular user không thể (sẽ nhận 403):**
Đăng nhập với email không trong ADMIN_EMAILS, rồi thử access API admin.

### Test 3: Kiểm tra Database

```bash
cd web

# Mở Prisma Studio
npx prisma studio

# Xem tab Users, kiểm tra field `role`
# Phải thấy ADMIN hoặc USER
```

---

## 📚 File References

### Mới tạo:
- `web/libs/roleAuthMiddleware.ts` - Role checking middleware
- `web/hooks/useAdminRole.ts` - Admin role hook
- `web/hooks/withAdminProtection.tsx` - Admin page wrapper
- `web/src/seedUserRoles.ts` - Seed data script
- `ROLE_SEPARATION_FIX.md` - Chi tiết fix

### Cập nhật:
- `web/libs/authOptions.ts` - NextAuth config với role
- `web/libs/adminVerify.ts` - Admin verification with role
- `web/pages/api/profile.ts` - Profile endpoint
- `web/pages/api/comments/delete.ts` - Comment deletion
- `web/pages/api/comments/check-auth.ts` - Auth check endpoint
- `web/prisma/schema.prisma` - Database schema
- `backend/prisma/schema.prisma` - Database schema

---

## 📖 Hướng dẫn sử dụng

### Bảo vệ API Routes

```typescript
// pages/api/admin-feature.ts
import { requireAdminRole, AuthenticatedRequest } from '@/libs/roleAuthMiddleware';

export default async function handler(req: AuthenticatedRequest, res) {
  // Kiểm tra admin role
  const isAdmin = await requireAdminRole(req, res);
  if (!isAdmin) return; // Response đã được gửi
  
  // Admin-only code here
  console.log('User:', req.user); // { id, email, name, role: 'ADMIN' }
}
```

### Bảo vệ Admin Pages (Frontend)

**Cách 1: Sử dụng HOC**
```typescript
import { withAdminProtection } from '@/hooks/withAdminProtection';

function AdminDashboard() {
  return <div>Admin Dashboard</div>;
}

export default withAdminProtection(AdminDashboard);
```

**Cách 2: Sử dụng Hook**
```typescript
import { useAdminRole } from '@/hooks/useAdminRole';

function AdminPanel() {
  const { isAdmin, isLoading } = useAdminRole();

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access Denied</div>;

  return <div>Admin Content</div>;
}
```

### Kiểm tra Role trong Component

```typescript
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  if (userRole === 'ADMIN') {
    return <div>Admin view</div>;
  }

  return <div>User view</div>;
}
```

---

## 🐛 Troubleshooting

### Problem: Migration Error "Field or model named `role` does not exist"
```
❌ Error: Field or model named `role` does not exist
```

**Solution:**
- Đảm bảo bạn chạy `npx prisma migrate dev` hoặc `npx prisma db push`
- Xóa database migration cache: `rm -rf prisma/migrations/_current` (nếu có)

### Problem: Migration Error "Prisma failed to resolve module"
```
❌ Error: Could not load `.prisma/client`
```

**Solution:**
```bash
cd web
npm install
npx prisma generate
npx prisma migrate dev
```

### Problem: Seed Script Error "Cannot find module"
```
❌ Error: Cannot find module 'ts-node'
```

**Solution:**
```bash
npm install --save-dev ts-node
npm run seed:roles
```

### Problem: User Role Shows as NULL
```
❌ User role shows as NULL in database/session
```

**Solution:**
1. Chạy migration: `npx prisma migrate dev`
2. Chạy seed script: `npm run seed:roles`
3. Đảm bảo ADMIN_EMAILS được cấu hình
4. Logout và login lại

### Problem: 403 Forbidden trên Admin APIs
```
❌ GET /api/users → 403 Forbidden (Admin access required)
```

**Solution:**
1. Kiểm tra xem bạn đã login?
2. Email của bạn trong ADMIN_EMAILS chưa?
3. Hãy check role: `fetch('/api/comments/check-auth').then(r=>r.json()).then(r=>console.log(r))`

---

## 🔒 Security Checklist

- [ ] Chạy migration để thêm `role` field
- [ ] Chạy seed script để update roles
- [ ] ADMIN_EMAILS được cấu hình đúng
- [ ] Restart ứng dụng sau cấu hình
- [ ] Test login với admin email - kiểm tra role ADMIN
- [ ] Test login với user email - kiểm tra role USER
- [ ] Kiểm tra 403 error khi regular user access admin APIs
- [ ] Kiểm tra database role field có data

---

## ❓ FAQs

**Q: Nếu tôi không chạy seed, sẽ xảy ra gì?**
A: Role mặc định là USER. Bạn cần chạy seed hoặc thủ công cập nhật role cho admin users.

**Q: Có thể sữ đổi ADMIN_EMAILS mà không restart không?**
A: Không, bạn cần restart ứng dụng để ADMIN_EMAILS được đọc lại từ .env.local.

**Q: Tôi muốn thêm người mới làm admin?**
A: Thêm email vào ADMIN_EMAILS trong .env.local, restart, rồi người đó login để nhận role ADMIN.

**Q: Có thể quản lý role từ Admin Panel không?**
A: Có, nhưng bạn cần tạo API endpoint mới và UI. Template:
```typescript
// pages/api/admin/users/[id]/role.ts
if (req.method === 'PATCH') {
  const isAdmin = await requireAdminRole(req, res);
  if (!isAdmin) return;
  
  const { role } = req.body;
  await prisma.user.update({
    where: { id: req.query.id as string },
    data: { role }
  });
}
```

---

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Console logs cho errors
2. Database schema (Prisma Studio)
3. Environment variables (.env.local)
4. NextAuth session data
5. Xem file `ROLE_SEPARATION_FIX.md` để biết thêm chi tiết
