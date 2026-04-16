# Hướng dẫn Cấu hình MongoDB Local + OAuth

## 1. Cấu hình MongoDB Local

### Bước 1: Cài đặt MongoDB Community Edition

**Windows:**
1. Tải MongoDB Community từ https://www.mongodb.com/try/download/community
2. Chạy installer và làm theo hướng dẫn
3. MongoDB sẽ được cài đặt mặc định tại `C:\Program Files\MongoDB`

### Bước 2: Chạy MongoDB Server

**Windows (sử dụng MongoDB Service):**
```powershell
# MongoDB service sẽ tự chạy nếu được cài đặt như service
# Kiểm tra MongoDB đang chạy:
Get-Service MongoDB
```

**Hoặc chạy thủ công:**
```powershell
cd "C:\Program Files\MongoDB\Server\7.0\bin"
.\mongod.exe
```

### Bước 3: Cấu hình Prisma cho MongoDB Local

Sửa file `backend/.env.local`:

```
# Cho MongoDB local mặc định
DATABASE_URL=mongodb://localhost:27017/netflix

# Hoặc với authentication (nếu bạn thiết lập user)
DATABASE_URL=mongodb://username:password@localhost:27017/netflix
```

### Bước 4: Tạo Database và Collections

```bash
cd backend
npx prisma migrate dev --name init
```

### Kiểm tra MongoDB đang chạy

Mở terminal khác và chạy:
```bash
mongosh
# Hoặc công cụ GUI: MongoDB Compass
```

---

## 2. Cấu hình Google OAuth

### Bước 1: Tạo Google Cloud Project

1. Truy cập https://console.cloud.google.com/
2. Tạo Project mới: Nhấp "Select a project" > "New Project"
   - Project name: `Netflix Clone`
   - Nhấp "Create"
3. Chờ project được tạo

### Bước 2: Tạo OAuth 2.0 Credentials

1. Vào menu Credentials (bên trái)
   - APIs & Services > Credentials
2. Nhấp "Create Credentials" > "OAuth client ID"
3. Nếu chưa có OAuth consent screen:
   - Nhấp "Create Consent Screen"
   - Chọn "External"
   - Điền thông tin:
     - App name: Netflix Clone
     - User support email: email@example.com
     - Developer contact: email@example.com
   - Nhấp "Save and Continue"
4. Thêm scopes (nếu cần)
5. Nhấp "Save and Continue"

### Bước 3: Tạo OAuth Client ID

1. Quay lại Credentials
2. Nhấp "Create Credentials" > "OAuth client ID"
3. Application type: **Web application**
4. Name: Netflix Clone
5. Thêm Authorized redirect URIs:
   ```
   http://localhost:3001/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   http://localhost:3002/api/auth/callback/google
   ```
6. Nhấp "Create"
7. Copy **Client ID** và **Client Secret**

### Bước 4: Cấu hình trong `.env.local`

**backend/.env.local:**
```
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

**frontend/.env.local:**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

**admin/.env.local:**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

---

## 3. Cấu hình GitHub OAuth

### Bước 1: Tạo GitHub OAuth App

1. Truy cập https://github.com/settings/apps hoặc Settings > Developer settings > OAuth Apps
2. Nhấp "New OAuth App"
3. Điền thông tin:
   - **Application name**: Netflix Clone
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**:
     ```
     http://localhost:3001/api/auth/callback/github
     http://localhost:3000/api/auth/callback/github
     http://localhost:3002/api/auth/callback/github
     ```
4. Nhấp "Register application"

### Bước 2: Lấy Credentials

1. Sau khi register, bạn sẽ thấy:
   - **Client ID**
   - **Client Secret** (nhấp "Generate a new client secret")
2. Copy cả hai giá trị

### Bước 3: Cấu hình trong `.env.local`

**backend/.env.local:**
```
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

**frontend/.env.local:**
```
NEXT_PUBLIC_GITHUB_ID=your-github-client-id
```

**admin/.env.local:**
```
NEXT_PUBLIC_GITHUB_ID=your-github-client-id
```

---

## 4. File `.env.local` Hoàn chỉnh

### backend/.env.local
```
# Database - MongoDB Local
DATABASE_URL=mongodb://localhost:27017/netflix

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-super-secret-key-change-this

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### frontend/.env.local
```
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this

# OAuth IDs (public)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GITHUB_ID=your-github-client-id
```

### admin/.env.local
```
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-super-secret-key-change-this

# OAuth IDs (public)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GITHUB_ID=your-github-client-id
```

---

## 5. Chạy Ứng dụng

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Chạy trên http://localhost:3001

# Terminal 2 - Frontend
cd frontend
npm run dev
# Chạy trên http://localhost:3000

# Terminal 3 - Admin
cd admin
npm run dev
# Chạy trên http://localhost:3002
```

---

## 6. Kiểm tra OAuth

1. Truy cập http://localhost:3000 (Frontend)
2. Nhấp vào nút "Sign in with Google" hoặc "Sign in with GitHub"
3. Bạn sẽ được chuyển hướng sang trang login
4. Sau khi login thành công, bạn sẽ quay lại ứng dụng

---

## Troubleshooting

### MongoDB không kết nối
- Đảm bảo MongoDB service đang chạy
- Kiểm tra `DATABASE_URL` có đúng không
- Mở MongoDB Compass để test kết nối

### OAuth redirect không hoạt động
- Kiểm tra callback URLs trong Google Cloud Console / GitHub
- Đảm bảo `NEXTAUTH_URL` trùng khớp với URL chạy app
- Xóa cookies và thử lại

### CORS errors
- Kiểm tra `NEXT_PUBLIC_API_URL` trỏ đúng backend
- Backend cần cấu hình CORS headers

---

## Tài liệu tham khảo

- MongoDB: https://docs.mongodb.com/
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- GitHub OAuth: https://docs.github.com/en/developers/apps/building-oauth-apps
- NextAuth.js: https://next-auth.js.org/
