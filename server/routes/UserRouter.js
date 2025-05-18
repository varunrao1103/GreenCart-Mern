import express from 'express';
import {
  isAuth,
  login,
  logout,
  register,
} from '../controllers/UserController.js';
import AuthUser from '../middlewares/AuthUser.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/is-auth', AuthUser, isAuth);
userRouter.get('/logout', AuthUser, logout);

export default userRouter;
