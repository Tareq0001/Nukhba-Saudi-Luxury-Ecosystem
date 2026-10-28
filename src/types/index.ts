// ==========================================
// NUKHBA | Sovereign Luxury Ecosystem Types
// Creator & Lead Architect: أ. طارق ابوعشي
// ==========================================

export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';

export interface SectorMeta {
  id: string;
  number: string;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  accentColor: string;
  glowColor: string;
  bgGradient: string;
}

export interface VaultItem {
  id: string;
  sectorId: string;
  sectorNameAr: string;
  sectorNameEn: string;
  titleAr: string;
  titleEn: string;
  specSummaryAr: string;
  specSummaryEn: string;
  estimatedValueSar: number;
  timestamp: string;
  referenceNo: string;
}

// 1. Mithmar Hypercar Atelier
export interface HypercarConfig {
  model: 'Thuraya-V12' | 'Sahra-GT' | 'Najd-Aero';
  rpm: number;
  horsepower: number;
  torqueNm: number;
  acceleration0to100: number;
  topSpeedKmH: number;
  paintColor: { nameAr: string; nameEn: string; hex: string; finish: 'gloss' | 'matte' | 'carbon' };
  carbonPackage: 'standard' | 'exposed-twill' | 'forged-composite';
  wheels: 'monoblock-21' | 'aero-blade-carbon' | 'forged-gold-22';
  aeroActiveWing: boolean;
  basePriceSar: number;
  optionsTotalSar: number;
}

// 2. Miqat Haute Horlogerie
export interface WatchConfig {
  caliber: 'Calibre-9150-Tourbillon' | 'Calibre-700-Perpetual' | 'Calibre-330-Chronometer';
  caseMaterial: 'Platinum-950' | 'Rose-Gold-18k' | 'Titanium-Grade-5';
  dialPattern: 'Clous-de-Paris' | 'Muonionalusta-Meteorite' | 'Sunburst-Obsidian';
  complications: string[];
  strap: 'Alligator-Black' | 'Titanium-Bracelet' | 'Sovereign-Gold-Mesh';
  oscillationHz: number;
  coscReadings: {
    dialUp: number;
    dialDown: number;
    crownUp: number;
    crownDown: number;
    crownLeft: number;
    deltaMax: number;
    meanDailyRate: number;
    passed: boolean;
  };
  totalPriceSar: number;
}

// 3. Sanbouk Superyacht Charter
export interface SuperyachtCharter {
  yachtModel: 'Sultan-85m' | 'Sindalah-65m' | 'Al-Bahr-52m';
  departurePort: string;
  destinationPort: string;
  durationDays: number;
  nauticalMiles: number;
  cruisingKnots: number;
  guestsCount: number;
  fuelBurnLiters: number;
  fuelCostSar: number;
  berthingFeesSar: number;
  charterBaseFeeSar: number;
  vipCateringTier: 'Royal-Chef' | 'Michelin-Sea' | 'Bespoke-Gourmet';
  totalCharterCostSar: number;
}

// 4. Aseel Royal Arabian Stud & Auction
export interface ArabianHorse {
  id: string;
  nameAr: string;
  nameEn: string;
  strain: 'Saklawi' | 'Kehilan' | 'Abeyyan' | 'Hadban';
  sire: string;
  dam: string;
  grandSireSire: string;
  grandDamSire: string;
  birthYear: number;
  microchipId: string;
  startingPriceSar: number;
  currentBidSar: number;
  bidsCount: number;
  timeLeftSeconds: number;
  status: 'live' | 'sold' | 'upcoming';
  imageUri: string;
}

// 5. Zumurrud Haute Joaillerie
export interface DiamondConfig {
  shape: 'Round-Brilliant' | 'Emerald-Cut' | 'Cushion-Royal' | 'Pear-Shape';
  carat: number; // 0.50 to 15.00
  color: 'D' | 'E' | 'F' | 'G' | 'H';
  clarity: 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1';
  cutGrade: 'Excellent' | 'Ideal';
  setting: 'Royal-Solitaire' | 'Crown-Halo' | 'Three-Stone-Trilogy' | 'Pave-Obsidian';
  metal: 'Platinum-950' | '18k-Yellow-Gold' | '18k-Rose-Gold';
  diamondValueSar: number;
  settingValueSar: number;
  totalAppraisalSar: number;
}

// 6. Shaheen Royal Falconry
export interface FalconPassport {
  passportNo: string;
  falconNameAr: string;
  falconNameEn: string;
  speciesAr: string;
  speciesEn: string;
  wingSpanCm: number;
  weightGrams: number;
  maxDiveSpeedKmH: number;
  gForceMax: number;
  ringSerial: string;
  biometricId: string;
  expeditionTier: 'Royal-RubAlKhali' | 'AlUla-Sanctuary' | 'Nafud-HighSpeed';
  expeditionCostSar: number;
}

// 7. Qassab Royal Bisht Atelier
export interface BishtConfig {
  fabricType: 'summer-wool' | 'japanese-deluxe' | 'najfi-handmade';
  darbowiyyah: 'malaki-royal' | 'mutawasa-refined' | 'mukhmas-heritage';
  zariThread: 'german-18k-gold' | 'french-silver-gilt' | 'pure-gold-24k';
  color: 'royal-black' | 'cream-oud' | 'havana-camel' | 'midnight-navy';
  heightCm: number;
  shoulderWidthCm: number;
  armLengthCm: number;
  artisanMasterAr: string;
  artisanMasterEn: string;
  productionHours: number;
  totalPriceSar: number;
}

// 8. Maaedah Haute Gastronomy
export interface GastronomyBooking {
  tableZone: 'Royal-Sovereign-Booth' | 'Master-Chef-Counter' | 'Al-Majlis-Salon';
  selectedDate: string;
  timeSlot: string;
  guestCount: number;
  courseSelections: {
    amuseBouche: string;
    coldStarter: string;
    warmEntree: string;
    seaCatch: string;
    mainCut: string;
    preDessert: string;
    grandFinale: string;
  };
  dietaryRestrictions: string[];
  sensoryProfile: {
    umami: number;
    sweet: number;
    salt: number;
    acidity: number;
    aroma: number;
    texture: number;
  };
  totalTastingCostSar: number;
  ticketSecurityCode: string;
}

// 9. Atheer Private Aviation
export interface AviationCharter {
  aircraftModel: 'Gulfstream-G700' | 'Bombardier-Global-7500' | 'Dassault-Falcon-10X';
  originCity: string;
  destinationCity: string;
  passengerCount: number;
  distanceKm: number;
  flightDurationHours: number;
  cruiseSpeedMach: number;
  fuelBurnLiters: number;
  hourlyRateSar: number;
  handlingFeesSar: number;
  totalCharterSar: number;
  vipLoungeAccess: boolean;
}

// 10. Iwan Ultra-Luxury Estates
export interface RealEstateInvestment {
  estateType: 'Sindalah-Water-Villa' | 'Riyadh-Sky-Penthouse' | 'RedSea-Private-Island' | 'AlUla-Canyon-Estate';
  acquisitionPriceSar: number;
  downPaymentPercent: number;
  downPaymentSar: number;
  annualAppreciationRatePercent: number;
  expectedAnnualGrossRentalSar: number;
  operatingExpensesSar: number;
  netRentalYieldPercent: number;
  capRatePercent: number;
  tenYearTotalRoiPercent: number;
  tenYearProjectedValueSar: number;
}
