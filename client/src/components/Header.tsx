import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

const navItems = [
  {
    label: "Home",
    to: "/",
    icon: <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  },
  {
    label: "Collections",
    to: "/collections",
    icon: <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  {
    label: "About",
    to: "/about",
    icon: <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  },
  {
    label: "Contact",
    to: "/contact",
    icon: <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  },
];

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-[#4b1e12]/10 bg-[#fff8ef]/85 backdrop-blur-xl dark:border-[#f7d18a]/15 dark:bg-[#120b0a]/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between sm:px-6 lg:px-8">

        {/* BRAND NAME AND LOGO */}
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Vama Illustrations logo"
            className="h-11 w-11 shrink-0 rounded-full object-cover shadow-lg shadow-[#4b1e12]/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6"
          />
          <span>
            <span className="block font-serif text-2xl font-semibold text-[#381a12] dark:text-[#fff4df]">
              Vama Illustrations
            </span>
            <span className="block text-xs uppercase tracking-[0.28em] text-[#8c4b26] dark:text-[#f7d18a]">
              Luxury Wedding Hub
            </span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 rounded-full border border-[#4b1e12]/10 bg-white/45 p-1 shadow-sm dark:border-[#f7d18a]/15 dark:bg-white/5 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive
                  ? "bg-[#4b1e12] backdrop-blur-md text-[#f7d18a] shadow-md shadow-[#4b1e12]/15"
                  : "text-[#5f2b19] hover:bg-[#f6dfbd]/70 hover:backdrop-blur-md dark:text-[#ffe7b8] dark:hover:bg-white/10 dark:hover:backdrop-blur-md"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="group relative inline-flex overflow-hidden rounded-full p-[2px] shadow-lg shadow-[#c84624]/25 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-[#c84624] transition-colors duration-300 group-hover:bg-[#9f2f18]"></div>
            
            <div 
              className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite]"
              style={{ background: 'conic-gradient(from 90deg, transparent 0%, transparent 70%, #f7d18a 90%, #fff 100%)' }}
            ></div>
            
            <Link
              to="/contact"
              className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-[#c84624] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-[#9f2f18]"
            >
              Book a Ritual
            </Link>
          </div>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative grid h-10 w-10 place-items-center rounded-full border shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${isActive
                ? "border-[#4b1e12]/20 bg-[#4b1e12] backdrop-blur-md text-[#f7d18a] shadow-md shadow-[#4b1e12]/15 dark:border-[#f7d18a]/30"
                : "border-[#4b1e12]/15 bg-white/60 text-[#381a12] hover:bg-[#f6dfbd]/70 hover:backdrop-blur-md dark:border-[#f7d18a]/20 dark:bg-white/10 dark:text-[#f7d18a] dark:hover:bg-white/20 dark:hover:backdrop-blur-md"
              }`
            }
            aria-label="View cart"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c84624] text-[9px] font-bold text-white shadow-sm ring-2 ring-[#fff8ef] dark:ring-[#120b0a]">
                {cartCount}
              </span>
            )}
          </NavLink>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 min-w-16 place-items-center rounded-full border border-[#4b1e12]/15 bg-white/60 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#4b1e12] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:bg-white/10 dark:text-[#fff4df] dark:hover:bg-white/20"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        {/* MOBILE ROW: Nav Items + Cart + Theme Toggle */}
        <div className="flex items-center justify-between gap-2 lg:hidden">

          {/* Mobile Nav Links */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center justify-center gap-2 rounded-full transition-all duration-300 ${isActive
                    ? "h-10 px-4 bg-[#4b1e12] backdrop-blur-md text-[#f7d18a] shadow-md shadow-[#4b1e12]/15"
                    : "h-10 w-10 border border-[#4b1e12]/10 bg-white/60 text-[#5f2b19] hover:bg-[#f6dfbd]/70 hover:backdrop-blur-md dark:border-[#f7d18a]/15 dark:bg-white/5 dark:text-[#ffe7b8] dark:hover:bg-white/10 dark:hover:backdrop-blur-md"
                  }`
                }
                title={item.label}
              >
                {({ isActive }) => (
                  <>
                    {item.icon}
                    {isActive && <span className="text-sm font-medium">{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Actions: Cart & Theme (Icons only) */}
          <div className="flex shrink-0 items-center gap-1">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative grid h-10 w-10 place-items-center rounded-full border shadow-sm transition-all duration-300 ${isActive
                  ? "border-[#4b1e12]/20 bg-[#4b1e12] backdrop-blur-md text-[#f7d18a] shadow-md shadow-[#4b1e12]/15 dark:border-[#f7d18a]/30"
                  : "border-[#4b1e12]/15 bg-white/60 text-[#381a12] hover:bg-[#f6dfbd]/70 dark:border-[#f7d18a]/20 dark:bg-white/10 dark:text-[#f7d18a] dark:hover:bg-white/20"
                }`
              }
              aria-label="View cart"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c84624] text-[9px] font-bold text-white shadow-sm ring-2 ring-[#fff8ef] dark:ring-[#120b0a]">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#4b1e12]/15 bg-white/60 text-[#4b1e12] shadow-sm transition-all duration-300 hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:bg-white/10 dark:text-[#fff4df] dark:hover:bg-white/20"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                // Sun Icon
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                // Moon Icon
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
