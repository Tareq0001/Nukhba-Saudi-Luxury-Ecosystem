import { ArabianHorse } from '../types';
import { sound } from '../engine/audio';
import { vault } from '../engine/vault';
import { i18n } from '../engine/i18n';

export class AseelController {
  private currentHorse: ArabianHorse = {
    id: 'horse_01',
    nameAr: 'نجمة الثريا الملكية',
    nameEn: 'Najmat Al-Thuraya Royale',
    strain: 'Saklawi',
    sire: 'مروان الشقب (Marwan Al Shaqab)',
    dam: 'غزالة الخالدية (Ghazalat Al Khalediah)',
    grandSireSire: 'غزال الشقب (Gazal Al Shaqab)',
    grandDamSire: 'العديد الشقب (Al Adeed Al Shaqab)',
    birthYear: 2021,
    microchipId: 'SA-982-0091-8842',
    startingPriceSar: 1500000,
    currentBidSar: 2650000,
    bidsCount: 14,
    timeLeftSeconds: 88,
    status: 'live',
    imageUri: ''
  };

  private timerInterval: number = 0;
  private aiBidTimeout: number = 0;

  public init() {
    this.bindEvents();
    this.startAuctionTimer();
    this.scheduleAiBid();
    this.renderPedigree();
    this.updateAuctionUI();
  }

  private bindEvents() {
    // Strain selection
    const strainSelect = document.getElementById('aseel-strain-select') as HTMLSelectElement;
    if (strainSelect) {
      strainSelect.addEventListener('change', () => {
        this.currentHorse.strain = strainSelect.value as ArabianHorse['strain'];
        if (this.currentHorse.strain === 'Kehilan') {
          this.currentHorse.nameAr = 'سهم الصحراء العتيد';
          this.currentHorse.nameEn = 'Sahm Al-Sahra Al-Ateed';
          this.currentHorse.sire = 'كنز البداير (Kanz Albidayer)';
          this.currentHorse.dam = 'بدور العاديات (Budoor Al-Aadiyat)';
        } else if (this.currentHorse.strain === 'Abeyyan') {
          this.currentHorse.nameAr = 'شهاب العبية الأصيلة';
          this.currentHorse.nameEn = 'Shehab Al-Abeyyah Al-Aseel';
          this.currentHorse.sire = 'إيميرالد جي (Emerald J)';
          this.currentHorse.dam = 'ريم الدرعية (Reem Al-Diriyah)';
        } else {
          this.currentHorse.nameAr = 'نجمة الثريا الملكية';
          this.currentHorse.nameEn = 'Najmat Al-Thuraya Royale';
          this.currentHorse.sire = 'مروان الشقب (Marwan Al Shaqab)';
          this.currentHorse.dam = 'غزالة الخالدية (Ghazalat Al Khalediah)';
        }
        this.renderPedigree();
        this.updateAuctionUI();
        sound.playClick('subtle');
      });
    }

    // Place Bid Button
    const bidBtn = document.getElementById('aseel-bid-btn');
    if (bidBtn) {
      bidBtn.addEventListener('click', () => {
        this.placeUserBid();
      });
    }

    // Add to Vault (Official Pedigree Certificate)
    const addVaultBtn = document.getElementById('aseel-add-vault-btn');
    if (addVaultBtn) {
      addVaultBtn.addEventListener('click', () => {
        const isAr = i18n.getLang() === 'ar';
        vault.addItem({
          sectorId: 'aseel',
          sectorNameAr: 'أَصِـيل | الخيل العربية',
          sectorNameEn: 'Aseel Royal Arabian Stud',
          titleAr: `شهادة نسب الفرس: ${this.currentHorse.nameAr}`,
          titleEn: `Pedigree Certificate: ${this.currentHorse.nameEn}`,
          specSummaryAr: `الرسن: ${this.currentHorse.strain} • الأب: ${this.currentHorse.sire} • الأم: ${this.currentHorse.dam} • الشريحة: ${this.currentHorse.microchipId}`,
          specSummaryEn: `Strain: ${this.currentHorse.strain} • Sire: ${this.currentHorse.sire} • Dam: ${this.currentHorse.dam} • Microchip: ${this.currentHorse.microchipId}`,
          estimatedValueSar: this.currentHorse.currentBidSar
        });
      });
    }
  }

  private placeUserBid() {
    this.currentHorse.currentBidSar += 50000;
    this.currentHorse.bidsCount += 1;
    this.currentHorse.timeLeftSeconds = Math.max(35, this.currentHorse.timeLeftSeconds + 15); // Dynamic reset

    sound.playGavel();
    this.updateAuctionUI();

    // Show temporary bidder banner
    const bidderEl = document.getElementById('aseel-bidder-lead');
    if (bidderEl) {
      bidderEl.textContent = i18n.getLang() === 'ar' ? 'أنت أعلى مزايد سيادي حالياً 👑' : 'You are currently the Highest Sovereign Bidder 👑';
      bidderEl.classList.add('user-lead');
    }
  }

  private startAuctionTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = window.setInterval(() => {
      if (this.currentHorse.timeLeftSeconds > 0) {
        this.currentHorse.timeLeftSeconds--;
        const timerEl = document.getElementById('aseel-timer-val');
        if (timerEl) {
          const mins = Math.floor(this.currentHorse.timeLeftSeconds / 60);
          const secs = this.currentHorse.timeLeftSeconds % 60;
          timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
      } else {
        clearInterval(this.timerInterval);
        sound.playGavel();
        const bidderEl = document.getElementById('aseel-bidder-lead');
        if (bidderEl) {
          bidderEl.textContent = i18n.getLang() === 'ar' ? 'بيعت بالمزاد السيادي! تم النقر بالمطرقة.' : 'Sold at Sovereign Auction! Gavel struck.';
        }
      }
    }, 1000);
  }

  private scheduleAiBid() {
    clearTimeout(this.aiBidTimeout);
    const delay = 12000 + Math.random() * 14000;
    this.aiBidTimeout = window.setTimeout(() => {
      if (this.currentHorse.timeLeftSeconds > 10) {
        this.currentHorse.currentBidSar += 25000;
        this.currentHorse.bidsCount += 1;
        sound.playGavel();
        this.updateAuctionUI();

        const bidderEl = document.getElementById('aseel-bidder-lead');
        if (bidderEl) {
          const aiStudsAr = ['مربط الدرعية الملكي', 'إسطبلات العاديات الخاصة', 'صندوق الفرسان الاستثماري'];
          const aiStudsEn = ['Al-Diriyah Royal Stud', 'Al-Aadiyat Private Stables', 'Al-Fursan Equine Syndicate'];
          const pick = Math.floor(Math.random() * aiStudsAr.length);
          bidderEl.textContent = i18n.getLang() === 'ar' ? `مزايدة واردة من: ${aiStudsAr[pick]}` : `Bid placed by: ${aiStudsEn[pick]}`;
          bidderEl.classList.remove('user-lead');
        }
      }
      this.scheduleAiBid();
    }, delay);
  }

  private updateAuctionUI() {
    const horseNameEl = document.getElementById('aseel-horse-name');
    const bidValEl = document.getElementById('aseel-bid-val');
    const bidCountEl = document.getElementById('aseel-count-val');
    const isAr = i18n.getLang() === 'ar';

    if (horseNameEl) horseNameEl.textContent = isAr ? this.currentHorse.nameAr : this.currentHorse.nameEn;
    if (bidValEl) bidValEl.textContent = `${this.currentHorse.currentBidSar.toLocaleString('en-US')} SAR`;
    if (bidCountEl) bidCountEl.textContent = `${this.currentHorse.bidsCount}`;
  }

  private renderPedigree() {
    const treeEl = document.getElementById('aseel-pedigree-tree');
    if (!treeEl) return;

    treeEl.innerHTML = `
      <div class="pedigree-node root-horse">
        <span class="pedigree-role">${i18n.getLang() === 'ar' ? 'الفرس المعروضة' : 'Featured Equine'}</span>
        <div class="pedigree-title">${i18n.getLang() === 'ar' ? this.currentHorse.nameAr : this.currentHorse.nameEn}</div>
        <div class="pedigree-sub">${this.currentHorse.strain} Strain • ${this.currentHorse.birthYear}</div>
      </div>
      <div class="pedigree-branch">
        <div class="pedigree-node sire-node">
          <span class="pedigree-role">${i18n.getLang() === 'ar' ? 'الأب (Sire)' : 'Sire'}</span>
          <div class="pedigree-title">${this.currentHorse.sire}</div>
          <div class="pedigree-sub">World Gold Champion Stallion</div>
        </div>
        <div class="pedigree-node dam-node">
          <span class="pedigree-role">${i18n.getLang() === 'ar' ? 'الأم (Dam)' : 'Dam'}</span>
          <div class="pedigree-title">${this.currentHorse.dam}</div>
          <div class="pedigree-sub">National Supreme Champion Mare</div>
        </div>
      </div>
    `;
  }

  public destroy() {
    clearInterval(this.timerInterval);
    clearTimeout(this.aiBidTimeout);
  }
}

export const aseelController = new AseelController();
