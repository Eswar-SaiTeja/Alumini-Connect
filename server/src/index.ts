import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { initSocket } from './sockets/socketHandler';

// Import route handlers
import authRoutes from './routes/authRoutes';
import alumniRoutes from './routes/alumniRoutes';
import eventRoutes from './routes/eventRoutes';
import newsRoutes from './routes/newsRoutes';
import storyRoutes from './routes/storyRoutes';
import galleryRoutes from './routes/galleryRoutes';
import contactRoutes from './routes/contactRoutes';
import settingsRoutes from './routes/settingsRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Initialize Real-time Socket.IO
initSocket(server, CLIENT_URL);

// Standard Middlewares
app.use(
  cors({
    origin: true, // Allow local network devices (phones, tablets, laptops)
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve client production build if available
const clientDistPath = path.join(__dirname, '../../client/dist');
const altClientDistPath = path.join(__dirname, '../client/dist');
const dockerClientDist = '/app/client/dist';
const resolvedClientDist = fs.existsSync(clientDistPath)
  ? clientDistPath
  : fs.existsSync(altClientDistPath)
  ? altClientDistPath
  : fs.existsSync(dockerClientDist)
  ? dockerClientDist
  : null;

if (resolvedClientDist) {
  app.use(express.static(resolvedClientDist));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Government College (Autonomous), Rajahmundry Alumni API',
    timestamp: new Date().toISOString(),
  });
});

// SPA catch-all fallback for client routing
if (resolvedClientDist) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(resolvedClientDist, 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎓 GCRJY Alumni Connect API & Realtime Server`);
  console.log(`🚀 Running at: http://localhost:${PORT}`);
  console.log(`⚡ Real-time Socket.IO connected & ready`);
  console.log(`====================================================`);
});
