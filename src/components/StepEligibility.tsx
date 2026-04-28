import React from 'react';
import { Clock, Calendar, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import type { HoursCategory } from '../utils/pfl-calculations';

interface StepEligibilityProps {
  hoursPerWeek: HoursCategory | null;
  timeAtEmployer: number | null;
  meetsEligibility: boolean | null;
  onHoursChange: (value: HoursCategory) => void;
  onTimeChange: (value: number) => void;
}

export default function StepEligibility({
  hoursPerWeek,
  timeAtEmployer,
  meetsEligibility,
  onHoursChange,
  onTimeChange,
}: StepEligibilityProps) {
  const is20Plus = hoursPerWeek === '20_plus';
  const isUnder20 = hoursPerWeek === 'under_20';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Check Your Eligibility
        </h2>
        <p className="text-slate-500 text-base max-w-lg mx-auto">
          Answer two quick questions to see if you qualify for New York Paid Family Leave.
        </p>
      </div>

      {/* Q1: Hours per week */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700">
          How many hours do you typically work per week?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onHoursChange('20_plus')}
            className={`
              group relative flex items-center gap-4 p-5 rounded-2xl border-2
              transition-all duration-300 cursor-pointer text-left
              ${is20Plus
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              transition-all duration-300
              ${is20Plus
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30'
                : 'bg-slate-100 group-hover:bg-slate-200'}
            `}>
              <Clock size={22} className={is20Plus ? 'text-white' : 'text-slate-500'} />
            </div>
            <div>
              <p className={`font-bold text-base ${is20Plus ? 'text-blue-700' : 'text-slate-700'}`}>
                20+ Hours
              </p>
              <p className={`text-sm ${is20Plus ? 'text-blue-600/70' : 'text-slate-400'}`}>
                Full-time or part-time (≥ 20 hrs/wk)
              </p>
            </div>
            {is20Plus && (
              <div className="absolute top-3 right-3">
                <CheckCircle2 size={20} className="text-blue-500" />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => onHoursChange('under_20')}
            className={`
              group relative flex items-center gap-4 p-5 rounded-2xl border-2
              transition-all duration-300 cursor-pointer text-left
              ${isUnder20
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              transition-all duration-300
              ${isUnder20
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30'
                : 'bg-slate-100 group-hover:bg-slate-200'}
            `}>
              <Clock size={22} className={isUnder20 ? 'text-white' : 'text-slate-500'} />
            </div>
            <div>
              <p className={`font-bold text-base ${isUnder20 ? 'text-blue-700' : 'text-slate-700'}`}>
                Less than 20 Hours
              </p>
              <p className={`text-sm ${isUnder20 ? 'text-blue-600/70' : 'text-slate-400'}`}>
                Part-time (&lt; 20 hrs/wk)
              </p>
            </div>
            {isUnder20 && (
              <div className="absolute top-3 right-3">
                <CheckCircle2 size={20} className="text-blue-500" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Q2: Time at employer (conditional) */}
      {hoursPerWeek && (
        <div className="space-y-3 animate-slideDown">
          <label
            htmlFor="time-at-employer"
            className="block text-sm font-semibold text-slate-700"
          >
            {is20Plus
              ? 'Have you worked for your current employer for at least 26 consecutive weeks?'
              : 'Have you worked at least 175 days for your current employer?'}
          </label>
          <p className="text-xs text-slate-400">
            {is20Plus
              ? 'Enter the number of consecutive weeks you\'ve worked for your current employer.'
              : 'Enter the total number of days you\'ve worked for your current employer.'}
          </p>
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Calendar size={16} className="text-white" />
            </div>
            <input
              id="time-at-employer"
              type="number"
              inputMode="numeric"
              min={0}
              max={is20Plus ? 520 : 3650}
              value={timeAtEmployer ?? ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onTimeChange(isNaN(val) ? 0 : val);
              }}
              placeholder={is20Plus ? 'e.g. 30' : 'e.g. 200'}
              className="
                w-full pl-18 pr-24 py-4 rounded-2xl
                text-xl font-bold text-slate-800
                bg-white border-2 border-slate-200
                focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                outline-none transition-all duration-200
                placeholder:text-slate-300 placeholder:font-normal
                currency-input
              "
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
              {is20Plus ? 'weeks' : 'days'}
            </span>
          </div>
        </div>
      )}

      {/* Eligibility result banner */}
      {hoursPerWeek && timeAtEmployer !== null && timeAtEmployer > 0 && (
        <div className="animate-fadeIn">
          {meetsEligibility ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 text-base">You're Eligible!</p>
                <p className="text-sm text-emerald-700 mt-1">
                  Based on your responses, you meet the eligibility requirements for NY Paid Family Leave.
                  Continue to calculate your estimated benefit.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-amber-800 text-base">Not Yet Eligible</p>
                <p className="text-sm text-amber-700 mt-1">
                  {is20Plus
                    ? `You need at least 26 consecutive weeks. You have ${timeAtEmployer} week${timeAtEmployer !== 1 ? 's' : ''}. You may continue to see your potential future benefit.`
                    : `You need at least 175 days of employment. You have ${timeAtEmployer} day${timeAtEmployer !== 1 ? 's' : ''}. You may continue to see your potential future benefit.`}
                </p>
                <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-amber-600">
                  <ChevronRight size={14} />
                  <span>You can still continue to estimate your future benefits</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
