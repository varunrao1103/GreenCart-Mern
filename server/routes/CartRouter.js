import express from 'express';
import { updateCart } from '../controllers/CartController.js';
import AuthUser from '../middlewares/AuthUser.js';

const cartRouter = express.Router();

cartRouter.post('/update', AuthUser, updateCart);

export default cartRouter;
