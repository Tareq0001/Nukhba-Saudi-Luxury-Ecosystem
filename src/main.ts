import './style.css';
import { StardustCanvas } from './engine/canvas-bg';
import { sound } from './engine/audio';
import { i18n } from './engine/i18n';
import { vault } from './engine/vault';
import { initMotion, initCardTilt } from './engine/motion';

import { mithmarController } from './components/sector-mithmar';
import { miqatController } from './components/sector-miqat';
import { sanboukController } from './components/sector-sanbouk';
import { aseelController } from './components/sector-aseel';
import { zumurrudController } from './components/sector-zumurrud';
import { shaheenController } from './components/sector-shaheen';
import { qassabController } from './components/sector-qassab';
import { maaedahController } from './components/sector-maaedah';
import { atheerController } from './components/sector-atheer';
import { iwanController } from './components/sector-iwan';

class NukhbaApp {
  private stardust: StardustCanvas | null = null;
  private currentTheme: 'dark' | 'light' = 'dark';

  public init() {
    // 1. Initialize Canvas Background
    const bgCanvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
    if (bgCanvas) {
      this.stardust = new StardustCanvas(bgCanvas);
    }

    // 2. Initialize Language & Direction
    i18n.apply();

    // 3. Setup Global Controls (Theme, Sound, Lang, Vault)
    this.setupGlobalControls();

    // 4. Initialize all 10 Sovereign Sector Controllers
    mithmarController.init();
    miqatController.init();
    sanboukController.init();
    aseelController.init();
    zumurrudController.init();
    shaheenController.init();
    qassabController.init();
    maaedahController.init();
    atheerController.init();
    iwanController.init();

    // 5. Initialize Vault UI
    vault.updateUI();

    // 6. Initialize GSAP Motion & 3D Tilt
    initMotion();
    initCardTilt();
  }

  private setupGlobalControls() {
    // Language Switcher
    const langBtn = document.getElementById('lang-toggle-btn');
    langBtn?.addEventListener('click', () => {
      const newLang = i18n.toggle();
      langBtn.textContent = newLang === 'ar' ? 'English' : 'العربية';
      vault.updateUI();
      sound.playClick('subtle');
    });

    // Theme Switcher
    const themeBtn = document.getElementById('theme-toggle-btn');
    themeBtn?.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      document.body.classList.toggle('theme-light', this.currentTheme === 'light');
      this.stardust?.setTheme(this.currentTheme === 'dark');
      sound.playClick('subtle');
    });

    // Sound Switcher
    const soundBtn = document.getElementById('sound-toggle-btn');
    soundBtn?.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      soundBtn.classList.toggle('muted', isMuted);
      const icon = soundBtn.querySelector('i');
      if (icon) {
        icon.className = isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
      }
      if (!isMuted) sound.playClick('subtle');
    });

    // Vault Drawer Open & Close
    const vaultBtn = document.getElementById('vault-drawer-btn');
    const vaultCloseBtn = document.getElementById('vault-close-btn');
    const vaultBackdrop = document.getElementById('vault-backdrop');

    vaultBtn?.addEventListener('click', () => vault.openDrawer());
    vaultCloseBtn?.addEventListener('click', () => vault.closeDrawer());
    vaultBackdrop?.addEventListener('click', () => vault.closeDrawer());

    // Clear Vault
    const clearVaultBtn = document.getElementById('vault-clear-btn');
    clearVaultBtn?.addEventListener('click', () => {
      vault.clearVault();
    });

    // Print Executive VIP Dossier
    const printDossierBtn = document.getElementById('print-dossier-btn');
    printDossierBtn?.addEventListener('click', () => {
      vault.printExecutiveDossier();
    });

    // Hero Explore CTA Smooth Scroll
    const exploreBtn = document.getElementById('hero-explore-btn');
    exploreBtn?.addEventListener('click', () => {
      const firstSector = document.getElementById('sector-mithmar');
      firstSector?.scrollIntoView({ behavior: 'smooth' });
      sound.playClick('subtle');
    });

    const heroVaultBtn = document.getElementById('hero-vault-btn');
    heroVaultBtn?.addEventListener('click', () => {
      vault.openDrawer();
    });
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new NukhbaApp();
  app.init();
});
