import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, Mail, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setError('Please enter your email or username.');
      setLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const user = await login(trimmedIdentifier, password);
      navigate(user.email === 'admin@tvsd.ai' ? '/admin' : '/dashboard');
    } catch (err) {
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (apiMessage?.includes('not found') || apiMessage?.includes('Invalid credentials')) {
        setError('User not found. Please register first.');
      } else if (apiMessage?.includes('password')) {
        setError('Incorrect password. Please try again.');
      } else {
        setError(apiMessage || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue and share feedback"
      icon={<UserCircle2 size={42} strokeWidth={1.6} />}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.05em] text-[#E31E24]">Username / Email</label>
          <div className="tvs-input-wrapper">
            <Mail size={16} className="tvs-input-icon" />
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Enter your username or email"
              required
              className="tvs-input"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.05em] text-[#E31E24]">Password</label>
          <div className="tvs-input-wrapper relative">
            <Lock size={16} className="tvs-input-icon" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              className="tvs-input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#081730] opacity-50 hover:opacity-100"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mt-2 text-right">
            <button type="button" className="text-[11px] text-white/50 hover:text-white transition">
              Forgot Password?
            </button>
          </div>
        </div>

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[#7f1d1d] bg-[#450a0a] px-4 py-3 text-sm text-[#fecaca]"
          >
            {error}
          </motion.div>
        ) : null}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="tvs-button-primary"
        >
          <LogIn size={16} />
          {loading ? 'Signing in...' : 'Login'}
        </motion.button>

        <div className="text-center text-sm text-white/85">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#E31E24] hover:underline">
            Register
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
