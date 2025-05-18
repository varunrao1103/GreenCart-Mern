import express from 'express';
import AuthUser from '../middlewares/AuthUser.js';
import { addAddress, getAddress } from '../controllers/AddressController.js';

const AddressRouter = express.Router();

AddressRouter.post('/add', AuthUser, addAddress),
  AddressRouter.get('/get', AuthUser, getAddress);

export default AddressRouter;
