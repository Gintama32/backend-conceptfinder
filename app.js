import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
app.use(cors({
  origin: 'https://zippy-kleicha-99f2cc.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
import routers from "./routes/routes.js";
app.use('/api/v1/', routers);

export default app;