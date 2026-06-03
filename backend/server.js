import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import artistsRouter from './src/routes/artists.js';
import authRouter from './src/routes/auth.js';
import eventsRouter from './src/routes/events.js';
import spotifyRouter from './src/routes/spotify.js';
import usersRouter from './src/routes/users.js';

const app = express();

// Trust reverse proxy (Vercel sits in front, so the rate limiter needs true client IPs)
app.set('trust proxy', 1);

// Security Headers (OWASP #5)
app.use(helmet());
app.disable('x-powered-by');

// Global Rate Limiting (OWASP #4 - DoS Prevention)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Too many requests from this IP, please try again later.' },
  skip: (req) => ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// CORS Hardening
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Music Calendar API is running!' });
});

// mount routes
app.use('/api/artists', artistsRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/spotify', spotifyRouter);
app.use('/api/users', usersRouter);

// NOTE: schema migrations live in src/scripts/ (e.g. migrate-profile-image.js),
// not here. Running ALTER TABLE on every cold start was removed.

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () =>
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`)
  );
}

export default app;
