import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Baby,
  Check,
  Heart,
  HelpCircle,
  Plus,
  Scale,
} from 'lucide-react';
import { getT } from '../../data/i18n';
import {
  getAnnualMissingAssetsPenalty,
  getEffectiveHappinessCost,
  getEffectivePersonalAssetInsurance,
  getEffectivePersonalAssetPrice,
  getHappinessItemName,
  getHappinessItemsForProfession,
  getInsurancePlanName,
  getLotteryTicketName,
  getPersonalAssetName,
  getVenturesForProfession,
  getVentureTitle,
  getWeddingCost,
  INSURANCE_PLANS,
  LOTTERY_TICKETS,
  PERSONAL_ASSETS,
  withPilgrimageHappinessItems,
} from '../../data/lifestyle';
import { localizeEventCard } from '../../data/localization';
import { formatCurrency } from '../../engine/prng';
import {
  FinancialSummary,
  GameSettings,
  GameState,
  LotteryTicketId,
  NavSection,
  PersonalAssetId,
} from '../../types/game';
import {
  HappinessIllustration,
  InsuranceAssetIllustration,
  InsuranceHealthIllustration,
  LotteryIllustration,
  PersonalAssetIllustration,
  VentureIllustration,
} from '../common/LifestyleIllustrations';

interface DashboardViewProps {
  game: GameState;
  summary: FinancialSummary;
  settings: GameSettings;
  onNextMonth: () => void;
  onNavigate: (section: NavSection) => void;
  onBuyHappiness: (itemId: string) => void;
  onBuyPersonalAsset: (assetId: PersonalAssetId) => void;
  onTogglePersonalAssetInsurance: (assetId: PersonalAssetId) => void;
  onMarry: () => void;
  onToggleInsurance: (planId: 'health' | 'property') => void;
  onTryVenture: (
    ventureId: string
  ) => { outcomeType: 'win' | 'loss'; delta: number; ventureId: string } | undefined;
  onPlayLottery: (
    ticketId: LotteryTicketId
  ) => { outcomeType: 'win' | 'loss'; delta: number; ticketId: LotteryTicketId } | undefined;
}

const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  helpText?: string;
  rightSlot?: React.ReactNode;
}> = ({ title, subtitle, helpText, rightSlot }) => {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div className="space-y-1 px-0.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h3>
          {rightSlot}
        </div>
        {helpText && (
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            aria-label={title}
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        )}
      </div>
      {subtitle && (
        <p className="text-sm sm:text-base text-white/85 leading-snug max-w-2xl">{subtitle}</p>
      )}
      {showHelp && helpText && (
        <div className="mt-1.5 rounded-2xl bg-white/12 backdrop-blur-md border border-white/15 px-4 py-3 text-sm text-white/95 leading-relaxed">
          {helpText}
        </div>
      )}
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  game,
  summary,
  settings,
  onNextMonth,
  onNavigate,
  onBuyHappiness,
  onBuyPersonalAsset,
  onTogglePersonalAssetInsurance,
  onMarry,
  onToggleInsurance,
  onTryVenture,
  onPlayLottery,
}) => {
  const [lastOutcome, setLastOutcome] = useState<{
    outcomeType: 'win' | 'loss';
    delta: number;
    title: string;
  } | null>(null);
  const [lastLotteryOutcome, setLastLotteryOutcome] = useState<{
    outcomeType: 'win' | 'loss';
    delta: number;
    title: string;
  } | null>(null);

  const lang = settings.language;
  const t = getT(lang);
  const happinessItems = withPilgrimageHappinessItems(
    game.activeHappinessItems && game.activeHappinessItems.length > 0
      ? game.activeHappinessItems
      : getHappinessItemsForProfession(game.professionId),
    game.professionId
  );
  const purchasedIds = new Set(game.purchasedHappinessIdsThisTurn ?? []);
  const maritalStatus = game.maritalStatus ?? 'single';
  const childrenCount = game.childrenCount ?? 0;
  const weddingCost = getWeddingCost(game);
  const ventures =
    game.activeVentures && game.activeVentures.length > 0
      ? game.activeVentures
      : getVenturesForProfession(game.professionId);

  const unresolvedEvents = settings.ignoreEvents
    ? []
    : game.pendingEvents.filter((e) => !e.resolved);
  const unresolvedCount = unresolvedEvents.length;
  const firstPendingEvent = unresolvedEvents[0]
    ? localizeEventCard(unresolvedEvents[0], lang)
    : null;

  const actionsUsed = Math.min(6, game.actionsUsedThisTurn ?? 0);
  const actionsRemaining = Math.max(0, 6 - actionsUsed);

  const pendingTitle =
    lang === 'bn'
      ? `${unresolvedCount}${t.dashboard.pendingPlural}`
      : `${unresolvedCount} ${
          unresolvedCount > 1 ? t.dashboard.pendingPlural : t.dashboard.pendingSingular
        }`;

  const ownedPersonal = game.personalAssets ?? [];
  const annualPenalty = getAnnualMissingAssetsPenalty(ownedPersonal);
  const playedLotteryIds = new Set(game.playedLotteryIdsThisTurn ?? []);

  return (
    <div className="space-y-6">

      {/* PENDING EVENT FOCAL CREAM CARD (Matches Screenshot's top cream decision card) */}
      {firstPendingEvent && (
        <section className="rounded-3xl bg-[#F6E7D7] p-5 sm:p-6 text-center text-[#26201C] shadow-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1 text-sm font-bold text-[#D97706]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{pendingTitle}</span>
          </div>
          <p className="text-base sm:text-lg font-medium text-[#4A423C] leading-relaxed max-w-lg mx-auto">
            {firstPendingEvent.description}
          </p>
          {firstPendingEvent.financialImpactSummary && (
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#26201C] tabular-nums">
              {firstPendingEvent.financialImpactSummary}
            </div>
          )}
          <button
            type="button"
            onClick={() => onNavigate('events')}
            className="w-full max-w-md mx-auto min-h-[52px] inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] active:scale-[0.99] px-6 py-3 text-base font-bold text-[#26201C] shadow-sm transition-all"
          >
            <span>{t.dashboard.openEvents}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {/* YEAR-END ZAKAT & INCOME TAX DUE REMINDER */}
      {(summary.zakatDueEffective > 0 || summary.incomeTaxDueEffective > 0) && (
        <section className="rounded-3xl bg-[#F6E7D7] p-5 text-[#26201C] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ring-2 ring-[#F7CA44]/75">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#169C5E]/15 text-[#169C5E]">
              <Scale className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="font-display text-lg font-bold text-[#26201C]">
                {t.dashboard.zakatTaxReminderTitle}
              </div>
              <p className="text-sm text-[#4A423C] leading-snug">{t.dashboard.zakatTaxReminderDesc}</p>
              <div className="flex flex-wrap items-center gap-3 pt-0.5 font-mono text-sm font-bold tabular-nums">
                {summary.zakatDueEffective > 0 && (
                  <span className="text-[#169C5E]">
                    {t.turnSummary.yearEndZakatAssessed}: {formatCurrency(summary.zakatDueEffective)}
                  </span>
                )}
                {summary.incomeTaxDueEffective > 0 && (
                  <span className="text-[#D97706]">
                    {t.turnSummary.yearEndTaxAssessed}:{' '}
                    {formatCurrency(summary.incomeTaxDueEffective)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tax')}
            className="min-h-[48px] shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] px-5 py-2.5 text-sm sm:text-base font-bold text-[#26201C] shadow-sm transition-colors"
          >
            <span>{t.dashboard.openZakatTaxBtn}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {/* CENTRAL FOCAL WARM CREAM TURN CARD (Matches Screenshot) */}
      <section className="rounded-3xl bg-[#F6E7D7] p-5 sm:p-6 text-[#26201C] shadow-xl">
        <div className="relative h-7 w-full overflow-hidden rounded-full bg-white/90">
          <div
            className="h-full rounded-full bg-[#B8B5EE] transition-all duration-300"
            style={{ width: `${Math.min(100, (actionsRemaining / 6) * 100)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-[#26201C] tabular-nums">
            {actionsRemaining}/6
          </div>
        </div>

        <h2 className="mt-6 font-display text-2xl font-bold text-[#26201C] text-left leading-snug">
          {t.dashboard.turnCardTitle}
        </h2>

        <p className="mt-3 text-base leading-relaxed text-[#4A423C] text-left">
          {t.dashboard.turnCardDesc}
        </p>

        <button
          type="button"
          onClick={onNextMonth}
          className="mt-6 w-full min-h-[54px] inline-flex items-center justify-center rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] active:scale-[0.99] px-6 py-3.5 text-base sm:text-lg font-bold text-[#26201C] shadow-sm transition-all"
        >
          {t.dashboard.turnCardBtn}
        </button>
      </section>

      {/* 1. INSURANCE HORIZONTAL CAROUSEL (বীমা — matches Screenshot) */}
      <section className="space-y-3">
        <SectionHeader
          title={t.dashboard.insuranceTitle}
          subtitle={t.dashboard.insuranceSubtitle}
          helpText={t.dashboard.insuranceSubtitle}
        />

        <div className="flex gap-3.5 overflow-x-auto overscroll-x-contain touch-pan-x touch-pan-y pb-2 snap-x snap-proximity -mx-4 px-4 sm:mx-0 sm:px-0">
          {INSURANCE_PLANS.map((plan) => {
            const active =
              plan.id === 'health'
                ? Boolean(game.healthInsured)
                : Boolean(game.propertyInsured);
            const cantAffordEnroll = !active && summary.cashAsset < plan.monthlyPremium;
            return (
              <div
                key={plan.id}
                className={`snap-start shrink-0 w-[200px] sm:w-[224px] rounded-[24px] p-4 sm:p-5 text-center text-[#26201C] shadow-xl flex flex-col items-center justify-between transition-opacity ${
                  active
                    ? 'bg-[#FFF9E6] ring-2 ring-[#F7CA44]'
                    : cantAffordEnroll
                      ? 'bg-[#EAE5DD] opacity-65'
                      : 'bg-[#F7F3EE]'
                }`}
              >
                <div>
                  <div className="font-display text-lg sm:text-xl font-bold text-[#26201C]">
                    {getInsurancePlanName(plan, lang)}
                  </div>
                  <div className="text-sm font-semibold text-[#5E544C] mt-0.5">
                    {active ? t.dashboard.insuranceActive : t.common.perMonth}
                  </div>
                </div>

                <div className="my-3 flex h-24 w-full items-center justify-center">
                  {plan.id === 'health' ? (
                    <InsuranceHealthIllustration className="w-24 h-24" />
                  ) : (
                    <InsuranceAssetIllustration className="w-24 h-24" />
                  )}
                </div>

                <div className="w-full space-y-2.5">
                  <div>
                    <div className="font-mono text-xl font-bold text-[#26201C] tabular-nums">
                      {formatCurrency(plan.monthlyPremium)}
                    </div>
                    <div className="text-sm font-medium text-[#5E544C]">{t.common.perMonth}</div>
                  </div>

                  {active ? (
                    <button
                      type="button"
                      onClick={() => onToggleInsurance(plan.id)}
                      className="mx-auto flex items-center justify-center gap-2 rounded-full bg-[#F7CA44] px-3.5 py-2 text-sm font-bold text-[#26201C] shadow-sm"
                      aria-label={getInsurancePlanName(plan, lang)}
                    >
                      <span className="h-4 w-4 rounded-full bg-white flex items-center justify-center">
                        <Check className="h-3 w-3 text-[#169C5E] stroke-[3]" />
                      </span>
                      <span>{t.dashboard.insuranceActive}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={cantAffordEnroll}
                      onClick={() => onToggleInsurance(plan.id)}
                      className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F7CA44] hover:bg-[#EBBF36] active:scale-95 text-[#26201C] shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={getInsurancePlanName(plan, lang)}
                    >
                      <Plus className="h-6 w-6 stroke-[2.75]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. BUY HAPPINESS & FAMILY HORIZONTAL CAROUSEL (সুখ কিনুন) */}
      <section id="happiness-panel" className="space-y-3">
        <SectionHeader
          title={t.dashboard.buyHappinessTitle}
          subtitle={t.dashboard.happinessSubtitle}
          helpText={t.dashboard.happinessSubtitle}
          rightSlot={
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
                <Heart className="h-3.5 w-3.5 text-[#FB7185]" />
                {t.dashboard.maritalStatuses[maritalStatus]}
              </span>
              {childrenCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
                  <Baby className="h-3.5 w-3.5 text-[#60A5FA]" />
                  {childrenCount}
                </span>
              )}
              {(game.inflationRate ?? 0) > 0 && (
                <span className="rounded-full bg-[#DC2626]/80 px-3 py-1 font-mono text-sm font-bold text-white">
                  {t.dashboard.inflationTag} +{game.inflationRate}%
                </span>
              )}
              {maritalStatus !== 'married' && (
                <button
                  type="button"
                  disabled={summary.cashAsset < weddingCost || actionsUsed >= 6}
                  onClick={onMarry}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F7CA44] hover:bg-[#EBBF36] disabled:opacity-45 disabled:cursor-not-allowed px-3.5 py-1.5 text-sm font-bold text-[#26201C] transition-colors"
                >
                  <Heart className="h-3.5 w-3.5" />
                  {t.dashboard.marryBtn} ({formatCurrency(weddingCost)})
                </button>
              )}
            </div>
          }
        />

        <div className="flex gap-3.5 overflow-x-auto overscroll-x-contain touch-pan-x touch-pan-y pb-2 snap-x snap-proximity -mx-4 px-4 sm:mx-0 sm:px-0">
          {happinessItems.map((item) => {
            const effectiveCost = getEffectiveHappinessCost(item, game);
            const alreadyBought = purchasedIds.has(item.id);
            const affordable =
              !alreadyBought && summary.cashAsset >= effectiveCost && summary.happiness < 100;
            return (
              <div
                key={item.id}
                className={`snap-start shrink-0 w-[200px] sm:w-[224px] rounded-[24px] p-4 sm:p-5 text-center text-[#26201C] shadow-xl flex flex-col items-center justify-between transition-opacity ${
                  alreadyBought
                    ? 'bg-[#E9E1D6]'
                    : affordable
                      ? 'bg-[#F7F3EE]'
                      : 'bg-[#EAE5DD] opacity-65'
                }`}
              >
                <div>
                  <div className="font-display text-base sm:text-lg font-bold text-[#26201C] leading-snug line-clamp-2">
                    {getHappinessItemName(item, lang)}
                  </div>
                  <div className="text-sm font-bold text-[#169C5E] mt-1">
                    +{item.happinessGain} {t.happinessLabel}
                  </div>
                </div>

                <div className="my-2.5 flex h-24 w-full items-center justify-center">
                  <HappinessIllustration
                    templateId={item.templateId}
                    itemId={item.id}
                    className="w-28 h-24"
                  />
                </div>

                <div className="w-full space-y-2.5">
                  <div className="font-mono text-xl font-bold text-[#26201C] tabular-nums">
                    {formatCurrency(effectiveCost)}
                  </div>

                  {alreadyBought ? (
                    <div className="mx-auto inline-flex items-center gap-1 rounded-full bg-[#D6C7B5] px-3.5 py-1.5 text-sm font-bold text-[#4A4038]">
                      <Check className="h-4 w-4" />
                      <span>{t.dashboard.happinessBoughtBadge}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!affordable}
                      onClick={() => onBuyHappiness(item.id)}
                      className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F7CA44] hover:bg-[#EBBF36] active:scale-95 text-[#26201C] shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={getHappinessItemName(item, lang)}
                    >
                      <Plus className="h-6 w-6 stroke-[2.75]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PERSONAL ASSETS / SHOPPING HORIZONTAL CAROUSEL (কেনাকাটা / নিজস্ব সম্পদ) */}
      <section className="space-y-3">
        <SectionHeader
          title={t.dashboard.personalAssetsTitle}
          subtitle={t.dashboard.personalAssetsSubtitle}
          helpText={t.dashboard.personalAssetsSubtitle}
          rightSlot={
            annualPenalty > 0 ? (
              <span className="rounded-full bg-[#DC2626]/85 px-3 py-1 font-mono text-sm font-bold text-white">
                -{annualPenalty} {t.dashboard.yearlyPenaltyUnit}
              </span>
            ) : undefined
          }
        />

        <div className="flex gap-3.5 overflow-x-auto overscroll-x-contain touch-pan-x touch-pan-y pb-2 snap-x snap-proximity -mx-4 px-4 sm:mx-0 sm:px-0">
          {PERSONAL_ASSETS.map((item) => {
            const owned = ownedPersonal.find((o) => o.id === item.id);
            const price = getEffectivePersonalAssetPrice(item, game);
            const premium = getEffectivePersonalAssetInsurance(item, game);
            const affordable = summary.cashAsset >= price;
            const canAffordIns = summary.cashAsset >= premium;
            const name = getPersonalAssetName(item, lang);

            return (
              <div
                key={item.id}
                className={`snap-start shrink-0 w-[204px] sm:w-[228px] rounded-[24px] p-4 sm:p-5 text-center text-[#26201C] shadow-xl flex flex-col items-center justify-between transition-opacity ${
                  owned
                    ? 'bg-[#FFFDF7] ring-2 ring-[#169C5E]/50'
                    : affordable
                      ? 'bg-[#F7F3EE]'
                      : 'bg-[#F3E9C9] opacity-80'
                }`}
              >
                <div>
                  <div className="font-display text-lg font-bold text-[#26201C]">
                    {name}
                  </div>
                  <div className="text-sm font-semibold text-[#5E544C] mt-0.5">
                    {owned
                      ? t.dashboard.ownedBadge
                      : `+${item.buyHappinessBonus} ${t.happinessLabel}`}
                  </div>
                </div>

                <div className="my-2.5 flex h-24 w-full items-center justify-center">
                  <PersonalAssetIllustration assetId={item.id} className="w-28 h-24" />
                </div>

                {owned ? (
                  <div className="w-full space-y-2">
                    <div className="font-mono text-base font-bold text-[#169C5E] tabular-nums">
                      {formatCurrency(premium)}
                      {t.common.perMonth}
                    </div>
                    <button
                      type="button"
                      disabled={!owned.insured && !canAffordIns}
                      onClick={() => onTogglePersonalAssetInsurance(item.id)}
                      className="mx-auto flex items-center justify-center gap-2 rounded-full px-2.5 py-1 text-sm font-bold transition-colors disabled:opacity-45"
                    >
                      <span
                        className={`relative inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                          owned.insured ? 'bg-[#F7CA44]' : 'bg-[#D8CFC4]'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                            owned.insured ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </span>
                      <span className={owned.insured ? 'text-[#169C5E]' : 'text-[#DC2626]'}>
                        {owned.insured ? t.dashboard.insuredBtn : t.dashboard.insureBtn}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full space-y-2.5">
                    <div>
                      <div className="font-mono text-xl font-bold text-[#26201C] tabular-nums">
                        {formatCurrency(price)}
                      </div>
                      <div className="text-[13px] font-mono font-semibold text-[#B91C1C]">
                        -{item.yearlyHappinessPenalty} {t.dashboard.yearlyPenaltyUnit}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!affordable}
                      onClick={() => onBuyPersonalAsset(item.id)}
                      className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F7CA44] hover:bg-[#EBBF36] active:scale-95 text-[#26201C] shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={name}
                    >
                      <Plus className="h-6 w-6 stroke-[2.75]" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SPECIAL OPPORTUNITIES CAROUSEL (বিশেষ সুযোগ) */}
      <section className="space-y-3">
        <SectionHeader
          title={t.dashboard.venturesTitle}
          subtitle={t.dashboard.venturesSubtitle}
          helpText={t.dashboard.venturesSubtitle}
          rightSlot={
            lastOutcome ? (
              <span
                className={`rounded-full px-3 py-1 font-mono text-sm font-bold tabular-nums ${
                  lastOutcome.outcomeType === 'win'
                    ? 'bg-[#DCFCE7] text-[#169C5E]'
                    : 'bg-[#FEE2E2] text-[#DC2626]'
                }`}
              >
                {lastOutcome.title}: {formatCurrency(lastOutcome.delta, true)}
              </span>
            ) : undefined
          }
        />

        <div className="flex gap-3.5 overflow-x-auto overscroll-x-contain touch-pan-x touch-pan-y pb-2 snap-x snap-proximity -mx-4 px-4 sm:mx-0 sm:px-0">
          {ventures.map((v) => {
            const affordable = summary.cashAsset >= v.cost && actionsUsed < 6;
            const lossPct = Math.round((1 - v.winChance) * 100);
            const vTitle = getVentureTitle(v, lang);
            return (
              <div
                key={v.id}
                className={`snap-start shrink-0 w-[214px] sm:w-[238px] rounded-[24px] p-4 sm:p-5 text-center text-[#26201C] shadow-xl flex flex-col items-center justify-between transition-opacity ${
                  affordable ? 'bg-[#F7F3EE]' : 'bg-[#EAE5DD] opacity-65'
                }`}
              >
                <div>
                  <div className="font-display text-base sm:text-lg font-bold text-[#26201C] leading-snug line-clamp-2">
                    {vTitle}
                  </div>
                  <div className="text-[13px] sm:text-sm font-mono font-bold text-[#169C5E] mt-1 whitespace-nowrap">
                    +{formatCurrency(v.minNetProfit)}–{formatCurrency(v.maxNetProfit)}
                  </div>
                </div>

                <div className="my-2 flex h-20 w-full items-center justify-center">
                  <VentureIllustration className="w-24 h-20" />
                </div>

                <div className="w-full space-y-2">
                  <div>
                    <div className="font-mono text-xl font-bold text-[#26201C] tabular-nums">
                      {formatCurrency(v.cost)}
                    </div>
                    <div className="text-[13px] font-semibold text-[#DC2626]">
                      {t.dashboard.ventureLossChanceLbl}: {lossPct}%
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!affordable}
                    onClick={() => {
                      const out = onTryVenture(v.id);
                      if (out) {
                        setLastOutcome({
                          outcomeType: out.outcomeType,
                          delta: out.delta,
                          title: vTitle,
                        });
                      }
                    }}
                    className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F7CA44] hover:bg-[#EBBF36] active:scale-95 text-[#26201C] shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={vTitle}
                  >
                    <Plus className="h-6 w-6 stroke-[2.75]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. LUCKY LOTTERY HORIZONTAL CAROUSEL (ভাগ্য লটারি) */}
      <section className="space-y-3">
        <SectionHeader
          title={t.dashboard.lotteryTitle}
          subtitle={t.dashboard.lotterySubtitle}
          helpText={t.dashboard.lotterySubtitle}
          rightSlot={
            lastLotteryOutcome ? (
              <span
                className={`rounded-full px-3 py-1 font-mono text-sm font-bold tabular-nums ${
                  lastLotteryOutcome.outcomeType === 'win'
                    ? 'bg-[#DCFCE7] text-[#169C5E]'
                    : 'bg-[#FEE2E2] text-[#DC2626]'
                }`}
              >
                {lastLotteryOutcome.title}: {formatCurrency(lastLotteryOutcome.delta, true)}
              </span>
            ) : undefined
          }
        />

        <div className="flex gap-3.5 overflow-x-auto overscroll-x-contain touch-pan-x touch-pan-y pb-2 snap-x snap-proximity -mx-4 px-4 sm:mx-0 sm:px-0">
          {LOTTERY_TICKETS.map((ticket) => {
            const alreadyPlayed = playedLotteryIds.has(ticket.id);
            const affordable = !alreadyPlayed && summary.cashAsset >= ticket.cost;
            const title = getLotteryTicketName(ticket, lang);
            return (
              <div
                key={ticket.id}
                className={`snap-start shrink-0 w-[204px] sm:w-[228px] rounded-[24px] p-4 sm:p-5 text-center text-[#26201C] shadow-xl flex flex-col items-center justify-between transition-opacity ${
                  alreadyPlayed
                    ? 'bg-[#E9E1D6]'
                    : affordable
                      ? 'bg-[#F7F3EE]'
                      : 'bg-[#EAE5DD] opacity-65'
                }`}
              >
                <div>
                  <div className="font-display text-base sm:text-lg font-bold text-[#26201C] leading-snug">
                    {title}
                  </div>
                  <div className="text-sm font-mono font-bold text-[#169C5E] mt-1">
                    +{formatCurrency(ticket.jackpotMax)}
                  </div>
                </div>

                <div className="my-2 flex h-20 w-full items-center justify-center">
                  <LotteryIllustration className="w-24 h-20" />
                </div>

                <div className="w-full space-y-2">
                  <div className="font-mono text-xl font-bold text-[#26201C] tabular-nums">
                    {formatCurrency(ticket.cost)}
                  </div>

                  {alreadyPlayed ? (
                    <div className="mx-auto inline-flex items-center gap-1 rounded-full bg-[#D6C7B5] px-3.5 py-1.5 text-sm font-bold text-[#4A4038]">
                      <Check className="h-4 w-4" />
                      <span>{t.dashboard.lotteryPlayedBadge}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!affordable}
                      onClick={() => {
                        const out = onPlayLottery(ticket.id);
                        if (out) {
                          setLastLotteryOutcome({
                            outcomeType: out.outcomeType,
                            delta: out.delta,
                            title,
                          });
                        }
                      }}
                      className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F7CA44] hover:bg-[#EBBF36] active:scale-95 text-[#26201C] shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={title}
                    >
                      <Plus className="h-6 w-6 stroke-[2.75]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
