# 🚀 Deploy Railway All-in-One (Free Tier) - webreactfilm.site

## 📊 Railway Free Tier
- ✅ **$5/tháng credits** miễn phí
- ✅ Đủ cho 1 backend + 1 database + 1-2 frontend
- ✅ Auto-scaling, zero cold starts
- ❌ Có thể hết credits nếu traffic cao (>10k requests/ngày)

---

## 🎯 Architecture

```
┌─ webreactfilm.site (Vercel free / Railway)
│  ├─ Frontend (web)
│  └─ Admin (/admin route)
│
└─ api.webreactfilm.site (Railway)
   ├─ Backend (Express.js)
   └─ Database (PostgreSQL)
```

---

## 📋 Step-by-Step

### STEP 1: Push code lên GitHub

```bash
cd d:\webreactfilm
git init
git add .
git commit -m "Initial commit for Railway deployment"
git remote add origin https://github.com/YOUR_USERNAME/webreactfilm.git
git branch -M main
git push -u origin main
```

---

### STEP 2: Setup Railway Database + Backend

1. **Vào https://railway.app** → Login with GitHub

2. **Create New Project** → **Deploy from GitHub repo**

3. **Select your repo**: `webreactfilm`

4. **Railway sẽ detect 3 services**. Chọn:
   - `backend` (thư mục chính)
   - Click **Add Service** → Select **PostgreSQL**

5. **Configure Backend:**
   - **Service Name**: `backend`
   - **Start Command**: `npm run start`
   - **Build Command**: `npm run build`
   - **Root Directory**: (để trống, nó tự tìm `backend/package.json`)

6. **Add Environment Variables** cho backend:
   ```
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   PORT=${{PORT}}
   CORS_ORIGIN=https://webreactfilm.site,https://www.webreactfilm.site
   ```

7. **Click Deploy** (5-10 phút)

8. **Ghi nhớ Backend URL**: Railway sẽ sinh URL kiểu `https://webreactfilm-production-xxxx.up.railway.app`

---

### STEP 3: Update Backend CORS

Edit [backend/src/index.ts](../backend/src/index.ts):

```typescript
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3001'
];

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
```

**Push lên:**
```bash
git add backend/src/index.ts
git commit -m "Update CORS for production"
git push
```

Railway sẽ auto-redeploy.

---

### STEP 4: Deploy Frontend (web) trên Railway

1. **Trong Railway project, click** `+ Add Service` → **GitHub Repo**

2. **Deploy web folder:**
   - **Service Name**: `web`
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Node Version**: `18` (set trong environment)

3. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=${{Railway.BACKEND_URL}}/api
   NODE_ENV=production
   ```

   Railway cho phép reference service URL như vậy - nó tự replace!

4. **Deploy** (3-5 phút)

---

### STEP 5: Setup Custom Domain

#### Option A: Railway Domain (dễ nhất, miễn phí)
1. Backend service → **Settings** → **Domain**
2. Railway sinh domain tự động: `webreactfilm-production-xxx.up.railway.app`
3. Tùy chọn: **Add Custom Domain** (yêu cầu verify DNS)

#### Option B: Custom Domain webreactfilm.site (recommended)

1. **Ở Registrar** (nơi bạn mua domain):
   - Tạo **A record**:
     ```
     Type: A
     Name: @
     Value: Railway's IP (xem phía dưới)
     TTL: 3600
     ```

2. **Railway Backend → Settings → Domain:**
   - Click **Add Custom Domain**
   - Nhập: `api.webreactfilm.site`
   - Railway sẽ generate SSL certificate (miễn phí)

3. **Railway Web → Settings → Domain:**
   - Click **Add Custom Domain**
   - Nhập: `webreactfilm.site`
   - Railway sẽ generate SSL certificate

4. **DNS Settings** (tại Registrar):
   ```dns
   ; API Backend
   api.webreactfilm.site    CNAME  gateway.railway.app

   ; Frontend Web
   webreactfilm.site        CNAME  gateway.railway.app
   www.webreactfilm.site    CNAME  gateway.railway.app
   ```

   Railway tự route dựa trên hostname!

5. **Đợi DNS propagate** (5-30 phút)

---

### STEP 6: Update Frontend API URL

Edit [web/libs/fetcher.ts](../web/libs/fetcher.ts) hoặc file API caller:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.origin !== 'http://localhost:3000'
    ? 'https://api.webreactfilm.site/api'
    : 'http://localhost:5000/api');
```

**Push:**
```bash
git add web/libs/fetcher.ts
git commit -m "Update API URL for production"
git push
```

Railway auto-redeploy web.

---

### STEP 7: Test Everything

```bash
# Test backend health
curl https://api.webreactfilm.site/api/health
# Expected: {"status":"ok",...}

# Test CORS
curl -H "Origin: https://webreactfilm.site" \
     -H "Access-Control-Request-Method: GET" \
     https://api.webreactfilm.site/api/movies

# Test frontend
Open: https://webreactfilm.site
# Should load without CORS errors
```

---

## 💰 Giá Cả Railway Free Tier

| Item | Cost | Notes |
|------|------|-------|
| **5 USD/tháng** | FREE | Railway credit |
| PostgreSQL (small) | ≈ $1-2 | Within free tier |
| Backend (Starter) | ≈ $2-3 | Within free tier |
| Frontend (Starter) | ≈ $1 | Within free tier |
| **Total/tháng** | ~**free** | Đủ $5 credits |

> ⚠️ **Lưu ý**: Nếu traffic tăng cao hoặc chạy lâu, hoặc có 2-3 services chạy lâu, hoặc database quá lớn → sẽ hết credits. Khi đó, sẽ mất service.

---

## 🐛 Troubleshooting

| Lỗi | Nguyên nhân | Fix |
|-----|----------|-----|
| Build fails | Missing deps | Run `npm install` locally, push lại |
| Cannot connect to DB | DATABASE_URL sai | Kiểm tra Railway Postgres service created |
| CORS error | Origin không trong allowlist | Update CORS_ORIGIN variable |
| 502 Bad Gateway | Backend crashed | Check Railway logs → Fix lỗi |
| Domain not working | DNS chưa propagate | Đợi 30 phút, clear browser cache |
| "Database connection refused" | PostgreSQL service bị stop | Restart service ở Railway dashboard |

**Check logs ở Railway:**
- Click service → **Logs** tab
- Xem error messages

---

## 📝 Checklist

- [ ] Code push GitHub
- [ ] Backend + PostgreSQL deployed Railway
- [ ] Web frontend deployed Railway
- [ ] CORS updated
- [ ] API_URL updated trên frontend
- [ ] Custom domain add Railway
- [ ] DNS records updated tại Registrar
- [ ] DNS propagated (ping test)
- [ ] Test API endpoint
- [ ] Test frontend ở webreactfilm.site
- [ ] Check Railway logs có error không

---

## 🎯 Next Steps

**Nếu traffic tăng:**
1. Nâng cấp Railway paid plan ($5-20/tháng)
2. Hoặc dùng Vercel + Railway split (Vercel free cho frontend, Railway cho backend)

**Tối ưu free tier:**
- Stop services không dùng
- Clean up old deployments
- Monitor Railway usage dashboard

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Discord: Railway community support
- Check Railway dashboard → Logs tab khi có issue

**Total setup time: ~45 minutes**

Good luck! 🎉
