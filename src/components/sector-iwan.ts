import { RealEstateInvestment } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

export class IwanController {
  private config: RealEstateInvestment = {
    estateType: 'Sindalah-Water-Villa',
    acquisitionPriceSar: 68000000,
    downPaymentPercent: 40,
    downPaymentSar: 27200000,
    annualAppreciationRatePercent: 7.5,
    expectedAnnualGrossRentalSar: 5440000,
    operatingExpensesSar: 1020000,
    netRentalYieldPercent: 6.5,
    capRatePercent: 6.5,
    tenYearTotalRoiPercent: 172.5,
    tenYearProjectedValueSar: 140150000
  };

  private currentSkylinePhase: 'day' | 'sunset' | 'night' = 'night';

  public init() {
    this.bindEvents();
    this.calculateROI();
    this.applySkylineTheme();
  }

  private bindEvents() {
    const estateSelect = document.getElementById('iwan-estate-select') as HTMLSelectElement;
    const downpaySlider = document.getElementById('iwan-downpay-slider') as HTMLInputElement;

    const onUpdate = () => {
      if (estateSelect) {
        this.config.estateType = estateSelect.value as RealEstateInvestment['estateType'];
        if (this.config.estateType === 'Sindalah-Water-Villa') {
          this.config.acquisitionPriceSar = 68000000;
        } else if (this.config.estateType === 'Riyadh-Sky-Penthouse') {
          this.config.acquisitionPriceSar = 45000000;
        } else if (this.config.estateType === 'RedSea-Private-Island') {
          this.config.acquisitionPriceSar = 120000000;
        } else {
          this.config.acquisitionPriceSar = 52000000;
        }
      }
      if (downpaySlider) {
        this.config.downPaymentPercent = parseInt(downpaySlider.value, 10);
      }

      this.calculateROI();
      sound.playClick('subtle');
    };

    estateSelect?.addEventListener('change', onUpdate);
    downpaySlider?.addEventListener('input', onUpdate);

    // Skyline view toggles
    const phaseButtons = document.querySelectorAll<HTMLButtonElement>('.iwan-phase-btn');
    phaseButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        phaseButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSkylinePhase = (btn.dataset.phase as 'day' | 'sunset' | 'night') || 'night';
        this.applySkylineTheme();
        sound.playClick('subtle');
      });
    });

    // Add to Vault
    const addVaultBtn = document.getElementById('iwan-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        const isAr = i18n.getLang() === 'ar';
        vault.addItem({
          sectorId: 'iwan',
          sectorNameAr: 'إِيـوان | العقارات السيادية',
          sectorNameEn: 'Iwan Ultra-Luxury Estates',
          titleAr: `استحواذ عقاري: ${this.config.estateType}`,
          titleEn: `Trophy Asset: ${this.config.estateType}`,
          specSummaryAr: `الاستحواذ: ${this.config.acquisitionPriceSar.toLocaleString('en-US')} ر.س • العائد الصافي: ${this.config.netRentalYieldPercent}% • العائد التراكمي لـ 10 سنوات: ${this.config.tenYearTotalRoiPercent}%`,
          specSummaryEn: `Acquisition: ${this.config.acquisitionPriceSar.toLocaleString('en-US')} SAR • Net Yield: ${this.config.netRentalYieldPercent}% • 10-Year ROI: ${this.config.tenYearTotalRoiPercent}%`,
          estimatedValueSar: this.config.acquisitionPriceSar
        });
      });
    }
  }

  private calculateROI() {
    const price = this.config.acquisitionPriceSar;
    const downPercent = this.config.downPaymentPercent / 100;
    this.config.downPaymentSar = Math.round(price * downPercent);

    // Yield logic
    const grossYieldRate = 0.08; // 8% gross
    this.config.expectedAnnualGrossRentalSar = Math.round(price * grossYieldRate);
    this.config.operatingExpensesSar = Math.round(price * 0.015); // 1.5% opex
    const netRentalSar = this.config.expectedAnnualGrossRentalSar - this.config.operatingExpensesSar;

    this.config.netRentalYieldPercent = parseFloat(((netRentalSar / price) * 100).toFixed(1));
    this.config.capRatePercent = this.config.netRentalYieldPercent;

    // 10-Year Compound Capital Appreciation (7.5% per year)
    const appreciationRate = this.config.annualAppreciationRatePercent / 100;
    const compoundGrowth = Math.pow(1 + appreciationRate, 10);
    this.config.tenYearProjectedValueSar = Math.round(price * compoundGrowth);

    // Total 10-year cumulative return (10 years net rent + capital appreciation)
    const tenYearTotalIncome = netRentalSar * 10;
    const capitalGain = this.config.tenYearProjectedValueSar - price;
    this.config.tenYearTotalRoiPercent = parseFloat((((tenYearTotalIncome + capitalGain) / price) * 100).toFixed(1));

    // Update UI
    const priceEl = document.getElementById('iwan-price-val');
    const downpayEl = document.getElementById('iwan-downpay-val');
    const yieldEl = document.getElementById('iwan-yield-val');
    const caprateEl = document.getElementById('iwan-caprate-val');
    const roiEl = document.getElementById('iwan-roi-val');
    const projEl = document.getElementById('iwan-proj-val');

    if (priceEl) priceEl.textContent = `${price.toLocaleString('en-US')} SAR`;
    if (downpayEl) downpayEl.textContent = `${this.config.downPaymentPercent}% (${this.config.downPaymentSar.toLocaleString('en-US')} SAR)`;
    if (yieldEl) yieldEl.textContent = `${this.config.netRentalYieldPercent}%`;
    if (caprateEl) caprateEl.textContent = `${this.config.capRatePercent}%`;
    if (roiEl) roiEl.textContent = `+${this.config.tenYearTotalRoiPercent}%`;
    if (projEl) projEl.textContent = `${this.config.tenYearProjectedValueSar.toLocaleString('en-US')} SAR`;
  }

  private applySkylineTheme() {
    const skylineBox = document.getElementById('iwan-skyline-box');
    if (!skylineBox) return;

    skylineBox.className = `skyline-simulator phase-${this.currentSkylinePhase}`;
  }
}

export const iwanController = new IwanController();
