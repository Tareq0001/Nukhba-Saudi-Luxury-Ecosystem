import { AviationCharter } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

interface Airport {
  code: string;
  cityAr: string;
  cityEn: string;
  lat: number;
  lng: number;
}

const GLOBAL_HUBS: Airport[] = [
  { code: 'RUH', cityAr: 'الرياض (صالة الطيران الخاص)', cityEn: 'Riyadh Private Terminal (RUH)', lat: 24.9576, lng: 46.6988 },
  { code: 'LBG', cityAr: 'باريس لو بورجيه', cityEn: 'Paris Le Bourget (LBG)', lat: 48.9694, lng: 2.4414 },
  { code: 'LTN', cityAr: 'لندن لوتون VIP', cityEn: 'London Luton VIP (LTN)', lat: 51.8747, lng: -0.3683 },
  { code: 'GVA', cityAr: 'جنيف كوانتران', cityEn: 'Geneva Cointrin (GVA)', lat: 46.2381, lng: 6.1089 },
  { code: 'DWC', cityAr: 'دبي وورلد سنترال VIP', cityEn: 'Dubai DWC Al-Maktoum (DWC)', lat: 24.8961, lng: 55.1614 },
  { code: 'HND', cityAr: 'طوكيو هانيدا التنفيذي', cityEn: 'Tokyo Haneda VIP (HND)', lat: 35.5494, lng: 139.7798 },
  { code: 'TEB', cityAr: 'نيويورك تيتربورو', cityEn: 'New York Teterboro (TEB)', lat: 40.8501, lng: -74.0608 }
];

export class AtheerController {
  private config: AviationCharter = {
    aircraftModel: 'Gulfstream-G700',
    originCity: 'RUH',
    destinationCity: 'LBG',
    passengerCount: 8,
    distanceKm: 4420,
    flightDurationHours: 5.2,
    cruiseSpeedMach: 0.925,
    fuelBurnLiters: 12800,
    hourlyRateSar: 42000,
    handlingFeesSar: 45000,
    totalCharterSar: 263400,
    vipLoungeAccess: true
  };

  public init() {
    this.bindEvents();
    this.calculateFlight();
  }

  private bindEvents() {
    const originSelect = document.getElementById('atheer-origin-select') as HTMLSelectElement;
    const destSelect = document.getElementById('atheer-dest-select') as HTMLSelectElement;
    const fleetSelect = document.getElementById('atheer-fleet-select') as HTMLSelectElement;
    const paxSlider = document.getElementById('atheer-pax-slider') as HTMLInputElement;

    const onUpdate = () => {
      if (originSelect) this.config.originCity = originSelect.value;
      if (destSelect) this.config.destinationCity = destSelect.value;
      if (fleetSelect) this.config.aircraftModel = fleetSelect.value as AviationCharter['aircraftModel'];
      if (paxSlider) this.config.passengerCount = parseInt(paxSlider.value, 10);

      this.calculateFlight();
      sound.playClick('subtle');
    };

    originSelect?.addEventListener('change', onUpdate);
    destSelect?.addEventListener('change', onUpdate);
    fleetSelect?.addEventListener('change', onUpdate);
    paxSlider?.addEventListener('input', onUpdate);

    // Add to Vault
    const addVaultBtn = document.getElementById('atheer-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        const orig = GLOBAL_HUBS.find((h) => h.code === this.config.originCity);
        const dest = GLOBAL_HUBS.find((h) => h.code === this.config.destinationCity);
        const isAr = i18n.getLang() === 'ar';

        vault.addItem({
          sectorId: 'atheer',
          sectorNameAr: 'أَثِـير | الطيران الخاص',
          sectorNameEn: 'Atheer Private Aviation',
          titleAr: `رحلة خاصة: ${orig?.cityAr} ⟵ ${dest?.cityAr}`,
          titleEn: `Private Charter: ${orig?.cityEn} ⟵ ${dest?.cityEn}`,
          specSummaryAr: `الطائرة: ${this.config.aircraftModel} • المسافة: ${this.config.distanceKm} كم • زمن الرحلة: ${this.config.flightDurationHours} س • الركاب: ${this.config.passengerCount}`,
          specSummaryEn: `Aircraft: ${this.config.aircraftModel} • Distance: ${this.config.distanceKm} km • Cruising: ${this.config.flightDurationHours}h • VIPs: ${this.config.passengerCount}`,
          estimatedValueSar: this.config.totalCharterSar
        });
      });
    }
  }

  private calculateFlight() {
    const orig = GLOBAL_HUBS.find((h) => h.code === this.config.originCity) || GLOBAL_HUBS[0];
    const dest = GLOBAL_HUBS.find((h) => h.code === this.config.destinationCity) || GLOBAL_HUBS[1];

    // Great-Circle calculation
    const R = 6371; // Earth radius in km
    const dLat = (dest.lat - orig.lat) * (Math.PI / 180);
    const dLng = (dest.lng - orig.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(orig.lat * (Math.PI / 180)) * Math.cos(dest.lat * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    this.config.distanceKm = Math.max(800, Math.round(R * c));

    // Cruising speed ~980 km/h
    const groundSpeedKmH = 920;
    this.config.flightDurationHours = parseFloat((this.config.distanceKm / groundSpeedKmH + 0.4).toFixed(1)); // +0.4 taxi/climb

    // Hourly rate
    if (this.config.aircraftModel === 'Gulfstream-G700') {
      this.config.hourlyRateSar = 46000;
      this.config.cruiseSpeedMach = 0.925;
    } else if (this.config.aircraftModel === 'Bombardier-Global-7500') {
      this.config.hourlyRateSar = 44000;
      this.config.cruiseSpeedMach = 0.925;
    } else {
      this.config.hourlyRateSar = 48000;
      this.config.cruiseSpeedMach = 0.925;
    }

    // Fuel Burn (liters ~1,600 L/hour for ultra long range business jets)
    this.config.fuelBurnLiters = Math.round(this.config.flightDurationHours * 1650);

    const flightBaseCost = this.config.hourlyRateSar * this.config.flightDurationHours;
    this.config.handlingFeesSar = 48000;
    const cateringAndTaxes = 24000 + this.config.passengerCount * 2500;

    this.config.totalCharterSar = Math.round(flightBaseCost + this.config.handlingFeesSar + cateringAndTaxes);

    // Update UI
    const distEl = document.getElementById('atheer-dist-val');
    const durEl = document.getElementById('atheer-dur-val');
    const paxEl = document.getElementById('atheer-pax-val');
    const totalEl = document.getElementById('atheer-total-val');

    if (distEl) distEl.textContent = `${this.config.distanceKm.toLocaleString('en-US')} km`;
    if (durEl) durEl.textContent = `${this.config.flightDurationHours} ${i18n.getLang() === 'ar' ? 'ساعات' : 'Hours'}`;
    if (paxEl) paxEl.textContent = `${this.config.passengerCount} VIPs`;
    if (totalEl) totalEl.textContent = `${this.config.totalCharterSar.toLocaleString('en-US')} SAR`;
  }
}

export const atheerController = new AtheerController();
