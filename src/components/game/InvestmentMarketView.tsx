import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Building2,
  Coins,
  Landmark,
  LineChart,
  TrendingUp,
} from 'lucide-react';
import { getT } from '../../data/i18n';
import {
  isFixedIncomeMatchedForProfession,
  isStockMatchedForProfession,
} from '../../data/lifestyle';
import { localizeCrypto, localizeFixedIncome, localizeStock } from '../../data/localization';
import { CRYPTO_CATALOG, FIXED_INCOME_PRODUCTS, STOCK_CATALOG } from '../../data/markets';
import {
  formatCurrency,
  formatCurrencyExact,
  formatPercent,
  formatRelativeMonth,
  roundMoney,
} from '../../engine/prng';
import { FinancialSummary, GameState, LanguageCode, NavSection } from '../../types/game';
import { FinancialChart, MiniSparkline } from '../charts/FinancialChart';

type MarketTab = 'overview' | 'stocks' | 'real_estate' | 'businesses' | 'bonds_savings' | 'crypto';

const WAVE_PATHS = [
  'M0 84 C 45 55, 80 18, 125 32 C 165 45, 175 102, 210 92 C 250 80, 290 22, 360 52',
  'M0 95 C 40 85, 70 12, 108 26 C 145 40, 155 108, 195 90 C 235 72, 255 34, 300 60 C 325 74, 345 45, 360 36',
  'M0 98 C 75 96, 155 96, 200 72 C 240 50, 265 14, 295 28 C 320 40, 338 56, 360 44',
  'M0 105 C 35 100, 72 48, 106 58 C 142 68, 150 98, 195 82 C 245 64, 300 32, 360 14',
  'M0 104 C 42 100, 75 14, 106 24 C 138 34, 155 102, 205 90 C 255 78, 290 36, 360 12',
  'M0 78 C 55 30, 110 88, 170 62 C 230 36, 285 78, 360 28',
  'M0 64 C 65 92, 130 24, 195 54 C 260 84, 310 34, 360 58',
];

interface InvestmentMarketViewProps {
  game: GameState;
  summary: FinancialSummary;
  language: LanguageCode;
  onBuyStock: (symbol: string, shares: number) => void;
  onSellStock: (symbol: string, shares: number) => void;
  onBuyCrypto: (symbol: string, units: number) => void;
  onSellCrypto: (symbol: string, units: number) => void;
  onInvestFixed: (productId: string, amount: number) => void;
  onRedeemFixed: (fixedId: string) => void;
  onNavigate: (section: NavSection) => void;
}

export const InvestmentMarketView: React.FC<InvestmentMarketViewProps> = ({
  game,
  summary,
  language,
  onBuyStock,
  onSellStock,
  onBuyCrypto,
  onSellCrypto,
  onInvestFixed,
  onRedeemFixed,
  onNavigate,
}) => {
  const t = getT(language);
  const [tab, setTab] = useState<MarketTab>('overview');
  const [selectedStockSym, setSelectedStockSym] = useState(STOCK_CATALOG[0].symbol);
  const [stockQty, setStockQty] = useState<string>('5');

  const [selectedCryptoSym, setSelectedCryptoSym] = useState(CRYPTO_CATALOG[0].symbol);
  const [cryptoQty, setCryptoQty] = useState<string>('1');

  const [fixedAmounts, setFixedAmounts] = useState<Record<string, string>>({
    hy_savings: '1000',
    t_bill_3m: '1000',
    corp_bond_6m: '2500',
    infra_bond_12m: '5000',
  });

  const activeStockDef =
    STOCK_CATALOG.find((s) => s.symbol === selectedStockSym) ?? STOCK_CATALOG[0];
  const activeStockLoc = localizeStock(activeStockDef.symbol, language);
  const activeStockMkt = game.market.stocks[activeStockDef.symbol];
  const activeStockHolding = game.stocks.find((h) => h.symbol === activeStockDef.symbol);
  const stockPriceDelta = activeStockMkt
    ? activeStockMkt.currentPrice - activeStockMkt.previousPrice
    : 0;
  const stockPctDelta =
    activeStockMkt && activeStockMkt.previousPrice > 0
      ? stockPriceDelta / activeStockMkt.previousPrice
      : 0;
  const parsedStockQty = Math.max(0, Math.floor(Number(stockQty) || 0));
  const activeStockPrice = activeStockMkt?.currentPrice ?? activeStockDef.basePrice;
  const stockOrderTotal = parsedStockQty * activeStockPrice;

  const activeCryptoDef =
    CRYPTO_CATALOG.find((c) => c.symbol === selectedCryptoSym) ?? CRYPTO_CATALOG[0];
  const activeCryptoLoc = localizeCrypto(activeCryptoDef.symbol, language);
  const activeCryptoMkt = game.market.crypto[activeCryptoDef.symbol];
  const activeCryptoHolding = game.crypto.find((c) => c.symbol === activeCryptoDef.symbol);
  const cryptoPriceDelta = activeCryptoMkt
    ? activeCryptoMkt.currentPrice - activeCryptoMkt.previousPrice
    : 0;
  const cryptoPctDelta =
    activeCryptoMkt && activeCryptoMkt.previousPrice > 0
      ? cryptoPriceDelta / activeCryptoMkt.previousPrice
      : 0;
  const parsedCryptoQty = Math.max(0, Number(cryptoQty) || 0);
  const activeCryptoPrice = activeCryptoMkt?.currentPrice ?? activeCryptoDef.basePrice;
  const cryptoTradeValue = parsedCryptoQty * activeCryptoPrice;

  // Overview Breakdown Metrics for the Wavy Cream Cards
  const equityHoldings = game.stocks.filter((s) => s.symbol !== 'GOLDM');
  const equityVal = equityHoldings.reduce((acc, h) => {
    const p = game.market.stocks[h.symbol]?.currentPrice ?? h.avgBuyPrice;
    return acc + h.shares * p;
  }, 0);
  const equityCost = equityHoldings.reduce((acc, h) => acc + h.shares * h.avgBuyPrice, 0);
  const equityPnl = equityVal - equityCost;
  const equityPct = equityCost > 0 ? (equityPnl / equityCost) * 100 : 0;

  const goldHolding = game.stocks.find((s) => s.symbol === 'GOLDM');
  const goldPrice = game.market.stocks.GOLDM?.currentPrice ?? goldHolding?.avgBuyPrice ?? 0;
  const goldVal = goldHolding ? goldHolding.shares * goldPrice : 0;
  const goldCost = goldHolding ? goldHolding.shares * goldHolding.avgBuyPrice : 0;
  const goldPnl = goldVal - goldCost;
  const goldPct = goldCost > 0 ? (goldPnl / goldCost) * 100 : 0;

  const fixedVal = summary.bondsAsset + summary.bankSavingsAsset;
  const fixedPrincipal = game.fixedIncome.reduce((acc, fi) => acc + fi.principal, 0);
  const fixedReturn = fixedVal - fixedPrincipal + summary.interestIncome;
  const fixedPct = fixedPrincipal > 0 ? (fixedReturn / fixedPrincipal) * 100 : 0;

  const cryptoVal = summary.otherInvestmentsAsset;
  const cryptoCost = game.crypto.reduce((acc, c) => acc + c.units * c.avgBuyPrice, 0);
  const cryptoPnl = cryptoVal - cryptoCost;
  const cryptoPct = cryptoCost > 0 ? (cryptoPnl / cryptoCost) * 100 : 0;

  const realEstateCost = game.properties.reduce((acc, p) => acc + p.purchasePrice, 0);
  const realEstatePnl = summary.realEstateAsset - realEstateCost;
  const realEstatePct = realEstateCost > 0 ? (realEstatePnl / realEstateCost) * 100 : 0;

  const businessCost = game.businesses.reduce(
    (acc, b) => acc + (b.purchasePrice || b.initialInvestment),
    0
  );
  const businessPnl = summary.businessesAsset - businessCost;
  const businessPct = businessCost > 0 ? (businessPnl / businessCost) * 100 : 0;

  const formatDeltaSummary = (pnl: number, pct: number) =>
    `${pnl > 0 ? '+' : ''}${formatCurrency(pnl)} (${pct > 0 ? '+' : ''}${pct.toFixed(0)}%)`;

  const overviewCards: {
    id: string;
    title: string;
    label: string;
    amount: number;
    subtext: string;
    subtextTone: 'pos' | 'neg' | 'neutral';
    wavePath: string;
    onClick: () => void;
  }[] = [
    {
      id: 'stocks',
      title: t.market.stocksCardTitle,
      label: t.market.investedLabel,
      amount: equityVal,
      subtext: formatDeltaSummary(equityPnl, equityPct),
      subtextTone: equityPnl > 0 ? 'pos' : equityPnl < 0 ? 'neg' : 'neutral',
      wavePath: WAVE_PATHS[0],
      onClick: () => {
        setSelectedStockSym(STOCK_CATALOG[0].symbol);
        setTab('stocks');
      },
    },
    {
      id: 'bonds_savings',
      title: t.market.bondsCardTitle,
      label: t.market.investedLabel,
      amount: fixedVal,
      subtext:
        summary.interestIncome > 0
          ? `+${formatCurrency(summary.interestIncome)}${t.common.perMonth}`
          : formatDeltaSummary(fixedReturn, fixedPct),
      subtextTone: fixedVal > 0 ? 'pos' : 'neutral',
      wavePath: WAVE_PATHS[1],
      onClick: () => setTab('bonds_savings'),
    },
    {
      id: 'crypto',
      title: t.market.cryptoCardTitle,
      label: t.market.investedLabel,
      amount: cryptoVal,
      subtext: formatDeltaSummary(cryptoPnl, cryptoPct),
      subtextTone: cryptoPnl > 0 ? 'pos' : cryptoPnl < 0 ? 'neg' : 'neutral',
      wavePath: WAVE_PATHS[2],
      onClick: () => setTab('crypto'),
    },
    {
      id: 'real_estate',
      title: t.market.realEstateCardTitle,
      label: t.market.investedLabel,
      amount: summary.realEstateAsset,
      subtext:
        summary.rentalIncome > 0
          ? `+${formatCurrency(summary.rentalIncome)}${t.common.perMonth}`
          : formatDeltaSummary(realEstatePnl, realEstatePct),
      subtextTone: summary.rentalIncome > 0 || realEstatePnl > 0 ? 'pos' : 'neutral',
      wavePath: WAVE_PATHS[3],
      onClick: () => onNavigate('properties'),
    },
    {
      id: 'gold',
      title: t.market.goldCardTitle,
      label: t.market.investedLabel,
      amount: goldVal,
      subtext: formatDeltaSummary(goldPnl, goldPct),
      subtextTone: goldPnl > 0 ? 'pos' : goldPnl < 0 ? 'neg' : 'neutral',
      wavePath: WAVE_PATHS[4],
      onClick: () => {
        setSelectedStockSym('GOLDM');
        setTab('stocks');
      },
    },
    {
      id: 'businesses',
      title: t.market.businessesCardTitle,
      label: t.market.investedLabel,
      amount: summary.businessesAsset,
      subtext:
        summary.businessIncome > 0
          ? `+${formatCurrency(summary.businessIncome)}${t.common.perMonth}`
          : formatDeltaSummary(businessPnl, businessPct),
      subtextTone: summary.businessIncome > 0 || businessPnl > 0 ? 'pos' : 'neutral',
      wavePath: WAVE_PATHS[5],
      onClick: () => onNavigate('businesses'),
    },
    {
      id: 'loans',
      title: t.market.loansCardTitle,
      label: t.market.debtLabel,
      amount: summary.totalLiabilities,
      subtext:
        summary.loanPaymentsTotal > 0
          ? `-${formatCurrency(summary.loanPaymentsTotal)}${t.common.perMonth}`
          : `$0 (0%)`,
      subtextTone: summary.totalLiabilities > 0 ? 'neg' : 'neutral',
      wavePath: WAVE_PATHS[6],
      onClick: () => onNavigate('loans'),
    },
  ];

  if (tab === 'overview') {
    return (
      <div className="space-y-5">
        {/* Section Heading */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white px-0.5">
          {t.investmentsLabel}
        </h2>

        {/* Vertical Stack of Wavy Cream Investment Category Cards (Matches Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overviewCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={card.onClick}
              className="group relative overflow-hidden rounded-3xl bg-[#F6E7D7] hover:bg-[#FAF0E6] p-5 text-left text-[#26201C] shadow-xl transition-all min-h-[150px] flex flex-col justify-between"
            >
              {/* Soft Translucent White Wavy Curve Backdrop */}
              <svg
                viewBox="0 0 360 120"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <path
                  d={card.wavePath}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.72"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Top-left Title */}
              <div className="relative z-10 flex items-center gap-2.5">
                <TrendingUp className="h-5 w-5 text-[#26201C] shrink-0" />
                <span className="font-display text-xl font-bold text-[#26201C]">
                  {card.title}
                </span>
              </div>

              {/* Bottom-right Amount & Return */}
              <div className="relative z-10 text-right pt-6">
                <div className="flex items-baseline justify-end gap-2">
                  <span className="text-sm sm:text-base font-semibold text-[#5E544C] whitespace-nowrap">
                    {card.label}
                  </span>
                  <span className="font-mono text-2xl sm:text-4xl font-bold text-[#26201C] tabular-nums whitespace-nowrap">
                    {formatCurrency(card.amount)}
                  </span>
                </div>
                <div
                  className={`mt-1 font-mono text-sm sm:text-base font-bold tabular-nums ${
                    card.subtextTone === 'pos'
                      ? 'text-[#169C5E]'
                      : card.subtextTone === 'neg'
                        ? 'text-[#DC2626]'
                        : 'text-[#5E544C]'
                  }`}
                >
                  {card.subtext}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setTab('overview')}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-white/12 border border-white/20 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>{t.market.backToInvestments}</span>
          </button>

          <div className="rounded-2xl bg-[#F6E7D7] px-4 py-1.5 text-center shadow">
            <div className="text-xs font-medium text-[#5E544C]">{t.market.availableCash}</div>
            <div className="font-mono text-base sm:text-lg font-bold text-[#169C5E] tabular-nums">
              {formatCurrency(summary.cashAsset)}
            </div>
          </div>
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-white text-center">
          {t.market.title}
        </h2>
      </div>

      {/* Warm Cream Tab Bar */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-[#F6E7D7] p-1.5 shadow">
        {[
          { id: 'stocks', label: t.market.tabs.stocks, icon: LineChart },
          { id: 'real_estate', label: t.market.tabs.real_estate, icon: Building2 },
          { id: 'businesses', label: t.market.tabs.businesses, icon: Briefcase },
          { id: 'bonds_savings', label: t.market.tabs.bonds_savings, icon: Landmark },
          { id: 'crypto', label: t.market.tabs.crypto, icon: Coins },
        ].map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as MarketTab)}
              className={`flex-1 min-w-[115px] min-h-[42px] inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[#F7CA44] text-[#26201C] shadow-sm'
                  : 'text-[#665B53] hover:bg-white/60 hover:text-[#26201C]'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* A. STOCK MARKET */}
      {tab === 'stocks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 rounded-3xl bg-[#F6E7D7] text-[#26201C] overflow-hidden shadow-lg">
            <div className="border-b border-[#E2CEB9] px-5 py-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold">{t.market.listedCompanies}</h3>
              <span className="text-sm text-[#665B53]">
                {t.market.holdingsLabel}{' '}
                <strong className="font-mono text-[#26201C]">
                  {formatCurrency(summary.stocksAsset)}
                </strong>
              </span>
            </div>

            <div className="divide-y divide-[#E4D2BE]">
              {STOCK_CATALOG.map((def) => {
                const loc = localizeStock(def.symbol, language);
                const mkt = game.market.stocks[def.symbol];
                const holding = game.stocks.find((h) => h.symbol === def.symbol);
                const price = mkt?.currentPrice ?? def.basePrice;
                const prev = mkt?.previousPrice ?? price;
                const diff = price - prev;
                const pct = prev > 0 ? diff / prev : 0;
                const isSelected = def.symbol === selectedStockSym;
                const isFit = isStockMatchedForProfession(game.professionId, def.symbol);
                const divYield = price > 0 ? (def.annualDividendPerShare * (isFit ? 1.2 : 1)) / price : 0;

                const stockCantBuyOne = !holding && price > summary.cashAsset;

                return (
                  <button
                    key={def.symbol}
                    type="button"
                    onClick={() => setSelectedStockSym(def.symbol)}
                    className={`flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors ${
                      isSelected ? 'bg-white' : 'hover:bg-white/50'
                    } ${stockCantBuyOne ? 'opacity-50' : ''}`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-base font-bold text-[#26201C]">
                          {loc.symbol}
                        </span>
                        <span className="text-base font-medium text-[#5E544C] truncate">
                          {loc.name}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[13px] sm:text-sm text-[#665B53]">
                        {loc.sector} · {t.market.divShort} {formatPercent(divYield)}
                        {holding
                          ? ` · ${t.market.ownedPrefix} ${holding.shares} ${t.common.sharesShort}`
                          : ''}
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <MiniSparkline
                        values={mkt?.priceHistory ?? [price]}
                        positive={diff >= 0}
                      />
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm font-bold text-[#26201C] tabular-nums">
                        {formatCurrencyExact(price)}
                      </div>
                      <div
                        className={`inline-flex items-center gap-0.5 font-mono text-xs font-semibold tabular-nums ${
                          diff >= 0 ? 'text-[#169C5E]' : 'text-[#DC2626]'
                        }`}
                      >
                        {diff >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {formatPercent(pct, true)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-[#F6E7D7] p-5 sm:p-6 text-[#26201C] shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-[#686CA8] font-bold">
                  {activeStockLoc.symbol} · {activeStockLoc.sector}
                </div>
                <h3 className="font-display text-lg font-bold mt-0.5">{activeStockLoc.name}</h3>
              </div>
              <div className="text-right">
                <div className="font-mono text-xl font-bold tabular-nums">
                  {formatCurrencyExact(activeStockMkt?.currentPrice ?? activeStockDef.basePrice)}
                </div>
                <div
                  className={`font-mono text-xs font-bold tabular-nums ${
                    stockPriceDelta >= 0 ? 'text-[#169C5E]' : 'text-[#DC2626]'
                  }`}
                >
                  {formatPercent(stockPctDelta, true)} {t.market.thisMonth}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white/80 p-3">
              <FinancialChart
                labels={(activeStockMkt?.priceHistory ?? []).map((_, idx) =>
                  formatRelativeMonth(
                    (activeStockMkt?.priceHistory.length ?? 1) - 1 - idx,
                    language
                  )
                )}
                height={165}
                emptyLabel={t.common.chartEmpty}
                valueFormatter={(v) => formatCurrencyExact(v)}
                series={[
                  {
                    id: `stock_${activeStockDef.symbol}`,
                    label: activeStockLoc.symbol,
                    color: stockPriceDelta >= 0 ? '#169C5E' : '#DC2626',
                    values: activeStockMkt?.priceHistory ?? [],
                  },
                ]}
              />
            </div>

            {activeStockHolding && (
              <div className="mt-4 rounded-2xl bg-white p-3.5 space-y-2.5 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <span className="text-[#665B53] block">{t.market.shares}</span>
                    <span className="font-mono font-bold tabular-nums">
                      {activeStockHolding.shares}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#665B53] block">{t.market.avgCost}</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {formatCurrencyExact(activeStockHolding.avgBuyPrice)}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[#665B53] block">{t.market.unrealizedPnl}</span>
                    {(() => {
                      const pnl =
                        ((activeStockMkt?.currentPrice ?? activeStockHolding.avgBuyPrice) -
                          activeStockHolding.avgBuyPrice) *
                        activeStockHolding.shares;
                      return (
                        <span
                          className={`font-mono font-bold tabular-nums ${
                            pnl >= 0 ? 'text-[#169C5E]' : 'text-[#DC2626]'
                          }`}
                        >
                          {formatCurrency(pnl, true)}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                {(() => {
                  const baseDiv =
                    (activeStockHolding.shares * activeStockHolding.annualDividendPerShare) / 12;
                  const matched = isStockMatchedForProfession(
                    game.professionId,
                    activeStockHolding.symbol
                  );
                  const monthlyDiv = roundMoney(matched ? baseDiv * 1.2 : baseDiv);
                  return (
                    <div className="border-t border-[#F0E4D7] pt-2 flex items-center justify-between gap-2">
                      <span className="text-[#665B53]">
                        {t.market.monthlyDividendLabel}
                      </span>
                      <span className="font-mono font-bold text-[#169C5E] tabular-nums whitespace-nowrap">
                        +{formatCurrency(monthlyDiv)}
                        {t.common.perMonth}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="mt-5 border-t border-[#E2CEB9] pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#665B53]">
                <span>{t.market.shareQty}</span>
                <span>
                  {t.market.dividend}{' '}
                  <strong className="font-mono text-[#169C5E]">
                    ${(
                      (activeStockDef.annualDividendPerShare *
                        (isStockMatchedForProfession(game.professionId, activeStockDef.symbol)
                          ? 1.2
                          : 1)) /
                      12
                    ).toFixed(2)}
                    /{t.common.sharesShort}
                    {t.common.perMonth}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  className="w-24 min-h-[44px] rounded-xl border border-[#DFC9B4] bg-white px-3 font-mono text-sm font-bold text-[#26201C] focus:outline-none"
                />
                {[1, 5, 10, 25].map((preset) => {
                  const presetCantBuy = preset * activeStockPrice > summary.cashAsset;
                  const presetCantSell = !activeStockHolding || preset > activeStockHolding.shares;
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={presetCantBuy && presetCantSell}
                      onClick={() => setStockQty(String(preset))}
                      className="min-h-[44px] flex-1 rounded-xl bg-white hover:bg-[#EAD7C3] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white text-xs font-mono font-bold text-[#26201C]"
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between text-xs text-[#665B53] font-mono">
                <span>{t.market.orderTotal}</span>
                <span className="text-[#26201C] font-bold">
                  {formatCurrencyExact(stockOrderTotal)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  disabled={parsedStockQty <= 0 || stockOrderTotal > summary.cashAsset}
                  onClick={() => onBuyStock(activeStockDef.symbol, parsedStockQty)}
                  className="min-h-[46px] rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F7CA44] text-sm font-bold text-[#26201C] transition-colors"
                >
                  {t.market.buyShares}
                </button>
                <button
                  type="button"
                  disabled={
                    !activeStockHolding ||
                    parsedStockQty <= 0 ||
                    parsedStockQty > activeStockHolding.shares
                  }
                  onClick={() => onSellStock(activeStockDef.symbol, parsedStockQty)}
                  className="min-h-[46px] rounded-2xl bg-[#FEE2E2] hover:bg-[#FECACA] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FEE2E2] text-sm font-bold text-[#DC2626] transition-colors"
                >
                  {t.market.sellShares}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. REAL ESTATE */}
      {tab === 'real_estate' && (
        <div className="rounded-3xl bg-[#F6E7D7] p-6 text-[#26201C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="font-display text-lg font-bold">{t.market.realEstateHubTitle}</h3>
            <p className="text-sm text-[#5E544C] mt-1">
              {language === 'bn'
                ? `${game.market.availableProperties.length}${t.market.realEstateHubDesc} ${game.properties.length}টি (${formatCurrency(summary.rentalIncome)}${t.common.perMonth})`
                : `${game.market.availableProperties.length} ${t.market.realEstateHubDesc} ${game.properties.length} (${formatCurrency(summary.rentalIncome)}${t.common.perMonth}).`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('properties')}
            className="min-h-[46px] rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] px-6 py-2.5 text-sm font-bold text-[#26201C] transition-colors whitespace-nowrap shrink-0"
          >
            {t.market.openPropertiesBtn}
          </button>
        </div>
      )}

      {/* C. BUSINESSES */}
      {tab === 'businesses' && (
        <div className="rounded-3xl bg-[#F6E7D7] p-6 text-[#26201C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="font-display text-lg font-bold">{t.market.businessHubTitle}</h3>
            <p className="text-sm text-[#5E544C] mt-1">
              {language === 'bn'
                ? `${game.market.availableBusinesses.length}${t.market.businessHubDesc} ${game.businesses.length}টি (${formatCurrency(summary.businessIncome)}${t.common.perMonth})`
                : `${game.market.availableBusinesses.length} ${t.market.businessHubDesc} ${game.businesses.length} (${formatCurrency(summary.businessIncome)}${t.common.perMonth}).`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('businesses')}
            className="min-h-[46px] rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] px-6 py-2.5 text-sm font-bold text-[#26201C] transition-colors whitespace-nowrap shrink-0"
          >
            {t.market.openBusinessBtn}
          </button>
        </div>
      )}

      {/* D. BONDS & SAVINGS */}
      {tab === 'bonds_savings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIXED_INCOME_PRODUCTS.map((prod) => {
              const loc = localizeFixedIncome(prod.id, prod.name, language);
              const isFit = isFixedIncomeMatchedForProfession(game.professionId, prod.id);
              const effectiveApy = (prod.annualInterestRate + (isFit ? 0.01 : 0)) * 100;
              const investAmt = Number(fixedAmounts[prod.id]) || prod.minAmount;
              const minCantAfford = summary.cashAsset < prod.minAmount;
              const canInvest =
                !minCantAfford && investAmt >= prod.minAmount && investAmt <= summary.cashAsset;
              return (
                <div
                  key={prod.id}
                  className={`rounded-3xl p-5 text-[#26201C] flex flex-col justify-between gap-4 shadow-md transition-opacity ${
                    minCantAfford ? 'bg-[#EAE0D3] opacity-55' : 'bg-[#F6E7D7]'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 text-sm font-bold text-[#686CA8]">
                      <span>
                        {prod.kind === 'savings'
                          ? t.market.liquidSavings
                          : `${prod.maturityMonths}${t.market.monthBondSuffix}`}{' '}
                        · {effectiveApy.toFixed(1)}% {t.common.apy}
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-bold mt-1">{loc.name}</h4>
                  </div>

                  <div className="space-y-2.5 border-t border-[#E2CEB9] pt-3">
                    <div className="flex items-center justify-between text-sm text-[#665B53]">
                      <span>
                        {t.market.minLabel} {formatCurrency(prod.minAmount)}
                      </span>
                      <span className="font-mono font-semibold text-[#169C5E]">
                        {prod.payoutFrequency === 'monthly'
                          ? t.market.monthlyPayout
                          : t.market.atMaturity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={prod.minAmount}
                        step={500}
                        disabled={minCantAfford}
                        value={fixedAmounts[prod.id] ?? String(prod.minAmount)}
                        onChange={(e) =>
                          setFixedAmounts({ ...fixedAmounts, [prod.id]: e.target.value })
                        }
                        className="w-full min-h-[44px] rounded-xl border border-[#DFC9B4] bg-white disabled:bg-[#F5EFE7] disabled:cursor-not-allowed px-3 font-mono text-sm font-bold text-[#26201C] focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={!canInvest}
                        onClick={() => onInvestFixed(prod.id, investAmt)}
                        className="min-h-[44px] rounded-xl bg-[#F7CA44] hover:bg-[#EBBF36] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F7CA44] px-4 text-sm font-bold text-[#26201C] transition-colors whitespace-nowrap shrink-0"
                      >
                        {t.market.depositBtn}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-[#F6E7D7] p-5 text-[#26201C] shadow-lg">
            <h3 className="font-display text-lg font-bold">
              {t.market.yourFixedTitle} ({game.fixedIncome.length})
            </h3>
            <p className="text-sm text-[#665B53] mt-0.5">
              {t.market.projectedMonthlyInt}{' '}
              <strong className="font-mono text-[#169C5E]">
                +{formatCurrency(summary.interestIncome)}
                {t.common.perMonth}
              </strong>
            </p>

            {game.fixedIncome.length === 0 ? (
              <div className="mt-6 py-8 text-center text-sm text-[#665B53]">
                {t.market.noFixedEmpty}
              </div>
            ) : (
              <div className="mt-4 divide-y divide-[#E2CEB9]">
                {game.fixedIncome.map((fi) => {
                  const locFi = localizeFixedIncome(fi.productId, fi.name, language);
                  const matched = isFixedIncomeMatchedForProfession(
                    game.professionId,
                    fi.productId
                  );
                  const effRate = fi.annualInterestRate + (matched ? 0.01 : 0);
                  const monthlyFiInt = roundMoney((fi.currentValue * effRate) / 12);
                  return (
                    <div key={fi.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-bold">{locFi.name}</div>
                        <div className="text-xs text-[#665B53] font-mono">
                          {(effRate * 100).toFixed(1)}% {t.common.apy} ·{' '}
                          {fi.maturityMonths === 0
                            ? t.market.liquidTag
                            : `${fi.turnsElapsed}/${fi.maturityMonths} ${t.common.monthsShort}`}
                        </div>
                        <div className="text-xs font-mono font-bold text-[#169C5E] mt-0.5">
                          +{formatCurrency(monthlyFiInt)}
                          {t.common.perMonth}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-sm font-bold text-[#26201C] tabular-nums">
                          {formatCurrencyExact(fi.currentValue)}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRedeemFixed(fi.id)}
                          className="mt-1 text-xs font-bold text-[#686CA8] hover:underline"
                        >
                          {fi.kind === 'savings' ? t.market.withdrawBtn : t.market.redeemEarlyBtn}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* E. CRYPTOCURRENCY */}
      {tab === 'crypto' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7 rounded-3xl bg-[#F6E7D7] text-[#26201C] divide-y divide-[#E4D2BE] overflow-hidden shadow-lg">
              {CRYPTO_CATALOG.map((coin) => {
                const loc = localizeCrypto(coin.symbol, language);
                const mkt = game.market.crypto[coin.symbol];
                const holding = game.crypto.find((c) => c.symbol === coin.symbol);
                const price = mkt?.currentPrice ?? coin.basePrice;
                const prev = mkt?.previousPrice ?? price;
                const diff = price - prev;
                const pct = prev > 0 ? diff / prev : 0;
                const isSelected = coin.symbol === selectedCryptoSym;

                const cryptoCantBuyMin = !holding && price * 0.1 > summary.cashAsset;

                return (
                  <button
                    key={coin.symbol}
                    type="button"
                    onClick={() => setSelectedCryptoSym(coin.symbol)}
                    className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors ${
                      isSelected ? 'bg-white' : 'hover:bg-white/50'
                    } ${cryptoCantBuyMin ? 'opacity-50' : ''}`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-base font-bold text-[#D97706]">
                          {loc.symbol}
                        </span>
                        <span className="text-base font-bold text-[#26201C]">{loc.name}</span>
                      </div>
                      <div className="text-[13px] sm:text-sm text-[#665B53] mt-0.5">
                        {t.market.volatilityLabel} {(coin.volatility * 100).toFixed(0)}%
                        {holding
                          ? ` · ${t.market.ownedPrefix} ${holding.units} ${loc.symbol}`
                          : ''}
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <MiniSparkline
                        values={mkt?.priceHistory ?? [price]}
                        positive={diff >= 0}
                      />
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-base font-bold tabular-nums">
                        {formatCurrencyExact(price)}
                      </div>
                      <div
                        className={`font-mono text-[13px] sm:text-sm font-bold tabular-nums ${
                          diff >= 0 ? 'text-[#169C5E]' : 'text-[#DC2626]'
                        }`}
                      >
                        {formatPercent(pct, true)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-5 rounded-3xl bg-[#F6E7D7] p-5 text-[#26201C] shadow-lg">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-[#D97706] font-bold">
                    {activeCryptoLoc.symbol}
                  </div>
                  <h3 className="font-display text-lg font-bold">{activeCryptoLoc.name}</h3>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl font-bold tabular-nums">
                    {formatCurrencyExact(activeCryptoMkt?.currentPrice ?? activeCryptoDef.basePrice)}
                  </div>
                  <div
                    className={`font-mono text-xs font-bold tabular-nums ${
                      cryptoPriceDelta >= 0 ? 'text-[#169C5E]' : 'text-[#DC2626]'
                    }`}
                  >
                    {formatPercent(cryptoPctDelta, true)}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/80 p-3">
                <FinancialChart
                  labels={(activeCryptoMkt?.priceHistory ?? []).map((_, idx) =>
                    formatRelativeMonth(
                      (activeCryptoMkt?.priceHistory.length ?? 1) - 1 - idx,
                      language
                    )
                  )}
                  height={160}
                  emptyLabel={t.common.chartEmpty}
                  valueFormatter={(v) => formatCurrencyExact(v)}
                  series={[
                    {
                      id: `crypto_${activeCryptoDef.symbol}`,
                      label: activeCryptoLoc.symbol,
                      color: '#D97706',
                      values: activeCryptoMkt?.priceHistory ?? [],
                    },
                  ]}
                />
              </div>

              {activeCryptoHolding && (
                <div className="mt-3 rounded-2xl bg-white p-3 flex justify-between text-xs">
                  <span className="text-[#665B53]">
                    {t.market.ownedPrefix}{' '}
                    <strong className="font-mono text-[#26201C]">
                      {activeCryptoHolding.units}
                    </strong>{' '}
                    @ {formatCurrencyExact(activeCryptoHolding.avgBuyPrice)}
                  </span>
                  <span className="font-mono font-bold text-[#169C5E]">
                    {formatCurrencyExact(
                      activeCryptoHolding.units * (activeCryptoMkt?.currentPrice ?? 0)
                    )}
                  </span>
                </div>
              )}

              <div className="mt-4 border-t border-[#E2CEB9] pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0.1}
                    step={0.5}
                    value={cryptoQty}
                    onChange={(e) => setCryptoQty(e.target.value)}
                    className="w-24 min-h-[44px] rounded-xl border border-[#DFC9B4] bg-white px-3 font-mono text-sm font-bold text-[#26201C] focus:outline-none"
                  />
                  {[0.5, 1, 5, 10].map((preset) => {
                    const presetCantBuy = preset * activeCryptoPrice > summary.cashAsset;
                    const presetCantSell = !activeCryptoHolding || preset > activeCryptoHolding.units;
                    return (
                      <button
                        key={preset}
                        type="button"
                        disabled={presetCantBuy && presetCantSell}
                        onClick={() => setCryptoQty(String(preset))}
                        className="min-h-[44px] flex-1 rounded-xl bg-white hover:bg-[#EAD7C3] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white text-xs font-mono font-bold text-[#26201C]"
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between text-xs text-[#665B53] font-mono">
                  <span>{t.market.tradeValue}</span>
                  <span className="text-[#26201C] font-bold">
                    {formatCurrencyExact(cryptoTradeValue)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={parsedCryptoQty <= 0 || cryptoTradeValue > summary.cashAsset}
                    onClick={() => onBuyCrypto(activeCryptoDef.symbol, parsedCryptoQty)}
                    className="min-h-[46px] rounded-2xl bg-[#F7CA44] hover:bg-[#EBBF36] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F7CA44] text-sm font-bold text-[#26201C] transition-colors"
                  >
                    {t.market.buyBtnPrefix} {activeCryptoLoc.symbol}
                  </button>
                  <button
                    type="button"
                    disabled={
                      !activeCryptoHolding ||
                      parsedCryptoQty <= 0 ||
                      parsedCryptoQty > activeCryptoHolding.units
                    }
                    onClick={() => onSellCrypto(activeCryptoDef.symbol, parsedCryptoQty)}
                    className="min-h-[46px] rounded-2xl bg-[#FEE2E2] hover:bg-[#FECACA] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FEE2E2] text-sm font-bold text-[#DC2626] transition-colors"
                  >
                    {t.market.sellBtnPrefix} {activeCryptoLoc.symbol}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
