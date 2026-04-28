/* =============================================================================
   NY Paid Family Leave (PFL) — Business Logic & Calculation Engine
   =============================================================================
   Source of truth for all PFL eligibility rules and benefit calculations.
   Based on current NY State PFL regulations (2024 rates).
   ============================================================================= */

// ---------------------------------------------------------------------------
// State Constants
// ---------------------------------------------------------------------------

/** Maximum number of weeks of PFL benefits available per claim */
export const MAX_WEEKS = 12;

/** Benefit percentage applied to the employee's Average Weekly Wage */
export const BENEFIT_PERCENTAGE = 0.67;

/** New York State Average Weekly Wage (SAWW) — 2024 */
export const CURRENT_NY_SAWW = 1718.15;

/** Maximum weekly benefit = SAWW × BENEFIT_PERCENTAGE */
export const MAX_WEEKLY_BENEFIT = parseFloat(
  (CURRENT_NY_SAWW * BENEFIT_PERCENTAGE).toFixed(2)
); // $1,151.16

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HoursCategory = '20_plus' | 'under_20';
export type IncomeFrequency = 'annual' | 'monthly' | 'biweekly' | 'weekly';

export interface EligibilityInput {
  hoursPerWeek: HoursCategory;
  /** Consecutive weeks (for 20+ hours) or total days (for <20 hours) */
  timeAtEmployer: number;
}

export interface EligibilityResult {
  eligible: boolean;
  /** Human-readable explanation of why the worker is or is not eligible */
  reason: string;
  /** The threshold required (26 weeks or 175 days) */
  threshold: number;
  /** The unit for the threshold ("consecutive weeks" | "days") */
  unit: string;
}

export interface BenefitInput {
  incomeAmount: number;
  incomeFrequency: IncomeFrequency;
}

export interface BenefitResult {
  /** Employee's calculated Average Weekly Wage */
  averageWeeklyWage: number;
  /** Raw calculated benefit (AWW × 67%) before cap */
  calculatedBenefit: number;
  /** The statutory maximum ($1,151.16) */
  maxStatutoryBenefit: number;
  /** The actual weekly payout (min of calculated vs. cap) */
  weeklyBenefit: number;
  /** Total payout over 12 weeks */
  totalPayout: number;
  /** Whether the worker's benefit hits the statutory cap */
  isCapped: boolean;
  /** Percentage of the cap that the worker's benefit fills (0–100) */
  capPercentage: number;
}

// ---------------------------------------------------------------------------
// Income Normalization
// ---------------------------------------------------------------------------

/**
 * Converts any income frequency into a weekly wage.
 *
 * - **Annual**:   amount / 52
 * - **Monthly**:  amount * 12 / 52
 * - **Bi-weekly**: amount / 2
 * - **Weekly**:   amount (no-op)
 */
export function normalizeToWeeklyWage(
  amount: number,
  frequency: IncomeFrequency
): number {
  switch (frequency) {
    case 'annual':
      return amount / 52;
    case 'monthly':
      return (amount * 12) / 52;
    case 'biweekly':
      return amount / 2;
    case 'weekly':
      return amount;
    default:
      return amount;
  }
}

// ---------------------------------------------------------------------------
// Eligibility Check
// ---------------------------------------------------------------------------

/**
 * Determines whether a worker meets the NY PFL eligibility requirements.
 *
 * - **20+ hours/week**: Must have worked ≥ 26 consecutive weeks.
 * - **< 20 hours/week**: Must have worked ≥ 175 days.
 */
export function checkEligibility(input: EligibilityInput): EligibilityResult {
  if (input.hoursPerWeek === '20_plus') {
    const threshold = 26;
    const eligible = input.timeAtEmployer >= threshold;
    return {
      eligible,
      threshold,
      unit: 'consecutive weeks',
      reason: eligible
        ? `You meet the requirement of ${threshold} consecutive weeks of employment.`
        : `You need at least ${threshold} consecutive weeks of employment. You currently have ${input.timeAtEmployer} week${input.timeAtEmployer !== 1 ? 's' : ''}.`,
    };
  }

  // under_20
  const threshold = 175;
  const eligible = input.timeAtEmployer >= threshold;
  return {
    eligible,
    threshold,
    unit: 'days',
    reason: eligible
      ? `You meet the requirement of ${threshold} days of employment.`
      : `You need at least ${threshold} days of employment. You currently have ${input.timeAtEmployer} day${input.timeAtEmployer !== 1 ? 's' : ''}.`,
  };
}

// ---------------------------------------------------------------------------
// Benefit Calculation
// ---------------------------------------------------------------------------

/**
 * Calculates the full PFL benefit breakdown.
 *
 * 1. Normalize income → Average Weekly Wage (AWW).
 * 2. Calculated Benefit = AWW × 67%.
 * 3. Cap at the statutory maximum (SAWW × 67%).
 * 4. Total Payout = weekly benefit × 12 weeks.
 */
export function calculateBenefit(input: BenefitInput): BenefitResult {
  const averageWeeklyWage = normalizeToWeeklyWage(
    input.incomeAmount,
    input.incomeFrequency
  );

  const calculatedBenefit = averageWeeklyWage * BENEFIT_PERCENTAGE;
  const maxStatutoryBenefit = MAX_WEEKLY_BENEFIT;
  const weeklyBenefit = Math.min(calculatedBenefit, maxStatutoryBenefit);
  const totalPayout = weeklyBenefit * MAX_WEEKS;
  const isCapped = calculatedBenefit >= maxStatutoryBenefit;
  const capPercentage = Math.min(
    (weeklyBenefit / maxStatutoryBenefit) * 100,
    100
  );

  return {
    averageWeeklyWage: roundTo(averageWeeklyWage, 2),
    calculatedBenefit: roundTo(calculatedBenefit, 2),
    maxStatutoryBenefit: roundTo(maxStatutoryBenefit, 2),
    weeklyBenefit: roundTo(weeklyBenefit, 2),
    totalPayout: roundTo(totalPayout, 2),
    isCapped,
    capPercentage: roundTo(capPercentage, 1),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Formats a number as a USD currency string.
 * e.g. 1151.16 → "$1,151.16"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
