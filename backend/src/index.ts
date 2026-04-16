import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import movieRoutes from './routes/movies';
import commentRoutes from './routes/comments';
import commentAdminRoutes from './routes/commentsAdmin';
import analyticsRoutes from './routes/analytics';
import userRoutes from './routes/users';
import seedRoutes from './routes/seedRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:3001',
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check root
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/comments/admin', commentAdminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api', seedRoutes); // Seed endpoint: POST /api/seed

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});
