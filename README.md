# 🎬 WebReactFilm - Nền tảng Phim Trực tuyến (Netflix Clone)

**WebReactFilm** là một ứng dụng fullstack hiện đại để xem phim trực tuyến, tương tự Netflix. Dự án này được tách thành các thành phần riêng biệt bao gồm Backend API, Frontend cho người dùng, Trang quản trị Admin, và Trang web chính. Tất cả được xây dựng bằng các công nghệ web hiện đại.

---

## 📋 Mục lục

- [Tổng quan dự án](#tổng-quan-dự-án)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Các thành phần chính](#các-thành-phần-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt và thiết lập](#cài-đặt-và-thiết-lập)
- [Chạy dự án](#chạy-dự-án)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Cơ sở dữ liệu](#cơ-sở-dữ-liệu)
- [Xác thực người dùng](#xác-thực-người-dùng)
- [Build cho Production](#build-cho-production)

---

## 🎯 Tổng quan dự án

**WebReactFilm** là một ứng dụng web fullstack cho phép người dùng:

✅ Duyệt và tìm kiếm các bộ phim/series  
✅ Xem phim trực tuyến với giao diện hiện đại  
✅ Tạo danh sách yêu thích (My List)  
✅ Xem bình luận và tương tác với người dùng khác  
✅ Quản lý hồ sơ người dùng (Profile)  
✅ Đăng nhập an toàn với xác thực OAuth  

Người quản trị có thể:

✅ Quản lý bộ sưu tập phim (tạo, sửa, xóa)  
✅ Quản lý danh mục/thể loại  
✅ Quản lý người dùng và quyền hạn  
✅ Xem thống kê và phân tích  
✅ Quản lý banner quảng cáo  

---

## 📁 Cấu trúc thư mục

```
webreactfilm/
├── web/                      # 🌐 Trang web chính cho người dùng (Next.js)
│   ├── pages/               # Các trang Next.js
│   ├── components/          # Các component React
│   ├── hooks/              # Custom hooks
│   ├── libs/               # Hàm tiện ích, xác thực, API
│   ├── store/              # Redux store
│   ├── public/             # Hình ảnh, media tĩnh
│   ├── prisma/             # Schema cơ sở dữ liệu
│   └── styles/             # CSS/Tailwind
│
├── admin/                    # 👨‍💼 Trang quản trị Admin (Next.js)
│   ├── pages/              # Các trang quản lý
│   ├── components/         # Component UI
│   ├── lib/                # Hàm tiện ích
│   └── styles/             # CSS/Tailwind
│
├── frontend/               # 📱 Frontend thay thế (Next.js)
│   ├── pages/             # Các trang
│   └── styles/            # CSS/Tailwind
│
├── backend/                # 🔧 API Backend (Next.js)
│   ├── pages/api/         # API endpoints
│   ├── src/               # Source code backend
│   ├── prisma/            # Schema cơ sở dữ liệu
│   └── tsconfig.json      # Cấu hình TypeScript
│
├── build-all.ps1          # Script build toàn bộ (PowerShell)
├── build-all.sh           # Script build toàn bộ (Bash)
├── start-all.ps1          # Script chạy toàn bộ (PowerShell)
├── start-all.sh           # Script chạy toàn bộ (Bash)
├── package.json           # Dependencies chính
└── README.md             # Tài liệu này
```

---

## 🏗️ Các thành phần chính

### 1️⃣ **Web (Trang chính cho người dùng) - Port 3000**

Giao diện người dùng chính cho việc xem và tìm kiếm phim.

**Công nghệ:**
- Next.js 13+
- React 18
- TypeScript
- TailwindCSS
- Redux Toolkit (quản lý state)
- SWR/Axios (gọi API)
- NextAuth.js (xác thực)

**Tính năng chính:**
- Trang chủ với banner quảng cáo động
- Danh sách phim theo thể loại
- Trang chi tiết phim
- Phát video trực tuyến
- Danh sách "Phim yêu thích"
- Thêm bình luận
- Cài đặt và quản lý hồ sơ

**Cài đặt & Chạy:**
```bash
cd web
npm install
npm run dev
# Truy cập: http://localhost:3000
```

---

### 2️⃣ **Admin Dashboard - Port 3002**

Trang quản trị dành cho quản lý nội dung và người dùng.

**Công nghệ:**
- Next.js 13+
- React 18
- TypeScript
- TailwindCSS
- Axios (API calls)

**Chức năng quản lý:**
- 📽️ Quản lý phim (tạo, sửa, xóa)
- 🎭 Quản lý thể loại
- 👥 Quản lý người dùng
- 📊 Xem thống kê analytics
- 🎨 Quản lý banner quảng cáo
- 💬 Kiểm duyệt bình luận

**Cài đặt & Chạy:**
```bash
cd admin
npm install
npm run dev
# Truy cập: http://localhost:3002
```

---

### 3️⃣ **Backend API - Port 3001**

Máy chủ API xử lý tất cả các logic backend, xác thực, và quản lý dữ liệu.

**Công nghệ:**
- Next.js 13+ (tạo API routes)
- Node.js
- TypeScript
- Prisma ORM
- MongoDB Atlas
- NextAuth.js

**Chủ yếu API endpoints:**
- `GET /api/movies` - Danh sách phim
- `POST /api/movies` - Tạo phim mới
- `GET /api/movies/[id]` - Chi tiết phim
- `PUT /api/movies/[id]` - Cập nhật phim
- `DELETE /api/movies/[id]` - Xóa phim
- `GET /api/users` - Danh sách người dùng
- `POST /api/favorites` - Thêm vào yêu thích
- `POST /api/comments` - Thêm bình luận

**Cài đặt & Chạy:**
```bash
cd backend
npm install
npm run dev
# Server chạy trên: http://localhost:3001
```

---

### 4️⃣ **Frontend (Thay thế) - Port 3000**

Phiên bản frontend thay thế, có thể được sử dụng thay vì `web/`.

---

## 🛠️ Công nghệ sử dụng

| Lĩnh vực | Công nghệ |
|---------|----------|
| **Framework** | Next.js 13+, React 18 |
| **Ngôn ngữ** | TypeScript, JavaScript |
| **Styling** | TailwindCSS, PostCSS |
| **Database** | MongoDB Atlas, Prisma ORM |
| **Authentication** | NextAuth.js (Google, GitHub OAuth) |
| **State Management** | Redux Toolkit |
| **HTTP Client** | Axios, SWR |
| **Build Tool** | Next.js built-in |
| **Version Control** | Git |

---

## 💾 Cài đặt và thiết lập

### Yêu cầu tiên quyết

- Node.js >= 16.x
- npm hoặc yarn
- MongoDB Atlas account (hoặc MongoDB local)
- Git

### Bước 1: Clone dự án

```bash
git clone https://github.com/MAC-hungoai/webreactfilm.git
cd webreactfilm
```

### Bước 2: Cài đặt dependencies

```bash
# Cài đặt dependencies chính
npm install

# Hoặc cài từng thành phần
cd web && npm install
cd ../admin && npm install
cd ../backend && npm install
```

### Bước 3: Cấu hình MongoDB

1. Tạo tài khoản tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo một cluster mới
3. Lấy connection string

---

## ⚙️ Cấu hình môi trường

### Backend - `backend/.env.local`

```env
# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/webreactfilm

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - GitHub
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret

# API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Web - `web/.env.local`

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters
```

### Admin - `admin/.env.local`

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters
```

---

## 💾 Cơ sở dữ liệu

### Thiết lập Prisma

```bash
cd backend

# Tạo migrations
npx prisma migrate dev --name init

# Seed dữ liệu (nếu có)
npm run seed

# Mở Prisma Studio để quản lý DB
npx prisma studio
```

### Schema chính

Xem file `backend/prisma/schema.prisma` để hiểu cấu trúc:

- **Users** - Thông tin người dùng
- **Movies** - Danh sách phim/series
- **Genres** - Thể loại phim
- **Favorites** - Danh sách yêu thích
- **Comments** - Bình luận từ người dùng
- **Accounts** - OAuth accounts
- **Sessions** - Phiên đăng nhập

---

## 🔐 Xác thực người dùng

Dự án sử dụng **NextAuth.js** với các phương thức xác thực:

### OAuth Providers

#### Google OAuth Setup:
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo OAuth 2.0 credentials (Web application)
3. Thêm URIs được phép:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3001/api/auth/callback/google`
   - `http://localhost:3002/api/auth/callback/google`
4. Sao chép Client ID và Secret vào `.env.local`

#### GitHub OAuth Setup:
1. Truy cập [GitHub Developer Settings](https://github.com/settings/developers)
2. Tạo OAuth App mới
3. Thêm Authorization callback URLs:
   - `http://localhost:3000/api/auth/callback/github`
   - `http://localhost:3001/api/auth/callback/github`
   - `http://localhost:3002/api/auth/callback/github`
4. Sao chép Client ID và Secret vào `.env.local`

---

## 🚀 Chạy dự án

### Cách 1: Chạy từng thành phần riêng biệt

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend: http://localhost:3001
```

**Terminal 2 - Web (Main UI):**
```bash
cd web
npm run dev
# Frontend: http://localhost:3000
```

**Terminal 3 - Admin:**
```bash
cd admin
npm run dev
# Admin: http://localhost:3002
```

### Cách 2: Chạy tất cả cùng một lúc (Windows PowerShell)

```bash
./start-all.ps1
```

### Cách 3: Chạy tất cả cùng một lúc (Linux/Mac)

```bash
./start-all.sh
```

---

## 📍 Các URL chính

| Ứng dụng | URL | Port |
|---------|-----|------|
| **Frontend (Web chính)** | http://localhost:3000 | 3000 |
| **Admin Dashboard** | http://localhost:3002 | 3002 |
| **Backend API** | http://localhost:3001 | 3001 |

---

## 🏭 Build cho Production

### Build toàn bộ dự án

```bash
# Windows PowerShell
./build-all.ps1

# Linux/Mac
./build-all.sh
```

### Build từng thành phần

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Web:**
```bash
cd web
npm run build
npm start
```

**Admin:**
```bash
cd admin
npm run build
npm start
```

---

## 📊 Các tệp tài liệu quan trọng

- [SETUP.md](./SETUP.md) - Hướng dẫn cài đặt chi tiết
- [QUICKSTART.md](./QUICKSTART.md) - Hướng dẫn nhanh
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Tài liệu toàn bộ
- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - Hướng dẫn OAuth
- [COMMANDS_CHEATSHEET.md](./COMMANDS_CHEATSHEET.md) - Tham chiếu lệnh
- [PROJECT_HISTORY.md](./PROJECT_HISTORY.md) - Lịch sử dự án

---

## 🐛 Xử lý sự cố

### Backend không kết nối được Database

```bash
# Kiểm tra DATABASE_URL trong .env.local
# Đảm bảo MongoDB cluster đang chạy
# Chạy migrations lại
cd backend
npx prisma migrate dev --name init
```

### Port đang được sử dụng

```bash
# Kiểm tra process đang chạy
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000

# Dừng process hoặc sử dụng port khác
```

### Module không tìm thấy

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

---

## 👥 Đóng góp

Nếu muốn đóng góp vào dự án, vui lòng:

1. Fork dự án
2. Tạo branch tính năng mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📝 License

Dự án này được cấp phép dưới MIT License - xem file [LICENSE](./LICENSE) để biết chi tiết.

---

## 📧 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng liên hệ:

- GitHub Issues: [MAC-hungoai/webreactfilm/issues](https://github.com/MAC-hungoai/webreactfilm/issues)

---

**Made with ❤️ by the WebReactFilm Team**
