## Troubleshooting

### Lỗi kết nối database
- Kiểm tra MongoDB connection string
- Đảm bảo IP được whitelist trong MongoDB Atlas
- Kiểm tra DATABASE_URL trong .env.local

### Lỗi CORS
- Backend và Frontend phải có cấu hình CORS phù hợp
- Kiểm tra NEXT_PUBLIC_API_URL trong Frontend

### Lỗi NextAuth
- Đảm bảo NEXTAUTH_SECRET được cấu hình
- Kiểm tra NEXTAUTH_URL trùng khớp với URL chạy app

## Hỗ trợ

Để tìm hiểu thêm, xem README.md trong mỗi thư mục con.

## License

MIT
