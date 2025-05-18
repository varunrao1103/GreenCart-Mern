import Address from '../models/Address.js';

// add address : /api/address/add:
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { address } = req.body;
    console.log(userId);
    console.log(address);
    await Address.create({ ...address, userId });
    res.json({ success: true, message: 'address added successfully ' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get address : /api/address/get:
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
