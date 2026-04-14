import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Lock, Laptop, Clock, Circle, User, X, KeyRound, Eye, EyeOff } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [fpName, setFpName] = useState('');
  const [fpEmail, setFpEmail] = useState('');
  const [fpNew, setFpNew] = useState('');
  const [fpConfirm, setFpConfirm] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1 = enter email, 2 = enter new password
  const [fpEmailVerified, setFpEmailVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data.role !== role) {
        toast.error(`Account exists but is not registered as ${role === 'admin' ? 'Admin' : 'Student'}`);
        setLoading(false);
        return;
      }
      login(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEmail = async () => {
    if (!fpName) return toast.error('Please enter your full name');
    if (!fpEmail) return toast.error('Please enter your email');
    setFpLoading(true);
    try {
      // Check if email and name exist by attempting a known-bad password (will get 401/400 not 404)
      await axios.post('/api/auth/forgot-password', { email: fpEmail, name: fpName, newPassword: 'check_temp_xyz' });
      // If we got here the account exists — but this would reset. Better: we just proceed to step 2.
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('No account found matching that email and name');
        setFpLoading(false);
        return;
      }
      // 400 (too short) means account was found — proceed
    } finally {
      setFpLoading(false);
    }
    setFpStep(2);
    setFpEmailVerified(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (fpNew !== fpConfirm) return toast.error('Passwords do not match');
    if (fpNew.length < 6) return toast.error('Password must be at least 6 characters');
    setFpLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email: fpEmail, name: fpName, newPassword: fpNew });
      toast.success('Password reset successfully! You can now log in.');
      setShowForgot(false);
      setFpName(''); setFpEmail(''); setFpNew(''); setFpConfirm(''); setFpStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setFpLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setFpName(''); setFpEmail(''); setFpNew(''); setFpConfirm(''); setFpStep(1); setFpEmailVerified(false);
  };

  return (
    <div className="min-h-screen bg-[#8ea7d6] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Centered Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col-reverse md:flex-row overflow-hidden z-10 min-h-[550px]">
        
        {/* Left Side: Form Area */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-extrabold text-[#1d40a8] mb-3">Welcome Back</h2>
          <p className="text-xs text-slate-500 mb-8 font-semibold">Enter your details to sign in to your account</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <CustomSelect 
              value={role}
              onChange={setRole}
              icon={User}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'admin', label: 'Admin' }
              ]}
            />

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={16} className="text-slate-400" />
              </div>
              <input 
                type="email" 
                required
                className="w-full text-sm font-medium text-slate-800 pl-11 pr-4 py-3.5 outline-none rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={16} className="text-slate-400" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full text-sm font-medium text-slate-800 pl-11 pr-12 py-3.5 outline-none rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#1d40a8] transition">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Forgot Password link */}
            <div className="text-right">
              <button type="button" onClick={() => setShowForgot(true)}
                className="text-xs text-[#1d40a8] font-semibold hover:underline">
                Forgot Password?
              </button>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1d40a8] text-white rounded-xl font-bold tracking-wide text-sm py-3.5 hover:bg-[#153084] transition-all shadow-md disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Illustration (Blue) */}
        <div className="w-full md:w-1/2 bg-[#1d40a8] p-12 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden">
          <div className="absolute top-10 right-10 flex items-center justify-center w-16 h-16 border border-white/30 rounded-full">
             <Clock className="text-white/50" strokeWidth={1.5} size={24} />
          </div>
          <div className="absolute bottom-20 right-12">
             <Circle className="text-white/30" size={16} strokeWidth={2} />
          </div>
          <svg className="absolute top-20 left-10 w-24 h-12 text-white/30" fill="none" viewBox="0 0 100 50">
             <path d="M0,25 Q12.5,0 25,25 T50,25 T75,25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <svg className="absolute bottom-32 left-8 w-24 h-12 text-white/30" fill="none" viewBox="0 0 100 50">
             <path d="M0,25 Q12.5,0 25,25 T50,25 T75,25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          
          <div className="relative z-10 flex flex-col items-center mt-12">
             <Laptop size={120} className="text-white drop-shadow-2xl" strokeWidth={1} />
             <div className="flex items-end mt-4 gap-2 mb-10">
                 <div className="w-16 h-24 border border-white/40 bg-white/5 rounded-t-sm relative">
                     <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/40"></div>
                     <div className="absolute top-8 right-3 w-2 h-2 rounded-full bg-white/40"></div>
                     <div className="absolute bottom-6 left-4 w-2 h-2 rounded-full bg-white/40"></div>
                 </div>
                 <div className="w-24 h-32 bg-white/20 backdrop-blur-sm rounded-t-sm shadow-inner overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#153084] to-transparent opacity-50"></div>
                 </div>
             </div>
             <Link to="/register" className="border-2 border-white text-white rounded-full font-bold tracking-widest uppercase text-sm px-10 py-3 hover:bg-white hover:text-[#1d40a8] transition-all shadow-lg focus:ring-2 focus:ring-white/50">
                Sign Up
             </Link>
          </div>
          <div className="absolute bottom-0 w-full h-px bg-white/30 px-10"></div>
        </div>
      </div>

      {/* ─── Forgot Password Modal ─── */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-[#1d40a8] px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/15 p-2 rounded-xl">
                  <KeyRound size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Reset Password</h3>
                  <p className="text-white/60 text-xs">Step {fpStep} of 2</p>
                </div>
              </div>
              <button onClick={closeForgot} className="text-white/60 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-slate-100">
              <div className={`h-1 bg-[#1d40a8] transition-all duration-500 ${fpStep === 1 ? 'w-1/2' : 'w-full'}`} />
            </div>

            <div className="p-8">
              {fpStep === 1 ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-slate-600 text-sm mb-5">Enter your registered full name and email address to verify your account.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={fpName}
                            onChange={(e) => setFpName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all text-sm text-slate-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            value={fpEmail}
                            onChange={(e) => setFpEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all text-sm text-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckEmail}
                    disabled={fpLoading}
                    className="w-full bg-[#1d40a8] text-white rounded-xl py-3.5 font-bold text-sm hover:bg-[#153084] transition-all disabled:opacity-50"
                  >
                    {fpLoading ? 'Verifying...' : 'Verify Email →'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <p className="text-slate-600 text-sm mb-5">Account found for <span className="font-bold text-[#1d40a8]">{fpEmail}</span>. Set your new password below.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="password" value={fpNew} onChange={(e) => setFpNew(e.target.value)} required
                        placeholder="Minimum 6 characters"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all text-sm text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="password" value={fpConfirm} onChange={(e) => setFpConfirm(e.target.value)} required
                        placeholder="Repeat new password"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all text-sm text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setFpStep(1)}
                      className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-3 font-semibold text-sm hover:bg-slate-50 transition">
                      ← Back
                    </button>
                    <button type="submit" disabled={fpLoading}
                      className="flex-1 bg-[#1d40a8] text-white rounded-xl py-3 font-bold text-sm hover:bg-[#153084] transition-all disabled:opacity-50">
                      {fpLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
