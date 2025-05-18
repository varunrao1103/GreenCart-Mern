import express from 'express';
import AuthSeller from '../middlewares/AuthSeller.js';
import AuthUser from '../middlewares/AuthUser.js';
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  placeOrderStripe,
} from '../controllers/OrderController.js';

const OrderRouter = express.Router();

OrderRouter.post('/cod', AuthUser, placeOrderCOD);
OrderRouter.get('/user', AuthUser, getUserOrders);
OrderRouter.get('/seller', AuthSeller, getAllOrders);
OrderRouter.post('/stripe', AuthUser, placeOrderStripe);

export default OrderRouter;
