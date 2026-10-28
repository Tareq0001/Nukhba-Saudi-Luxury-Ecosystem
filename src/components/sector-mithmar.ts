import { HypercarConfig } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

export class MithmarController {
  private config: HypercarConfig = {
    model: 'Thuraya-V12',
    rpm: 4200,
    horsepower: 920,
    torqueNm: 860,
    acceleration0to100: 2.7,
    topSpeedKmH: 395,
    paintColor: { nameAr: 'أسود الثريا البركاني', nameEn: 'Obsidian Black Gloss', hex: '#0a0a0c', finish: 'gloss' },
    carbonPackage: 'exposed-twill',
    wheels: 'forged-gold-22',
    aeroActiveWing: true,
    basePriceSar: 12500000,
    optionsTotalSar: 1200000
  };

  private dynoCanvas: HTMLCanvasElement | null = null;
  private dynoCtx: CanvasRenderingContext2D | null = null;
  private carPreviewSvg: SVGElement | null = null;

  public init() {
    this.dynoCanvas = document.getElementById('mithmar-dyno-canvas') as HTMLCanvasElement;
    if (this.dynoCanvas) {
      this.dynoCtx = this.dynoCanvas.getContext('2d');
    }
    this.carPreviewSvg = document.getElementById('mithmar-car-svg') as unknown as SVGElement;

    this.bindEvents();
    this.calculateTelemetry();
    this.renderDynoCurve();
    this.renderCarVisual();
  }

  private bindEvents() {
    const rpmSlider = document.getElementById('mithmar-rpm-slider') as HTMLInputElement;
    if (rpmSlider) {
      rpmSlider.addEventListener('input', () => {
        this.config.rpm = parseInt(rpmSlider.value, 10);
        this.calculateTelemetry();
        this.renderDynoCurve();
        sound.updateEngineRpm(this.config.rpm);
      });
    }

    // Rev Engine Button (Mouse & Touch hold)
    const revBtn = document.getElementById('mithmar-rev-btn');
    if (revBtn) {
      const startRev = (e: Event) => {
        e.preventDefault();
        sound.startEngineRev(this.config.rpm);
        revBtn.classList.add('active-rev');
      };
      const stopRev = (e: Event) => {
        e.preventDefault();
        sound.stopEngineRev();
        revBtn.classList.remove('active-rev');
      };

      revBtn.addEventListener('mousedown', startRev);
      revBtn.addEventListener('mouseup', stopRev);
      revBtn.addEventListener('mouseleave', stopRev);
      revBtn.addEventListener('touchstart', startRev, { passive: false });
      revBtn.addEventListener('touchend', stopRev, { passive: false });
    }

    // Model Selector
    const modelSelect = document.getElementById('mithmar-model-select') as HTMLSelectElement;
    if (modelSelect) {
      modelSelect.addEventListener('change', () => {
        this.config.model = modelSelect.value as HypercarConfig['model'];
        if (this.config.model === 'Thuraya-V12') {
          this.config.basePriceSar = 12500000;
        } else if (this.config.model === 'Sahra-GT') {
          this.config.basePriceSar = 9800000;
        } else {
          this.config.basePriceSar = 14200000;
        }
        this.calculateTelemetry();
        this.renderDynoCurve();
        this.renderCarVisual();
        sound.playClick('subtle');
      });
    }

    // Paint Palette Buttons
    const paintButtons = document.querySelectorAll<HTMLButtonElement>('.mithmar-paint-btn');
    paintButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        paintButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const hex = btn.dataset.hex || '#0a0a0c';
        const nameAr = btn.dataset.nameAr || 'مخصص';
        const nameEn = btn.dataset.nameEn || 'Custom';
        this.config.paintColor = { nameAr, nameEn, hex, finish: 'gloss' };
        this.renderCarVisual();
        sound.playClick('subtle');
      });
    });

    // Carbon Package
    const carbonSelect = document.getElementById('mithmar-carbon-select') as HTMLSelectElement;
    if (carbonSelect) {
      carbonSelect.addEventListener('change', () => {
        this.config.carbonPackage = carbonSelect.value as HypercarConfig['carbonPackage'];
        this.renderCarVisual();
        sound.playClick('subtle');
      });
    }

    // Wheels
    const wheelsSelect = document.getElementById('mithmar-wheels-select') as HTMLSelectElement;
    if (wheelsSelect) {
      wheelsSelect.addEventListener('change', () => {
        this.config.wheels = wheelsSelect.value as HypercarConfig['wheels'];
        this.renderCarVisual();
        sound.playClick('subtle');
      });
    }

    // Aero Toggle
    const aeroToggle = document.getElementById('mithmar-aero-toggle') as HTMLInputElement;
    if (aeroToggle) {
      aeroToggle.addEventListener('change', () => {
        this.config.aeroActiveWing = aeroToggle.checked;
        this.calculateTelemetry();
        this.renderCarVisual();
        sound.playClick('subtle');
      });
    }

    // Add to Vault Button
    const addVaultBtn = document.getElementById('mithmar-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        const isAr = i18n.getLang() === 'ar';
        const total = this.config.basePriceSar + this.config.optionsTotalSar;
        vault.addItem({
          sectorId: 'mithmar',
          sectorNameAr: 'مِـضْـمار | هايبركار',
          sectorNameEn: 'Mithmar Hypercar Atelier',
          titleAr: `هايبركار ${this.config.model} - محرك V12`,
          titleEn: `Hypercar ${this.config.model} - Naturally Aspirated V12`,
          specSummaryAr: `القدرة: ${this.config.horsepower} حصان • العزم: ${this.config.torqueNm} نيوتن.متر • السرعة: ${this.config.topSpeedKmH} كم/س • لون الطلاء: ${this.config.paintColor.nameAr}`,
          specSummaryEn: `Power: ${this.config.horsepower} BHP • Torque: ${this.config.torqueNm} Nm • Top Speed: ${this.config.topSpeedKmH} km/h • Finish: ${this.config.paintColor.nameEn}`,
          estimatedValueSar: total
        });
      });
    }
  }

  private calculateTelemetry() {
    const rpm = this.config.rpm;
    let basePeakHp = 950;
    let basePeakTorque = 880;

    if (this.config.model === 'Sahra-GT') {
      basePeakHp = 840;
      basePeakTorque = 790;
    } else if (this.config.model === 'Najd-Aero') {
      basePeakHp = 1080;
      basePeakTorque = 940;
    }

    // Thermodynamic Torque curve (bell-shaped peak around 6200 RPM)
    const normalizedRpm = (rpm - 1000) / 8000;
    const torqueCurve = Math.sin(normalizedRpm * Math.PI * 0.95 + 0.15);
    this.config.torqueNm = Math.round(basePeakTorque * Math.max(0.45, torqueCurve));

    // Horsepower calculation: (Torque * RPM) / 7120 for metric HP
    this.config.horsepower = Math.round((this.config.torqueNm * rpm) / 5800);

    // Dynamic aero sprint
    const aeroBonus = this.config.aeroActiveWing ? 0.2 : 0;
    const modelWeightFactor = this.config.model === 'Najd-Aero' ? 2.5 : 2.7;
    this.config.acceleration0to100 = parseFloat((modelWeightFactor - aeroBonus).toFixed(2));

    // Top Speed
    const topSpeedBase = this.config.model === 'Najd-Aero' ? 418 : 395;
    this.config.topSpeedKmH = this.config.aeroActiveWing ? topSpeedBase : topSpeedBase - 12;

    // Update UI numbers
    const hpEl = document.getElementById('mithmar-hp-val');
    const torqueEl = document.getElementById('mithmar-torque-val');
    const accelEl = document.getElementById('mithmar-accel-val');
    const speedEl = document.getElementById('mithmar-speed-val');
    const rpmDisplay = document.getElementById('mithmar-rpm-display');
    const priceEl = document.getElementById('mithmar-price-val');

    if (hpEl) hpEl.textContent = `${this.config.horsepower} BHP`;
    if (torqueEl) torqueEl.textContent = `${this.config.torqueNm} Nm`;
    if (accelEl) accelEl.textContent = `${this.config.acceleration0to100} s`;
    if (speedEl) speedEl.textContent = `${this.config.topSpeedKmH} km/h`;
    if (rpmDisplay) rpmDisplay.textContent = `${rpm.toLocaleString('en-US')} RPM`;

    const totalSar = this.config.basePriceSar + this.config.optionsTotalSar;
    if (priceEl) priceEl.textContent = `${totalSar.toLocaleString('en-US')} SAR`;
  }

  private renderDynoCurve() {
    if (!this.dynoCtx || !this.dynoCanvas) return;
    const ctx = this.dynoCtx;
    const w = this.dynoCanvas.width;
    const h = this.dynoCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h - 20);
      ctx.stroke();
    }
    for (let y = 20; y < h - 20; y += 30) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Torque Curve (Amber)
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    for (let r = 1000; r <= 9000; r += 100) {
      const x = 40 + ((r - 1000) / 8000) * (w - 60);
      const norm = (r - 1000) / 8000;
      const torque = Math.sin(norm * Math.PI * 0.95 + 0.15) * 880;
      const y = h - 25 - (torque / 1100) * (h - 45);
      if (r === 1000) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // HP Curve (Cyan)
    ctx.beginPath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    for (let r = 1000; r <= 9000; r += 100) {
      const x = 40 + ((r - 1000) / 8000) * (w - 60);
      const norm = (r - 1000) / 8000;
      const torque = Math.sin(norm * Math.PI * 0.95 + 0.15) * 880;
      const hp = (torque * r) / 5800;
      const y = h - 25 - (hp / 1200) * (h - 45);
      if (r === 1000) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Current RPM indicator line
    const curX = 40 + ((this.config.rpm - 1000) / 8000) * (w - 60);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.moveTo(curX, 10);
    ctx.lineTo(curX, h - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Operating point dots
    const curTorqueY = h - 25 - (this.config.torqueNm / 1100) * (h - 45);
    ctx.beginPath();
    ctx.arc(curX, curTorqueY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    const curHpY = h - 25 - (this.config.horsepower / 1200) * (h - 45);
    ctx.beginPath();
    ctx.arc(curX, curHpY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.fill();
  }

  private renderCarVisual() {
    if (!this.carPreviewSvg) return;
    const bodyPath = this.carPreviewSvg.querySelector('#car-body-path') as SVGPathElement;
    const wingPath = this.carPreviewSvg.querySelector('#car-wing-path') as SVGPathElement;
    const wheelFront = this.carPreviewSvg.querySelector('#car-wheel-front') as SVGCircleElement;
    const wheelRear = this.carPreviewSvg.querySelector('#car-wheel-rear') as SVGCircleElement;

    if (bodyPath) {
      bodyPath.style.fill = this.config.paintColor.hex;
      if (this.config.carbonPackage === 'forged-composite') {
        bodyPath.style.stroke = '#555';
        bodyPath.style.strokeWidth = '1.5';
      } else {
        bodyPath.style.stroke = '#f59e0b';
        bodyPath.style.strokeWidth = '0.5';
      }
    }

    if (wingPath) {
      if (this.config.aeroActiveWing) {
        wingPath.style.transform = 'translateY(-10px) rotate(-6deg)';
        wingPath.style.opacity = '1';
      } else {
        wingPath.style.transform = 'translateY(0px) rotate(0deg)';
        wingPath.style.opacity = '0.6';
      }
    }

    const rimColor = this.config.wheels === 'forged-gold-22' ? '#f59e0b' : this.config.wheels === 'aero-blade-carbon' ? '#333333' : '#a1a1aa';
    if (wheelFront) wheelFront.style.stroke = rimColor;
    if (wheelRear) wheelRear.style.stroke = rimColor;
  }
}

export const mithmarController = new MithmarController();
