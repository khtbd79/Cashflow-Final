import React from 'react';
import {
  AlertTriangle,
  Award,
  CalendarCheck,
  CheckCircle2,
  ListChecks,
  Scale,
  Wallet,
  X,
} from 'lucide-react';
import { getT } from '../../data/i18n';
import { getPersonalAssetById, getPersonalAssetName } from '../../data/lifestyle';
import { localizeTransactionText, localizeTurnNote } from '../../data/localization';
import { formatCurrency, formatYearMonth } from '../../engine/prng';
import { LanguageCode, TurnSummary } from '../../types/game';

interface TurnSummaryModalProps {
  summary: TurnSummary | null;
  language: LanguageCode;
  onClose: () => void;
  onGoToEvents: () => void;
  onGoToTax?: () => void;
}

function formatSignedDelta(value: number, suffix = ''): string {
  if (value === 0) return `0${suffix}`;
  const sign = value > 0 ? '+' : '-';
  return `${sign}${Math.abs(value)}${suffix}`;
}

export const TurnSummaryModal: React.FC<TurnSummaryModalProps> = ({
  summary,
  language,
  onClose,
  onGoToEvents,
  onGoToTax,
}) => {
  if (!summary) return null;

  const t = getT(language);
  const completedYear = summary.completedYear ?? summary.year;
  const completedMonth = summary.completedMonth ?? summary.month;
  const completedTurn = summary.completedTurn ?? summary.turn;

  const viewEventsText =
    summary.eventsGeneratedCount === 1
      ? t.turnSummary.viewEventsSingular
      : language === 'bn'
      ? `${summary.eventsGeneratedCount}${t.turnSummary.viewEventsPlural}`
      : `View ${summary.eventsGeneratedCount} ${t.turnSummary.viewEventsPlural}`;

  const actions = summary.actionsDuringTurn ?? [];
  const hasAchievementsData =
    summary.netWorthAfter !== undefined ||
    summary.passiveIncomeAfter !== undefined ||
    summary.freedomProgressPctAfter !== undefined ||
    summary.happinessAfter !== undefined;

  const passiveBreakdown = [
    { label: t.turnSummary.stockDividends, val: summary.stockDividendsReceived ?? 0 },
    { label: t.turnSummary.goldDividends, val: summary.goldDividendsReceived ?? 0 },
    { label: t.turnSummary.bondInterest, val: summary.bondInterestReceived ?? 0 },
    { label: t.turnSummary.savingsInterest, val: summary.savingsInterestReceived ?? 0 },
    { label: t.turnSummary.rentalIncome, val: summary.rentalIncomeReceived ?? 0 },
    { label: t.turnSummary.autoBizIncome, val: summary.automatedBusinessReceived ?? 0 },
    { label: t.turnSummary.otherPassive, val: summary.otherPassiveReceived ?? 0 },
  ].filter((r) => r.val > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F6E7D7] p-5 sm:p-6 text-[#26201C] shadow-2xl">
        {/* Header: Completed Month + Title */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2CEB9] pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#169C5E] shadow-sm">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-semibold text-[#665B53]">
                <span>
                  {formatYearMonth(completedYear, completedMonth, language)} · {t.monthLabel}{' '}
                  {completedTurn}
                </span>
                <span className="rounded-md bg-[#169C5E]/15 px-1.5 py-0.5 text-[11px] font-sans font-bold text-[#147A4B]">
                  {t.turnSummary.completedBadge}
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#26201C] leading-snug mt-0.5">
                {t.turnSummary.title}
              </h3>
              {summary.completedTurn !== undefined && (
                <div className="text-[11px] font-mono text-[#7C6F65] mt-0.5">
                  {t.turnSummary.nextPeriodPrefix}{' '}
                  {formatYearMonth(summary.year, summary.month, language)} · {t.monthLabel}{' '}
                  {summary.turn}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] shrink-0 flex items-center justify-center rounded-xl text-[#665B53] hover:bg-[#EAD7C3]"
            aria-label={t.common.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Black Swan Market Event */}
        {summary.blackSwanTriggered && (
          <div className="mt-4 rounded-2xl bg-[#191C24] p-4 text-white border border-[#F7CA44]/40">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#F7CA44] shrink-0" />
                <span className="text-xs font-bold text-[#F7CA44]">
                  {t.turnSummary.blackSwanBadge}
                </span>
              </div>
              <span className="text-xs font-bold text-white/80">
                {t.turnSummary.blackSwanTitle}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-xl bg-white/5 px-3 py-2">
                <div className="text-white/60">{t.turnSummary.blackSwanMarketDrop}</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-[#F87171]">
                  -{summary.blackSwanMarketDropPct ?? 25}%
                </div>
              </div>
              <div className="rounded-xl bg-white/5 px-3 py-2">
                <div className="text-white/60">{t.turnSummary.blackSwanGoldSurge}</div>
                <div className="mt-0.5 font-mono text-sm font-bold text-[#F7CA44]">
                  +{summary.blackSwanGoldSurgePct ?? 35}%
                </div>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs">
              {(summary.blackSwanGoldProfit ?? 0) > 0 ? (
                <>
                  <span className="font-semibold text-white/90">
                    {t.turnSummary.blackSwanGoldProfit}
                  </span>
                  <span className="font-mono font-bold text-[#4ADE80]">
                    +{formatCurrency(summary.blackSwanGoldProfit ?? 0)}
                  </span>
                </>
              ) : (
                <span className="font-medium text-[#F7CA44]">
                  {t.turnSummary.blackSwanNoGold}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Turn Alerts (Inflation, Baby, Divorce, Uninsured Accident) */}
        {((summary.annualInflationPct ?? 0) > 0 ||
          summary.babyBornThisTurn ||
          summary.divorceThisTurn ||
          (summary.yearlyMissingAssetsHappinessLoss ?? 0) > 0 ||
          summary.uninsuredAccidentOccurred) && (
          <div className="mt-3 space-y-2 text-xs font-bold">
            {(summary.annualInflationPct ?? 0) > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-[#FEE2E2] px-3.5 py-2 text-[#991B1B]">
                <span>{t.turnSummary.annualInflationAlert}</span>
                <span className="font-mono">+{summary.annualInflationPct}%</span>
              </div>
            )}
            {(summary.yearlyMissingAssetsHappinessLoss ?? 0) > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-[#FEF3C7] px-3.5 py-2 text-[#92400E]">
                <span>{t.turnSummary.yearlyMissingAssetsAlert}</span>
                <span className="font-mono">
                  -{summary.yearlyMissingAssetsHappinessLoss} {t.happinessLabel}
                </span>
              </div>
            )}
            {summary.uninsuredAccidentOccurred && (
              <div className="flex items-center justify-between gap-2 rounded-xl bg-[#FEE2E2] px-3.5 py-2 text-[#991B1B]">
                <span>
                  {t.turnSummary.uninsuredAccidentAlert}
                  {summary.uninsuredAccidentAssetId
                    ? ` · ${getPersonalAssetName(
                        getPersonalAssetById(summary.uninsuredAccidentAssetId),
                        language
                      )}`
                    : ''}
                </span>
                <span className="font-mono shrink-0">
                  -{formatCurrency(summary.uninsuredAccidentCashLoss ?? 0)} · -
                  {summary.uninsuredAccidentHappinessLoss ?? 0} {t.happinessLabel}
                </span>
              </div>
            )}
            {summary.babyBornThisTurn && (
              <div className="flex items-center justify-between rounded-xl bg-[#DCFCE7] px-3.5 py-2 text-[#166534]">
                <span>{t.turnSummary.babyBornAlert}</span>
              </div>
            )}
            {summary.divorceThisTurn && (
              <div className="flex items-center justify-between rounded-xl bg-[#FEE2E2] px-3.5 py-2 text-[#991B1B]">
                <span>{t.turnSummary.divorceAlert}</span>
                {(summary.divorceSettlementPaid ?? 0) > 0 && (
                  <span className="font-mono">
                    -{formatCurrency(summary.divorceSettlementPaid ?? 0)}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Year-End Zakat & Income Tax Assessment */}
        {((summary.zakatAssessedThisYearEnd ?? 0) > 0 ||
          (summary.taxAssessedThisYearEnd ?? 0) > 0) && (
          <div className="mt-3 rounded-2xl bg-[#191C24] p-3.5 text-white space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F7CA44]">
              <Scale className="h-4 w-4 shrink-0" />
              <span>{t.turnSummary.yearEndTaxZakatTitle}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(summary.zakatAssessedThisYearEnd ?? 0) > 0 && (
                <div className="rounded-xl bg-white/8 px-3 py-2">
                  <div className="text-white/65">{t.turnSummary.yearEndZakatAssessed}</div>
                  <div className="mt-0.5 font-mono font-bold text-[#4ADE80] tabular-nums">
                    {formatCurrency(summary.zakatAssessedThisYearEnd ?? 0)}
                  </div>
                </div>
              )}
              {(summary.taxAssessedThisYearEnd ?? 0) > 0 && (
                <div className="rounded-xl bg-white/8 px-3 py-2">
                  <div className="text-white/65">{t.turnSummary.yearEndTaxAssessed}</div>
                  <div className="mt-0.5 font-mono font-bold text-[#FBBF24] tabular-nums">
                    {formatCurrency(summary.taxAssessedThisYearEnd ?? 0)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 1. WHAT YOU ACHIEVED (কী অর্জন করলাম) */}
        {hasAchievementsData && (
          <section className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4A423C]">
              <Award className="h-4 w-4 text-[#D97706] shrink-0" />
              <span>{t.turnSummary.achievedSectionTitle}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Net Worth */}
              <div className="rounded-2xl bg-white p-3 sm:p-3.5 shadow-sm min-w-0">
                <div className="text-xs sm:text-[13px] font-semibold text-[#5E544C] truncate">
                  {t.turnSummary.netWorthMetric}
                </div>
                <div className="mt-0.5 font-mono text-[15px] sm:text-lg font-bold text-[#26201C] tabular-nums whitespace-nowrap">
                  {formatCurrency(summary.netWorthAfter ?? 0)}
                </div>
                <div
                  className={`mt-0.5 font-mono text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap ${
                    (summary.netWorthDelta ?? 0) >= 0 ? 'text-[#169C5E]' : 'text-[#DC2626]'
                  }`}
                >
                  {formatCurrency(summary.netWorthDelta ?? 0, true)}
                </div>
              </div>

              {/* Monthly Passive Income */}
              <div className="rounded-2xl bg-white p-3 sm:p-3.5 shadow-sm min-w-0">
                <div className="text-xs sm:text-[13px] font-semibold text-[#5E544C] truncate">
                  {t.turnSummary.passiveMetric}
                </div>
                <div className="mt-0.5 font-mono text-[15px] sm:text-lg font-bold text-[#26201C] tabular-nums whitespace-nowrap">
                  {formatCurrency(summary.passiveIncomeAfter ?? 0)}
                </div>
                <div
                  className={`mt-0.5 font-mono text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap ${
                    (summary.passiveIncomeDelta ?? 0) > 0
                      ? 'text-[#169C5E]'
                      : (summary.passiveIncomeDelta ?? 0) < 0
                        ? 'text-[#DC2626]'
                        : 'text-[#665B53]'
                  }`}
                >
                  {formatCurrency(summary.passiveIncomeDelta ?? 0, true)}
                </div>
              </div>

              {/* Financial Freedom % */}
              <div className="rounded-2xl bg-white p-3 sm:p-3.5 shadow-sm min-w-0">
                <div className="text-xs sm:text-[13px] font-semibold text-[#5E544C] truncate">
                  {t.turnSummary.freedomMetric}
                </div>
                <div className="mt-0.5 font-mono text-[15px] sm:text-lg font-bold text-[#26201C] tabular-nums whitespace-nowrap">
                  {(summary.freedomProgressPctAfter ?? 0).toFixed(0)}%
                </div>
                <div
                  className={`mt-0.5 font-mono text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap ${
                    (summary.freedomProgressDelta ?? 0) > 0
                      ? 'text-[#169C5E]'
                      : (summary.freedomProgressDelta ?? 0) < 0
                        ? 'text-[#DC2626]'
                        : 'text-[#665B53]'
                  }`}
                >
                  {formatSignedDelta(
                    Number((summary.freedomProgressDelta ?? 0).toFixed(1)),
                    '%'
                  )}
                </div>
              </div>

              {/* Happiness */}
              <div className="rounded-2xl bg-white p-3 sm:p-3.5 shadow-sm min-w-0">
                <div className="text-xs sm:text-[13px] font-semibold text-[#5E544C] truncate">
                  {t.turnSummary.happinessMetric}
                </div>
                <div className="mt-0.5 font-mono text-[15px] sm:text-lg font-bold text-[#26201C] tabular-nums whitespace-nowrap">
                  {summary.happinessAfter ?? 70}/100
                </div>
                <div
                  className={`mt-0.5 font-mono text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap ${
                    (summary.happinessDelta ?? 0) > 0
                      ? 'text-[#169C5E]'
                      : (summary.happinessDelta ?? 0) < 0
                        ? 'text-[#DC2626]'
                        : 'text-[#665B53]'
                  }`}
                >
                  {formatSignedDelta(summary.happinessDelta ?? 0)}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. WHAT YOU DID THIS MONTH (সমাপ্ত মাসে কী করলাম) */}
        <section className="mt-4 space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm font-bold text-[#4A423C]">
            <span className="inline-flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-[#686CA8] shrink-0" />
              <span>{t.turnSummary.didSectionTitle}</span>
            </span>
            {(summary.actionsCountThisTurn ?? 0) > 0 && (
              <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-xs font-bold text-[#686CA8]">
                {summary.actionsCountThisTurn}/6 {t.turnSummary.actionsTag}
              </span>
            )}
          </div>

          <div className="rounded-2xl bg-white/85 px-4 py-3 text-sm shadow-sm">
            {actions.length === 0 ? (
              <div className="py-1 text-[#5E544C]">{t.turnSummary.noActionsMsg}</div>
            ) : (
              <div className="divide-y divide-[#F0E4D7]">
                {actions.map((act, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 py-2">
                    <span className="inline-flex items-center gap-2 text-[#26201C] font-medium min-w-0">
                      <CheckCircle2 className="h-4 w-4 text-[#169C5E] shrink-0" />
                      <span className="truncate">
                        {localizeTransactionText(act.description, language)}
                      </span>
                    </span>
                    <span
                      className={`font-mono font-bold tabular-nums whitespace-nowrap shrink-0 ${
                        act.amount > 0
                          ? 'text-[#169C5E]'
                          : act.amount < 0
                            ? 'text-[#DC2626]'
                            : 'text-[#665B53]'
                      }`}
                    >
                      {act.amount === 0 ? '$0' : formatCurrency(act.amount, true)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. WHAT YOU RECEIVED & PAID AT MONTH END (মাস শেষে কী পেলাম ও খরচ হলো) */}
        <section className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[#4A423C]">
            <Wallet className="h-4 w-4 text-[#169C5E] shrink-0" />
            <span>{t.turnSummary.receivedPaidSectionTitle}</span>
          </div>

          <div className="space-y-2 text-[13px] sm:text-sm font-mono tabular-nums">
            <div className="flex justify-between py-1">
              <span className="text-[#5E544C] font-sans font-medium">
                {t.turnSummary.salaryReceived}
              </span>
              <span className="text-[#169C5E] font-bold">
                +{formatCurrency(summary.salaryReceived)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#5E544C] font-sans font-medium">
                {t.turnSummary.passiveReceived}
              </span>
              <span className="text-[#169C5E] font-bold">
                +{formatCurrency(summary.passiveIncomeReceived)}
              </span>
            </div>

            {passiveBreakdown.length > 0 && (
              <div className="rounded-xl bg-white/80 px-3 py-2 space-y-1 text-xs">
                {passiveBreakdown.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <span className="font-sans text-[#665B53]">{item.label}</span>
                    <span className="font-mono font-bold text-[#169C5E] whitespace-nowrap">
                      +{formatCurrency(item.val)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {summary.activeBusinessRevenue > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-[#5E544C] font-sans font-medium">
                  {t.turnSummary.activeBizRev}
                </span>
                <span className="text-[#169C5E] font-bold">
                  +{formatCurrency(summary.activeBusinessRevenue)}
                </span>
              </div>
            )}
            {summary.maturedFixedIncomePayout > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-[#5E544C] font-sans font-medium">
                  {t.turnSummary.maturedBond}
                </span>
                <span className="text-[#D97706] font-bold">
                  +{formatCurrency(summary.maturedFixedIncomePayout)}
                </span>
              </div>
            )}
            {(summary.emergencyCreditDrawn ?? 0) > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-[#5E544C] font-sans font-medium">
                  {t.turnSummary.emergencyCreditLabel}
                </span>
                <span className="text-[#D97706] font-bold">
                  +{formatCurrency(summary.emergencyCreditDrawn ?? 0)}
                </span>
              </div>
            )}

            <div className="border-t border-[#E2CEB9] my-2" />

            <div className="flex justify-between py-1">
              <span className="text-[#5E544C] font-sans font-medium">
                {t.turnSummary.livingPaid}
              </span>
              <span className="text-[#DC2626] font-bold">
                -{formatCurrency(summary.livingExpensesPaid)}
              </span>
            </div>
            {(summary.insurancePaid ?? 0) > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-[#5E544C] font-sans font-medium">
                  {t.turnSummary.insurancePaid}
                </span>
                <span className="text-[#DC2626] font-bold">
                  -{formatCurrency(summary.insurancePaid ?? 0)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-[#5E544C] font-sans font-medium">{t.turnSummary.loanPaid}</span>
              <span className="text-[#DC2626] font-bold">
                -{formatCurrency(summary.loanPaymentsPaid)}
              </span>
            </div>
            {summary.businessExpensesPaid > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-[#5E544C] font-sans font-medium">
                  {t.turnSummary.bizExpPaid}
                </span>
                <span className="text-[#DC2626] font-bold">
                  -{formatCurrency(summary.businessExpensesPaid)}
                </span>
              </div>
            )}
            {summary.propertyExpensesPaid > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-[#5E544C] font-sans font-medium">
                  {t.turnSummary.propMaintPaid}
                </span>
                <span className="text-[#DC2626] font-bold">
                  -{formatCurrency(summary.propertyExpensesPaid)}
                </span>
              </div>
            )}
            {(summary.babyBirthCostPaid ?? 0) > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-[#5E544C] font-sans font-medium">
                  {t.turnSummary.babyBirthCostPaid}
                </span>
                <span className="text-[#DC2626] font-bold">
                  -{formatCurrency(summary.babyBirthCostPaid ?? 0)}
                </span>
              </div>
            )}
            {(summary.divorceSettlementPaid ?? 0) > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-[#5E544C] font-sans font-medium">
                  {t.turnSummary.divorceSettlementLabel}
                </span>
                <span className="text-[#DC2626] font-bold">
                  -{formatCurrency(summary.divorceSettlementPaid ?? 0)}
                </span>
              </div>
            )}
            {(summary.uninsuredAccidentCashLoss ?? 0) > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-[#5E544C] font-sans font-medium">
                  {t.turnSummary.accidentCashLossLabel}
                </span>
                <span className="text-[#DC2626] font-bold">
                  -{formatCurrency(summary.uninsuredAccidentCashLoss ?? 0)}
                </span>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-white p-4 text-sm font-bold shadow-sm">
              <span className="text-[#26201C] font-sans">{t.turnSummary.netCashChange}</span>
              <span
                className={summary.netTurnCashChange >= 0 ? 'text-[#169C5E]' : 'text-[#DC2626]'}
              >
                {formatCurrency(summary.netTurnCashChange, true)}
              </span>
            </div>
          </div>
        </section>

        {summary.notes.length > 0 && (
          <div className="mt-4 rounded-2xl bg-white/80 p-3 text-xs text-[#5E544C] space-y-1">
            {summary.notes.map((n, i) => (
              <div key={i}>• {localizeTurnNote(n, language)}</div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-end gap-3">
          {((summary.zakatAssessedThisYearEnd ?? 0) > 0 ||
            (summary.taxAssessedThisYearEnd ?? 0) > 0) &&
            onGoToTax && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToTax();
                }}
                className="w-full sm:w-auto min-h-[46px] rounded-2xl bg-[#169C5E] hover:bg-[#12834E] px-4 py-2 text-xs font-bold text-white transition-colors"
              >
                {t.turnSummary.payZakatTaxBtn}
              </button>
            )}
          {summary.eventsGeneratedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToEvents();
              }}
              className="w-full sm:w-auto min-h-[46px] rounded-2xl bg-white hover:bg-white/80 px-4 py-2 text-xs font-bold text-[#26201C] transition-colors"
            >
              {viewEventsText}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[46px] rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] px-6 py-2 text-sm font-bold text-[#26201C] transition-colors"
          >
            {t.turnSummary.continueBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
