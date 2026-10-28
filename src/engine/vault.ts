import { VaultItem } from '../types';
import { sound } from './audio';
import { triggerLuxuryConfetti } from './motion';
import { i18n } from './i18n';

class VaultManager {
  private items: VaultItem[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const data = localStorage.getItem('nukhba_vault_items');
      if (data) {
        this.items = JSON.parse(data);
      }
    } catch {
      this.items = [];
    }
  }

  private save() {
    try {
      localStorage.setItem('nukhba_vault_items', JSON.stringify(this.items));
    } catch {
      // ignore
    }
    this.updateUI();
  }

  public getItems(): VaultItem[] {
    return this.items;
  }

  public addItem(item: Omit<VaultItem, 'id' | 'timestamp' | 'referenceNo'>) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const prefix = item.sectorId.toUpperCase().slice(0, 3);
    const newItem: VaultItem = {
      ...item,
      id: 'vault_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      referenceNo: `NKH-${prefix}-${randomDigits}`,
      timestamp: new Date().toLocaleString(i18n.getLang() === 'ar' ? 'ar-SA' : 'en-US')
    };

    // Remove existing item from same sector if replacing, or append
    this.items.unshift(newItem);
    this.save();

    sound.playChime();
    triggerLuxuryConfetti();
    this.showToast(
      i18n.getLang() === 'ar'
        ? `تمت إضافة "${item.titleAr}" إلى الحقيبة السيادية بنجاح.`
        : `Added "${item.titleEn}" to Sovereign Vault successfully.`
    );
  }

  public removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.save();
    sound.playClick('subtle');
  }

  public clearVault() {
    this.items = [];
    this.save();
    sound.playClick('subtle');
  }

  public getTotalValue(): number {
    return this.items.reduce((sum, item) => sum + (item.estimatedValueSar || 0), 0);
  }

  public updateUI() {
    const badge = document.getElementById('vault-badge');
    const countText = document.getElementById('vault-count-text');
    const drawerList = document.getElementById('vault-items-list');
    const totalValEl = document.getElementById('vault-total-value');

    const count = this.items.length;
    if (badge) {
      badge.textContent = String(count);
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
    if (countText) {
      countText.textContent = `${count} ${i18n.t('vault_badge_items')}`;
    }

    if (totalValEl) {
      const total = this.getTotalValue();
      totalValEl.textContent = `${total.toLocaleString('en-US')} ${i18n.t('currency_sar')}`;
    }

    if (drawerList) {
      if (this.items.length === 0) {
        drawerList.innerHTML = `
          <div class="empty-vault-state">
            <i class="fa-solid fa-gem empty-icon"></i>
            <p data-i18n="vault_empty_msg">${i18n.t('vault_empty_msg')}</p>
          </div>
        `;
      } else {
        const isAr = i18n.getLang() === 'ar';
        drawerList.innerHTML = this.items
          .map(
            (item) => `
          <div class="vault-card-item">
            <div class="vault-card-header">
              <span class="vault-ref">${item.referenceNo}</span>
              <span class="vault-sector-tag">${isAr ? item.sectorNameAr : item.sectorNameEn}</span>
              <button class="vault-del-btn" data-id="${item.id}" title="Remove">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <h4 class="vault-item-title">${isAr ? item.titleAr : item.titleEn}</h4>
            <p class="vault-item-specs">${isAr ? item.specSummaryAr : item.specSummaryEn}</p>
            <div class="vault-card-footer">
              <span class="vault-item-price">${item.estimatedValueSar.toLocaleString('en-US')} ${i18n.t('currency_sar')}</span>
              <span class="vault-item-date">${item.timestamp}</span>
            </div>
          </div>
        `
          )
          .join('');

        // Attach delete handlers
        drawerList.querySelectorAll<HTMLButtonElement>('.vault-del-btn').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            if (id) this.removeItem(id);
          });
        });
      }
    }
  }

  public openDrawer() {
    const drawer = document.getElementById('vault-drawer');
    const backdrop = document.getElementById('vault-backdrop');
    if (drawer && backdrop) {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      sound.playClick('luxury');
    }
  }

  public closeDrawer() {
    const drawer = document.getElementById('vault-drawer');
    const backdrop = document.getElementById('vault-backdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      sound.playClick('subtle');
    }
  }

  public printExecutiveDossier() {
    sound.playClick('gold');
    const isAr = i18n.getLang() === 'ar';
    const total = this.getTotalValue();
    const dateStr = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const itemsHtml =
      this.items.length === 0
        ? `<p style="text-align: center; color: #666; font-style: italic;">${isAr ? 'لم يتم حفظ أي قطاعات حتى الآن.' : 'No items recorded in dossier.'}</p>`
        : this.items
            .map(
              (item, idx) => `
          <div class="print-dossier-row" style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #d4af37;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem; color: #1a1a1a;">
              <span>${idx + 1}. [${isAr ? item.sectorNameAr : item.sectorNameEn}] ${isAr ? item.titleAr : item.titleEn}</span>
              <span style="color: #92400e;">${item.estimatedValueSar.toLocaleString('en-US')} SAR</span>
            </div>
            <div style="margin: 6px 0; color: #555; font-size: 0.95rem;">${isAr ? item.specSummaryAr : item.specSummaryEn}</div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #888;">
              <span>Ref: ${item.referenceNo}</span>
              <span>Timestamp: ${item.timestamp}</span>
            </div>
          </div>
        `
            )
            .join('');

    const dossierModal = document.getElementById('dossier-print-container');
    if (dossierModal) {
      dossierModal.innerHTML = `
        <div class="printable-dossier-document" style="padding: 40px; font-family: 'Amiri', 'Plus Jakarta Sans', serif; color: #0a0a0a;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #d4af37; padding-bottom: 20px;">
            <div style="font-size: 0.85rem; letter-spacing: 3px; color: #b45309; text-transform: uppercase;">
              KINGDOM OF SAUDI ARABIA • THE SOVEREIGN LUXURY ECOSYSTEM
            </div>
            <h1 style="font-size: 2.4rem; margin: 10px 0; color: #000; font-family: 'Scheherazade New', 'Amiri', serif;">
              نُـخْـبَة | الملف التنفيذي السيادي الموحد
            </h1>
            <div style="font-size: 1.1rem; color: #444;">
              MASTER EXECUTIVE VIP PORTFOLIO DOSSIER
            </div>
            <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
              ${isAr ? 'تاريخ التوثيق:' : 'Issued Date:'} ${dateStr} • Ref: NKH-VIP-${Date.now().toString().slice(-6)}
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #b45309; border-left: 4px solid #b45309; border-right: 4px solid #b45309; padding: 0 10px; font-size: 1.2rem;">
              ${isAr ? 'جدول المخصصات والالتزامات السيادية المختارة:' : 'Bespoke Sovereign Allocations & Customizations:'}
            </h3>
            <div style="margin-top: 20px;">
              ${itemsHtml}
            </div>
          </div>

          <div style="background: #fdfaf0; border: 1px solid #e0c870; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 1.25rem; font-weight: bold; color: #111;">
              ${isAr ? 'إجمالي القيمة التقديرية للمنظومة:' : 'Total Sovereign Portfolio Value:'}
            </span>
            <span style="font-size: 1.6rem; font-weight: 800; color: #b45309;">
              ${total.toLocaleString('en-US')} SAR
            </span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 60px; padding-top: 30px; border-top: 1px solid #ccc;">
            <div style="text-align: center; width: 45%;">
              <div style="font-size: 0.9rem; color: #666; margin-bottom: 40px;">
                ${isAr ? 'المطور والمهندس المعماري المعتمد' : 'Sole Lead Architect & Developer'}
              </div>
              <div style="font-weight: bold; font-size: 1.2rem; color: #111;">أ. طارق ابوعشي</div>
              <div style="font-size: 0.8rem; color: #888;">Tareq Abuashi • Sovereign System Architecture</div>
            </div>

            <div style="text-align: center; width: 45%;">
              <div style="font-size: 0.9rem; color: #666; margin-bottom: 40px;">
                ${isAr ? 'ختم الاعتماد والتوثيق السيادي' : 'Official Sovereign Seal of Authenticity'}
              </div>
              <div style="display: inline-block; border: 2px solid #b45309; padding: 8px 24px; border-radius: 999px; font-weight: bold; color: #b45309; font-size: 0.9rem;">
                VERIFIED SOVEREIGN DOSSIER • 2026
              </div>
            </div>
          </div>
        </div>
      `;

      window.print();
    }
  }

  private showToast(msg: string) {
    const toast = document.createElement('div');
    toast.className = 'nukhba-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('visible');
    }, 20);

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}

export const vault = new VaultManager();
