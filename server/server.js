import cookieParser from 'cookie-parser';
import express from 'express';
import connectDB from './configs/db.js';
import 'dotenv/config';
import cors from 'cors';
import userRouter from './routes/UserRouter.js';
import sellerRouter from './routes/SellerRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import ProductRouter from './routes/ProductRouter.js';
import CartRouter from './routes/CartRouter.js';
import AddressRouter from './routes/AddressRouter.js';
import OrderRouter from './routes/OrderRouter.js';
import { stripeWebhooks } from './controllers/OrderController.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173', 'https://green-cart-vert.vercel.app'];

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Middleware configurations
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/', (req, res) => {
  res.send('API is working successfully !');
});

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', ProductRouter);
app.use('/api/cart', CartRouter);
app.use('/api/address', AddressRouter);
app.use('/api/order', OrderRouter);

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
