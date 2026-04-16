# Netflix Clone Admin Dashboard

Trang quản trị phim cho Netflix Clone. Cho phép quản lý các bộ phim trong hệ thống.

## Cài đặt

```bash
npm install
```

## Cấu hình môi trường

Tạo file `.env.local` dựa trên `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key
```

## Chạy

```bash
npm run dev
```

Admin Dashboard sẽ chạy trên `http://localhost:3002`

## Tính năng

- **Xem danh sách phim** - Hiển thị tất cả các phim trong hệ thống
- **Thêm phim** - Tạo phim mới với thông tin chi tiết
- **Sửa phim** - Cập nhật thông tin phim
- **Xóa phim** - Xóa phim khỏi hệ thống
- **Quản lý thể loại** - Quản lý các thể loại phim

## Cấu trúc thư mục

- `pages/` - Next.js pages
- `components/` - React components
- `styles/` - CSS styles
- `lib/` - Utility functions
- `public/` - Static files
