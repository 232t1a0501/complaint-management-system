import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Lock, Save, ShieldCheck, Mail, Eye, EyeOff, CheckCircle2, Settings } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('New passwords do not match');
    if (newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.put('/api/auth/password', { oldPassword, newPassword });
      toast.success('Password updated successfully');
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const isAdmin = user?.role === 'admin';

  const strengthScore = newPassword.length === 0 ? 0
    : newPassword.length < 6 ? 1
    : newPassword.length < 10 ? 2
    : 3;
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-400'];

  return (
    <Layout>
      <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-[#1d40a8]/10 p-2.5 rounded-xl text-[#1d40a8]">
            <Settings size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Account Settings</h2>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Manage your profile and security preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Profile Card ── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Avatar & Info */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center">
              {/* Circle avatar with glow background */}
              <div className="relative mb-5">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#1d40a8] via-[#2951c7] to-[#153084] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-[#1d40a8]/30">
                  {initials}
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-sm"></span>
              </div>

              <h3 className="text-xl font-bold text-slate-800 leading-tight">{user?.name}</h3>
              <p className="text-slate-400 text-sm font-medium mt-1 mb-4 break-all">{user?.email}</p>

              <div className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5
                ${isAdmin ? 'bg-[#1d40a8]/10 text-[#1d40a8]' : 'bg-blue-50 text-blue-600'}`}>
                <ShieldCheck size={13} />
                {user?.role === 'admin' ? (user?.admin_type || user?.role) : (user?.batch ? `${user.department} • ${user.batch}` : user?.role)}
              </div>
            </div>


            {/* Info Tiles */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Account Info</h4>
              <div className="flex items-center gap-3 py-2 border-b border-slate-50">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <User size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-slate-50">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-[#1d40a8]/10 text-[#1d40a8]' : 'bg-sky-50 text-sky-500'}`}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Role</p>
                  <p className="text-sm font-bold text-slate-700 capitalize">
                    {user?.role === 'admin' ? (user?.admin_type || user?.role) : (user?.batch ? `${user.department} - ${user.batch}` : user?.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Security Card ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-full">
              
              {/* Card Header */}
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="bg-[#1d40a8]/10 p-2 rounded-xl text-[#1d40a8]">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Change Password</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Update your account security password</p>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handlePasswordUpdate} className="space-y-6">

                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showOld ? 'text' : 'password'}
                        required
                        placeholder="Enter your current password"
                        className="w-full pl-11 pr-12 py-3.5 text-sm bg-slate-50 text-slate-700 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowOld(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1d40a8] transition">
                        {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showNew ? 'text' : 'password'}
                        required
                        placeholder="Minimum 6 characters"
                        className="w-full pl-11 pr-12 py-3.5 text-sm bg-slate-50 text-slate-700 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowNew(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1d40a8] transition">
                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {newPassword.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strengthScore ? strengthColor[strengthScore] : 'bg-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{strengthLabel[strengthScore]}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        placeholder="Repeat new password"
                        className={`w-full pl-11 pr-12 py-3.5 text-sm bg-slate-50 text-slate-700 rounded-xl border outline-none focus:ring-2 focus:ring-[#1d40a8]/30 transition-all ${
                          confirmPassword && newPassword !== confirmPassword
                            ? 'border-red-300 focus:border-red-400'
                            : confirmPassword && newPassword === confirmPassword
                            ? 'border-green-300 focus:border-green-400'
                            : 'border-slate-200 focus:border-[#1d40a8]'
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1d40a8] transition">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">Passwords do not match</p>
                    )}
                    {confirmPassword && newPassword === confirmPassword && (
                      <p className="text-xs text-green-600 mt-1.5 font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Passwords match</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-2 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                        success
                          ? 'bg-green-500 text-white shadow-green-200'
                          : 'bg-[#1d40a8] text-white hover:bg-[#153084] shadow-[#1d40a8]/20'
                      } disabled:opacity-60`}
                    >
                      {success ? <><CheckCircle2 size={16} /> Password Updated!</> : <><Save size={16} /> {loading ? 'Saving...' : 'Update Password'}</>}
                    </button>
                    {!loading && !success && (
                      <button type="button" onClick={() => { setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                        className="text-sm text-slate-400 hover:text-slate-600 font-medium transition">
                        Clear
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
