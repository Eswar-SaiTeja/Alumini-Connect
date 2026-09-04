# 🌐 Hosting & Deployment Guide
## Government College (Autonomous), Rajahmundry — Alumni Connect Platform

This project is a unified full-stack application with:
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend API & WebSockets**: Node.js, Express, Socket.IO, Prisma ORM
- **Database**: SQLite (built-in) or PostgreSQL / MySQL (production ready)

---

## 🚀 Option 1: Free Cloud Hosting on Render.com (Recommended)

Render provides free hosting with full WebSocket and Node.js support.

### Step-by-Step Instructions:

1. **Push Code to GitHub / GitLab**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of GCRJY Alumni Platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/gcrjy-alumni-platform.git
   git push -u origin main
   ```

2. **Create a New Web Service on Render**:
   - Go to [render.com](https://render.com) and log in.
   - Click **New +** → **Web Service**.
   - Connect your GitHub repository.

3. **Configure Settings**:
   - **Name**: `gcrjy-alumni` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: `Singapore` or `Frankfurt` (closest to users)
   - **Branch**: `main`
   - **Build Command**:
     ```bash
     npm install && cd server && npm install && npx prisma generate && npm run build && cd ../client && npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     cd server && npx prisma db push && npx tsx prisma/seed.ts && node dist/index.js
     ```
   - **Plan**: `Free`

4. **Environment Variables**:
   Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = `your_super_secret_jwt_key_2026`
   - `DATABASE_URL` = `file:./dev.db`

5. **Deploy**:
   - Click **Create Web Service**.
   - In 2–3 minutes, Render will build and deploy your platform with a free HTTPS URL like:  
     👉 `https://gcrjy-alumni.onrender.com`

---

## ⚡ Option 2: 1-Click Deployment on Railway.app

Railway automatically detects the root `Dockerfile` and deploys both backend and frontend together.

1. Go to [railway.app](https://railway.app) and sign up with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your repository.
4. Add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = `your_super_secret_jwt_key`
   - `DATABASE_URL` = `file:./dev.db`
5. Click **Deploy**. Railway will provide a live URL like `https://gcrjy-alumni-production.up.railway.app`.

---

## 🐳 Option 3: Universal Docker Container (Any Cloud Provider)

To deploy to AWS, DigitalOcean, Azure, or Fly.io:

```bash
# 1. Build image
docker build -t gcrjy-alumni:latest .

# 2. Run container
docker run -d -p 5000:5000 --name gcrjy-alumni-app gcrjy-alumni:latest
```

Or using Docker Compose:
```bash
docker-compose up -d --build
```

---

## 🌍 Option 4: Instant Public URL for Testing (No Setup Required)

If you want an instant live public HTTPS URL on your phone or to share with others right now:

### Using Cloudflare Quick Tunnel:
```powershell
# In PowerShell:
npx cloudflared tunnel --url http://localhost:5173
```
This gives you an instant, secure public HTTPS URL (e.g., `https://random-words.trycloudflare.com`) that works on any mobile phone on 4G/5G/Wi-Fi anywhere in the world!

### Using LocalTunnel:
```powershell
npx localtunnel --port 5173
```

---

## 🖥️ Option 5: Self-Hosting on a Linux / Ubuntu VPS

### 1. Server Setup:
```bash
sudo apt update && sudo apt install -y nodejs npm nginx git
npm install -g pm2
```

### 2. Clone and Build:
```bash
git clone https://github.com/YOUR_USERNAME/gcrjy-alumni-platform.git /var/www/alumni
cd /var/www/alumni
npm install
npm run build
cd server && npx prisma db push && npm run prisma:seed
```

### 3. Start with PM2 Process Manager:
```bash
cd /var/www/alumni/server
pm2 start dist/index.js --name "gcrjy-alumni"
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy Configuration:
Edit `/etc/nginx/sites-available/alumni.conf`:
```nginx
server {
    listen 80;
    server_name alumni.gcrjy.ac.in;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/alumni.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Free SSL via Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d alumni.gcrjy.ac.in
```
