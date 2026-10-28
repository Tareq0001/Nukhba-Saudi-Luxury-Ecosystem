import { WatchConfig } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

export class MiqatController {
  private config: WatchConfig = {
    caliber: 'Calibre-9150-Tourbillon',
    caseMaterial: 'Platinum-950',
    dialPattern: 'Muonionalusta-Meteorite',
    complications: ['60-Second Flying Tourbillon', 'Perpetual Calendar', 'Moonphase'],
    strap: 'Alligator-Black',
    oscillationHz: 4, // 28,800 vph
    coscReadings: {
      dialUp: 0.8,
      dialDown: -0.4,
      crownUp: 1.2,
      crownDown: -0.2,
      crownLeft: 0.6,
      deltaMax: 1.6,
      meanDailyRate: 0.4,
      passed: true
    },
    totalPriceSar: 1850000
  };

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animId: number = 0;
  private balanceAngle: number = 0;
  private balanceVelocity: number = 0;
  private escapeWheelAngle: number = 0;
  private anchorAngle: number = 0;
  private lastTickTime: number = 0;
  private tickToggle: boolean = false;
  private audioTickEnabled: boolean = false;

  public init() {
    this.canvas = document.getElementById('miqat-escapement-canvas') as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }

    this.bindEvents();
    this.startSimulation();
    this.updatePrice();
  }

  private bindEvents() {
    // Caliber selection
    const caliberSelect = document.getElementById('miqat-caliber-select') as HTMLSelectElement;
    if (caliberSelect) {
      caliberSelect.addEventListener('change', () => {
        this.config.caliber = caliberSelect.value as WatchConfig['caliber'];
        this.updatePrice();
        sound.playClick('subtle');
      });
    }

    // Case selection
    const caseSelect = document.getElementById('miqat-case-select') as HTMLSelectElement;
    if (caseSelect) {
      caseSelect.addEventListener('change', () => {
        this.config.caseMaterial = caseSelect.value as WatchConfig['caseMaterial'];
        this.updatePrice();
        sound.playClick('subtle');
      });
    }

    // Dial selection
    const dialSelect = document.getElementById('miqat-dial-select') as HTMLSelectElement;
    if (dialSelect) {
      dialSelect.addEventListener('change', () => {
        this.config.dialPattern = dialSelect.value as WatchConfig['dialPattern'];
        this.updatePrice();
        sound.playClick('subtle');
      });
    }

    // Strap selection
    const strapSelect = document.getElementById('miqat-strap-select') as HTMLSelectElement;
    if (strapSelect) {
      strapSelect.addEventListener('change', () => {
        this.config.strap = strapSelect.value as WatchConfig['strap'];
        this.updatePrice();
        sound.playClick('subtle');
      });
    }

    // Audio Tick Toggle
    const tickToggleBtn = document.getElementById('miqat-tick-sound-btn');
    if (tickToggleBtn) {
      tickToggleBtn.addEventListener('click', () => {
        this.audioTickEnabled = !this.audioTickEnabled;
        tickToggleBtn.classList.toggle('active', this.audioTickEnabled);
        sound.playClick('subtle');
      });
    }

    // Add to Vault
    const addVaultBtn = document.getElementById('miqat-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        vault.addItem({
          sectorId: 'miqat',
          sectorNameAr: 'مِـيقات | الساعات الراقية',
          sectorNameEn: 'Miqat Haute Horlogerie',
          titleAr: `كرونومتر ${this.config.caliber} - ${this.config.caseMaterial}`,
          titleEn: `Chronometer ${this.config.caliber} - ${this.config.caseMaterial}`,
          specSummaryAr: `الميناء: ${this.config.dialPattern} • الدقة: معتمدة COSC (+${this.config.coscReadings.meanDailyRate} ث/يوم) • السوار: ${this.config.strap}`,
          specSummaryEn: `Dial: ${this.config.dialPattern} • Precision: COSC Certified (+${this.config.coscReadings.meanDailyRate} s/d) • Strap: ${this.config.strap}`,
          estimatedValueSar: this.config.totalPriceSar
        });
      });
    }
  }

  private updatePrice() {
    let base = 1200000;
    if (this.config.caliber === 'Calibre-9150-Tourbillon') base = 1850000;
    if (this.config.caliber === 'Calibre-700-Perpetual') base = 1450000;

    let caseAdd = 0;
    if (this.config.caseMaterial === 'Platinum-950') caseAdd = 450000;
    if (this.config.caseMaterial === 'Rose-Gold-18k') caseAdd = 280000;

    let dialAdd = 0;
    if (this.config.dialPattern === 'Muonionalusta-Meteorite') dialAdd = 180000;
    if (this.config.dialPattern === 'Sunburst-Obsidian') dialAdd = 90000;

    this.config.totalPriceSar = base + caseAdd + dialAdd;
    const priceEl = document.getElementById('miqat-price-val');
    if (priceEl) {
      priceEl.textContent = `${this.config.totalPriceSar.toLocaleString('en-US')} SAR`;
    }
  }

  private startSimulation() {
    const loop = (timestamp: number) => {
      this.updatePhysics(timestamp);
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  private updatePhysics(timestamp: number) {
    // 4Hz oscillation = 8 beats per second (28,800 vph)
    // T = 0.25 s per cycle -> omega = 2 * PI * 4 = ~25.13 rad/s
    const t = timestamp * 0.001;
    const amplitude = 1.35; // radians (~77 degrees)
    this.balanceAngle = amplitude * Math.sin(t * Math.PI * 8);

    // Anchor rocks synchronously with balance wheel passing through center
    this.anchorAngle = 0.22 * Math.sin(t * Math.PI * 8);

    // Escape wheel advances in discrete steps at zero-crossings
    if (timestamp - this.lastTickTime > 125) {
      this.escapeWheelAngle += (Math.PI * 2) / 30; // 15 teeth = 30 impulse steps
      this.lastTickTime = timestamp;
      this.tickToggle = !this.tickToggle;

      if (this.audioTickEnabled) {
        sound.playEscapementTick(this.tickToggle);
      }
    }
  }

  private render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Outer Movement Brass / Anthracite Plate
    ctx.beginPath();
    ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();

    // Subtle Geneva Stripes (Côtes de Genève)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 6;
    for (let x = centerX - 120; x <= centerX + 120; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, centerY - 125);
      ctx.lineTo(x, centerY + 125);
      ctx.stroke();
    }

    // 1. Draw Escape Wheel (Lower layer)
    ctx.save();
    ctx.translate(centerX - 45, centerY + 40);
    ctx.rotate(this.escapeWheelAngle);
    this.drawEscapeWheel(ctx);
    ctx.restore();

    // 2. Draw Anchor & Pallets (Middle layer)
    ctx.save();
    ctx.translate(centerX - 10, centerY + 10);
    ctx.rotate(this.anchorAngle);
    this.drawAnchor(ctx);
    ctx.restore();

    // 3. Draw Balance Wheel & Hairspring (Top layer)
    ctx.save();
    ctx.translate(centerX + 35, centerY - 25);
    ctx.rotate(this.balanceAngle);
    this.drawBalanceWheel(ctx);
    this.drawHairspring(ctx, this.balanceAngle);
    ctx.restore();

    // Rubies / Jewels
    this.drawJewel(ctx, centerX + 35, centerY - 25);
    this.drawJewel(ctx, centerX - 10, centerY + 10);
    this.drawJewel(ctx, centerX - 45, centerY + 40);
  }

  private drawBalanceWheel(ctx: CanvasRenderingContext2D) {
    const r = 52;
    // Outer Rim
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#f59e0b'; // 24k Gold rim
    ctx.stroke();

    // 3 Spokes
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();
    }

    // Regulating Screws along the rim
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const x = Math.cos(angle) * (r + 3);
      const y = Math.sin(angle) * (r + 3);
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff'; // Blued titanium screws
      ctx.fill();
    }
  }

  private drawHairspring(ctx: CanvasRenderingContext2D, twistAngle: number) {
    ctx.beginPath();
    const coils = 5;
    const points = 120;
    const baseSpacing = 3.8 + twistAngle * 0.4;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (coils * Math.PI * 2);
      const r = (theta / (coils * Math.PI * 2)) * (baseSpacing * coils);
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#00f0ff'; // Blued steel spring
    ctx.stroke();
  }

  private drawEscapeWheel(ctx: CanvasRenderingContext2D) {
    const r = 38;
    const teeth = 15;
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = (i * Math.PI * 2) / teeth;
      const aNext = a + (Math.PI * 2) / (teeth * 2);
      const xOuter = Math.cos(a) * r;
      const yOuter = Math.sin(a) * r;
      const xInner = Math.cos(aNext) * (r - 9);
      const yInner = Math.sin(aNext) * (r - 9);

      if (i === 0) ctx.moveTo(xOuter, yOuter);
      ctx.lineTo(xOuter, yOuter);
      ctx.lineTo(xInner, yInner);
    }
    ctx.closePath();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#d97706';
    ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
    ctx.fill();
    ctx.stroke();
  }

  private drawAnchor(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(0, 18);
    ctx.moveTo(-16, -10);
    ctx.lineTo(0, -2);
    ctx.lineTo(16, -10);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // Synthetic Ruby Pallets
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-18, -12, 4, 6);
    ctx.fillRect(14, -12, 4, 6);
  }

  private drawJewel(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e'; // Synthetic red ruby
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#fbbf24'; // Gold chaton
    ctx.stroke();
  }

  public destroy() {
    cancelAnimationFrame(this.animId);
  }
}

export const miqatController = new MiqatController();
