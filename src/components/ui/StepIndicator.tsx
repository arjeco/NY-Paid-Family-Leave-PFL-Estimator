import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-xl mx-auto px-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <React.Fragment key={step}>
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-500 ease-out
                  ${isCompleted
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-100'
                    : isActive
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110 ring-4 ring-blue-500/20'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-200'}
                `}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step}
              </div>
              <span
                className={`
                  text-xs font-semibold tracking-wide text-center hidden sm:block
                  transition-colors duration-300
                  ${isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}
                `}
              >
                {labels[i]}
              </span>
            </div>

            {/* Connector line */}
            {step < totalSteps && (
              <div className="flex-1 mx-3 h-1 rounded-full overflow-hidden bg-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-emerald-400 to-blue-500"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
