import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export default function DatePicker({ value, onChange, placeholder = 'Select date' }) {
  const [open, setOpen] = useState(false);
  const today = new Date();

  const parseDate = (val) => {
    if (!val) return null;
    const [y, m, d] = val.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const selected = parseDate(value);
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const selectDay = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const displayValue = selected
    ? selected.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const isSelected = (day) => {
    if (!selected) return false;
    return selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;
  };

  const isToday = (day) => {
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white hover:border-[#1d40a8]/60 focus:outline-none focus:ring-2 focus:ring-[#1d40a8]/30 focus:border-[#1d40a8] transition-all"
      >
        <Calendar size={16} className="text-slate-400 flex-shrink-0" />
        <span className={displayValue ? 'text-slate-800 font-medium' : 'text-slate-400'}>{displayValue || placeholder}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-slate-800">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold uppercase text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                type="button"
                onClick={() => selectDay(day)}
                className={`
                  w-full aspect-square flex items-center justify-center text-sm rounded-lg font-medium transition-all
                  ${isSelected(day) ? 'bg-[#1d40a8] text-white shadow-md' : ''}
                  ${isToday(day) && !isSelected(day) ? 'border border-[#1d40a8] text-[#1d40a8] font-bold' : ''}
                  ${!isSelected(day) && !isToday(day) ? 'text-slate-700 hover:bg-[#1d40a8]/10 hover:text-[#1d40a8]' : ''}
                `}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
            <button
              type="button"
              onClick={() => { const n = new Date(); onChange(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`); setOpen(false); }}
              className="text-xs font-semibold text-[#1d40a8] hover:underline"
            >
              Today
            </button>
            {value && (
              <button type="button" onClick={() => { onChange(''); setOpen(false); }} className="text-xs font-semibold text-slate-400 hover:text-red-500">
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
