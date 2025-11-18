import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { initRedis } from './config/cache.config.js';
import { security } from './config/security.config.js';

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const limiter = rateLimit({
  windowMs: security.rateLimitLogin.windowMs,
  max: security.rateLimitLogin.max,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/login', limiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(routes);

export async function initApp() {
  await initRedis();
  return app;
}