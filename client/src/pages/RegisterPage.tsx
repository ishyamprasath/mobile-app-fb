import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Lock, Mail, User, UserPlus } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: '',
    department: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof formState>(key: K, value: (typeof formState)[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const email = formState.email.toLowerCase().trim();
    if (!email.endsWith('@tvsd.ai')) {
      setError('Only @tvsd.ai email addresses are allowed. No @gmail.com or other domains.');
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formState.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!formState.department) {
      setError('Please select a department.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formState.name.trim(),
        email,
        password: formState.password,
        designation: formState.designation.trim(),
        department: formState.department,
      });
      navigate('/login');
    } catch (err) {
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (apiMessage?.includes('already exists')) {
        setError('An account with this email already exists. Please login instead.');
      } else {
        setError(apiMessage || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Register to get started and share your feedback"
      icon={<UserPlus size={38} strokeWidth={1.6} />}
    >
      <form className="space-y-2" onSubmit={handleSubmit}>
        <Field label="Full Name" icon={<User size={18} className="tvs-input-icon" />}>
          <input
            value={formState.name}
            onChange={(event) => update('name', event.target.value)}
            required
            minLength={2}
            placeholder="Enter your full name"
            className="tvs-input"
          />
        </Field>

        <Field label="Designation" icon={<User size={18} className="tvs-input-icon" />}>
          <input
            value={formState.designation}
            onChange={(event) => update('designation', event.target.value)}
            required
            placeholder="e.g. Software Engineer"
            className="tvs-input"
          />
        </Field>

        <Field label="Department" icon={<Building size={18} className="tvs-input-icon" />}>
          <select
            value={formState.department}
            onChange={(event) => update('department', event.target.value)}
            required
            className="tvs-input appearance-none bg-transparent cursor-pointer"
          >
            <option value="" disabled>Select your department</option>
            <option value="development">Development</option>
            <option value="testing">Testing</option>
            <option value="sap">SAP</option>
            <option value="salesforce">Salesforce</option>
            <option value="pm">PM</option>
            <option value="db">DB</option>
            <option value="marketing">Marketing</option>
          </select>
        </Field>

        <Field label="Email Address" icon={<Mail size={18} className="tvs-input-icon" />}>
          <input
            type="email"
            value={formState.email}
            onChange={(event) => update('email', event.target.value)}
            required
            placeholder="you@tvsd.ai"
            className="tvs-input"
          />
        </Field>
        <p className="-mt-2 pl-2 text-[11px] text-white/55">Only @tvsd.ai email addresses are allowed.</p>

        <Field label="Password" icon={<Lock size={18} className="tvs-input-icon" />}>
          <input
            type="password"
            value={formState.password}
            onChange={(event) => update('password', event.target.value)}
            required
            minLength={8}
            placeholder="Create a password"
            className="tvs-input"
          />
        </Field>

        <Field label="Confirm Password" icon={<Lock size={18} className="tvs-input-icon" />}>
          <input
            type="password"
            value={formState.confirmPassword}
            onChange={(event) => update('confirmPassword', event.target.value)}
            required
            minLength={8}
            placeholder="Confirm your password"
            className="tvs-input"
          />
        </Field>

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
          <UserPlus size={16} />
          {loading ? 'Creating account...' : 'Register'}
        </motion.button>

        <div className="tvs-divider">or</div>

        <div className="text-center text-sm text-white/85">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#E31E24] hover:underline">
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.05em] text-[#E31E24]">{label}</label>
      <div className="tvs-input-wrapper relative">
        {icon}
        {children}
      </div>
    </div>
  );
}
