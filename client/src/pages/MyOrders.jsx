import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error('no orders ');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-8 pb-8 md:mt-16 md:pb-16">
      <div className="flex flex-col items-start w-full mb-6 md:mb-8 px-4 md:px-0">
        <p className="text-xl font-semibold uppercase md:text-2xl">My Orders</p>
        <div className="w-12 h-0.5 bg-primary rounded-full md:w-16"></div>
      </div>
      <div className="space-y-6 px-4 md:px-0">
        {myOrders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 py-5 w-full md:max-w-4xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-gray-400 mb-3">
              <span className="mb-1 md:mb-0">Order id: {order._id}</span>
              <span className="mb-1 md:mb-0">Payment: {order.paymentType}</span>
              <span>
                Total Amount: {currency}
                {order.amount}
              </span>
            </div>
            {order.items.map((item, index) => (
              <div
                key={index}
                className={`relative bg-white text-gray-500/70 ${
                  order.items.length !== index + 1 && 'border-b'
                } border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between p-4 py-4 sm:gap-8 w-full`}
              >
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <img
                      src={item.product.image[0]}
                      alt=""
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-medium text-gray-800">
                      {item.product.name}
                    </h2>
                    <p className="text-sm">Category: {item.product.category}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end justify-center mb-2 sm:mb-0">
                  <p className="text-sm">Quantity: {item.quantity || '1'}</p>
                  <p className="text-sm">Status: {order.status}</p>
                  <p className="text-sm">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-primary text-base font-medium">
                  Amount: {currency}
                  {item.product.offerPrice * item.quantity}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
