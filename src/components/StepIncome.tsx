import React from 'react';
import CurrencyInput from './ui/CurrencyInput';
import type { IncomeFrequency } from '../utils/pfl-calculations';
import { Wallet, TrendingUp } from 'lucide-react';
import { normalizeToWeeklyWage, formatCurrency } from '../utils/pfl-calculations';

interface StepIncomeProps {
  incomeAmount: number;
  incomeFrequency: IncomeFrequency;
  onAmountChange: (value: number) => void;
  onFrequencyChange: (value: IncomeFrequency) => void;
}

const FREQUENCY_OPTIONS: { value: IncomeFrequency; label: string; sublabel: string }[] = [
  { value: 'annual', label: 'Annual', sublabel: 'Yearly salary' },
  { value: 'monthly', label: 'Monthly', sublabel: 'Per month' },
  { value: 'biweekly', label: 'Bi-weekly', sublabel: 'Every 2 weeks' },
  { value: 'weekly', label: 'Weekly', sublabel: 'Per week' },
];

export default function StepIncome({
  incomeAmount,
  incomeFrequency,
  onAmountChange,
  onFrequencyChange,
}: StepIncomeProps) {
  const weeklyWage = incomeAmount > 0
    ? normalizeToWeeklyWage(incomeAmount, incomeFrequency)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Your Income
        </h2>
        <p className="text-slate-500 text-base max-w-lg mx-auto">
          Enter your gross income to calculate your PFL benefit. We'll convert it to a weekly wage automatically.
        </p>
      </div>

      {/* Income Frequency Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700">
          Pay Frequency
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFrequencyChange(opt.value)}
              className={`
                group relative p-3 sm:p-4 rounded-2xl border-2
                transition-all duration-300 cursor-pointer text-center
                ${incomeFrequency === opt.value
                  ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}
              `}
            >
              <p className={`font-bold text-sm sm:text-base ${
                incomeFrequency === opt.value ? 'text-blue-700' : 'text-slate-700'
              }`}>
                {opt.label}
              </p>
              <p className={`text-xs mt-0.5 ${
                incomeFrequency === opt.value ? 'text-blue-600/70' : 'text-slate-400'
              }`}>
                {opt.sublabel}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Income Amount */}
      <CurrencyInput
        label={`Gross ${FREQUENCY_OPTIONS.find(f => f.value === incomeFrequency)?.label || ''} Income`}
        value={incomeAmount}
        onChange={onAmountChange}
        placeholder={incomeFrequency === 'annual' ? '75,000' : incomeFrequency === 'monthly' ? '6,250' : incomeFrequency === 'biweekly' ? '2,885' : '1,442'}
        id="income-amount"
      />

      {/* Weekly wage preview */}
      {incomeAmount > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 animate-fadeIn">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-600">Your Average Weekly Wage</span>
          </div>
          <p className="text-2xl font-black text-blue-700">
            {formatCurrency(weeklyWage)}
            <span className="text-sm font-medium text-blue-500 ml-2">/ week</span>
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <div className="flex items-start gap-3">
          <Wallet size={18} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter your <strong>gross</strong> (pre-tax) income. PFL benefits are calculated at 67% of your
            average weekly wage, capped at the New York State Average Weekly Wage maximum.
          </p>
        </div>
      </div>
    </div>
  );
}
