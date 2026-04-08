# ⚡ Deploy Railway - 15 Phút Quick Start

## 🎯 Mục tiêu
Deploy **webreactfilm.site** lên Railway free tier (backend + database + frontend)

---

## 📋 Pre-requisites (5 phút)

### 1. GitHub account
- [ ] Có GitHub account
- [ ] Code đã push: https://github.com/YOUR_USERNAME/webreactfilm

### 2. Railway account
- [ ] Tạo account: https://railway.app
- [ ] Login with GitHub

---

## 🚀 Deploy Steps (15 phút)

### STEP 1: Deploy Backend + Database (5 phút)

1. Vào https://railway.app → **+ Create New**

2. Chọn **Deploy from GitHub repo**

3. Select repo: `webreactfilm` → **Configure**

4. Railway sẽ hỏi, chọn:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`

5. Click **Add Service** → **PostgreSQL** (database sẽ tự add)

6. Set environment variables cho backend service:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://webreactfilm.site,https://www.webreactfilm.site
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   PORT=${{PORT}}
   ```

7. Click **Deploy** & **Wait** (5-10 phút until "Running" ✅)

8. **Copy Backend URL** từ Deployments tab:
   - Ví dụ: `https://webreactfilm-production-xxx.up.railway.app`
   - **Lưu lại** URL này!

---

### STEP 2: Deploy Frontend Web (5 phút)

1. **Trong cùng Railway project**, click **+ Add Service**

2. Chọn **GitHub Repo** → Select `webreactfilm` repo

3. Configure:
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`

4. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://webreactfilm-production-xxx.up.railway.app/api
   NODE_ENV=production
   ```
   (Replace `xxx` với backend URL từ STEP 1)

5. Click **Deploy** & **Wait** (3-5 phút)

6. **Copy Web URL**:
   - Ví dụ: `https://webreactfilm-production-yyy.up.railway.app`
   - **Note:** Đây là temp URL, sẽ đổi thành domain sau

---

### STEP 3: Deploy Admin Frontend (3 phút)

*Tương tự STEP 2 nhưng dùng folder `admin`*

1. **+ Add Service** → `admin` folder

2. Configure:
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start -p 3002`

3. Environment:
   ```
   NEXT_PUBLIC_API_URL=https://webreactfilm-production-xxx.up.railway.app/api
   NODE_ENV=production
   ```

4. **Deploy**

---

### STEP 4: Test Before Domain (2 phút)

```bash
# Test 1: Backend health
curl https://webreactfilm-production-xxx.up.railway.app/api/health
# Should return: {"status":"ok",...}

# Test 2: Open in browser
https://webreactfilm-production-yyy.up.railway.app
# Should load website without CORS errors
```

---

### STEP 5: Setup Custom Domain (5 phút)

1. **Backend Service** → Settings → **Domain**
   - Click **Add Custom Domain**
   - Enter: `api.webreactfilm.site`
   - Railway tạo SSL cert tự động ✅

2. **Web Service** → Settings → **Domain**
   - Click **Add Custom Domain**
   - Enter: `webreactfilm.site`
   - Railway tạo SSL cert tự động ✅

3. **At your Domain Registrar** (GoDaddy, Namecheap, etc.):
   ```dns
   # Add these CNAME records:
   api        CNAME   gateway.railway.app
   @          CNAME   gateway.railway.app
   www        CNAME   gateway.railway.app
   ```

4. **Wait 15-30 phút** để DNS propagate

5. **Check if ready:**
   ```bash
   ping webreactfilm.site
   # Should resolve ✅
   ```

---

## ✅ Verification

| What to Check | How | Expected Result |
|---|---|---|
| Backend API | `curl https://api.webreactfilm.site/api/health` | `{"status":"ok"}` |
| Web Domain | Visit `https://webreactfilm.site` | Page loads, no CORS error |
| Admin Domain | Visit `https://admin.webreactfilm.site` (or `/admin`) | Admin loads |
| Database | Check backend logs | No connection errors |

---

## 🎉 Done!

Your site is live at **https://webreactfilm.site**!

---

## ⚠️ Important Notes

| Item | Details |
|---|---|
| **Free Tier** | $5/month credits - enough for small site |
| **Build Logs** | Railway → Service → Logs tab |
| **If Error** | Check Railway logs, not terminal |
| **Auto Deploy** | Each `git push` auto-redeploys |
| **Domain DNS** | May take 24h to full propagate |

---

## 🐛 Troubleshooting

| Issue | Fix |
|---|---|
| "Cannot connect to database" | Wait 2 min nach PostgreSQL deploy, then redeploy backend |
| CORS error in browser | Check `CORS_ORIGIN` environment variable |
| "Cannot deploy" build error | Run `npm install` locally & `git push` again |
| Domain not resolving | Verify nameservers at registrar, wait 30 min |
| 502 Bad Gateway | Check backend service logs in Railway |

---

## 📞 Need More Help?

- Full guide: [DEPLOYMENT_RAILWAY_FREE.md](./DEPLOYMENT_RAILWAY_FREE.md)
- Railway docs: https://docs.railway.app
- Debug: Check Railway dashboard → [Service] → Logs

**🚀 Total time: 15-20 minutes**

Good luck! 🎯
