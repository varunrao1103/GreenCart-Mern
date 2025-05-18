import express from 'express';
import {
  sellerIsAuth,
  sellerLogin,
  sellerLogout,
} from '../controllers/SellerController.js';
import AuthSeller from '../middlewares/AuthSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', AuthSeller, sellerIsAuth);
sellerRouter.get('/logout', AuthSeller, sellerLogout);

export default sellerRouter;
