import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db';
import authRoutes from './routes/auth.routes';
import shopRoutes from './routes/shop.routes';
import productRoutes from './routes/product.routes';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
db.connect().then(() => app.listen(PORT, () => console.log(`Server running on :${PORT}`)));
