# Netflix Clone - Hướng dẫn Setup Hoàn Toàn

## 📋 Điều kiện tiên quyết

1. **Node.js** (phiên bản 16+): https://nodejs.org/
2. **MongoDB Local**: https://www.mongodb.com/try/download/community
3. **Git**: https://git-scm.com/

## 🚀 Quick Start

### 1. Cài đặt Dependencies

```bash
# Backend
cd backend
npm install --legacy-peer-deps

# Frontend
cd ../frontend
npm install

# Admin
cd ../admin
npm install
```

### 2. Cấu hình MongoDB Local

**Windows:**
1. Tải MongoDB Community từ: https://www.mongodb.com/try/download/community
2. Cài đặt và MongoDB sẽ tự chạy như một service
3. Hoặc chạy thủ công:
   ```powershell
   mongod
   ```

### 3. Cấu hình OAuth (Google + GitHub)

Xem chi tiết trong file [OAUTH_SETUP.md](./OAUTH_SETUP.md)

### 4. Tạo file `.env.local` cho mỗi phần

**backend/.env.local:**
```
DATABASE_URL=mongodb://localhost:27017/netflix
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
```

**frontend/.env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

**admin/.env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key-here
```

### 5. Setup Database

```bash
cd backend
npx prisma migrate dev --name init
```

### 6. Chạy Ứng dụng

**Cách 1 - Chạy riêng lẻ (Terminal khác nhau):**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Admin
cd admin
npm run dev
```

**Cách 2 - PowerShell Script (Windows):**
```powershell
.\start-all.ps1
```

### 7. Truy cập Ứng dụng

- 🎬 **Frontend**: http://localhost:3000
- ⚙️ **Backend**: http://localhost:3001
- 👨‍💼 **Admin**: http://localhost:3002

## 📁 Cấu trúc Thư mục

```
nextflix/
├── backend/              # API Backend
│   ├── pages/
│   │   └── api/          # API routes
│   ├── prisma/           # Database schema
│   ├── package.json
│   └── .env.example
│
├── frontend/             # Frontend
│   ├── pages/
│   ├── components/
│   ├── styles/
│   ├── store/            # Redux
│   ├── hooks/
│   ├── package.json
│   └── .env.example
│
└── admin/                # Admin Dashboard
    ├── pages/
    ├── components/
    ├── styles/
    ├── package.json
    └── .env.example
```

## 🔧 Build cho Production

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

## ❓ Troubleshooting

### "MongoDB connection refused"
- Kiểm tra MongoDB service đang chạy
- Windows: Kiểm tra Services > MongoDB Server
- Linux/Mac: `brew services list | grep mongodb`

### "CORS errors"
- Đảm bảo `NEXT_PUBLIC_API_URL=http://localhost:3001` trong frontend/.env.local
- Backend cần cấu hình CORS headers

### "NextAuth not working"
- Kiểm tra `NEXTAUTH_SECRET` giống nhau ở cả 3 phần
- Kiểm tra `NEXTAUTH_URL` trùng khớp với URL chạy app
- Xóa cookies browser và thử lại

### "Build fails"
- Xóa `node_modules` và `package-lock.json`
- Chạy `npm install --legacy-peer-deps`
- Thử `npm run build` lại

## 📚 Tài liệu

- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - Setup Google + GitHub OAuth
- Backend README: [backend/README.md](./backend/README.md)
- Frontend README: [frontend/README.md](./frontend/README.md)
- Admin README: [admin/README.md](./admin/README.md)

## 🎯 Tính năng

### Frontend
- ✅ Xem phim
- ✅ Tìm kiếm phim
- ✅ Danh sách yêu thích
- ✅ Authentication (Google, GitHub)
- ✅ Responsive design

### Admin Dashboard
- ✅ Xem danh sách phim
- ✅ Thêm phim mới
- ✅ Sửa thông tin phim
- ✅ Xóa phim
- ✅ Quản lý thể loại

### Backend API
- ✅ CRUD Movies
- ✅ User Authentication
- ✅ Genre Management
- ✅ Favorites Management
- ✅ NextAuth.js Integration

## 🛠️ Công nghệ

- **Frontend**: Next.js 13, React 18, TailwindCSS, Redux Toolkit
- **Backend**: Next.js 13, Prisma, MongoDB, NextAuth.js
- **Admin**: Next.js 13, React 18, TailwindCSS
- **Database**: MongoDB Atlas / MongoDB Local
- **Authentication**: NextAuth.js (Google, GitHub)

## 📝 Notes

- Tất cả các services chạy trên localhost
- MongoDB local được cấu hình mặc định tại `mongodb://localhost:27017/netflix`
- Sử dụng `npm install --legacy-peer-deps` cho backend để tránh conflict với Prisma
- JWT Secret được sử dụng cho NextAuth sessions

## 💡 Tiếp theo

1. Cấu hình Google OAuth tại: https://console.cloud.google.com
2. Cấu hình GitHub OAuth tại: https://github.com/settings/developers
3. Tạo MongoDB Database tại: https://www.mongodb.com/cloud/atlas
4. Deploy ứng dụng lên Vercel, Heroku, hoặc server của bạn
