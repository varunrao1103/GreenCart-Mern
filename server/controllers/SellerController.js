import jwt from 'jsonwebtoken';

// Login Seller : api/seller/login

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.cookie('sellerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ success: true, message: 'logged in ' });
    } else {
      res.json({ success: false, message: 'invalid credentials ' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Check seller Auth: /api/seller/is-auth
export const sellerIsAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// seller Logout : /api/seller/logout:

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie('sellerToken', {
      httpOnly: true,
      SameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
