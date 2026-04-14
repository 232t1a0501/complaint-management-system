import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  icon: Icon, 
  disabled = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => 
    (typeof opt === 'object' ? opt.value : opt) === value
  );
  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) 
    : '';

  return (
    <div className={`relative ${disabled ? 'opacity-75 pointer-events-none' : ''} ${className}`} ref={dropdownRef}>
      {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />}
      
      <div 
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-3 text-sm bg-white border ${isOpen ? 'border-[#1d40a8] ring-2 ring-[#1d40a8]/20' : 'border-slate-200'} rounded-xl cursor-pointer transition-all flex items-center justify-between text-slate-800 font-medium`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 absolute right-4 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
          {options.map((opt, i) => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = value === optValue;
            
            return (
              <div 
                key={i}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center ${
                  isSelected 
                    ? 'bg-[#1d40a8]/5 text-[#1d40a8] font-bold' 
                    : 'hover:bg-slate-50 text-slate-700 font-medium'
                }`}
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
