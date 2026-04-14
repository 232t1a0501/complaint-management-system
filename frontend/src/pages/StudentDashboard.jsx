import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Plus, Clock, Loader2, CheckCircle2, List, LayoutDashboard, Edit, Eye, Trash2, Search, SlidersHorizontal, Check } from 'lucide-react';
import ComplaintForm from '../components/ComplaintForm';
import EditComplaintForm from '../components/EditComplaintForm';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [viewingComplaint, setViewingComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef(null);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [priorityOpen, setPriorityOpen] = useState(false);
  const priorityRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/api/complaints');
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || (c.priority || 'Medium') === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.max(1, Math.ceil(filteredComplaints.length / PAGE_SIZE));
  const paginatedComplaints = filteredComplaints.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when filters change
  const handleSearch = (val) => { setSearchQuery(val); setCurrentPage(1); };
  const handleStatus = (val) => { setStatusFilter(val); setCurrentPage(1); };
  const handlePriority = (val) => { setPriorityFilter(val); setCurrentPage(1); };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingComplaint(null);
    setViewingComplaint(null);
  };

  const handleFormSucceed = () => {
    handleFormClose();
    fetchComplaints();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto w-full p-8 lg:p-12">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Complaints</h2>
            <p className="text-slate-500 mt-2 font-medium mb-1.5">Track your submitted complaints or log a new incident seamlessly.</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/50">
               <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
               Note: Resolved complaints are automatically purged after 30 days.
            </div>
          </div>
          <button 
            onClick={() => { setIsFormOpen(true); setEditingComplaint(null); }}
            className="bg-[#1d40a8] text-white px-6 py-3.5 rounded-full flex items-center font-bold uppercase tracking-widest text-sm hover:bg-[#153084] transition shadow-lg shadow-[#1d40a8]/30 flex-shrink-0"
          >
            <Plus className="mr-2" size={18} /> New Complaint
          </button>
        </div>
        
        {/* Metric Cards - Modernized */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-400 opacity-10 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="bg-yellow-50 text-yellow-500 p-3 rounded-2xl mb-3"><Clock size={28} /></div>
            <span className="text-4xl font-extrabold text-slate-800">{pendingCount}</span>
            <span className="text-slate-500 font-semibold text-sm mt-1 uppercase tracking-widest">Pending</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400 opacity-10 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl mb-3"><Loader2 size={28} /></div>
            <span className="text-4xl font-extrabold text-slate-800">{inProgressCount}</span>
            <span className="text-slate-500 font-semibold text-sm mt-1 uppercase tracking-widest">In Progress</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500 opacity-10 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="bg-green-50 text-green-500 p-3 rounded-2xl mb-3"><CheckCircle2 size={28} /></div>
            <span className="text-4xl font-extrabold text-slate-800">{resolvedCount}</span>
            <span className="text-slate-500 font-semibold text-sm mt-1 uppercase tracking-widest">Resolved</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#1d40a8] opacity-10 rounded-full group-hover:scale-110 transition-transform"></div>
             <div className="bg-[#1d40a8]/10 text-[#1d40a8] p-3 rounded-2xl mb-3"><List size={28} /></div>
             <span className="text-4xl font-extrabold text-slate-800">{complaints.length}</span>
             <span className="text-slate-500 font-semibold text-sm mt-1 uppercase tracking-widest">Total</span>
          </div>
        </div>

        {/* Filters & Search - ShadCN Style */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Status Filter Button */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setStatusOpen(o => !o)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                statusFilter !== 'All'
                  ? 'bg-[#1d40a8] text-white border-[#1d40a8] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#1d40a8]/50 hover:text-[#1d40a8]'
              }`}
            >
              <SlidersHorizontal size={15} />
              Status{statusFilter !== 'All' ? `: ${statusFilter}` : ''}
            </button>

            {statusOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter by Status</p>
                {['All', 'Pending', 'In Progress', 'Resolved'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { handleStatus(s); setStatusOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition ${
                      statusFilter === s ? 'text-[#1d40a8] font-bold' : 'text-slate-600 font-medium'
                    }`}
                  >
                    {statusFilter === s && <Check size={13} />}
                    {statusFilter !== s && <span className="w-[13px]" />}
                    {s === 'All' ? 'All Statuses' : s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={priorityRef}>
            <button
              type="button"
              onClick={() => setPriorityOpen(o => !o)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                priorityFilter !== 'All'
                  ? 'bg-[#1d40a8] text-white border-[#1d40a8] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#1d40a8]/50 hover:text-[#1d40a8]'
              }`}
            >
              <SlidersHorizontal size={15} />
              Priority{priorityFilter !== 'All' ? `: ${priorityFilter}` : ''}
            </button>

            {priorityOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter by Priority</p>
                {['All', 'High', 'Medium', 'Low'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => { handlePriority(p); setPriorityOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition ${
                      priorityFilter === p ? 'text-[#1d40a8] font-bold' : 'text-slate-600 font-medium'
                    }`}
                  >
                    {priorityFilter === p && <Check size={13} />}
                    {priorityFilter !== p && <span className="w-[13px]" />}
                    {p === 'All' ? 'All Priorities' : p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center bg-slate-50/50">
            <LayoutDashboard className="mr-3 text-[#1d40a8]" size={22} />
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Your Logged Issues</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#f8fafc]">
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">ID</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Title</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Description</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-center">Date Logged</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-center">Priority</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Admin Remark</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500"><Loader2 size={32} className="animate-spin mx-auto mb-4 text-[#1d40a8]" /> Loading records...</td></tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-16 text-center text-slate-500 font-medium">No complaints match your filters.</td></tr>
                ) : (
                  paginatedComplaints.map(complaint => (
                    <tr key={complaint.id} className="hover:bg-slate-50/80 transition-colors p-4 group">
                      <td className="px-6 py-5 text-slate-500 font-bold">{complaint.id}</td>
                      <td className="px-6 py-5 min-w-[200px] text-slate-800 font-bold text-sm">{complaint.title}</td>
                      <td className="px-6 py-5 text-slate-600 max-w-sm">
                        <p className="line-clamp-2 text-sm">{complaint.description}</p>
                      </td>
                      <td className="px-6 py-5 text-slate-500 text-center text-sm font-medium whitespace-nowrap">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-full inline-flex items-center justify-center border
                            ${complaint.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-200' : 
                              complaint.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                              'bg-yellow-50 text-yellow-600 border-yellow-200'}
                          `}
                        >
                          {complaint.status === 'In Progress' ? 'in_progress' : complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-full inline-flex items-center justify-center border
                            ${(complaint.priority || 'Medium') === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 
                              (complaint.priority || 'Medium') === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                              'bg-green-50 text-green-600 border-green-200'}
                          `}
                        >
                          {complaint.priority || 'Medium'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-600 max-w-xs">
                        <p className="line-clamp-2 text-sm italic">{complaint.admin_remark || <span className="text-slate-300 italic">No remark yet</span>}</p>
                      </td>
                       <td className="px-6 py-5">
                         <div className="flex justify-center space-x-2">
                           <button 
                             onClick={() => setViewingComplaint(complaint)}
                             title="View Details"
                             className="bg-[#e2e8f0] text-slate-700 p-2.5 rounded-lg hover:bg-[#1d40a8] hover:text-white transition-all shadow-sm">
                              <Eye size={16} />
                           </button>
                           <button 
                             onClick={() => setEditingComplaint(complaint)}
                             title="Edit Complaint"
                             className="bg-[#e2e8f0] text-slate-700 p-2.5 rounded-lg hover:bg-[#1d40a8] hover:text-white transition-all shadow-sm">
                              <Edit size={16} />
                           </button>
                           {complaint.status === 'Pending' && (
                             <button 
                               onClick={() => toast.error("Contact an Admin to process deletions.")}
                               title="Delete"
                               className="bg-[#e2e8f0] text-rose-600 p-2.5 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                             >
                                <Trash2 size={16} />
                             </button>
                           )}
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredComplaints.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <p className="text-sm text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-700">{Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredComplaints.length)}</span>–<span className="font-bold text-slate-700">{Math.min(currentPage * PAGE_SIZE, filteredComplaints.length)}</span> of <span className="font-bold text-slate-700">{filteredComplaints.length}</span> results
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-[#1d40a8] hover:text-white hover:border-[#1d40a8] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹ Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                          currentPage === p
                            ? 'bg-[#1d40a8] text-white shadow'
                            : 'border border-slate-200 text-slate-600 hover:bg-[#1d40a8] hover:text-white hover:border-[#1d40a8]'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )
                }
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-[#1d40a8] hover:text-white hover:border-[#1d40a8] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isFormOpen && !editingComplaint && (
        <ComplaintForm onClose={handleFormClose} onSucceed={handleFormSucceed} />
      )}
      
      {editingComplaint && (
        <EditComplaintForm 
          complaint={editingComplaint}
          isAdmin={false}
          onClose={handleFormClose} 
          onSucceed={handleFormSucceed} 
        />
      )}

      {viewingComplaint && (
        <EditComplaintForm 
          complaint={viewingComplaint}
          isAdmin={false}
          readOnly={true}
          onClose={handleFormClose} 
        />
      )}
    </Layout>
  );
}
