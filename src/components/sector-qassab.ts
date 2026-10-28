import { BishtConfig } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

export class QassabController {
  private config: BishtConfig = {
    fabricType: 'summer-wool',
    darbowiyyah: 'malaki-royal',
    zariThread: 'pure-gold-24k',
    color: 'royal-black',
    heightCm: 160,
    shoulderWidthCm: 48,
    armLengthCm: 72,
    artisanMasterAr: 'شيخ الصاغة الحساوي - الأحساء التاريخية',
    artisanMasterEn: 'Master Artisan of Al-Ahsa Historic Quarter',
    productionHours: 180,
    totalPriceSar: 85000
  };

  private collarCanvas: HTMLCanvasElement | null = null;
  private collarCtx: CanvasRenderingContext2D | null = null;

  public init() {
    this.collarCanvas = document.getElementById('qassab-collar-canvas') as HTMLCanvasElement;
    if (this.collarCanvas) {
      this.collarCtx = this.collarCanvas.getContext('2d');
    }

    this.bindEvents();
    this.calculatePricing();
    this.renderCollar();
  }

  private bindEvents() {
    const fabricSelect = document.getElementById('qassab-fabric-select') as HTMLSelectElement;
    const darbSelect = document.getElementById('qassab-darb-select') as HTMLSelectElement;
    const zariSelect = document.getElementById('qassab-zari-select') as HTMLSelectElement;
    const colorSelect = document.getElementById('qassab-color-select') as HTMLSelectElement;
    const heightSlider = document.getElementById('qassab-height-slider') as HTMLInputElement;

    const onUpdate = () => {
      if (fabricSelect) this.config.fabricType = fabricSelect.value as BishtConfig['fabricType'];
      if (darbSelect) this.config.darbowiyyah = darbSelect.value as BishtConfig['darbowiyyah'];
      if (zariSelect) this.config.zariThread = zariSelect.value as BishtConfig['zariThread'];
      if (colorSelect) this.config.color = colorSelect.value as BishtConfig['color'];
      if (heightSlider) this.config.heightCm = parseInt(heightSlider.value, 10);

      this.calculatePricing();
      this.renderCollar();
      sound.playClick('subtle');
    };

    fabricSelect?.addEventListener('change', onUpdate);
    darbSelect?.addEventListener('change', onUpdate);
    zariSelect?.addEventListener('change', onUpdate);
    colorSelect?.addEventListener('change', onUpdate);
    heightSlider?.addEventListener('input', onUpdate);

    // Add to Vault
    const addVaultBtn = document.getElementById('qassab-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        const isAr = i18n.getLang() === 'ar';
        vault.addItem({
          sectorId: 'qassab',
          sectorNameAr: 'قَصّاب | البشت الحساوي',
          sectorNameEn: 'Qassab Royal Bisht Atelier',
          titleAr: `بشت حساوي ملكي - خياطة يد ${this.config.productionHours} ساعة`,
          titleEn: `Royal Hasawi Bisht - Handcrafted ${this.config.productionHours} Hours`,
          specSummaryAr: `القماش: ${this.config.fabricType} • الدربوية: ${this.config.darbowiyyah} • الزري: ${this.config.zariThread} • اللون: ${this.config.color}`,
          specSummaryEn: `Fabric: ${this.config.fabricType} • Darb: ${this.config.darbowiyyah} • Zari: ${this.config.zariThread} • Hue: ${this.config.color}`,
          estimatedValueSar: this.config.totalPriceSar
        });
      });
    }
  }

  private calculatePricing() {
    let base = 35000;
    if (this.config.fabricType === 'japanese-deluxe') base = 48000;
    if (this.config.fabricType === 'najfi-handmade') base = 65000;

    let darbAdd = 15000;
    if (this.config.darbowiyyah === 'malaki-royal') {
      darbAdd = 30000;
      this.config.productionHours = 220;
    } else if (this.config.darbowiyyah === 'mutawasa-refined') {
      darbAdd = 20000;
      this.config.productionHours = 160;
    } else {
      this.config.productionHours = 120;
    }

    let zariAdd = 10000;
    if (this.config.zariThread === 'pure-gold-24k') zariAdd = 35000;
    if (this.config.zariThread === 'german-18k-gold') zariAdd = 22000;

    this.config.totalPriceSar = base + darbAdd + zariAdd;

    // Update UI
    const priceEl = document.getElementById('qassab-price-val');
    const hoursEl = document.getElementById('qassab-hours-val');
    const heightEl = document.getElementById('qassab-height-val');

    if (priceEl) priceEl.textContent = `${this.config.totalPriceSar.toLocaleString('en-US')} SAR`;
    if (hoursEl) hoursEl.textContent = `${this.config.productionHours} ${i18n.getLang() === 'ar' ? 'ساعة يد' : 'Hours'}`;
    if (heightEl) heightEl.textContent = `${this.config.heightCm} cm`;
  }

  private renderCollar() {
    if (!this.collarCtx || !this.collarCanvas) return;
    const ctx = this.collarCtx;
    const w = this.collarCanvas.width;
    const h = this.collarCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Bisht Fabric Background
    let fabricBg = '#0b0c10'; // Royal black
    if (this.config.color === 'cream-oud') fabricBg = '#ede3d1';
    if (this.config.color === 'havana-camel') fabricBg = '#a2764b';
    if (this.config.color === 'midnight-navy') fabricBg = '#08172c';

    ctx.fillStyle = fabricBg;
    ctx.fillRect(0, 0, w, h);

    // Neck opening V-shape collar
    const cx = w / 2;
    const topY = 20;
    const bottomV = h - 25;

    // Gold Zari Metallic Gradient
    const goldGrad = ctx.createLinearGradient(0, topY, w, bottomV);
    if (this.config.zariThread === 'french-silver-gilt') {
      goldGrad.addColorStop(0, '#e2e8f0');
      goldGrad.addColorStop(0.5, '#f8fafc');
      goldGrad.addColorStop(1, '#94a3b8');
    } else {
      // 24k / 18k Pure Gold
      goldGrad.addColorStop(0, '#d97706');
      goldGrad.addColorStop(0.3, '#fbbf24');
      goldGrad.addColorStop(0.6, '#fef08a');
      goldGrad.addColorStop(1, '#b45309');
    }

    const darbWidth = this.config.darbowiyyah === 'malaki-royal' ? 36 : 24;

    // Left Collar Band
    ctx.beginPath();
    ctx.moveTo(cx - 100, topY);
    ctx.lineTo(cx - 100 + darbWidth, topY);
    ctx.lineTo(cx, bottomV);
    ctx.lineTo(cx - darbWidth, bottomV);
    ctx.closePath();
    ctx.fillStyle = goldGrad;
    ctx.fill();

    // Right Collar Band
    ctx.beginPath();
    ctx.moveTo(cx + 100, topY);
    ctx.lineTo(cx + 100 - darbWidth, topY);
    ctx.lineTo(cx, bottomV);
    ctx.lineTo(cx + darbWidth, bottomV);
    ctx.closePath();
    ctx.fillStyle = goldGrad;
    ctx.fill();

    // The Royal Heilah (الهيلة) medallion embroidery at center
    ctx.beginPath();
    ctx.arc(cx, bottomV - 10, 16, 0, Math.PI * 2);
    ctx.fillStyle = goldGrad;
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // The Burooj (البروج) traditional geometric stitch details
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.6)';
    ctx.lineWidth = 1;
    for (let y = topY + 15; y < bottomV - 30; y += 12) {
      const leftX = cx - 100 + ((y - topY) / (bottomV - topY)) * 100;
      const rightX = cx + 100 - ((y - topY) / (bottomV - topY)) * 100;

      ctx.beginPath();
      ctx.moveTo(leftX, y);
      ctx.lineTo(leftX + darbWidth - 6, y);
      ctx.moveTo(rightX, y);
      ctx.lineTo(rightX - darbWidth + 6, y);
      ctx.stroke();
    }
  }
}

export const qassabController = new QassabController();
