# 🚀 Hướng dẫn Deploy Frontend lên Vercel

## 📋 Chuẩn bị trước khi deploy

### ✅ Đã hoàn thành:

1. **Cấu hình Environment Variables:**
   - ✅ Tạo file `.env.development` (local)
   - ✅ Tạo file `.env.production` (production)
   - ✅ Cập nhật tất cả components sử dụng `process.env.REACT_APP_API_URL`

2. **Cấu hình Vercel:**
   - ✅ Tạo file `vercel.json` với routing cho SPA

3. **Update code:**
   - ✅ App.js
   - ✅ Auth.jsx
   - ✅ Profile.jsx
   - ✅ AdminUserManagement.jsx
   - ✅ ForgotPassword.jsx

---

## 🔧 Bước 1: Chuẩn bị GitHub Repository

### 1.1. Khởi tạo Git (nếu chưa có)

```bash
cd d:\group15-project
git init
```

### 1.2. Tạo file .gitignore (quan trọng!)

Đảm bảo file `frontend/.gitignore` có nội dung:
```
node_modules/
build/
.env.local
.vercel
```

### 1.3. Commit code

```bash
git add .
git commit -m "Prepare frontend for Vercel deployment"
```

### 1.4. Push lên GitHub

#### Cách 1: Tạo repo mới trên GitHub

1. Truy cập: https://github.com/new
2. Repository name: `group15-project`
3. Visibility: Public hoặc Private
4. Click **"Create repository"**

#### Cách 2: Dùng repo hiện có

Bạn đang có repo: `LeAnhHuyNCTU/group15-project`

```bash
git remote add origin https://github.com/LeAnhHuyNCTU/group15-project.git
git branch -M main
git push -u origin main
```

---

## 🌐 Bước 2: Deploy lên Vercel

### 2.1. Truy cập Vercel

1. Mở: https://vercel.com
2. Click **"Sign Up"** hoặc **"Log In"**
3. Chọn **"Continue with GitHub"**
4. Authorize Vercel truy cập GitHub của bạn

### 2.2. Import Project

1. Sau khi đăng nhập, click **"Add New..."** → **"Project"**
2. Tìm repository: `group15-project`
3. Click **"Import"**

### 2.3. Cấu hình Build Settings

Vercel sẽ hiển thị màn hình cấu hình:

```
┌─────────────────────────────────────────────────┐
│ Configure Project                                │
├─────────────────────────────────────────────────┤
│ Framework Preset: Create React App              │
│                                                  │
│ Root Directory: frontend/                       │
│   [Edit]                                         │
│                                                  │
│ Build and Output Settings                       │
│                                                  │
│ Build Command:                                   │
│   npm run build                                  │
│   [Override]                                     │
│                                                  │
│ Output Directory:                                │
│   build                                          │
│   [Override]                                     │
│                                                  │
│ Install Command:                                 │
│   npm install                                    │
│   [Override]                                     │
└─────────────────────────────────────────────────┘
```

**Cấu hình chi tiết:**

| Setting | Value | Giải thích |
|---------|-------|-----------|
| **Framework Preset** | Create React App | Tự động detect |
| **Root Directory** | `frontend/` | ⚠️ QUAN TRỌNG! Click "Edit" và chọn thư mục `frontend` |
| **Build Command** | `npm run build` | Command để build React app |
| **Output Directory** | `build` | Thư mục chứa file build |
| **Install Command** | `npm install` | Command cài dependencies |

⚠️ **LƯU Ý:** Phải set **Root Directory** là `frontend/` vì code React nằm trong thư mục con!

### 2.4. Thêm Environment Variables

Scroll xuống phần **"Environment Variables"**:

```
┌─────────────────────────────────────────────────┐
│ Environment Variables                            │
├─────────────────────────────────────────────────┤
│                                                  │
│ KEY                    VALUE                     │
│ ─────────────────────  ─────────────────────    │
│ REACT_APP_API_URL      [Add value here]         │
│                                                  │
│                        [Add New]                 │
└─────────────────────────────────────────────────┘
```

**Thêm biến:**

1. Click **"Add"** hoặc **"Environment Variables"**
2. Key: `REACT_APP_API_URL`
3. Value: URL backend của bạn

**Các tùy chọn cho Value:**

#### Option 1: Backend đã deploy (khuyến nghị)
```
https://your-backend.herokuapp.com/api
https://your-backend.railway.app/api
https://your-backend-api.onrender.com/api
```

#### Option 2: Backend local (tạm thời để test)
```
http://localhost:3000/api
```
⚠️ **Lưu ý:** Localhost chỉ hoạt động khi test local, không hoạt động trên production!

#### Option 3: Backend chưa deploy
- Bỏ qua bước này
- Deploy backend trước (Heroku, Railway, Render)
- Quay lại Vercel sau để thêm biến

4. Environment: Chọn **"Production"**, **"Preview"**, **"Development"** (hoặc tất cả)
5. Click **"Add"**

### 2.5. Deploy!

1. Kiểm tra lại tất cả cấu hình
2. Click **"Deploy"**
3. Chờ Vercel build (khoảng 1-3 phút)

```
🔨 Building...
  ▶ Installing dependencies...
  ▶ Running build command...
  ▶ Collecting build output...
  ▶ Uploading build...
✅ Deployment Complete!
```

---

## 🎉 Bước 3: Kiểm tra Deployment

### 3.1. Xem Domain

Sau khi deploy thành công, Vercel sẽ tạo domain:

```
🌐 https://group15-project.vercel.app
🌐 https://group15-project-git-main-yourname.vercel.app
🌐 https://group15-project-xyz123.vercel.app
```

### 3.2. Test tính năng

1. **Mở domain:** https://your-project.vercel.app
2. **Test đăng ký:** Tạo tài khoản mới
3. **Test đăng nhập:** Login với tài khoản vừa tạo
4. **Test profile:** Xem và cập nhật profile
5. **Test admin:** Đăng nhập với admin và quản lý users

### 3.3. Kiểm tra Console

Mở Chrome DevTools (F12) → Console:

```javascript
// Kiểm tra API URL đang dùng
console.log('API URL:', process.env.REACT_APP_API_URL);

// Test API connection
fetch(process.env.REACT_APP_API_URL + '/auth/me')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## 🔄 Bước 4: Update Code (Deploy lại)

Khi bạn cập nhật code:

```bash
# 1. Commit changes
git add .
git commit -m "Update frontend features"

# 2. Push to GitHub
git push origin main

# 3. Vercel tự động deploy!
```

⚡ **Auto Deploy:** Vercel tự động build và deploy mỗi khi bạn push code lên GitHub!

---

## ⚙️ Bước 5: Cấu hình nâng cao (Optional)

### 5.1. Custom Domain

1. Vào Project Settings trong Vercel
2. Tab **"Domains"**
3. Click **"Add"**
4. Nhập domain của bạn: `myproject.com`
5. Cấu hình DNS theo hướng dẫn

### 5.2. Environment Variables cho từng môi trường

```
Production:   REACT_APP_API_URL = https://api.production.com/api
Preview:      REACT_APP_API_URL = https://api.staging.com/api
Development:  REACT_APP_API_URL = http://localhost:3000/api
```

### 5.3. Build Settings

Vào **Settings** → **General** → **Build & Development Settings**:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "devCommand": "npm start"
}
```

---

## 🐛 Troubleshooting

### ❌ Lỗi: "Build failed"

**Nguyên nhân:** Lỗi compile hoặc thiếu dependencies

**Giải pháp:**
1. Check logs trong Vercel Dashboard
2. Build local để test: `npm run build`
3. Fix lỗi và push lại

### ❌ Lỗi: "Root Directory not found"

**Nguyên nhân:** Chưa set Root Directory

**Giải pháp:**
1. Vào Project Settings
2. Tab **"General"**
3. **Root Directory:** Click "Edit" → Chọn `frontend`
4. Save và redeploy

### ❌ Lỗi: "API connection failed"

**Nguyên nhân:** Backend chưa deploy hoặc CORS chưa cấu hình

**Giải pháp:**

1. **Check backend URL:**
   ```bash
   curl https://your-backend-url.com/api/auth/login
   ```

2. **Cấu hình CORS trong backend:**
   ```javascript
   // backend/server.js
   const cors = require('cors');
   
   app.use(cors({
     origin: [
       'http://localhost:3001',
       'https://your-project.vercel.app'
     ],
     credentials: true
   }));
   ```

3. **Update Environment Variable trong Vercel:**
   - Settings → Environment Variables
   - Edit `REACT_APP_API_URL`
   - Redeploy

### ❌ Lỗi: 404 khi refresh trang

**Nguyên nhân:** SPA routing không được cấu hình

**Giải pháp:** File `vercel.json` đã có routing:
```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### ❌ Lỗi: Environment variable undefined

**Nguyên nhân:** Biến môi trường chưa được set hoặc không bắt đầu bằng `REACT_APP_`

**Giải pháp:**
1. Đảm bảo tên biến: `REACT_APP_API_URL` (có prefix `REACT_APP_`)
2. Thêm trong Vercel Environment Variables
3. Redeploy project

---

## 📊 Monitoring & Analytics

### View Deployment Logs

1. Vào Vercel Dashboard
2. Click vào project
3. Tab **"Deployments"**
4. Click vào deployment cụ thể → **"View Function Logs"**

### Performance Monitoring

Vercel cung cấp:
- ⚡ Speed Insights
- 📊 Web Vitals
- 🔍 Error tracking

Vào tab **"Analytics"** để xem chi tiết.

---

## 📝 Checklist Deploy

- [ ] Code đã được push lên GitHub
- [ ] Root Directory set là `frontend/`
- [ ] Framework Preset: Create React App
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Environment Variable `REACT_APP_API_URL` đã thêm
- [ ] Backend đã deploy và hoạt động
- [ ] CORS đã cấu hình cho Vercel domain
- [ ] Deploy thành công
- [ ] Test đăng ký/đăng nhập
- [ ] Test tất cả tính năng chính

---

## 🎓 Best Practices

### 1. Separate Frontend & Backend Repos

Nếu có thể, tách frontend và backend thành 2 repos riêng:
```
repo: group15-frontend  → Deploy Vercel
repo: group15-backend   → Deploy Heroku/Railway
```

### 2. Environment-based Configuration

```javascript
// src/config.js
const config = {
  development: {
    apiUrl: 'http://localhost:3000/api'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

### 3. Git Workflow

```bash
main         → Production (auto-deploy Vercel)
develop      → Staging (preview deployment)
feature/*    → Feature branches
```

### 4. Security

- ✅ Không commit file `.env` lên Git
- ✅ Dùng Environment Variables trong Vercel
- ✅ Set CORS chính xác trong backend
- ✅ HTTPS only trong production

---

## 🔗 Links hữu ích

- 📘 Vercel Docs: https://vercel.com/docs
- 📘 Deploy React: https://vercel.com/guides/deploying-react-with-vercel
- 📘 Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
- 🎓 Vercel CLI: https://vercel.com/docs/cli

---

## 🎯 Next Steps

Sau khi deploy frontend:

1. **Deploy Backend:**
   - Heroku: https://www.heroku.com
   - Railway: https://railway.app
   - Render: https://render.com

2. **Update Environment Variables:**
   - Copy backend URL
   - Update `REACT_APP_API_URL` trong Vercel
   - Redeploy

3. **Setup Custom Domain** (optional)

4. **Add Analytics & Monitoring**

5. **Setup CI/CD Pipeline**

---

✅ **Hoàn thành!** Frontend của bạn đã sẵn sàng deploy lên Vercel! 🚀

**Domain mẫu:**
```
https://group15-project.vercel.app
```

Bây giờ hãy làm theo các bước trên để deploy nhé! 🎉
