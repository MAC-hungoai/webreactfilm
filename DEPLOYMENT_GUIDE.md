# 🚀 Hướng Dẫn Deploy lên webreactfilm.site

## Tóm Tắt
- **Frontend (web + admin)** → Vercel
- **Backend (Express server)** → Railway
- **Database** → Railway PostgreSQL hoặc MongoDB Atlas
- **Domain** → webreactfilm.site (trỏ về Vercel)

---

## 📋 Chuẩn Bị

### 1. Tài khoản cần có:
- ✅ GitHub account (push code lên)
- ✅ Vercel account (vercel.com)
- ✅ Railway account (railway.app)
- ✅ Registrar tên miền (nơi bạn mua webreactfilm.site)

### 2. Git setup
```bash
# Init git nếu chưa có
git init
git add .
git commit -m "Initial commit for deployment"

# Push lên GitHub (tạo repo trước)
git remote add origin https://github.com/YOUR_USERNAME/webreactfilm.git
git push -u origin main
```

---

## 🔧 PHẦN 1: SETUP BACKEND TRÊN RAILWAY

### Step 1: Chuẩn bị code backend

Tạo file `.env.example` trong `backend/`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/webreactfilm
PORT=5000
NODE_ENV=production
```

Tạo file `backend/railway.json`:
```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm run start"
  }
}
```

**Cập nhật** `backend/package.json` script:
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "prestart": "prisma generate",
    "start": "node dist/index.js",
    "seed": "ts-node src/seed.ts"
  }
}
```

### Step 2: Deploy lên Railway

1. Vào https://railway.app
2. Login với GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Chọn repo → chọn thư mục `backend`
5. Set environment variables:
   - `DATABASE_URL` (từ Railway PostgreSQL hoặc MongoDB Atlas)
   - `NODE_ENV=production`
   - `PORT=5000` (hoặc để Railway auto-assign)

6. Wait for build & deploy (5-10 phút)
7. Copy URL endpoint được sinh (vd: `https://webreactfilm-backend.railway.app`)

---

## 🌐 PHẦN 2: SETUP DATABASE

### Option A: MongoDB Atlas (dễ nhất)

1. Tạo account tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/webreactfilm`
4. Thêm vào Railway environment: `DATABASE_URL=<connection_string>`

### Option B: Railway PostgreSQL (tích hợp sẵn)

1. Trong Railway project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway tự tạo variable `DATABASE_URL`
3. Dùng ngay, không cần setup thêm

---

## ⚡ PHẦN 3: DEPLOY FRONTEND TRÊN VERCEL

### Step 1: Chuẩn bị web/ folder

**Tạo** `web/.env.local` (chỉ local):
```env
NEXT_PUBLIC_API_URL=https://webreactfilm-backend.railway.app/api
```

**Cập nhật** `web/libs/fetcher.ts` (nếu cần):
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

**Cập nhật** `backend/src/index.ts` - CORS cho Vercel domain:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3002',
    'https://webreactfilm.site',
    'https://www.webreactfilm.site',
    'https://*.vercel.app' // Vercel preview domains
  ],
  credentials: true,
}));
```

**Push lên GitHub:**
```bash
git add .
git commit -m "Add deployment configuration"
git push
```

### Step 2: Deploy Web Frontend

1. Vào https://vercel.com
2. Click **Import Project**
3. Chọn GitHub repo
4. **Root Directory**: `web`
5. Build Command: `next build`
6. Start Command: `next start`
7. Environment Variables:
   - `NEXT_PUBLIC_API_URL=https://webreactfilm-backend.railway.app/api`
8. Click **Deploy**

**Ghi nhớ Vercel URL sinh ra** (vd: `webreactfilm.vercel.app`)

### Step 3: Deploy Admin Frontend

1. Làm tương tự, tạo project khác
2. **Root Directory**: `admin`
3. Environment Variables:
   - `NEXT_PUBLIC_API_URL=https://webreactfilm-backend.railway.app/api`
4. Deploy

**Vercel URL admin** (vd: `webreactfilm-admin.vercel.app`)

---

## 🎯 PHẦN 4: SETUP DOMAIN webreactfilm.site

### Bước 1: Lấy DNS nameservers từ Vercel

Trong Vercel project (web):
- Settings → **Domains**
- Thêm domain: `webreactfilm.site`
- Vercel sẽ cho bạn **4 nameservers**:
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ns3.vercel-dns.com
  ns4.vercel-dns.com
  ```

### Bước 2: Đổi Nameserver tại Registrar

Nơi bạn mua domain (GoDaddy, Namecheap, Cloudflare, etc.):
1. Vào Domain Settings
2. Thay nameservers thành **4 cái từ Vercel** ở trên
3. Save & đợi 24-48 tiếng để DNS propagate

### Bước 3: Verify Domain ở Vercel

- Quay lại Vercel → Domain settings
- Click **Verify** khi DNS propagated
- Vercel sẽ confirm

### Bước 4: Setup bạn còn muốn gì?

**Admin subdomain:**
- Nếu muốn admin ở `admin.webreactfilm.site`:
  - Vercel admin project → Settings → Domains
  - Add: `admin.webreactfilm.site`
  - Add CNAME: `cname.vercel-dns.com`

**Hoặc** để admin tại `webreactfilm.site/admin`:
- Trong web project, cấu hình rewrite ở `web/next.config.js`:
```javascript
module.exports = {
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/admin/:path*',
          destination: 'https://webreactfilm-admin.vercel.app/:path*',
        },
      ],
    };
  },
};
```

---

## 🧪 KIỂM TRA & TEST

### 1. Test backend API
```bash
curl https://webreactfilm-backend.railway.app/api/health
# Phải trả về: {"status":"ok",...}
```

### 2. Test frontend tại domain
- https://webreactfilm.site (web)
- https://admin.webreactfilm.site hoặc https://webreactfilm.site/admin (admin)

### 3. Kiểm tra CORS
- Mở browser DevTools → Console
- Không được thấy CORS error

### 4. Kiểm tra API calls
- Mở Network tab
- Click vào API call
- Xem status code 200 (OK)

---

## 🐛 TROUBLESHOOTING

| Lỗi | Nguyên nhân | Cách fix |
|-----|----------|---------|
| 502 Bad Gateway (Vercel) | Backend không chạy | Check Railway logs |
| CORS error | Backend CORS config sai | Update CORS origin list |
| Cannot call /api | API_URL sai | Update env variable |
| Database connection fails | DATABASE_URL sai | Verify connection string |
| Domain not resolving | DNS chưa propagate | Đợi 24-48h, hoặc check nameservers |
| Build fails | Missing dependencies | Run `npm install` locally test |

---

## 📝 CHECKLIST CUỐI CÙNG

- [ ] Code push lên GitHub
- [ ] Backend deploy thành công trên Railway
- [ ] Database connected (test seed data)
- [ ] Web frontend deploy trên Vercel
- [ ] Admin frontend deploy trên Vercel
- [ ] Domain NS đổi tại Registrar
- [ ] Domain verified ở Vercel
- [ ] CORS updated cho production domains
- [ ] API_URL environment variables set
- [ ] Test mọi feature (login, API calls, etc.)

---

## 🚨 IMPORTANT NOTES

1. **Vercel Preview URLs**: Mỗi pull request sẽ sinh preview URL - cộng vào CORS allowlist
2. **Railway Restart**: Nếu update backend, Railway auto-rebuild từ GitHub
3. **Database Migration**: Ensure `prisma push` chạy trước khi deploy
4. **Secrets**: Không commit `.env.local` - dùng environment variables ở hosting
5. **Monitoring**: Railway & Vercel đều có logs - check nếu có lỗi

---

Bạn sẽ cần **~30 phút** để hoàn tất toàn bộ. Hãy bắt đầu từ PHẦN 1! 🎉
