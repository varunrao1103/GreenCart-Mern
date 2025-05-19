import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
  } = useAppContext();
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState('COD');

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      product.quantity = cartItems[key];
      tempArray.push(product);
    }
    setCartArray(tempArray);
  };

  const getUserAddresses = async () => {
    try {
      const { data } = await axios.get('/api/address/get');
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeorder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error('please select an address');
      }
      if (paymentOption === 'COD') {
        const { data } = await axios.post('/api/order/cod', {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate('/my-orders');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post('/api/order/stripe', {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddresses();
    }
  }, [user]);

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-8 md:mt-16 px-4 md:px-0">
      <div className="flex-1 max-w-4xl mb-8 md:mb-0 md:mr-8">
        <h1 className="text-2xl font-medium mb-4 md:text-3xl">
          Shopping Cart
          <span className="text-sm text-primary ml-2">
            {getCartCount()} Items
          </span>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] text-gray-500 text-sm md:text-base font-medium pb-2 md:pb-3 items-center">
          <p className="text-left">Product Details</p>
          <p className="text-right md:text-center">Subtotal</p>
          <p className="hidden md:block text-right md:text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium py-2 md:py-3 border-b border-gray-300"
          >
            <div className="relative flex md:justify-start gap-2 md:gap-6">
              <div className="md:block hidden">
                {' '}
                {/* Hide image on mobile, show on desktop */}
                <div
                  onClick={() => {
                    navigate(
                      `/products/${product.category.toLowerCase()}/${
                        product._id
                      }`
                    );
                    scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-16 h-16 md:w-24 md:h-24 flex items-center justify-center border border-gray-300 rounded"
                >
                  <img
                    className="max-w-full h-full object-cover"
                    src={product.image[0]}
                    alt={product.name}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm md:text-base">
                    {product.name}
                  </p>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="text-xs text-red-500 border border-red-500 rounded px-2 py-0.5 md:hidden" // Added md:hidden to hide on larger screens
                  >
                    Remove
                  </button>
                </div>
                <div className="font-normal text-gray-500/70 text-xs md:text-sm">
                  <p>
                    Weight: <span>{product.weight || 'N/A'}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <p>Qty:</p>
                    <select
                      onChange={(e) =>
                        updateCartItem(product._id, Number(e.target.value))
                      }
                      value={cartItems[product._id]}
                      className="outline-none text-xs md:text-sm"
                    >
                      {Array(
                        cartItems[product._id] > 9 ? cartItems[product._id] : 9
                      )
                        .fill('')
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-right md:text-center self-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>
            <div className="text-right md:text-center self-center hidden md:block">
              <button
                onClick={() => removeFromCart(product._id)}
                className="cursor-pointer mx-auto text-xs text-red-500 border border-red-500 rounded px-2 py-0.5"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            navigate('/products');
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-6 gap-2 text-primary font-medium text-sm md:text-base"
        >
          <img
            className="group-hover: -translate-x-1 transition w-4 h-4 md:w-5 md:h-5"
            src={assets.arrow_right_icon_colored}
            alt="arrow_right_icon_colored"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-4 md:p-5 max-md:mt-8 border border-gray-300/70">
        <h2 className="text-lg md:text-xl font-medium mb-3">Order Summary</h2>
        <hr className="border-gray-300 my-4" />

        <div className="mb-4 md:mb-6">
          <p className="text-sm font-medium uppercase mb-1">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-1 md:mt-2">
            <p className="text-gray-500 text-xs md:text-sm">
              {selectedAddress
                ? `${selectedAddress.street} , ${selectedAddress.city} , ${selectedAddress.state}, ${selectedAddress.country} `
                : 'No address found'}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer text-xs md:text-sm"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-10 md:top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                {addresses.map((address, index) => (
                  <p
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 text-xs md:text-sm"
                  >
                    {address.street},{address.city},{address.state},
                    {address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate('/add-address')}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10 text-xs md:text-sm"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-4 md:mt-6 mb-1">
            Payment Method
          </p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-2 py-1 mt-1 outline-none text-xs md:text-sm"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-3 space-y-1 md:space-y-2 text-sm md:text-base">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 2) / 100}
            </span>
          </p>
          <p className="flex justify-between text-base font-medium mt-2 md:mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {getCartAmount() + (getCartAmount() * 2) / 100}
            </span>
          </p>
        </div>

        <button
          onClick={placeorder}
          className="w-full py-2 mt-4 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition text-sm md:text-base"
        >
          {paymentOption === 'COD' ? 'Place order' : 'Proceed to check out'}
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;
