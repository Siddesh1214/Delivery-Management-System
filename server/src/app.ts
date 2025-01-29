import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import partnerRoutes from './routes/partner.js';
import orderRoutes from './routes/order.js';
import cors from 'cors';

dotenv.config();
connectDB();
const port = process.env.PORT || 8000;
const app = express();


app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENTURI,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use('/api/v1/partner', partnerRoutes);
app.use('/api/v1/order', orderRoutes);

app.get('/', (request:any,response:any) => {
  return response.json({
    success: true,
    message: 'Welcome to the API',
    clientUri: `client uri is ${process.env.CLIENTURI}`
  })
})



app.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
  console.log(`client uri is ${process.env.CLIENTURI}`);
})