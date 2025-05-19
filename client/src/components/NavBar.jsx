import React, { useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const NavBar = () => {
  const [open, setOpen] = React.useState(false);
  const {
    user,
    setShowUserLogin,
    setUser,
    navigate,
    searchQuery,
    setSearchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink to="/">
        <img
          className="h-9"
          src={assets.logo}
          onClick={() => {
            setOpen(false);
          }}
          alt="dummyLogoColored"
        />
      </NavLink>
      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        {!user && (
          <button
            onClick={() => navigate('/seller')}
            className="border border-gray-300 rounded-full px-3 py-1.5 text-sm hover:bg-gray-100 transition"
          >
            Seller Dashboard
          </button>
        )}
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Products</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search_icon" className="w-4 h-4" />
          <path
            d="M10.836 10.615 15 14.695"
            stroke="#7A7B7D"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            clip-rule="evenodd"
            d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
            stroke="#7A7B7D"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </div>

        <div
          className="relative cursor-pointer"
          onClick={() => navigate('/cart')}
        >
          <img
            src={assets.cart_icon}
            alt="cart_icon"
            className="w-6 opacaity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => {
              setOpen(!open);
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img
              src={assets.profile_icon}
              className="w-10"
              alt="profile_icon"
            />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
              <li
                onClick={() => navigate('my-orders')}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My orders
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex item-center gap-6 sm:hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate('/cart')}
        >
          <img
            src={assets.cart_icon}
            alt="cart_icon"
            className="w-6 opacaity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
        >
          {/* Menu Icon SVG */}
          <img src={assets.menu_icon} alt="menu_icon" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className={`${
            open ? 'flex' : 'hidden'
          } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}
        >
          {!user && (
            <NavLink to="/seller" onClick={() => setOpen(!open)}>
              Seller Dashboard
            </NavLink>
          )}
          <NavLink to="/" onClick={() => setOpen(!open)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(!open)}>
            All Products
          </NavLink>
          {user && (
            <NavLink to="/orders" onClick={() => setOpen(!open)}>
              My Orders
            </NavLink>
          )}

          {!user ? (
            <button
              onClick={() => {
                setOpen(!open);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(!open);
                logout();
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
