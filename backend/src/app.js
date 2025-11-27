import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { initRedis } from './config/cache.config.js';
import { security } from './config/security.config.js';
import mongoSanitize from 'mongo-sanitize';

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());

app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
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