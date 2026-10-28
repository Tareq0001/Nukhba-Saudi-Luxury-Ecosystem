import { DiamondConfig } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

export class ZumurrudController {
  private config: DiamondConfig = {
    shape: 'Round-Brilliant',
    carat: 3.5,
    color: 'D',
    clarity: 'FL',
    cutGrade: 'Ideal',
    setting: 'Royal-Solitaire',
    metal: 'Platinum-950',
    diamondValueSar: 680000,
    settingValueSar: 45000,
    totalAppraisalSar: 725000
  };

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animId: number = 0;
  private mouseX: number = 150;
  private mouseY: number = 150;

  public init() {
    this.canvas = document.getElementById('zumurrud-dispersion-canvas') as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }

    this.bindEvents();
    this.calculateValuation();
    this.startDispersionAnimation();
  }

  private bindEvents() {
    const caratSlider = document.getElementById('zumurrud-carat-slider') as HTMLInputElement;
    const colorSelect = document.getElementById('zumurrud-color-select') as HTMLSelectElement;
    const claritySelect = document.getElementById('zumurrud-clarity-select') as HTMLSelectElement;
    const cutSelect = document.getElementById('zumurrud-cut-select') as HTMLSelectElement;
    const metalSelect = document.getElementById('zumurrud-metal-select') as HTMLSelectElement;
    const settingSelect = document.getElementById('zumurrud-setting-select') as HTMLSelectElement;

    const onUpdate = () => {
      if (caratSlider) this.config.carat = parseFloat(caratSlider.value);
      if (colorSelect) this.config.color = colorSelect.value as DiamondConfig['color'];
      if (claritySelect) this.config.clarity = claritySelect.value as DiamondConfig['clarity'];
      if (cutSelect) this.config.cutGrade = cutSelect.value as DiamondConfig['cutGrade'];
      if (metalSelect) this.config.metal = metalSelect.value as DiamondConfig['metal'];
      if (settingSelect) this.config.setting = settingSelect.value as DiamondConfig['setting'];

      this.calculateValuation();
      sound.playClick('subtle');
    };

    caratSlider?.addEventListener('input', onUpdate);
    colorSelect?.addEventListener('change', onUpdate);
    claritySelect?.addEventListener('change', onUpdate);
    cutSelect?.addEventListener('change', onUpdate);
    metalSelect?.addEventListener('change', onUpdate);
    settingSelect?.addEventListener('change', onUpdate);

    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas!.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
      });
    }

    // Add to Vault
    const addVaultBtn = document.getElementById('zumurrud-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        const isAr = i18n.getLang() === 'ar';
        vault.addItem({
          sectorId: 'zumurrud',
          sectorNameAr: 'زُمُـرّد | الألماس والمجوهرات',
          sectorNameEn: 'Zumurrud Haute Joaillerie',
          titleAr: `ألماس حر ${this.config.carat} قيراط - صياغة ${this.config.metal}`,
          titleEn: `Investment Diamond ${this.config.carat}ct - Mounting ${this.config.metal}`,
          specSummaryAr: `اللون: ${this.config.color} • النقاء: ${this.config.clarity} • القطع: ${this.config.cutGrade} • التركيب: ${this.config.setting}`,
          specSummaryEn: `Color: ${this.config.color} • Clarity: ${this.config.clarity} • Cut: ${this.config.cutGrade} • Setting: ${this.config.setting}`,
          estimatedValueSar: this.config.totalAppraisalSar
        });
      });
    }
  }

  private calculateValuation() {
    // Non-linear carat pricing curve (price per carat increases quadratically with size!)
    const carat = this.config.carat;
    let basePerCarat = 45000;

    // Color multiplier
    const colorMultipliers: Record<string, number> = { D: 1.45, E: 1.28, F: 1.15, G: 1.0, H: 0.88 };
    const colorFactor = colorMultipliers[this.config.color] || 1.0;

    // Clarity multiplier
    const clarityMultipliers: Record<string, number> = { FL: 1.6, IF: 1.4, VVS1: 1.25, VVS2: 1.12, VS1: 1.0 };
    const clarityFactor = clarityMultipliers[this.config.clarity] || 1.0;

    // Cut multiplier
    const cutFactor = this.config.cutGrade === 'Ideal' ? 1.15 : 1.0;

    // Quadratic carat scaling: e.g. 1ct = 45k, 3ct = 3 * 45k * 2.2 = 300k, 10ct = 10 * 45k * 4.5 = 2.0M
    const caratScale = Math.pow(carat, 1.38);
    this.config.diamondValueSar = Math.round(caratScale * basePerCarat * colorFactor * clarityFactor * cutFactor);

    // Setting value
    let settingPrice = 35000;
    if (this.config.metal === 'Platinum-950') settingPrice += 15000;
    if (this.config.setting === 'Three-Stone-Trilogy') settingPrice += 28000;
    if (this.config.setting === 'Crown-Halo') settingPrice += 18000;
    this.config.settingValueSar = settingPrice;

    this.config.totalAppraisalSar = this.config.diamondValueSar + this.config.settingValueSar;

    // Update UI
    const caratDisplay = document.getElementById('zumurrud-carat-val');
    const totalEl = document.getElementById('zumurrud-total-val');

    if (caratDisplay) caratDisplay.textContent = `${carat.toFixed(2)} ct`;
    if (totalEl) totalEl.textContent = `${this.config.totalAppraisalSar.toLocaleString('en-US')} SAR`;
  }

  private startDispersionAnimation() {
    const loop = (timestamp: number) => {
      this.renderDispersion(timestamp);
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  private renderDispersion(timestamp: number) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Dark Velvet Jewel Vault background
    const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
    bgGrad.addColorStop(0, '#091522');
    bgGrad.addColorStop(1, '#02060c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Prismatic Dispersion Rays reacting to cursor
    const angleToMouse = Math.atan2(this.mouseY - cy, this.mouseX - cx);
    const distToMouse = Math.sqrt((this.mouseX - cx) ** 2 + (this.mouseY - cy) ** 2);
    const shimmer = Math.sin(timestamp * 0.005) * 0.3 + 0.7;

    const spectralColors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#818cf8', '#e879f9'];

    // Draw caustic rainbow beams
    for (let i = 0; i < 7; i++) {
      const rayAngle = angleToMouse + (i - 3) * 0.22 + Math.sin(timestamp * 0.003 + i) * 0.1;
      const rayLength = 90 + Math.sin(timestamp * 0.004 + i) * 25;
      const rx = cx + Math.cos(rayAngle) * rayLength;
      const ry = cy + Math.sin(rayAngle) * rayLength;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(rx, ry);
      ctx.strokeStyle = spectralColors[i];
      ctx.lineWidth = 1.6 * shimmer;
      ctx.stroke();
    }

    // Draw Brilliant-Cut Diamond Facets
    const r = 58;
    const tableR = 30;

    // Table facet (center octagon)
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8 + Math.PI / 8;
      const x = cx + Math.cos(a) * tableR;
      const y = cy + Math.sin(a) * tableR;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Star & Kite Facets (outer ring)
    for (let i = 0; i < 8; i++) {
      const a1 = (i * Math.PI * 2) / 8 + Math.PI / 8;
      const a2 = ((i + 1) * Math.PI * 2) / 8 + Math.PI / 8;
      const aMid = (a1 + a2) / 2;

      const x1 = cx + Math.cos(a1) * tableR;
      const y1 = cy + Math.sin(a1) * tableR;
      const x2 = cx + Math.cos(a2) * tableR;
      const y2 = cy + Math.sin(a2) * tableR;
      const xOuter = cx + Math.cos(aMid) * r;
      const yOuter = cy + Math.sin(aMid) * r;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(xOuter, yOuter);
      ctx.lineTo(x2, y2);
      ctx.closePath();

      const facetShine = Math.abs(Math.sin(angleToMouse + i * 0.8)) * 0.4 + 0.15;
      ctx.fillStyle = `rgba(200, 240, 255, ${facetShine})`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.stroke();
    }

    // Outer Girdle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d4af37'; // 24k Gold mount ring hint
    ctx.stroke();

    // Central Sparkle Flash
    const flashSize = (Math.sin(timestamp * 0.008) * 0.5 + 0.5) * 8;
    ctx.beginPath();
    ctx.arc(cx, cy, flashSize, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00f0ff';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  public destroy() {
    cancelAnimationFrame(this.animId);
  }
}

export const zumurrudController = new ZumurrudController();
