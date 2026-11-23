import React from 'react';
import { AlertTriangle, CheckCircle2, EyeOff, Sparkles, TrendingUp, X } from 'lucide-react';
import { getT } from '../../data/i18n';
import { localizeEventCard } from '../../data/localization';
import { formatCurrency } from '../../engine/prng';
import { FinancialSummary, GameState, LanguageCode } from '../../types/game';

interface EventsViewProps {
  game: GameState;
  summary: FinancialSummary;
  language: LanguageCode;
  ignoreEvents: boolean;
  onResolveEvent: (eventId: string, choiceId: string) => void;
  onDismissEvent: (eventId: string) => void;
  onIgnoreAllEvents: () => void;
  onToggleIgnoreEvents: (ignore: boolean) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  game,
  summary,
  language,
  ignoreEvents,
  onResolveEvent,
  onDismissEvent,
  onIgnoreAllEvents,
  onToggleIgnoreEvents,
}) => {
  const t = getT(language);
  const pending = game.pendingEvents
    .filter((e) => !e.resolved)
    .map((e) => localizeEventCard(e, language));

  const historyEvents = game.eventHistory
    .slice(0, 30)
    .map((e) => localizeEventCard(e, language));

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white text-center">
          {t.events.title}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="rounded-2xl bg-[#F6E7D7] px-4 py-2 font-mono text-xs font-bold text-[#169C5E]">
            {t.events.cashPrefix} {formatCurrency(summary.cashAsset)}
          </div>
          <button
            type="button"
            onClick={() => onToggleIgnoreEvents(!ignoreEvents)}
            className={`min-h-[36px] inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold shadow transition-colors whitespace-nowrap ${
              ignoreEvents
                ? 'bg-[#F7CA44] text-[#26201C] hover:bg-[#EBBF36]'
                : 'bg-[#F6E7D7] text-[#26201C] hover:bg-white'
            }`}
          >
            <EyeOff className="h-3.5 w-3.5 shrink-0" />
            <span>{t.events.ignoreToggleLabel}:</span>
            <span
              className={`rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                ignoreEvents ? 'bg-[#26201C] text-[#F7CA44]' : 'bg-[#EAD7C3] text-[#5E544C]'
              }`}
            >
              {ignoreEvents ? t.events.ignoreOnBadge : t.events.ignoreOffBadge}
            </span>
          </button>
          {!ignoreEvents && pending.length > 0 && (
            <button
              type="button"
              onClick={onIgnoreAllEvents}
              className="min-h-[36px] inline-flex items-center gap-1.5 rounded-2xl bg-white/12 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors whitespace-nowrap"
            >
              <X className="h-3.5 w-3.5 shrink-0" />
              {t.events.ignoreAllBtn}
            </button>
          )}
        </div>
      </div>

      {ignoreEvents ? (
        <section className="rounded-3xl bg-[#F6E7D7] p-7 text-center text-[#26201C] shadow-lg space-y-3">
          <EyeOff className="h-9 w-9 text-[#686CA8] mx-auto" />
          <div className="text-base font-bold">{t.events.ignoreModeTitle}</div>
          <p className="text-xs sm:text-sm text-[#5E544C] max-w-md mx-auto">
            {t.events.ignoreModeDesc}
          </p>
          <button
            type="button"
            onClick={() => onToggleIgnoreEvents(false)}
            className="min-h-[42px] rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] px-5 py-2 text-xs sm:text-sm font-bold text-[#26201C] transition-colors"
          >
            {t.events.enableEventsBtn}
          </button>
        </section>
      ) : (
        <section className="space-y-4">
          <h3 className="font-display text-base sm:text-lg font-bold text-white text-center">
            {t.events.activeDecisions} ({pending.length})
          </h3>

          {pending.length === 0 ? (
            <div className="rounded-3xl bg-[#F6E7D7] p-8 text-center text-[#26201C] shadow-lg">
              <CheckCircle2 className="h-9 w-9 text-[#169C5E] mx-auto" />
              <div className="mt-2 text-base font-bold">{t.events.allResolvedTitle}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pending.map((evt) => {
                const isEmergency = evt.category === 'expense_emergency';
                const isOpp = evt.category === 'opportunity';
                const categoryLabel = t.events.categories[evt.category];

                return (
                  <div
                    key={evt.id}
                    className="rounded-3xl bg-[#F6E7D7] p-5 sm:p-6 text-[#26201C] flex flex-col justify-between gap-4 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span
                          className={`inline-flex items-center gap-1.5 font-bold ${
                            isEmergency
                              ? 'text-[#DC2626]'
                              : isOpp
                              ? 'text-[#169C5E]'
                              : 'text-[#686CA8]'
                          }`}
                        >
                          {isEmergency ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : isOpp ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          {categoryLabel} · {t.monthLabel} {evt.turnGenerated}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDismissEvent(evt.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-white/80 hover:bg-white px-3 py-1.5 text-sm font-bold text-[#665B53] hover:text-[#26201C] transition-colors whitespace-nowrap shrink-0"
                        >
                          <X className="h-3.5 w-3.5" />
                          {t.events.ignoreSingleBtn}
                        </button>
                      </div>

                      <h4 className="font-display text-xl font-bold mt-2">{evt.title}</h4>
                      <p className="mt-2 text-base text-[#4A423C] leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-mono font-bold text-[#26201C]">
                        {evt.financialImpactSummary}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-[#E2CEB9] pt-4">
                      {evt.choices.map((choice) => {
                        const insuredMedical =
                          evt.templateId === 'exp_medical' && Boolean(game.healthInsured);
                        const insuredAsset =
                          (evt.templateId === 'exp_car_repair' ||
                            evt.templateId === 'exp_home_repair') &&
                          Boolean(game.propertyInsured);
                        const requiredCash =
                          choice.effectType === 'stock_opportunity'
                            ? Math.round((choice.amount ?? 0) * (choice.shares ?? 1) * 100) / 100
                            : choice.effectType === 'cash_delta' &&
                                (choice.amount ?? 0) < 0 &&
                                (insuredMedical || insuredAsset)
                              ? Math.round(Math.abs(choice.amount ?? 0) * 0.15 * 100) / 100
                              : choice.amount !== undefined
                                ? Math.abs(choice.amount)
                                : 0;
                        const exceedsBorrowing =
                          choice.effectType === 'property_opportunity' &&
                          Boolean(choice.propertyTemplate) &&
                          (choice.propertyTemplate?.loanAmount ?? 0) >
                            summary.remainingBorrowingCapacity;
                        const needsCash =
                          (Boolean(choice.requiresCashCheck) && summary.cashAsset < requiredCash) ||
                          exceedsBorrowing;

                        const btnStyle =
                          choice.tone === 'positive' || choice.tone === 'gold'
                            ? 'bg-[#F7CA44] hover:bg-[#EBBF36] text-[#26201C] font-bold'
                            : choice.tone === 'negative'
                            ? 'bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] font-bold'
                            : 'bg-white hover:bg-white/80 text-[#26201C] font-semibold';

                        return (
                          <button
                            key={choice.id}
                            type="button"
                            disabled={needsCash}
                            onClick={() => onResolveEvent(evt.id, choice.id)}
                            className={`w-full min-h-[48px] rounded-2xl px-4 py-2.5 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${btnStyle}`}
                          >
                            <div className="text-sm sm:text-base flex flex-wrap items-center justify-between gap-2">
                              <span>{choice.label}</span>
                              {needsCash && (
                                <span className="text-sm font-mono whitespace-nowrap shrink-0">
                                  {t.common.insufficientCash}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Event History */}
      <section className="rounded-3xl bg-[#F6E7D7] p-5 sm:p-6 text-[#26201C] shadow-lg">
        <h3 className="font-display text-lg font-bold border-b border-[#E2CEB9] pb-3">
          {t.events.pastHistoryTitle} ({game.eventHistory.length})
        </h3>
        {game.eventHistory.length === 0 ? (
          <div className="py-6 text-center text-sm text-[#665B53]">{t.events.emptyHistory}</div>
        ) : (
          <div className="mt-3 divide-y divide-[#E4D2BE]">
            {historyEvents.map((evt) => (
              <div
                key={evt.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
              >
                <div>
                  <span className="text-[#665B53] font-mono mr-2">
                    {t.monthLabel} {evt.turnGenerated}
                  </span>
                  <span className="font-bold text-[#26201C]">{evt.title}</span>
                </div>
                <span className="text-[#5E544C] font-mono">{evt.resolutionNote}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
