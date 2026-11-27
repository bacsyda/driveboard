# Bảng file theo tuần (Google Drive + Vercel)

Cấu trúc thư mục Drive:

    Folder gốc
    ├── file lẻ (video/ảnh)     → hiện ở mục "File lẻ" trên cùng
    ├── Folder con              → bảng
    │   └── Folder cháu         → cột
    │       └── video / ảnh

## Cấu trúc dự án

    api/_lib.js       hàm dùng chung (mã hóa cookie, gọi Google)
    api/login.js      chuyển sang Google để đăng nhập
    api/callback.js   nhận mã từ Google, lưu refresh token vào cookie (180 ngày)
    api/token.js      cấp access token mới cho trang
    public/index.html giao diện (sửa ROOT_ID ở đây)
    vercel.json       rewrite /auth/* sang /api/* và chọn thư mục public
    .env.example      mẫu biến môi trường

## Các bước deploy

1. Mở `public/index.html`, tìm `const ROOT_ID="PASTE_FOLDER_ID_HERE"` và dán ID folder gốc
   (đoạn cuối link folder trên Drive).
2. Đẩy code lên GitHub:
       git init
       git add .
       git commit -m "init"
       git branch -M main
       git remote add origin <link repo>
       git push -u origin main
3. Vercel: Add New → Project → import repo. Framework Preset: Other. Chưa bấm Deploy vội.
   Ghi lại tên miền sẽ có dạng https://<tên-project>.vercel.app
4. Google Cloud Console:
   - Tạo project, bật Google Drive API.
   - OAuth consent screen: User type External, thêm scope .../auth/drive,
     rồi chuyển Publishing status sang In production.
   - Credentials → Create OAuth client ID → Web application.
     Authorized redirect URIs: https://<tên-project>.vercel.app/auth/callback
   - Lấy Client ID và Client secret.
5. Vercel → Settings → Environment Variables (Production):
       CLIENT_ID       = Client ID
       CLIENT_SECRET   = Client secret
       SESSION_SECRET  = chuỗi ngẫu nhiên dài (openssl rand -hex 32)
       BASE_URL        = https://<tên-project>.vercel.app   (không có dấu / cuối)
6. Bấm Deploy (hoặc Redeploy nếu đã deploy trước khi thêm biến).
7. Drive: chia sẻ folder gốc cho từng người xem với quyền Người chỉnh sửa.

## Lưu ý
- Ở trạng thái Testing, refresh token hết hạn sau 7 ngày. Phải để In production.
- App chưa xác minh: người xem thấy cảnh báo "Google hasn't verified this app"
  (Advanced → Continue) và tối đa 100 người đăng nhập.
- Đổi biến môi trường xong phải Redeploy mới có hiệu lực.
- Nếu trang báo 404: Vercel → Settings → Build & Output → Output Directory = public.
