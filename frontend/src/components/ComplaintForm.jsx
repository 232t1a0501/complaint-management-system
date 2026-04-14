import { useState } from 'react';
import axios from 'axios';
import { X, Check, FileText, AlignLeft, LayoutDashboard, ShieldAlert, Image } from 'lucide-react';
import CustomSelect from './CustomSelect';
import toast from 'react-hot-toast';
import DatePicker from './DatePicker';

export default function ComplaintForm({ onClose, onSucceed }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('College');
  const [priority, setPriority] = useState('Medium');
  const [incidentDate, setIncidentDate] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('priority', priority);
      if (incidentDate) formData.append('incidentDate', incidentDate);
      if (image) formData.append('image', image);

      await axios.post('/api/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Complaint submitted successfully!');
      onSucceed();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-[#1d40a8] px-7 pt-8 pb-6 relative">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">New Complaint</h2>
          </div>
          <p className="text-blue-200 text-sm ml-12">Fill in the details to log your grievance</p>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5 overflow-y-auto flex-1">

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                placeholder="e.g. Computer not working"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <AlignLeft size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <textarea
                required
                rows={5}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] focus:bg-white transition-all resize-none text-slate-800 placeholder-slate-400"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Category / Domain <span className="text-red-500">*</span>
            </label>
            <CustomSelect 
               value={category}
               onChange={setCategory}
               icon={LayoutDashboard}
               options={[
                 { value: 'College', label: 'College Issue' },
                 { value: 'Hostel', label: 'Hostel Issue' }
               ]}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Priority <span className="text-red-500">*</span>
            </label>
            <CustomSelect 
               value={priority}
               onChange={setPriority}
               icon={ShieldAlert}
               options={[
                 { value: 'Low', label: 'Low - Minor Issue' },
                 { value: 'Medium', label: 'Medium - Normal Attention' },
                 { value: 'High', label: 'High - Urgent / Critical' }
               ]}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Incident Date
            </label>
            <DatePicker value={incidentDate} onChange={setIncidentDate} placeholder="Pick incident date" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Image <span className="text-slate-400 font-normal normal-case">(Optional)</span>
            </label>
            <div className="relative flex items-center">
              <Image size={15} className="absolute left-3.5 text-slate-400" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] focus:bg-white transition-all text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1d40a8]/10 file:text-[#1d40a8] hover:file:bg-[#1d40a8]/20 cursor-pointer"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#1d40a8] text-white font-bold text-sm hover:bg-[#153084] transition shadow-md shadow-[#1d40a8]/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check size={16} /> {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
