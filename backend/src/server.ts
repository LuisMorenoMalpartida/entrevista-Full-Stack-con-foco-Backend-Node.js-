import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import env from './config/env.js';
import clienteRoutes from './domains/cliente/cliente.routes.js';
import tramiteRoutes from './domains/tramite/tramite.routes.js';

dotenv.config();

const app: Express = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/api/clientes', clienteRoutes);
app.use('/api/tramites', tramiteRoutes);

// Middleware de errores
app.use(errorHandler);

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 Modo: ${env.NODE_ENV}`);
});
