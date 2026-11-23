import React from 'react';
import {
  CheckCircle2,
  Coins,
  Landmark,
  Scale,
  ShieldCheck,
  Smile,
  TrendingDown,
} from 'lucide-react';
import { getT } from '../../data/i18n';
import { formatCurrency } from '../../engine/prng';
import { FinancialSummary, GameState, LanguageCode } from '../../types/game';

interface ZakatTaxViewProps {
  game: GameState;
  summary: FinancialSummary;
  language: LanguageCode;
  onPayZakat: (mode: 'due' | 'accrued') => void;
  onPayIncomeTax: (mode: 'due' | 'accrued') => void;
}

export const ZakatTaxView: React.FC<ZakatTaxViewProps> = ({
  game,
  summary,
  language,
  onPayZakat,
  onPayIncomeTax,
}) => {
  const t = getT(language);
  const tp = t.taxPage;

  const zakatMonths = Math.max(0, Math.min(12, game.zakatAccrualMonths ?? 0));
  const zakatProgressWidth = Math.min(100, (zakatMonths / 12) * 100);
  const zakatableAssetsTotal =
    summary.cashAsset +
    summary.bankSavingsAsset +
    summary.bondsAsset +
    summary.stocksAsset +
    summary.otherInvestmentsAsset +
    summary.realEstateAsset +
    summary.businessesAsset;

  const totalLifetimePaid = (game.zakatPaidTotal ?? 0) + (game.incomeTaxPaidTotal ?? 0);

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white">{tp.title}</h2>
        <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">{tp.subtitle}</p>
      </div>

      {/* TOP 4 KPI STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-[#F6E7D7] p-3.5 sm:p-4 text-[#26201C] shadow min-w-0">
          <div className="text-xs sm:text-sm font-medium text-[#5E544C] truncate">
            {tp.zakatableWealthLbl}
          </div>
          <div className="mt-1 font-mono text-base sm:text-xl font-bold text-[#26201C] tabular-nums whitespace-nowrap">
            {formatCurrency(summary.zakatableNetWealth)}
          </div>
          <div className="text-xs sm:text-sm text-[#5E544C] mt-1 font-mono tabular-nums whitespace-nowrap truncate">
            {tp.nisabLbl}: {formatCurrency(summary.zakatNisab)}
          </div>
        </div>

        <div className="rounded-2xl bg-[#F6E7D7] p-3.5 sm:p-4 text-[#26201C] shadow min-w-0">
          <div className="text-xs sm:text-sm font-medium text-[#5E544C] truncate">
            {tp.zakatAccrualLbl}
          </div>
          <div className="mt-1 font-mono text-base sm:text-xl font-bold text-[#169C5E] tabular-nums whitespace-nowrap">
            {summary.zakatAccruedPct.toFixed(2)}%
          </div>
          <div className="text-xs sm:text-sm text-[#5E544C] mt-1 font-mono tabular-nums whitespace-nowrap">
            {formatCurrency(summary.zakatAccruedCurrent)}
          </div>
        </div>

        <div className="rounded-2xl bg-[#F6E7D7] p-3.5 sm:p-4 text-[#26201C] shadow min-w-0">
          <div className="text-xs sm:text-sm font-medium text-[#5E544C] truncate">
            {tp.taxAccrualLbl}
          </div>
          <div className="mt-1 font-mono text-base sm:text-xl font-bold text-[#D97706] tabular-nums whitespace-nowrap">
            {formatCurrency(summary.incomeTaxAccruedCurrent)}
          </div>
          <div className="text-xs sm:text-sm text-[#5E544C] mt-1 font-mono tabular-nums whitespace-nowrap truncate">
            {summary.incomeTaxRatePct}% {tp.taxRateBadge}
          </div>
        </div>

        <div className="rounded-2xl bg-[#F6E7D7] p-3.5 sm:p-4 text-[#26201C] shadow min-w-0">
          <div className="text-xs sm:text-sm font-medium text-[#5E544C] truncate">
            {tp.lifetimePaidLbl}
          </div>
          <div className="mt-1 font-mono text-base sm:text-xl font-bold text-[#26201C] tabular-nums whitespace-nowrap">
            {formatCurrency(totalLifetimePaid)}
          </div>
          <div className="text-xs sm:text-sm text-[#169C5E] mt-1 font-semibold inline-flex items-center gap-1 whitespace-nowrap">
            <Smile className="h-3.5 w-3.5 shrink-0" />
            <span>
              {t.happinessLabel}: {summary.happiness}/100
            </span>
          </div>
        </div>
      </section>

      {/* MAIN TWO CARDS: ISLAMIC ZAKAT & INCOME TAX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 1. ISLAMIC ZAKAT CARD */}
        <section className="rounded-3xl bg-[#F6E7D7] p-5 sm:p-6 text-[#26201C] shadow-lg space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E2CEB9] pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#169C5E]/15 text-[#169C5E]">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#26201C]">
                  {tp.zakatSectionTitle}
                </h3>
                <div className="text-sm font-semibold text-[#169C5E]">
                  {tp.zakatHappinessTag}
                </div>
              </div>
            </div>

            <span
              className={`rounded-full px-3.5 py-1 text-sm font-bold ${
                summary.zakatEligible
                  ? 'bg-[#DCFCE7] text-[#147A4B]'
                  : 'bg-white/80 text-[#5E544C]'
              }`}
            >
              {summary.zakatEligible ? tp.eligibleBadge : tp.belowNisabBadge}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[#4A423C]">{tp.zakatRuleDesc}</p>

          {/* Auto Accrual Progress Bar */}
          <div className="rounded-2xl bg-white p-4 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-[#453B34]">{tp.accrualProgressLbl}</span>
              <span className="font-mono text-[#169C5E] tabular-nums">
                {summary.zakatAccruedPct.toFixed(2)}% / 2.50%
              </span>
            </div>

            <div className="relative h-6 w-full overflow-hidden rounded-full bg-[#EFE3D4]">
              <div
                className="h-full rounded-full bg-[#169C5E] transition-all duration-300"
                style={{ width: `${summary.zakatEligible ? zakatProgressWidth : 0}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-[#26201C] tabular-nums">
                {zakatMonths}/12 {tp.monthsCompletedSuffix}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1 text-sm">
              <div className="rounded-xl bg-[#FAF2E9] p-3 min-w-0">
                <div className="text-xs font-medium text-[#5E544C] truncate">
                  {tp.projectedAnnualLbl}
                </div>
                <div className="mt-0.5 font-mono text-[15px] sm:text-base font-bold text-[#26201C] tabular-nums whitespace-nowrap">
                  {formatCurrency(summary.zakatProjectedAnnual)}
                </div>
              </div>
              <div className="rounded-xl bg-[#FAF2E9] p-3 min-w-0">
                <div className="text-xs font-medium text-[#5E544C] truncate">
                  {tp.exemptAssetsNote}
                </div>
                <div className="mt-0.5 font-mono text-[15px] sm:text-base font-bold text-[#26201C] tabular-nums whitespace-nowrap">
                  {formatCurrency(summary.personalAssetsValue)}
                </div>
              </div>
            </div>
          </div>

          {/* Wealth-responsive note */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-white/75 px-4 py-3 text-sm text-[#4A423C]">
            <TrendingDown className="h-4 w-4 shrink-0 text-[#D97706] mt-0.5" />
            <span>{tp.wealthDropNote}</span>
          </div>

          {/* Payment Actions */}
          <div className="space-y-2.5 pt-1">
            {/* Year-End Due Zakat */}
            <div className="rounded-2xl bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div>
                <div className="text-sm font-medium text-[#5E544C]">{tp.yearEndDueLbl}</div>
                <div
                  className={`font-mono text-xl font-bold tabular-nums ${
                    summary.zakatDueEffective > 0 ? 'text-[#DC2626]' : 'text-[#169C5E]'
                  }`}
                >
                  {formatCurrency(summary.zakatDueEffective)}
                </div>
              </div>

              {summary.zakatDueEffective > 0 ? (
                <button
                  type="button"
                  disabled={summary.cashAsset < summary.zakatDueEffective}
                  onClick={() => onPayZakat('due')}
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] disabled:opacity-45 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-bold text-[#26201C] shadow-sm transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{tp.payYearEndZakatBtn}</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#169C5E]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{tp.noZakatDueText}</span>
                </span>
              )}
            </div>

            {/* Live Accrued Zakat (Advance Payment) */}
            <div className="rounded-2xl bg-white/85 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#5E544C]">{tp.currentAccruedLbl}</div>
                <div className="font-mono text-xl font-bold text-[#26201C] tabular-nums">
                  {formatCurrency(summary.zakatAccruedCurrent)}
                </div>
              </div>

              <button
                type="button"
                disabled={
                  summary.zakatAccruedCurrent <= 0 ||
                  summary.cashAsset < summary.zakatAccruedCurrent
                }
                onClick={() => onPayZakat('accrued')}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#169C5E] hover:bg-[#12834E] disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-bold text-white transition-colors"
              >
                <Coins className="h-4 w-4" />
                <span>{tp.payAdvanceZakatBtn}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. PROGRESSIVE INCOME TAX CARD */}
        <section className="rounded-3xl bg-[#F6E7D7] p-5 sm:p-6 text-[#26201C] shadow-lg space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#E2CEB9] pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D97706]/15 text-[#D97706]">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#26201C]">
                  {tp.taxSectionTitle}
                </h3>
                <div className="text-sm font-semibold text-[#D97706]">{tp.taxHappinessTag}</div>
              </div>
            </div>

            <span className="rounded-full bg-white/85 px-3.5 py-1 font-mono text-sm font-bold text-[#26201C]">
              {summary.incomeTaxRatePct}% {tp.taxRateBadge}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[#4A423C]">{tp.taxRuleDesc}</p>

          {/* Metrics Grid */}
          <div className="rounded-2xl bg-white p-4 space-y-3 shadow-sm">
            <div className="grid grid-cols-2 gap-2.5 text-sm">
              <div className="rounded-xl bg-[#FAF2E9] p-3 min-w-0">
                <div className="text-xs font-medium text-[#5E544C] truncate">
                  {tp.taxableIncomeYtdLbl}
                </div>
                <div className="mt-0.5 font-mono text-[15px] sm:text-lg font-bold text-[#26201C] tabular-nums whitespace-nowrap">
                  {formatCurrency(game.taxableIncomeYTD ?? 0)}
                </div>
              </div>
              <div className="rounded-xl bg-[#FAF2E9] p-3 min-w-0">
                <div className="text-xs font-medium text-[#5E544C] truncate">
                  {tp.currentTaxBracketLbl}
                </div>
                <div className="mt-0.5 font-mono text-[15px] sm:text-lg font-bold text-[#D97706] tabular-nums whitespace-nowrap">
                  {summary.incomeTaxRatePct}%
                </div>
              </div>
            </div>

            {summary.incomeTaxLossRelief > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-[#DCFCE7] px-3.5 py-2.5 text-sm font-bold text-[#147A4B]">
                <span>{tp.lossReliefLbl}</span>
                <span className="font-mono tabular-nums">
                  -{formatCurrency(summary.incomeTaxLossRelief)}
                </span>
              </div>
            )}
          </div>

          {/* Payment Actions */}
          <div className="space-y-2.5 pt-1">
            {/* Year-End Unpaid Tax */}
            <div className="rounded-2xl bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div>
                <div className="text-sm font-medium text-[#5E544C]">
                  {tp.taxSectionTitle} · {tp.yearEndDueLbl}
                </div>
                <div
                  className={`font-mono text-xl font-bold tabular-nums ${
                    summary.incomeTaxDueEffective > 0 ? 'text-[#DC2626]' : 'text-[#169C5E]'
                  }`}
                >
                  {formatCurrency(summary.incomeTaxDueEffective)}
                </div>
              </div>

              {summary.incomeTaxDueEffective > 0 ? (
                <button
                  type="button"
                  disabled={summary.cashAsset < summary.incomeTaxDueEffective}
                  onClick={() => onPayIncomeTax('due')}
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] disabled:opacity-45 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-bold text-[#26201C] shadow-sm transition-colors"
                >
                  <Scale className="h-4 w-4" />
                  <span>{tp.payYearEndTaxBtn}</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#169C5E]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{tp.noTaxDueText}</span>
                </span>
              )}
            </div>

            {/* Live Accrued Tax (Advance Payment) */}
            <div className="rounded-2xl bg-white/85 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#5E544C]">{tp.currentAccruedLbl}</div>
                <div className="font-mono text-xl font-bold text-[#26201C] tabular-nums">
                  {formatCurrency(summary.incomeTaxAccruedCurrent)}
                </div>
              </div>

              <button
                type="button"
                disabled={
                  summary.incomeTaxAccruedCurrent <= 0 ||
                  summary.cashAsset < summary.incomeTaxAccruedCurrent
                }
                onClick={() => onPayIncomeTax('accrued')}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#26201C] hover:bg-[#3A312B] disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-bold text-white transition-colors"
              >
                <Landmark className="h-4 w-4" />
                <span>{tp.payAdvanceTaxBtn}</span>
              </button>
            </div>
          </div>

          {/* Asset Breakdown Box */}
          <div className="rounded-2xl bg-white/80 p-4 space-y-2 text-sm">
            <div className="font-bold text-[#26201C]">{tp.assetBreakdownTitle}</div>
            <div className="flex items-center justify-between text-[#5E544C]">
              <span>{tp.zakatableAssetsSumLbl}</span>
              <span className="font-mono font-bold text-[#26201C] tabular-nums">
                {formatCurrency(zakatableAssetsTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#5E544C]">
              <span>{tp.deductibleDebtsLbl}</span>
              <span className="font-mono font-bold text-[#DC2626] tabular-nums">
                -{formatCurrency(summary.totalLiabilities)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[#E2CEB9] pt-2 font-bold text-[#26201C]">
              <span>{tp.netZakatableLbl}</span>
              <span className="font-mono text-[#169C5E] tabular-nums">
                {formatCurrency(summary.zakatableNetWealth)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
