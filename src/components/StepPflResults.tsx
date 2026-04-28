import React from 'react';
import {
  DollarSign,
  CalendarDays,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import type { BenefitResult } from '../utils/pfl-calculations';
import { formatCurrency, MAX_WEEKS, MAX_WEEKLY_BENEFIT } from '../utils/pfl-calculations';

interface StepPflResultsProps {
  benefit: BenefitResult;
  isEligible: boolean | null;
}

export default function StepPflResults({ benefit, isEligible }: StepPflResultsProps) {
  const {
    averageWeeklyWage,
    weeklyBenefit,
    totalPayout,
    isCapped,
    capPercentage,
    maxStatutoryBenefit,
  } = benefit;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Your PFL Benefit Estimate
        </h2>
        <p className="text-slate-500 text-base max-w-lg mx-auto">
          Here's a breakdown of your estimated NY Paid Family Leave benefit.
        </p>
      </div>

      {/* Eligibility warning if not eligible */}
      {isEligible === false && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
          <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700">
            <strong>Note:</strong> Based on your answers, you don't currently meet the eligibility requirements.
            The estimates below show what your benefit <em>would</em> be once you're eligible.
          </p>
        </div>
      )}

      {/* Primary benefit card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/20 animate-scaleIn">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <DollarSign size={22} className="text-blue-200" />
          </div>
          <div>
            <p className="text-blue-200 text-sm font-semibold">Your Estimated Weekly Benefit</p>
          </div>
        </div>
        <p className="text-4xl sm:text-5xl font-black tracking-tight animate-countUp">
          {formatCurrency(weeklyBenefit)}
        </p>
        <p className="text-blue-200 text-sm mt-2 font-medium">per week for up to {MAX_WEEKS} weeks</p>
      </div>

      {/* Summary cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total payout */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Payout</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{formatCurrency(totalPayout)}</p>
          <p className="text-xs text-slate-400 mt-1">over {MAX_WEEKS} weeks</p>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <CalendarDays size={16} className="text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Duration</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{MAX_WEEKS} Weeks</p>
          <p className="text-xs text-slate-400 mt-1">maximum leave period</p>
        </div>

        {/* AWW */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <Award size={16} className="text-violet-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your AWW</span>
          </div>
          <p className="text-2xl font-black text-slate-800">{formatCurrency(averageWeeklyWage)}</p>
          <p className="text-xs text-slate-400 mt-1">average weekly wage</p>
        </div>
      </div>

      {/* Cap comparison visual */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">
              Benefit vs. NY State Maximum
            </span>
          </div>
          {isCapped && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              <AlertTriangle size={12} />
              Cap reached
            </span>
          )}
          {!isCapped && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              <CheckCircle2 size={12} />
              Under cap
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out animate-progressFill"
              style={{
                width: `${capPercentage}%`,
                background: isCapped
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                  : 'linear-gradient(90deg, #3b82f6, #6366f1)',
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              Your benefit: {formatCurrency(weeklyBenefit)}
            </span>
            <span className="font-semibold text-slate-400">
              NY Max: {formatCurrency(maxStatutoryBenefit)}
            </span>
          </div>
        </div>

        {/* Cap explanation */}
        <div className={`rounded-xl p-4 text-sm ${
          isCapped
            ? 'bg-amber-50 border border-amber-100 text-amber-800'
            : 'bg-blue-50 border border-blue-100 text-blue-800'
        }`}>
          {isCapped ? (
            <p>
              Your calculated benefit ({formatCurrency(benefit.calculatedBenefit)}/wk) exceeds the NY State
              maximum of <strong>{formatCurrency(maxStatutoryBenefit)}/wk</strong>. Your benefit is capped
              at the statutory maximum.
            </p>
          ) : (
            <p>
              Your benefit is <strong>{capPercentage.toFixed(0)}%</strong> of the NY State maximum
              ({formatCurrency(maxStatutoryBenefit)}/wk). You are below the statutory cap.
            </p>
          )}
        </div>
      </div>

      {/* Methodology note */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong>How this is calculated:</strong> Your average weekly wage ({formatCurrency(averageWeeklyWage)})
          × 67% = {formatCurrency(benefit.calculatedBenefit)}. This is{' '}
          {isCapped ? (
            <>capped at the statutory maximum of {formatCurrency(maxStatutoryBenefit)} per week</>
          ) : (
            <>below the statutory maximum of {formatCurrency(maxStatutoryBenefit)} per week</>
          )}
          . Benefits are available for up to {MAX_WEEKS} weeks per qualifying event.
        </p>
      </div>
    </div>
  );
}
