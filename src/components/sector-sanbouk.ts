import { SuperyachtCharter } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

interface Port {
  id: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
  canvasX: number;
  canvasY: number;
}

const RED_SEA_PORTS: Port[] = [
  { id: 'sindalah', nameAr: 'جزيرة سندالة (نيوم)', nameEn: 'Sindalah Island (NEOM)', lat: 27.915, lng: 35.132, canvasX: 75, canvasY: 55 },
  { id: 'umluj', nameAr: 'أرخبيل جزر أملج', nameEn: 'Umluj Archipelago', lat: 25.041, lng: 37.268, canvasX: 135, canvasY: 130 },
  { id: 'yanbu', nameAr: 'مرسى ينبع الملكي', nameEn: 'Yanbu Royal Marina', lat: 24.089, lng: 38.063, canvasX: 175, canvasY: 175 },
  { id: 'jeddah', nameAr: 'نادي جدة لليخوت والقرية', nameEn: 'Jeddah Yacht Club & Marina', lat: 21.485, lng: 39.192, canvasX: 235, canvasY: 260 },
  { id: 'farasan', nameAr: 'جزر فرسان المحمية', nameEn: 'Farasan Islands Reserve', lat: 16.702, lng: 42.118, canvasX: 320, canvasY: 370 }
];

export class SanboukController {
  private config: SuperyachtCharter = {
    yachtModel: 'Sultan-85m',
    departurePort: 'jeddah',
    destinationPort: 'sindalah',
    durationDays: 7,
    nauticalMiles: 480,
    cruisingKnots: 16,
    guestsCount: 12,
    fuelBurnLiters: 18500,
    fuelCostSar: 125000,
    berthingFeesSar: 85000,
    charterBaseFeeSar: 1850000,
    vipCateringTier: 'Royal-Chef',
    totalCharterCostSar: 2280000
  };

  private mapCanvas: HTMLCanvasElement | null = null;
  private mapCtx: CanvasRenderingContext2D | null = null;

  public init() {
    this.mapCanvas = document.getElementById('sanbouk-map-canvas') as HTMLCanvasElement;
    if (this.mapCanvas) {
      this.mapCtx = this.mapCanvas.getContext('2d');
    }

    this.bindEvents();
    this.calculateCharter();
    this.renderMap();
  }

  private bindEvents() {
    const fromSelect = document.getElementById('sanbouk-from-select') as HTMLSelectElement;
    const toSelect = document.getElementById('sanbouk-to-select') as HTMLSelectElement;
    const yachtSelect = document.getElementById('sanbouk-yacht-select') as HTMLSelectElement;
    const daysSlider = document.getElementById('sanbouk-days-slider') as HTMLInputElement;
    const cateringSelect = document.getElementById('sanbouk-catering-select') as HTMLSelectElement;

    const onUpdate = () => {
      if (fromSelect) this.config.departurePort = fromSelect.value;
      if (toSelect) this.config.destinationPort = toSelect.value;
      if (yachtSelect) this.config.yachtModel = yachtSelect.value as SuperyachtCharter['yachtModel'];
      if (daysSlider) this.config.durationDays = parseInt(daysSlider.value, 10);
      if (cateringSelect) this.config.vipCateringTier = cateringSelect.value as SuperyachtCharter['vipCateringTier'];

      this.calculateCharter();
      this.renderMap();
      sound.playClick('subtle');
    };

    fromSelect?.addEventListener('change', onUpdate);
    toSelect?.addEventListener('change', onUpdate);
    yachtSelect?.addEventListener('change', onUpdate);
    daysSlider?.addEventListener('input', onUpdate);
    cateringSelect?.addEventListener('change', onUpdate);

    // Add to Vault
    const addVaultBtn = document.getElementById('sanbouk-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        const fromPort = RED_SEA_PORTS.find((p) => p.id === this.config.departurePort);
        const toPort = RED_SEA_PORTS.find((p) => p.id === this.config.destinationPort);
        const isAr = i18n.getLang() === 'ar';

        vault.addItem({
          sectorId: 'sanbouk',
          sectorNameAr: 'سُـنْـبوق | اليخوت السوبر',
          sectorNameEn: 'Sanbouk Superyacht Charter',
          titleAr: `استئجار يخت ${this.config.yachtModel} - ${this.config.durationDays} أيام`,
          titleEn: `Superyacht Charter ${this.config.yachtModel} - ${this.config.durationDays} Days`,
          specSummaryAr: `المسار: من ${fromPort?.nameAr} إلى ${toPort?.nameAr} • المسافة: ${this.config.nauticalMiles} ميل بحري • الضيافة: ${this.config.vipCateringTier}`,
          specSummaryEn: `Route: ${fromPort?.nameEn} to ${toPort?.nameEn} • Distance: ${this.config.nauticalMiles} NM • Catering: ${this.config.vipCateringTier}`,
          estimatedValueSar: this.config.totalCharterCostSar
        });
      });
    }
  }

  private calculateCharter() {
    const p1 = RED_SEA_PORTS.find((p) => p.id === this.config.departurePort) || RED_SEA_PORTS[3];
    const p2 = RED_SEA_PORTS.find((p) => p.id === this.config.destinationPort) || RED_SEA_PORTS[0];

    // Haversine Nautical Miles
    const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
    const dLng = (p2.lng - p1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1.lat * (Math.PI / 180)) * Math.cos(p2.lat * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = 6371 * c;
    const nm = Math.max(35, Math.round(distKm * 0.539957));
    this.config.nauticalMiles = nm;

    // Fuel Burn (liters)
    const litersPerHour = this.config.yachtModel === 'Sultan-85m' ? 620 : this.config.yachtModel === 'Sindalah-65m' ? 420 : 280;
    const sailingHours = nm / this.config.cruisingKnots;
    this.config.fuelBurnLiters = Math.round(sailingHours * litersPerHour * 1.3); // With generator idle
    this.config.fuelCostSar = Math.round(this.config.fuelBurnLiters * 6.5);

    // Daily Charter Base Rate
    let dailyRate = 220000;
    if (this.config.yachtModel === 'Sindalah-65m') dailyRate = 160000;
    if (this.config.yachtModel === 'Al-Bahr-52m') dailyRate = 95000;

    this.config.charterBaseFeeSar = dailyRate * this.config.durationDays;
    this.config.berthingFeesSar = 15000 * this.config.durationDays;

    let cateringTotal = 18000 * this.config.durationDays;
    if (this.config.vipCateringTier === 'Michelin-Sea') cateringTotal = 28000 * this.config.durationDays;
    if (this.config.vipCateringTier === 'Royal-Chef') cateringTotal = 45000 * this.config.durationDays;

    this.config.totalCharterCostSar =
      this.config.charterBaseFeeSar + this.config.fuelCostSar + this.config.berthingFeesSar + cateringTotal;

    // Update UI
    const milesEl = document.getElementById('sanbouk-miles-val');
    const fuelEl = document.getElementById('sanbouk-fuel-val');
    const daysDisplay = document.getElementById('sanbouk-days-val');
    const totalEl = document.getElementById('sanbouk-total-val');

    if (milesEl) milesEl.textContent = `${this.config.nauticalMiles} NM`;
    if (fuelEl) fuelEl.textContent = `${this.config.fuelBurnLiters.toLocaleString('en-US')} L`;
    if (daysDisplay) daysDisplay.textContent = `${this.config.durationDays} ${i18n.getLang() === 'ar' ? 'أيام' : 'Days'}`;
    if (totalEl) totalEl.textContent = `${this.config.totalCharterCostSar.toLocaleString('en-US')} SAR`;
  }

  private renderMap() {
    if (!this.mapCtx || !this.mapCanvas) return;
    const ctx = this.mapCtx;
    const w = this.mapCanvas.width;
    const h = this.mapCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Deep Red Sea Water Gradient
    const waterGrad = ctx.createLinearGradient(0, 0, w, h);
    waterGrad.addColorStop(0, '#041628');
    waterGrad.addColorStop(1, '#020b14');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, w, h);

    // Stylized Coastline of Western Arabian Peninsula
    ctx.beginPath();
    ctx.moveTo(w - 20, 10);
    ctx.lineTo(w - 60, 60);
    ctx.lineTo(w - 90, 120);
    ctx.lineTo(w - 110, 180);
    ctx.lineTo(w - 140, 260);
    ctx.lineTo(w - 160, 340);
    ctx.lineTo(w - 190, h - 10);
    ctx.lineTo(w, h);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(217, 119, 6, 0.08)'; // Golden land mass hint
    ctx.fill();
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Route line connecting from -> to
    const p1 = RED_SEA_PORTS.find((p) => p.id === this.config.departurePort);
    const p2 = RED_SEA_PORTS.find((p) => p.id === this.config.destinationPort);

    if (p1 && p2 && p1 !== p2) {
      ctx.beginPath();
      ctx.moveTo(p1.canvasX, p1.canvasY);
      // Gentle nautical curve
      const midX = (p1.canvasX + p2.canvasX) / 2 - 25;
      const midY = (p1.canvasY + p2.canvasY) / 2;
      ctx.quadraticCurveTo(midX, midY, p2.canvasX, p2.canvasY);

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Ports
    RED_SEA_PORTS.forEach((port) => {
      const isSelected = port.id === this.config.departurePort || port.id === this.config.destinationPort;

      ctx.beginPath();
      ctx.arc(port.canvasX, port.canvasY, isSelected ? 8 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#f59e0b' : '#38bdf8';
      ctx.fill();
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Port Label
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.6)';
      const isAr = i18n.getLang() === 'ar';
      ctx.fillText(isAr ? port.nameAr : port.nameEn, port.canvasX + 12, port.canvasY + 4);
    });
  }
}

export const sanboukController = new SanboukController();
