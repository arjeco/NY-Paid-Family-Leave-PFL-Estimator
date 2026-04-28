import React, { useRef, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  id?: string;
}

export default function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = '0',
  id = 'currency-input',
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Format display value
  const displayValue = value > 0 ? value.toLocaleString('en-US') : '';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(raw);
    onChange(isNaN(parsed) ? 0 : parsed);
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    // Show raw number for editing
    if (inputRef.current && value > 0) {
      inputRef.current.value = value.toString();
    }
  }

  function handleBlur() {
    // Re-format on blur
    if (inputRef.current) {
      inputRef.current.value = displayValue;
    }
  }

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.value = displayValue;
    }
  }, [displayValue]);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <DollarSign size={16} className="text-white" />
        </div>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="decimal"
          defaultValue={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="
            w-full pl-18 pr-6 py-4 rounded-2xl
            text-xl font-bold text-slate-800
            bg-white border-2 border-slate-200
            focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
            outline-none transition-all duration-200
            placeholder:text-slate-300 placeholder:font-normal
            currency-input
          "
        />
      </div>
    </div>
  );
}
