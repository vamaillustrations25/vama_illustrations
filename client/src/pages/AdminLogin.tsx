import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authApi.login({ username, password });
      login();
      navigate('/admin');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'detail' in err) {
        setError((err as { detail: string }).detail || 'Login failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#fdfaf6] p-5 font-sans dark:bg-[#120a08]">
      <div className="absolute right-6 top-6">
        <button
          type="button"
          onClick={toggleTheme}
          className="fixed right-6 top-6 grid h-10 min-w-16 place-items-center rounded-full border border-[#4b1e12]/15 bg-white/60 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#4b1e12] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f6dfbd] dark:border-[#f7d18a]/20 dark:bg-white/10 dark:text-[#fff4df] dark:hover:bg-white/20"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[#4b1e12]/10 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-[#f7d18a]/10 dark:bg-white/5"
      >
        <div className="bg-[#4b1e12] p-8 text-center dark:bg-[#170f0d]">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#f7d18a]">Admin Portal</h1>
          <p className="mt-2 text-sm text-[#f5dec2]/80">Sign in to manage Vama Illustrations</p>
        </div>
        <div className="p-8">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm font-medium text-red-500">
              {error}
            </motion.div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8c4b26] dark:text-[#f7d18a]">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#4b1e12]/15 bg-white/50 px-4 py-3 text-sm text-[#381a12] outline-none transition focus:border-[#c84624] focus:bg-white focus:ring-4 focus:ring-[#c84624]/10 dark:border-[#f7d18a]/15 dark:bg-black/20 dark:text-[#fff4df] dark:focus:bg-black/40"
                placeholder="Enter admin username"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8c4b26] dark:text-[#f7d18a]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#4b1e12]/15 bg-white/50 px-4 py-3 text-sm text-[#381a12] outline-none transition focus:border-[#c84624] focus:bg-white focus:ring-4 focus:ring-[#c84624]/10 dark:border-[#f7d18a]/15 dark:bg-black/20 dark:text-[#fff4df] dark:focus:bg-black/40"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c84624] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#c84624]/20 transition hover:bg-[#9f2f18] disabled:opacity-70"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
              {!loading && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
