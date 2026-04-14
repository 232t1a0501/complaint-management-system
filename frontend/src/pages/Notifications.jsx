import { useState, useEffect } from 'react';
import axios from 'axios';
import { BellRing, CheckCircle, Trash2, X } from 'lucide-react';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchData = async () => {
    try {
      const [notifRes, compRes] = await Promise.all([
        axios.get('/api/notifications'),
        axios.get('/api/complaints')
      ]);
      setNotifications(notifRes.data);
      setComplaints(compRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const targetComplaint = selectedNotification ? complaints.find(c => c.id === selectedNotification.complaint_id) : null;

  const handleRead = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications(n => n.filter(item => item.id !== id));
      setSelectedNotification(null);
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Failed to clear notification');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full p-8 lg:p-12">
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-red-500/10 p-2.5 rounded-xl text-red-500">
            <BellRing size={22} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">System Alerts</h2>
            <p className="text-slate-500 font-medium mt-1">Review urgent statuses regarding your logged grievances.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
           {loading ? (
             <div className="p-16 text-center text-slate-400">Loading alerts...</div>
           ) : notifications.length === 0 ? (
             <div className="p-16 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle size={30} />
               </div>
               <h3 className="text-lg font-bold text-slate-700">All Caught Up!</h3>
               <p className="text-slate-400 font-medium mt-1">You have zero unread systemic notifications awaiting.</p>
             </div>
           ) : (
             <div className="divide-y divide-slate-50">
               {notifications.map(notif => (
                 <div key={notif.id} className="p-5 hover:bg-slate-50/70 transition cursor-pointer flex items-start gap-4" onClick={() => setSelectedNotification(notif)}>
                   <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                     <BellRing size={16} />
                   </div>
                   <div className="flex-1">
                     <h4 className="font-bold text-slate-800 tracking-tight text-sm mb-1">{notif.title}</h4>
                     <p className="text-sm text-slate-500 font-medium line-clamp-1">{notif.message}</p>
                     <p className="text-xs text-slate-400 font-bold tracking-widest mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                   </div>
                   <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-200">
                     New
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Modal Viewer */}
        {selectedNotification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedNotification(null)} />
             <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-sm relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-red-500 px-6 py-5 flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg tracking-tight">Alert Opened</h3>
                  <button onClick={() => setSelectedNotification(null)} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-slate-800 text-lg mb-3">{selectedNotification.title}</h4>
                  
                  {targetComplaint && (
                    <div className="mb-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1d40a8]"></div>
                       <div className="flex items-center gap-2 mb-1.5">
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#1d40a8]/10 text-[#1d40a8] uppercase">
                           {targetComplaint.category} Issue
                         </span>
                         <span className="text-[10px] font-bold text-slate-400">Target Ticket</span>
                       </div>
                       <p className="text-slate-800 font-bold text-sm mb-1">{targetComplaint.title}</p>
                       <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{targetComplaint.description}</p>
                    </div>
                  )}

                  <p className="text-slate-600 font-semibold text-sm leading-relaxed mb-6 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">{selectedNotification.message}</p>
                  
                  <button 
                    onClick={() => handleRead(selectedNotification.id)}
                    className="w-full py-3 bg-[#1d40a8] text-white font-bold rounded-xl shadow-md shadow-[#1d40a8]/20 hover:bg-[#153084] transition"
                  >
                    Close & Mark Read
                  </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
