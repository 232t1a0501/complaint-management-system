import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Laptop, Clock, Circle } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [adminSecret, setAdminSecret] = useState('');
  const [batch, setBatch] = useState('1st Year');
  const [department, setDepartment] = useState('CSE');
  const [adminType, setAdminType] = useState('College Admin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        role,
        ...(role === 'admin' ? { adminSecret, admin_type: adminType } : { batch, department })
      });
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#8ea7d6] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Centered Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 min-h-[550px]">
        
        {/* Left Side: Illustration (Blue) */}
        <div className="w-full md:w-1/2 bg-[#1d40a8] p-12 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden">
          {/* Decorative CSS shapes mimicking the reference artwork */}
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
          
          {/* Main Abstract Character mimicking the seated student */}
          <div className="relative z-10 flex flex-col items-center mt-12">
             <Laptop size={120} className="text-white drop-shadow-2xl" strokeWidth={1} />
             
             {/* Abstract Blocks */}
             <div className="flex items-end mt-4 gap-2 mb-10">
                 <div className="w-16 h-24 border border-white/40 bg-white/5 rounded-t-sm relative">
                     {/* Polka dots */}
                     <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/40"></div>
                     <div className="absolute top-8 right-3 w-2 h-2 rounded-full bg-white/40"></div>
                     <div className="absolute bottom-6 left-4 w-2 h-2 rounded-full bg-white/40"></div>
                 </div>
                 <div className="w-24 h-32 bg-white/20 backdrop-blur-sm rounded-t-sm shadow-inner overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#153084] to-transparent opacity-50"></div>
                 </div>
             </div>

             <Link to="/login" className="border-2 border-white text-white rounded-full font-bold tracking-widest uppercase text-sm px-10 py-3 hover:bg-white hover:text-[#1d40a8] transition-all shadow-lg focus:ring-2 focus:ring-white/50">
                Login
             </Link>
          </div>
          <div className="absolute bottom-0 w-full h-px bg-white/30 px-10"></div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-extrabold text-[#1d40a8] mb-3">Signup</h2>
          <p className="text-xs text-slate-500 mb-8 font-semibold">Hey enter your details to create your account</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={16} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                required
                className="w-full text-sm font-medium text-slate-800 pl-11 pr-4 py-3 outline-none rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={16} className="text-slate-400" />
              </div>
              <input 
                type="email" 
                required
                className="w-full text-sm font-medium text-slate-800 pl-11 pr-4 py-3 outline-none rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <CustomSelect 
              value={role}
              onChange={setRole}
              icon={User}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
            
            {role === 'student' && (
              <>
                <CustomSelect 
                  value={batch}
                  onChange={setBatch}
                  icon={Clock}
                  options={['1st Year', '2nd Year', '3rd Year', '4th Year']}
                />
                
                <CustomSelect 
                  value={department}
                  onChange={setDepartment}
                  icon={Laptop}
                  options={['CSE', 'CSE-AI', 'ECE', 'EEE', 'CIVIL', 'Others']}
                />
              </>
            )}

            {role === 'admin' && (
              <>
                <CustomSelect 
                  value={adminType}
                  onChange={setAdminType}
                  icon={User}
                  options={['College Admin', 'Hostel Admin']}
                />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="password" 
                    required
                    className="w-full text-sm font-medium text-slate-800 pl-11 pr-4 py-3 outline-none rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all"
                    placeholder="Admin Secret Key"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={16} className="text-slate-400" />
              </div>
              <input 
                type="password" 
                required
                className="w-full text-sm font-medium text-slate-800 pl-11 pr-4 py-3 outline-none rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1d40a8] text-white rounded-xl font-bold tracking-wide text-sm py-3.5 hover:bg-[#153084] transition-all shadow-md disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Sign up'}
              </button>
            </div>
          </form>

         
        </div>
      </div>
    </div>
  );
}
