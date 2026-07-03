import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const TAG_LABELS: Record<string, string> = {
  photography: 'Photography',
  film: 'Wedding Film',
  stationery: 'Stationery',
  editorial: 'Editorial',
  documentary: 'Documentary',
  color_story: 'Color Story',
};

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Collect all the tags to pass to the contact form
    const events = Array.from(new Set(cartItems.map((item) => TAG_LABELS[item.tag] ?? item.tag))).join(', ');
    navigate(`/contact?event=${encodeURIComponent(events)}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#fff8ef] dark:bg-[#120b0a]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
      >
        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-[#381a12] dark:text-[#f7d18a] md:text-5xl">
            Your Selection
          </h1>
          <p className="mt-4 text-lg text-[#5f2b19] dark:text-[#ffe7b8]/80">
            Review the services you've added before finalizing your enquiry.
          </p>
        </header>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#4b1e12]/10 bg-white/40 p-16 text-center shadow-xl backdrop-blur-md dark:border-[#f7d18a]/10 dark:bg-black/20">
            <div className="mb-6 rounded-full bg-[#f6dfbd]/50 p-6 dark:bg-[#2a120c]">
              <svg className="h-12 w-12 text-[#8c4b26] dark:text-[#f7d18a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[#381a12] dark:text-[#fff4df]">
              Your cart is empty
            </h2>
            <p className="mt-2 text-[#5f2b19] dark:text-[#ffe7b8]/70">
              Explore our collections and add the styles you love.
            </p>
            <Link
              to="/collections"
              className="mt-8 rounded-full bg-[#c84624] px-8 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition-transform hover:-translate-y-1 hover:bg-[#9f2f18] hover:shadow-lg hover:shadow-[#c84624]/20"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="overflow-hidden rounded-3xl border border-[#4b1e12]/10 bg-white/60 shadow-xl backdrop-blur-md dark:border-[#f7d18a]/15 dark:bg-[#1a0c08]/80">
              <ul className="divide-y divide-[#4b1e12]/10 dark:divide-[#f7d18a]/10">
                {cartItems.map((item, index) => (
                  <motion.li
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8"
                  >
                    <div className="h-32 w-48 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-36">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <span className="mb-2 w-fit rounded-full bg-[#f6dfbd] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8c4b26] dark:bg-[#2a120c] dark:text-[#f7d18a]">
                        {TAG_LABELS[item.tag] ?? item.tag}
                      </span>
                      <h3 className="font-serif text-2xl font-semibold text-[#381a12] dark:text-[#fff8ef]">
                        {item.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="group flex items-center justify-center rounded-full p-2 text-[#5f2b19] transition-colors hover:bg-red-50 hover:text-red-600 dark:text-[#ffe7b8]/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      aria-label="Remove item"
                    >
                      <svg className="h-6 w-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#4b1e12]/10 bg-[#f7d18a]/20 p-8 dark:border-[#f7d18a]/15 dark:bg-[#2a120c] sm:flex-row">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-[#8c4b26] dark:text-[#f7d18a]/80">
                  Subtotal
                </p>
                <p className="font-serif text-3xl font-semibold text-[#381a12] dark:text-[#fff4df]">
                  {cartItems.length} {cartItems.length === 1 ? 'Service' : 'Services'}
                </p>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full rounded-full bg-[#381a12] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#f7d18a] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#5b1a3a] hover:text-white hover:shadow-2xl hover:shadow-[#5b1a3a]/30 dark:bg-[#f7d18a] dark:text-[#381a12] dark:hover:bg-white sm:w-auto"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
