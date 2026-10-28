import { FalconPassport } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

export class ShaheenController {
  private config: FalconPassport = {
    passportNo: 'KSA-FALCON-9081',
    falconNameAr: 'صقر شاهين بحري نادر (الجساس)',
    falconNameEn: 'Peregrine Shaheen (Al-Jassas)',
    speciesAr: 'شاهين بحري أصيل (Falco peregrinus)',
    speciesEn: 'Pure Marine Peregrine',
    wingSpanCm: 112,
    weightGrams: 980,
    maxDiveSpeedKmH: 388,
    gForceMax: 11.4,
    ringSerial: 'ROYAL-SA-88102',
    biometricId: 'BIO-WING-9821-X',
    expeditionTier: 'Royal-RubAlKhali',
    expeditionCostSar: 420000
  };

  private radarCanvas: HTMLCanvasElement | null = null;
  private radarCtx: CanvasRenderingContext2D | null = null;
  private animId: number = 0;
  private altitude: number = 850;
  private diveProgress: number = 0;

  public init() {
    this.radarCanvas = document.getElementById('shaheen-radar-canvas') as HTMLCanvasElement;
    if (this.radarCanvas) {
      this.radarCtx = this.radarCanvas.getContext('2d');
    }

    this.bindEvents();
    this.calculateTelemetry();
    this.startRadarAnimation();
  }

  private bindEvents() {
    const altSlider = document.getElementById('shaheen-alt-slider') as HTMLInputElement;
    const tierSelect = document.getElementById('shaheen-tier-select') as HTMLSelectElement;

    altSlider?.addEventListener('input', () => {
      this.altitude = parseInt(altSlider.value, 10);
      this.calculateTelemetry();
    });

    tierSelect?.addEventListener('change', () => {
      this.config.expeditionTier = tierSelect.value as FalconPassport['expeditionTier'];
      if (this.config.expeditionTier === 'Royal-RubAlKhali') {
        this.config.expeditionCostSar = 420000;
      } else if (this.config.expeditionTier === 'AlUla-Sanctuary') {
        this.config.expeditionCostSar = 310000;
      } else {
        this.config.expeditionCostSar = 240000;
      }
      this.updateUI();
      sound.playClick('subtle');
    });

    // Add to Vault (Falcon Passport)
    const addVaultBtn = document.getElementById('shaheen-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        const isAr = i18n.getLang() === 'ar';
        vault.addItem({
          sectorId: 'shaheen',
          sectorNameAr: 'شَـاهين | الصقور الملكية',
          sectorNameEn: 'Shaheen Royal Falconry',
          titleAr: `جواز سفر ${this.config.falconNameAr}`,
          titleEn: `Sovereign Passport: ${this.config.falconNameEn}`,
          specSummaryAr: `السرعة القصوى: ${this.config.maxDiveSpeedKmH} كم/س • قوى الجاذبية: ${this.config.gForceMax}G • رقم الشريحة: ${this.config.biometricId} • الرحلة: ${this.config.expeditionTier}`,
          specSummaryEn: `Max Velocity: ${this.config.maxDiveSpeedKmH} km/h • Peak G-Force: ${this.config.gForceMax}G • Biometric: ${this.config.biometricId} • Tour: ${this.config.expeditionTier}`,
          estimatedValueSar: this.config.expeditionCostSar
        });
      });
    }
  }

  private calculateTelemetry() {
    // Terminal dive speed physics: v = sqrt(2 * m * g / (rho * A * Cd))
    // Shaheen aerodynamic shape drag coefficient Cd ~ 0.06
    // At higher altitudes, diving speed reaches 360 - 395 km/h
    const baseSpeed = 290 + (this.altitude / 1500) * 105;
    this.config.maxDiveSpeedKmH = Math.round(baseSpeed);

    // G-Force at pull out
    this.config.gForceMax = parseFloat((8.5 + (this.altitude / 1500) * 3.8).toFixed(1));

    this.updateUI();
  }

  private updateUI() {
    const altEl = document.getElementById('shaheen-alt-val');
    const speedEl = document.getElementById('shaheen-speed-val');
    const gforceEl = document.getElementById('shaheen-gforce-val');
    const costEl = document.getElementById('shaheen-cost-val');

    if (altEl) altEl.textContent = `${this.altitude} m`;
    if (speedEl) speedEl.textContent = `${this.config.maxDiveSpeedKmH} km/h`;
    if (gforceEl) gforceEl.textContent = `${this.config.gForceMax} G`;
    if (costEl) costEl.textContent = `${this.config.expeditionCostSar.toLocaleString('en-US')} SAR`;
  }

  private startRadarAnimation() {
    const loop = (timestamp: number) => {
      this.renderRadar(timestamp);
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  private renderRadar(timestamp: number) {
    if (!this.radarCtx || !this.radarCanvas) return;
    const ctx = this.radarCtx;
    const w = this.radarCanvas.width;
    const h = this.radarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 15;

    ctx.clearRect(0, 0, w, h);

    // Deep Obsidian Tactical Radar Background
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#030c14';
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Concentric Range Rings
    [0.33, 0.66, 1].forEach((scale) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.stroke();

    // Radar Sweeping Line
    const sweepAngle = (timestamp * 0.002) % (Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepAngle) * r, cy + Math.sin(sweepAngle) * r);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Falcon Target Blip Diving
    this.diveProgress = (this.diveProgress + 0.015) % 1;
    const falconDist = r * (1 - this.diveProgress * 0.85);
    const falconAngle = 0.8;
    const fx = cx + Math.cos(falconAngle) * falconDist;
    const fy = cy + Math.sin(falconAngle) * falconDist;

    ctx.beginPath();
    ctx.arc(fx, fy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#eab308';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Telemetry text overlay
    ctx.font = '10px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`ALT: ${(this.altitude * (1 - this.diveProgress)).toFixed(0)}m`, fx + 8, fy - 4);
    ctx.fillText(`VEL: ${this.config.maxDiveSpeedKmH} km/h`, fx + 8, fy + 8);
  }

  public destroy() {
    cancelAnimationFrame(this.animId);
  }
}

export const shaheenController = new ShaheenController();
