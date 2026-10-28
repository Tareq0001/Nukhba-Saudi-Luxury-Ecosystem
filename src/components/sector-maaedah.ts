import { GastronomyBooking } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

export class MaaedahController {
  private config: GastronomyBooking = {
    tableZone: 'Royal-Sovereign-Booth',
    selectedDate: '2026-11-15',
    timeSlot: '20:30',
    guestCount: 6,
    courseSelections: {
      amuseBouche: 'كافيار بيلوغا إمبيريال مع تارت الكمأة السوداء',
      coldStarter: 'كارباتشيو سمك الناجل الحجازي مع ماء الورد والذهب',
      warmEntree: 'فطيرة كبد البط المحمرة مع عسل السدر الجبلي',
      seaCatch: 'استاكوزا البحر الأحمر المشوية على فحم الأراك',
      mainCut: 'شريحة واغيو A5 معتقة بالعود ودهن العنبر',
      preDessert: 'سوربيه الليمون الحساوي والنعناع المديني',
      grandFinale: 'كرة الذهب عيار 24 بحشوة شوكولاتة التمر والزعفران'
    },
    dietaryRestrictions: [],
    sensoryProfile: {
      umami: 9.4,
      sweet: 6.8,
      salt: 5.5,
      acidity: 7.2,
      aroma: 9.8,
      texture: 8.9
    },
    totalTastingCostSar: 48000,
    ticketSecurityCode: 'MKH-CHEF-7729-VIP'
  };

  private radarCanvas: HTMLCanvasElement | null = null;
  private radarCtx: CanvasRenderingContext2D | null = null;

  public init() {
    this.radarCanvas = document.getElementById('maaedah-radar-canvas') as HTMLCanvasElement;
    if (this.radarCanvas) {
      this.radarCtx = this.radarCanvas.getContext('2d');
    }

    this.bindEvents();
    this.calculatePricing();
    this.renderSensoryRadar();
  }

  private bindEvents() {
    const zoneSelect = document.getElementById('maaedah-zone-select') as HTMLSelectElement;
    const guestsSlider = document.getElementById('maaedah-guests-slider') as HTMLInputElement;

    const onUpdate = () => {
      if (zoneSelect) this.config.tableZone = zoneSelect.value as GastronomyBooking['tableZone'];
      if (guestsSlider) this.config.guestCount = parseInt(guestsSlider.value, 10);

      this.calculatePricing();
      this.renderSensoryRadar();
      sound.playClick('subtle');
    };

    zoneSelect?.addEventListener('change', onUpdate);
    guestsSlider?.addEventListener('input', onUpdate);

    // Clickable Floorplan Seats
    const seats = document.querySelectorAll<HTMLElement>('.floorplan-seat');
    seats.forEach((seat) => {
      seat.addEventListener('click', () => {
        seats.forEach((s) => s.classList.remove('active'));
        seat.classList.add('active');
        const zone = seat.dataset.zone as GastronomyBooking['tableZone'];
        if (zone && zoneSelect) {
          zoneSelect.value = zone;
          this.config.tableZone = zone;
          this.calculatePricing();
          this.renderSensoryRadar();
          sound.playClick('subtle');
        }
      });
    });

    // Add to Vault
    const addVaultBtn = document.getElementById('maaedah-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        const isAr = i18n.getLang() === 'ar';
        vault.addItem({
          sectorId: 'maaedah',
          sectorNameAr: 'مَـائـدة | فن الطهي الرفيع',
          sectorNameEn: 'Maaedah Haute Gastronomy',
          titleAr: `مائدة الشيف الملكية - ${this.config.guestCount} ضيوف`,
          titleEn: `Sovereign Chef’s Table - ${this.config.guestCount} VIP Guests`,
          specSummaryAr: `الموقع: ${this.config.tableZone} • القائمة: 7 أطباق تذوق حصرية • التذكرة الأمنية: ${this.config.ticketSecurityCode}`,
          specSummaryEn: `Zone: ${this.config.tableZone} • Menu: 7-Course Royal Tasting • Security Ticket: ${this.config.ticketSecurityCode}`,
          estimatedValueSar: this.config.totalTastingCostSar
        });
      });
    }
  }

  private calculatePricing() {
    let perGuest = 6500;
    if (this.config.tableZone === 'Royal-Sovereign-Booth') {
      perGuest = 8500;
      this.config.sensoryProfile.aroma = 9.8;
      this.config.sensoryProfile.umami = 9.5;
    } else if (this.config.tableZone === 'Master-Chef-Counter') {
      perGuest = 7200;
      this.config.sensoryProfile.texture = 9.4;
    } else {
      perGuest = 5800;
    }

    this.config.totalTastingCostSar = perGuest * this.config.guestCount;

    // Update UI
    const totalEl = document.getElementById('maaedah-total-val');
    const guestsEl = document.getElementById('maaedah-guests-val');

    if (totalEl) totalEl.textContent = `${this.config.totalTastingCostSar.toLocaleString('en-US')} SAR`;
    if (guestsEl) guestsEl.textContent = `${this.config.guestCount} ${i18n.getLang() === 'ar' ? 'أشخاص' : 'Guests'}`;
  }

  private renderSensoryRadar() {
    if (!this.radarCtx || !this.radarCanvas) return;
    const ctx = this.radarCtx;
    const w = this.radarCanvas.width;
    const h = this.radarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(cx, cy) - 25;

    ctx.clearRect(0, 0, w, h);

    const axes = [
      { key: 'umami', labelAr: 'أومامي', labelEn: 'Umami', val: this.config.sensoryProfile.umami },
      { key: 'sweet', labelAr: 'حلاوة', labelEn: 'Sweet', val: this.config.sensoryProfile.sweet },
      { key: 'salt', labelAr: 'ملوحة', labelEn: 'Salt', val: this.config.sensoryProfile.salt },
      { key: 'acidity', labelAr: 'حموضة', labelEn: 'Acidity', val: this.config.sensoryProfile.acidity },
      { key: 'aroma', labelAr: 'عبير وعطر', labelEn: 'Aroma', val: this.config.sensoryProfile.aroma },
      { key: 'texture', labelAr: 'قوام وملمس', labelEn: 'Texture', val: this.config.sensoryProfile.texture }
    ];

    const count = axes.length;

    // Grid webs
    [0.25, 0.5, 0.75, 1].forEach((level) => {
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const a = (i * Math.PI * 2) / count - Math.PI / 2;
        const x = cx + Math.cos(a) * (maxR * level);
        const y = cy + Math.sin(a) * (maxR * level);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Spokes & Labels
    const isAr = i18n.getLang() === 'ar';
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
      const a = (i * Math.PI * 2) / count - Math.PI / 2;
      const xEnd = cx + Math.cos(a) * maxR;
      const yEnd = cy + Math.sin(a) * maxR;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(xEnd, yEnd);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      const labelX = cx + Math.cos(a) * (maxR + 15);
      const labelY = cy + Math.sin(a) * (maxR + 15);
      ctx.fillText(isAr ? axes[i].labelAr : axes[i].labelEn, labelX, labelY);
    }

    // Sensory Profile Filled Polygon
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const a = (i * Math.PI * 2) / count - Math.PI / 2;
      const r = (axes[i].val / 10) * maxR;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data points
    for (let i = 0; i < count; i++) {
      const a = (i * Math.PI * 2) / count - Math.PI / 2;
      const r = (axes[i].val / 10) * maxR;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
    }
  }
}

export const maaedahController = new MaaedahController();
