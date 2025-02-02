import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'https://zippy-kleicha-99f2cc.netlify.app'
}));
app.use(express.json());
import routers from "./routes/routes.js";
app.use('/api/v1/', routers);



export default app;