import React from 'react';
import { PersonalAssetId } from '../../types/game';

export const InsuranceHealthIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="insGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="insNavy" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>
    {/* Shield Outer Gold Rim */}
    <path
      d="M60 12 L98 26 V58 C98 83 80 100 60 108 C40 100 22 83 22 58 V26 Z"
      fill="url(#insGold)"
    />
    {/* Shield Inner Navy */}
    <path
      d="M60 18 L92 30 V57 C92 78 76 93 60 100 C44 93 28 78 28 57 V30 Z"
      fill="url(#insNavy)"
    />
    {/* Family Figures */}
    <circle cx="48" cy="46" r="5.5" fill="#E5C08D" />
    <path d="M40 72 C40 59 56 59 56 72 Z" fill="#E5C08D" />
    <circle cx="72" cy="46" r="5.5" fill="#E5C08D" />
    <path d="M64 72 C64 59 80 59 80 72 Z" fill="#E5C08D" />
    <circle cx="60" cy="54" r="4.5" fill="#F7CA44" />
    <path d="M53 76 C53 64 67 64 67 76 Z" fill="#F7CA44" />
    {/* Protective Golden Hand */}
    <path
      d="M34 72 C44 82 62 84 78 77 C83 75 87 79 83 83 C67 93 46 92 31 79 Z"
      fill="url(#insGold)"
    />
  </svg>
);

export const InsuranceAssetIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="insGold2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="insNavy2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>
    <path
      d="M60 12 L98 26 V58 C98 83 80 100 60 108 C40 100 22 83 22 58 V26 Z"
      fill="url(#insGold2)"
    />
    <path
      d="M60 18 L92 30 V57 C92 78 76 93 60 100 C44 93 28 78 28 57 V30 Z"
      fill="url(#insNavy2)"
    />
    {/* House inside Shield */}
    <path d="M38 56 L60 36 L82 56 H76 V78 H44 V56 Z" fill="#E5C08D" />
    <path d="M35 56 L60 33 L85 56" fill="none" stroke="#F7CA44" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="55" y="62" width="10" height="16" rx="1.5" fill="#1E293B" />
    <rect x="47" y="54" width="6" height="6" rx="1" fill="#1E293B" />
    <rect x="67" y="54" width="6" height="6" rx="1" fill="#1E293B" />
  </svg>
);

export const PersonalAssetIllustration: React.FC<{
  assetId: PersonalAssetId;
  className?: string;
}> = ({ assetId, className = 'w-28 h-24' }) => {
  if (assetId === 'car') {
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        {/* Pedestal */}
        <path d="M18 76 L70 98 L124 72 L72 52 Z" fill="#C9BAAB" />
        <path d="M18 76 L70 98 V104 L18 82 Z" fill="#A9998A" />
        <path d="M70 98 L124 72 V78 L70 104 Z" fill="#928273" />
        {/* Angular Cyber-Style Car Body */}
        <polygon points="32,68 58,42 96,42 114,56 108,70 36,74" fill="#CBD5E1" />
        <polygon points="58,42 96,42 84,54 46,56" fill="#E2E8F0" />
        <polygon points="36,74 108,70 114,56 76,62" fill="#94A3B8" />
        {/* Dark Cabin Glass */}
        <polygon points="48,55 60,44 90,44 82,54" fill="#334155" />
        {/* Wheels */}
        <circle cx="52" cy="74" r="10" fill="#1E293B" />
        <circle cx="52" cy="74" r="4.5" fill="#64748B" />
        <circle cx="94" cy="68" r="9.5" fill="#1E293B" />
        <circle cx="94" cy="68" r="4" fill="#64748B" />
        {/* Headlight */}
        <line x1="34" y1="67" x2="46" y2="69" stroke="#F7CA44" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (assetId === 'house') {
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        {/* Lawn Pedestal */}
        <path d="M16 74 L70 98 L126 70 L72 48 Z" fill="#9DC88D" />
        <path d="M16 74 L70 98 V104 L16 80 Z" fill="#B8AA9B" />
        <path d="M70 98 L126 70 V76 L70 104 Z" fill="#9E9082" />
        {/* Modern House Block */}
        <polygon points="36,68 36,42 74,28 74,56" fill="#F1E7DB" />
        <polygon points="74,28 106,42 106,68 74,56" fill="#D9C8B4" />
        {/* Flat Roof Overhang */}
        <polygon points="30,42 74,24 112,40 70,56" fill="#8D6E63" />
        {/* Glass Windows & Warm Door */}
        <polygon points="44,48 56,43 56,59 44,64" fill="#38BDF8" opacity="0.85" />
        <polygon points="60,42 70,38 70,64 60,68" fill="#B45309" />
        <polygon points="82,42 98,48 98,60 82,54" fill="#38BDF8" opacity="0.75" />
      </svg>
    );
  }

  if (assetId === 'yacht') {
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        {/* Ocean Pedestal */}
        <ellipse cx="70" cy="80" rx="52" ry="18" fill="#38BDF8" opacity="0.3" />
        <ellipse cx="70" cy="76" rx="46" ry="14" fill="#0284C7" opacity="0.25" />
        {/* Hull */}
        <path d="M24 66 L108 58 L118 70 L40 78 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
        <path d="M30 72 L114 64 L110 72 L38 79 Z" fill="#1E293B" />
        {/* Upper Deck */}
        <path d="M44 58 L62 42 H94 L102 58 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="1.5" />
        <polygon points="50,54 62,45 86,45 92,54" fill="#0EA5E9" opacity="0.8" />
        <line x1="74" y1="42" x2="74" y2="26" stroke="#475569" strokeWidth="2.5" />
        <circle cx="74" cy="24" r="2.5" fill="#F7CA44" />
      </svg>
    );
  }

  // Villa
  return (
    <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
      {/* Island Base */}
      <path d="M16 74 L70 98 L126 70 L72 48 Z" fill="#FDE68A" />
      <path d="M16 74 L70 98 V104 L16 80 Z" fill="#D97706" opacity="0.6" />
      <path d="M70 98 L126 70 V76 L70 104 Z" fill="#B45309" opacity="0.7" />
      {/* Pool */}
      <polygon points="56,78 86,66 102,73 72,85" fill="#38BDF8" />
      {/* Villa Building */}
      <polygon points="34,64 34,36 74,24 74,52" fill="#FFFFFF" />
      <polygon points="74,24 102,36 102,60 74,52" fill="#E2E8F0" />
      <polygon points="28,36 74,20 108,34 70,48" fill="#B45309" />
      <polygon points="44,44 64,37 64,56 44,63" fill="#0284C7" opacity="0.8" />
      {/* Palm Tree */}
      <path d="M108 64 Q112 46 105 34" fill="none" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M105 34 Q94 30 90 38 M105 34 Q115 28 122 36 M105 34 Q106 22 114 22" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const HappinessIllustration: React.FC<{
  templateId?: string;
  itemId: string;
  className?: string;
}> = ({ templateId, itemId, className = 'w-28 h-24' }) => {
  const key = (templateId ?? itemId).toLowerCase();

  // Pilgrimage: Umrah & Major Hajj (Kaaba & Crescent Illustration)
  if (key.includes('pilgrimage') || key.includes('umrah') || key.includes('hajj')) {
    const isMajorHajj = key.includes('hajj');
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        {/* Courtyard / Marble Base */}
        <ellipse
          cx="70"
          cy="86"
          rx="48"
          ry="14"
          fill={isMajorHajj ? '#FDE68A' : '#A7F3D0'}
          opacity="0.7"
        />
        <ellipse cx="70" cy="83" rx="42" ry="11" fill="#F8FAFC" stroke="#E2CEB9" strokeWidth="2" />
        {/* Crescent */}
        <path
          d="M104 20 A10 10 0 1 0 116 32 A8 8 0 1 1 104 20 Z"
          fill={isMajorHajj ? '#D97706' : '#169C5E'}
        />
        {/* Kaaba Left Face */}
        <polygon points="44,40 70,30 70,78 44,68" fill="#1E293B" />
        {/* Kaaba Right Face */}
        <polygon points="70,30 96,40 96,68 70,78" fill="#0F172A" />
        {/* Roof */}
        <polygon points="44,40 70,30 96,40 70,50" fill="#334155" />
        {/* Golden Kiswah Band (Hizam) */}
        <polygon points="44,48 70,58 70,63 44,53" fill="#F7CA44" />
        <polygon points="70,58 96,48 96,53 70,63" fill="#D97706" />
        {/* Golden Door */}
        <polygon points="77,57 85,54 85,72 77,75" fill="#F7CA44" />
        {/* Top Star Accent for Major Hajj */}
        {isMajorHajj && (
          <circle cx="70" cy="20" r="4" fill="#F7CA44" />
        )}
      </svg>
    );
  }

  // Fitness / Gym (Blue & Gold Dumbbell on Mat — matches screenshot)
  if (key.includes('gym') || key.includes('sport') || key.includes('cycle')) {
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <rect x="24" y="66" width="92" height="24" rx="10" fill="#1E293B" stroke="#F97316" strokeWidth="3" />
        {/* Dumbbell */}
        <rect x="46" y="47" width="48" height="10" rx="4" fill="#D97706" />
        <polygon points="30,36 46,32 52,52 46,72 30,68 24,52" fill="#2563EB" />
        <polygon points="46,32 54,36 58,52 54,68 46,72 50,52" fill="#1D4ED8" />
        <polygon points="94,32 110,36 116,52 110,68 94,72 88,52" fill="#2563EB" />
        <polygon points="86,36 94,32 90,52 94,72 86,68 82,52" fill="#1E40AF" />
      </svg>
    );
  }

  // Book / Study / Library / Tech / Keyboard / Desk / Cinema (Laptop + Cap + Book — matches screenshot)
  if (
    key.includes('book') ||
    key.includes('library') ||
    key.includes('kb') ||
    key.includes('desk') ||
    key.includes('gadget') ||
    key.includes('sim') ||
    key.includes('vr') ||
    key.includes('sketch') ||
    key.includes('studio') ||
    key.includes('camera')
  ) {
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        {/* Wooden Base */}
        <ellipse cx="70" cy="84" rx="50" ry="16" fill="#B08968" />
        <ellipse cx="70" cy="80" rx="50" ry="15" fill="#C8A27E" />
        {/* Laptop */}
        <polygon points="44,30 100,22 104,58 48,66" fill="#1E293B" stroke="#475569" strokeWidth="2.5" />
        <polygon points="48,66 104,58 118,72 62,82" fill="#334155" />
        {/* Graduation Cap on screen */}
        <polygon points="62,42 76,34 90,40 76,48" fill="#F7CA44" />
        <rect x="68" y="45" width="16" height="6" rx="1" fill="#D97706" />
        {/* Blue Book */}
        <polygon points="34,68 58,64 66,74 42,78" fill="#2563EB" />
        <polygon points="34,68 42,78 42,84 34,74" fill="#1D4ED8" />
        <polygon points="42,78 66,74 66,80 42,84" fill="#F8FAFC" />
      </svg>
    );
  }

  // Coffee / Dining / Bakery / Tea / Feast
  if (
    key.includes('espresso') ||
    key.includes('coffee') ||
    key.includes('tea') ||
    key.includes('dining') ||
    key.includes('feast') ||
    key.includes('food') ||
    key.includes('bakery') ||
    key.includes('cooking')
  ) {
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <ellipse cx="70" cy="84" rx="46" ry="14" fill="#D6C3B0" />
        <ellipse cx="70" cy="80" rx="42" ry="12" fill="#FFFFFF" stroke="#E2CEB9" strokeWidth="2" />
        {/* Cup */}
        <path d="M46 46 H88 L82 76 C81 80 53 80 52 76 Z" fill="#F59E0B" />
        <path d="M88 52 C98 52 98 66 86 67" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="67" cy="46" rx="21" ry="6" fill="#78350F" />
        {/* Steam */}
        <path d="M58 34 Q55 26 60 20 M68 32 Q65 24 70 18 M78 34 Q75 26 80 20" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Travel / Cruise / Resort / Hill / Island / Camp
  return (
    <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
      <ellipse cx="70" cy="84" rx="48" ry="14" fill="#93C5FD" opacity="0.45" />
      {/* Suitcase / Adventure Bag */}
      <rect x="42" y="34" width="56" height="44" rx="9" fill="#0284C7" />
      <rect x="42" y="34" width="56" height="14" rx="7" fill="#0369A1" />
      <path d="M58 34 V26 H82 V34" fill="none" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <rect x="52" y="34" width="6" height="44" fill="#F7CA44" />
      <rect x="82" y="34" width="6" height="44" fill="#F7CA44" />
      {/* Sun badge */}
      <circle cx="70" cy="59" r="8" fill="#FEF3C7" />
      <circle cx="70" cy="59" r="4.5" fill="#F59E0B" />
    </svg>
  );
};

export const VentureIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 110" className={className} aria-hidden="true">
    <ellipse cx="60" cy="88" rx="44" ry="12" fill="#DDD0C0" />
    {/* Die 1 */}
    <rect x="26" y="42" width="38" height="38" rx="8" fill="#FFFFFF" stroke="#686CA8" strokeWidth="2.5" />
    <circle cx="37" cy="53" r="3.2" fill="#686CA8" />
    <circle cx="53" cy="53" r="3.2" fill="#686CA8" />
    <circle cx="45" cy="61" r="3.2" fill="#686CA8" />
    <circle cx="37" cy="69" r="3.2" fill="#686CA8" />
    <circle cx="53" cy="69" r="3.2" fill="#686CA8" />
    {/* Die 2 */}
    <rect x="56" y="28" width="38" height="38" rx="8" fill="#F7CA44" stroke="#B45309" strokeWidth="2.5" />
    <circle cx="67" cy="39" r="3.2" fill="#26201C" />
    <circle cx="83" cy="55" r="3.2" fill="#26201C" />
    <circle cx="75" cy="47" r="3.2" fill="#26201C" />
  </svg>
);

export const LotteryIllustration: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg viewBox="0 0 120 110" className={className} aria-hidden="true">
    <ellipse cx="60" cy="88" rx="44" ry="12" fill="#DDD0C0" />
    {/* Ticket */}
    <g transform="rotate(-8 60 54)">
      <rect x="20" y="34" width="80" height="42" rx="8" fill="#F7CA44" stroke="#B45309" strokeWidth="2.5" />
      <rect x="27" y="41" width="66" height="28" rx="4" fill="#FEF3C7" stroke="#D97706" strokeDasharray="4 3" strokeWidth="1.5" />
      <polygon points="60,45 63,52 70,52 64,56 66,63 60,59 54,63 56,56 50,52 57,52" fill="#D97706" />
    </g>
    <circle cx="94" cy="30" r="8" fill="#169C5E" />
    <text x="94" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">$</text>
  </svg>
);

export const EducationIllustration: React.FC<{
  tier: 1 | 2 | 3 | 4 | 5;
  className?: string;
}> = ({ tier, className = 'w-24 h-24' }) => {
  if (tier === 1) {
    // Online Course: Laptop + Graduation Cap + Blue Book on wooden desk
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <path d="M18 76 L70 98 L124 72 L72 52 Z" fill="#C89F7B" />
        <path d="M18 76 L70 98 V104 L18 82 Z" fill="#A98260" />
        <path d="M70 98 L124 72 V78 L70 104 Z" fill="#926D4E" />
        {/* Laptop screen */}
        <polygon points="46,24 102,16 106,56 50,64" fill="#1E293B" stroke="#475569" strokeWidth="2.5" />
        <polygon points="50,28 98,21 101,53 53,60" fill="#234876" />
        {/* Laptop keyboard base */}
        <polygon points="50,64 106,56 120,70 64,80" fill="#475569" />
        <polygon points="54,65 102,58 112,68 64,76" fill="#334155" />
        {/* Graduation cap inside screen */}
        <polygon points="62,38 76,30 90,36 76,44" fill="#1E293B" stroke="#F7CA44" strokeWidth="1.2" />
        <rect x="69" y="41" width="14" height="5" rx="1" fill="#1E293B" />
        <line x1="88" y1="36" x2="88" y2="48" stroke="#F7CA44" strokeWidth="2" />
        {/* Play badge */}
        <circle cx="58" cy="48" r="5" fill="#F8FAFC" opacity="0.9" />
        <polygon points="56.5,45.5 61,48 56.5,50.5" fill="#1E293B" />
        {/* Blue book in front */}
        <polygon points="32,68 54,64 62,74 40,78" fill="#2563EB" />
        <polygon points="32,68 40,78 40,84 32,74" fill="#1D4ED8" />
        <polygon points="40,78 62,74 62,80 40,84" fill="#F8FAFC" />
      </svg>
    );
  }

  if (tier === 2) {
    // Higher Education: Upright hardcover textbooks & golden bookmark
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <path d="M18 76 L70 98 L124 72 L72 52 Z" fill="#C89F7B" />
        <path d="M18 76 L70 98 V104 L18 82 Z" fill="#A98260" />
        <path d="M70 98 L124 72 V78 L70 104 Z" fill="#926D4E" />
        {/* Tall Navy Book */}
        <polygon points="54,26 84,18 96,24 66,32" fill="#1E3A8A" />
        <polygon points="54,26 66,32 66,78 54,72" fill="#1D4ED8" />
        <polygon points="66,32 96,24 96,70 66,78" fill="#1E40AF" />
        <polygon points="58,34 62,36 62,68 58,66" fill="#F7CA44" />
        {/* Second Crimson Book */}
        <polygon points="40,42 54,38 54,74 40,78" fill="#B91C1C" />
        <polygon points="40,42 54,38 62,42 48,46" fill="#DC2626" />
        {/* Golden Ribbon */}
        <polygon points="78,29 84,27 84,48 81,44 78,48" fill="#F7CA44" />
      </svg>
    );
  }

  if (tier === 3) {
    // Postgraduate Degree: Diploma Scroll & Academic Cap
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <path d="M18 76 L70 98 L124 72 L72 52 Z" fill="#C89F7B" />
        <path d="M18 76 L70 98 V104 L18 82 Z" fill="#A98260" />
        <path d="M70 98 L124 72 V78 L70 104 Z" fill="#926D4E" />
        {/* Rolled Parchment Diploma */}
        <g transform="rotate(-14 70 64)">
          <rect x="34" y="54" width="72" height="18" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <ellipse cx="102" cy="63" rx="4" ry="8" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          <rect x="64" y="52" width="12" height="22" rx="2" fill="#DC2626" />
          <circle cx="70" cy="63" r="5" fill="#F7CA44" />
        </g>
        {/* Graduation Cap on top */}
        <polygon points="40,34 70,20 100,34 70,48" fill="#1E293B" stroke="#475569" strokeWidth="2" />
        <path d="M52 40 V50 C52 55 88 55 88 50 V40 Z" fill="#334155" />
        <line x1="94" y1="36" x2="94" y2="52" stroke="#F7CA44" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="94" cy="53" r="3" fill="#F7CA44" />
      </svg>
    );
  }

  if (tier === 4) {
    // Experience Exchange: Connected Global Network & Mentorship Badges
    return (
      <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
        <ellipse cx="70" cy="86" rx="46" ry="13" fill="#DDD0C0" />
        {/* Globe */}
        <circle cx="70" cy="52" r="26" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
        <ellipse cx="70" cy="52" rx="12" ry="26" fill="none" stroke="#BAE6FD" strokeWidth="1.8" />
        <line x1="44" y1="52" x2="96" y2="52" stroke="#BAE6FD" strokeWidth="1.8" />
        <path d="M48 40 Q70 46 92 40 M48 64 Q70 58 92 64" fill="none" stroke="#BAE6FD" strokeWidth="1.6" />
        {/* Left & Right Exchange Arrows/Badges */}
        <circle cx="38" cy="40" r="10" fill="#F7CA44" stroke="#B45309" strokeWidth="2" />
        <circle cx="38" cy="38" r="3.5" fill="#26201C" />
        <path d="M32 46 C32 42 44 42 44 46" fill="#26201C" />
        <circle cx="102" cy="64" r="10" fill="#169C5E" stroke="#14532D" strokeWidth="2" />
        <circle cx="102" cy="62" r="3.5" fill="#FFFFFF" />
        <path d="M96 70 C96 66 108 66 108 70" fill="#FFFFFF" />
      </svg>
    );
  }

  // Tier 5: MBA / Executive Briefcase + Rising Gold Trophy Chart
  return (
    <svg viewBox="0 0 140 110" className={className} aria-hidden="true">
      <ellipse cx="70" cy="88" rx="46" ry="12" fill="#DDD0C0" />
      {/* Executive Briefcase */}
      <path d="M58 34 V26 H82 V34" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="34" y="34" width="72" height="46" rx="9" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
      <path d="M34 46 Q70 56 106 46" fill="none" stroke="#B45309" strokeWidth="3" />
      <rect x="64" y="46" width="12" height="8" rx="2" fill="#F7CA44" />
      {/* Gold Growth Star Seal */}
      <circle cx="96" cy="32" r="11" fill="#F7CA44" stroke="#B45309" strokeWidth="2" />
      <polygon points="96,24 98.5,29.5 104,30 100,34 101,39.5 96,36.5 91,39.5 92,34 88,30 93.5,29.5" fill="#26201C" />
    </svg>
  );
};

