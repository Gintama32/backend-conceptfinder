import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
import routers from "./routes/routes.js";
app.use('/api/v1/', routers);



export default app;