import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import StepIndicator from './ui/StepIndicator';
import StepEligibility from './StepEligibility';
import StepIncome from './StepIncome';
import StepPflResults from './StepPflResults';
import {
  checkEligibility,
  calculateBenefit,
} from '../utils/pfl-calculations';
import type { HoursCategory, IncomeFrequency } from '../utils/pfl-calculations';

const STEP_LABELS = ['Eligibility', 'Income', 'Results'];

export default function PflCalculator() {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 — Eligibility
  const [hoursPerWeek, setHoursPerWeek] = useState<HoursCategory | null>(null);
  const [timeAtEmployer, setTimeAtEmployer] = useState<number | null>(null);

  // Step 2 — Income
  const [incomeAmount, setIncomeAmount] = useState<number>(0);
  const [incomeFrequency, setIncomeFrequency] = useState<IncomeFrequency>('annual');

  // Computed: eligibility
  const eligibility = useMemo(() => {
    if (!hoursPerWeek || timeAtEmployer === null || timeAtEmployer <= 0) return null;
    return checkEligibility({ hoursPerWeek, timeAtEmployer });
  }, [hoursPerWeek, timeAtEmployer]);

  const meetsEligibility = eligibility?.eligible ?? null;

  // Computed: benefit
  const benefit = useMemo(
    () => calculateBenefit({ incomeAmount, incomeFrequency }),
    [incomeAmount, incomeFrequency]
  );

  // Navigation helpers
  const canProceedStep1 = hoursPerWeek !== null;
  const canProceedStep2 = incomeAmount > 0;

  const canProceed = currentStep === 1 ? canProceedStep1 : currentStep === 2 ? canProceedStep2 : false;

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, 3));
  }, []);

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  // Reset time at employer when hours category changes
  const handleHoursChange = useCallback((value: HoursCategory) => {
    setHoursPerWeek(value);
    setTimeAtEmployer(null);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Calculator Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 sm:px-10 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Shield size={22} className="text-blue-200" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                NY Paid Family Leave Estimator
              </h1>
              <p className="text-blue-200 text-sm font-medium">
                New York State • 2024 Rates
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-6 sm:px-10 py-6 border-b border-slate-100 bg-slate-50/50">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={3}
            labels={STEP_LABELS}
          />
        </div>

        {/* Step Content */}
        <div className="px-6 sm:px-10 py-8 sm:py-10">
          {currentStep === 1 && (
            <StepEligibility
              hoursPerWeek={hoursPerWeek}
              timeAtEmployer={timeAtEmployer}
              meetsEligibility={meetsEligibility}
              onHoursChange={handleHoursChange}
              onTimeChange={setTimeAtEmployer}
            />
          )}

          {currentStep === 2 && (
            <StepIncome
              incomeAmount={incomeAmount}
              incomeFrequency={incomeFrequency}
              onAmountChange={setIncomeAmount}
              onFrequencyChange={setIncomeFrequency}
            />
          )}

          {currentStep === 3 && (
            <StepPflResults
              benefit={benefit}
              isEligible={meetsEligibility}
            />
          )}
        </div>

        {/* Navigation Footer */}
        <div className="px-6 sm:px-10 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          {/* Back Button */}
          {currentStep > 1 ? (
            <button
              onClick={goBack}
              className="
                flex items-center gap-2 px-6 py-3 rounded-full
                text-slate-600 font-semibold text-sm
                border border-slate-200 bg-white
                hover:bg-slate-50 hover:border-slate-300
                transition-all duration-200
                cursor-pointer
              "
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}

          {/* Next / Calculate Button */}
          {currentStep < 3 && (
            <button
              onClick={goNext}
              disabled={!canProceed}
              className="
                flex items-center gap-2 px-8 py-3 rounded-full
                text-white font-bold text-sm
                bg-gradient-to-r from-blue-600 to-indigo-600
                shadow-lg shadow-blue-500/25
                hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5
                active:translate-y-0
                transition-all duration-300
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
                cursor-pointer
              "
            >
              {currentStep === 2 ? 'Calculate My Benefit' : 'Continue'}
              <ArrowRight size={16} />
            </button>
          )}

          {/* Restart on results page */}
          {currentStep === 3 && (
            <button
              onClick={() => {
                setCurrentStep(1);
                setHoursPerWeek(null);
                setTimeAtEmployer(null);
                setIncomeAmount(0);
                setIncomeFrequency('annual');
              }}
              className="
                flex items-center gap-2 px-8 py-3 rounded-full
                text-white font-bold text-sm
                bg-gradient-to-r from-blue-600 to-indigo-600
                shadow-lg shadow-blue-500/25
                hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5
                active:translate-y-0
                transition-all duration-300
                cursor-pointer
              "
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <p className="text-center text-xs text-slate-400 mt-6 px-4 leading-relaxed">
        This tool provides estimates only. Benefits are based on 2024 NY State PFL rates.
        <br />
        Consult your employer's HR department or the{' '}
        <a
          href="https://paidfamilyleave.ny.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 underline underline-offset-2"
        >
          NY PFL website
        </a>
        {' '}for official guidance.
      </p>
    </div>
  );
}
