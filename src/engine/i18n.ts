import { Language } from '../types';

export const DICTIONARY: Record<Language, Record<string, string>> = {
  ar: {
    // Brand & Header
    brand_title: 'نُـخْـبَة',
    brand_sub: 'المنظومة الفاخرة للقطاعات السيادية العشرة',
    brand_eng: 'THE SOVEREIGN LUXURY ECOSYSTEM',
    lead_architect: 'المطور والمهندس المعماري: أ. طارق ابوعشي',
    creator_tag: 'تصميم وتنفيذ وتطوير: أ. طارق ابوعشي',
    sovereign_badge: 'المملكة العربية السعودية 🇸🇦 • منصة سيادية خاصة',
    nav_sectors: 'القطاعات السيادية',
    nav_vault: 'الخزينة والحقيبة السيادية',
    nav_dossier: 'الملف التنفيذي VIP',
    theme_toggle: 'المظهر',
    sound_toggle: 'الصوت التفاعلي',
    lang_toggle: 'English',
    vault_badge_items: 'طلب',

    // Hero
    hero_eyebrow: 'قمة الترف السيادي والامتياز الحصري',
    hero_headline: 'عشرة قطاعات سيادية.. تُدار بأعلى معايير الإتقان والفخامة المطلقة',
    hero_desc: 'منظومة حصرية متكاملة تجمع هندسة الهايبركار، وساعات الكرونومتر الميكانيكية، ويخوت البحر الأحمر، وخيول الأنساب العربية، والألماس الحر، وصقور القنص، وبشوت الزري الحساوية، ومائدة الشيف الملكية، والطيران الخاص، والعقارات السيادية.',
    hero_cta_explore: 'استكشاف القطاعات السيادية',
    hero_cta_vault: 'فتح الخزينة السيادية',
    stat_sectors_num: '10',
    stat_sectors_lbl: 'قطاعات سيادية متكاملة',
    stat_bespoke_num: '100%',
    stat_bespoke_lbl: 'حسابات وتخصيصات تفاعلية حية',
    stat_prestige_num: '24K',
    stat_prestige_lbl: 'معايير الفخامة الخالصة',

    // Global Sector Action
    btn_add_to_vault: 'إضافة إلى الحقيبة السيادية',
    btn_calculate: 'إعادة الحساب المباشر',
    btn_export_spec: 'استخراج وثيقة المواصفات',
    btn_print_dossier: 'طباعة الملف التنفيذي الشامل (VIP Dossier)',
    btn_clear_vault: 'تفريغ الحقيبة',
    btn_close: 'إغلاق',
    vault_empty_msg: 'لا توجد طلبات محفوظة حالياً في الخزينة السيادية. قم بتخصيص خدماتك من القطاعات بالأسفل لإضافتها إلى حقيبتك.',
    currency_sar: 'ر.س',

    // 1. Mithmar
    m_dyno_title: 'مختبر اختبار القدرة والعزم (Dyno Simulator)',
    m_rpm_slider: 'معدل دورات المحرك بالدقيقة (RPM)',
    m_hp_label: 'القدرة الحصانية الصافية',
    m_torque_label: 'عزم الدوران الأقصى',
    m_accel_label: 'التسارع 0 - 100 كم/س',
    m_speed_label: 'السرعة القصوى المحققة',
    m_rev_btn: 'ضغط دواسة الوقود وتوليد صوت V12 🔊',
    m_rev_hint: 'اضغط واستمر بالضغط لسماع زئير المحرك وافلت لسماع فرقعة العادم!',
    m_config_title: 'تخصيص هيكل الهايبركار وألياف الكربون',
    m_model_select: 'طراز الهايبركار',
    m_paint_select: 'طلاء الهيكل الحصري',
    m_carbon_select: 'حزمة ألياف الكربون',
    m_wheels_select: 'جنوط المغنيسيوم والمكابح',
    m_aero_toggle: 'جناح خلفي هوائي تفاعلي (Active Aero Wing)',

    // 2. Miqat
    mq_canvas_title: 'محاكاة ميزان الساعة الميكانيكي الحي (Escapement 4Hz)',
    mq_canvas_hint: 'تذبذب عجلة التوازن والشعرية ونقرات الميزان السويسري في الوقت الفعلي',
    mq_builder_title: 'تفصيل ساعة الكرونومتر السيادية',
    mq_caliber_lbl: 'العيار الميكانيكي والتعقيد',
    mq_case_lbl: 'معدن العلبة الفاخر',
    mq_dial_lbl: 'نمط وخامة الميناء',
    mq_strap_lbl: 'السوار والإبزيم',
    mq_cosc_title: 'محلل دقة الكرونومتر المعتمد (COSC Deviation)',
    mq_cosc_desc: 'فحص انحراف التوقيت اليومي عبر 5 وضعيات فيزيائية مختلفة:',
    mq_cosc_status: 'شهادة الاعتماد السويسرية COSC',

    // 3. Sanbouk
    sb_route_title: 'مخطط رحلات البحر الأحمر الاستكشافية',
    sb_from_lbl: 'ميناء الانطلاق',
    sb_to_lbl: 'وجهة الرسو الفاخرة',
    sb_days_lbl: 'مدة الرحلة (أيام)',
    sb_yacht_lbl: 'فئة اليخت السوبر',
    sb_guests_lbl: 'عدد الضيوف الملكيين',
    sb_catering_lbl: 'باقة الضيافة الملكية',
    sb_miles_calc: 'المسافة البحرية المقدرة',
    sb_fuel_calc: 'استهلاك وقود المحركات',
    sb_total_calc: 'إجمالي استئجار اليخت والرسوم',
    sb_contract_btn: 'إصدار مسودة عقد الإيجار البحري',

    // 4. Aseel
    as_pedigree_title: 'شجرة الأنساب الملكية لأرسان الخيل العربية',
    as_strain_lbl: 'الرسن العربي الأصيل',
    as_sire_lbl: 'خط الأب (Sire Line)',
    as_dam_lbl: 'خط الأم (Dam Line)',
    as_auction_title: 'المزاد السيادي المباشر للخيل العربية',
    as_current_horse: 'الفرس المعروضة حالياً بالمزاد',
    as_current_bid: 'أعلى مزايدة حالية',
    as_bid_count: 'إجمالي المزايدات المسجلة',
    as_time_left: 'الوقت المتبقي للمطرقة',
    as_place_bid_btn: 'رفع المزايدة السيادية (+50,000 ر.س)',
    as_cert_btn: 'شهادة النسب والجينات الوراثية الرسمية',

    // 5. Zumurrud
    zm_matrix_title: 'مصفوفة معايير الألماس الأربعة (The 4Cs Matrix)',
    zm_carat_lbl: 'الوزن بالقيراط (Carat Weight)',
    zm_color_lbl: 'درجة نقاء اللون (Color Grade)',
    zm_clarity_lbl: 'مستوى الصفاء والنقاء (Clarity)',
    zm_cut_lbl: 'جودة الصقل والقطع (Cut Grade)',
    zm_canvas_title: 'محاكي انكسار وتشتت الضوء الطيفي (Dispersion)',
    zm_setting_title: 'تصميم خاتم السوليتير الاستثماري',
    zm_metal_lbl: 'معدن الصياغة الملكي',
    zm_setting_lbl: 'شكل التركيب والحماية',
    zm_valuation_lbl: 'القيمة التقديرية الحالية (Rapaport/GIA)',

    // 6. Shaheen
    sh_dive_title: 'محاكي الانقضاض الجوي التكتيكي (Dive Telemetry)',
    sh_altitude_slider: 'ارتفاع بدء الانقضاض (متر)',
    sh_speed_calc: 'السرعة القصوى المحققة عند الانقضاض',
    sh_gforce_calc: 'معامل قوى الجاذبية (G-Force Peak)',
    sh_time_calc: 'زمن الوصول للهدف (ثواني)',
    sh_radar_title: 'رادار الرصد الحي وتتبع الصقر',
    sh_passport_title: 'جواز سفر الصقر البيومتري الإلكتروني',
    sh_passport_btn: 'إصدار جواز الصقر الملكي وبطاقة الشريحة',

    // 7. Qassab
    qs_fabric_title: 'محترف البشت الحساوي الأصيل',
    qs_fabric_lbl: 'خامة القماش الفاخر',
    qs_darb_lbl: 'طراز الدربوية الملكية',
    qs_zari_lbl: 'نوع خيوط الزري المذهب',
    qs_color_lbl: 'لون البشت الملكي',
    qs_collar_title: 'المحاكاة المرئية لطوق الهيلة والبروج المذهب',
    qs_measures_title: 'المقاسات الدقيقة (سنتيمتر)',
    qs_height_lbl: 'طول البشت (إنش/سم)',
    qs_shoulder_lbl: 'عرض الكتف',
    qs_hours_lbl: 'ساعات الحياكة اليدوية المخصصة',

    // 8. Maaedah
    md_seat_title: 'مخطط جلوس مائدة الشيف الخاصة (Floorplan)',
    md_seat_vip: 'المقصورة الملكية السيادية (Royal Booth)',
    md_seat_counter: 'منضدة الشيف التفاعلية (Chef Counter)',
    md_seat_majlis: 'الصالون الخاص (Private Salon)',
    md_menu_title: 'تصميم قائمة التذوق ذات الأطباق السبعة',
    md_radar_title: 'رادار التوازن الحسي للنكهات (Sensory Profile)',
    md_allergens_lbl: 'استثناء مسببات الحساسية',
    md_ticket_btn: 'إصدار تذكرة المأدبة الملكية برمز الأمان',

    // 9. Atheer
    at_calc_title: 'حاسبة الطيران الخاص عبر القارات (Great-Circle Aviation)',
    at_origin_lbl: 'مطار الإقلاع',
    at_dest_lbl: 'مطار الهبوط الدولي',
    at_fleet_lbl: 'طراز الطائرة الخاصة',
    at_pax_lbl: 'عدد الركاب التنفيذيين',
    at_dist_calc: 'المسافة الجوية المباشرة',
    at_duration_calc: 'زمن الرحلة المحسوب',
    at_cost_calc: 'تكلفة استئجار الرحلة الشاملة',
    at_quote_btn: 'إصدار عرض سعر الطيران والبيان الرسمي (VIP Manifest)',

    // 10. Iwan
    iw_estate_title: 'حاسبة الجدوى الاستثمارية للعقارات السيادية',
    iw_type_lbl: 'نوع الأصل العقاري الفاخر',
    iw_price_lbl: 'سعر الاستحواذ الإجمالي',
    iw_downpay_lbl: 'الدفعة الأولى النقدية (%)',
    iw_yield_lbl: 'صافي العائد الإيجاري السنوي',
    iw_caprate_lbl: 'معدل الرسملة (Cap Rate)',
    iw_roi_lbl: 'العائد الاستثماري المتوقع لـ 10 سنوات',
    iw_skyline_title: 'محاكي إطلالة الأفق البانورامية (Skyline Simulator)',
    iw_time_day: 'نهارية مشرقة',
    iw_time_sunset: 'ساعة الغروب الذهبية',
    iw_time_night: 'أضواء الليل والنجوم',

    // Footer
    footer_copy: 'جميع الحقوق محفوظة للمنظومة © 2026 • تصميم وتطوير وهندسة معمارية بواسطة',
    footer_owner: 'أ. طارق ابوعشي',
    footer_sub: 'منظومة حصرية سيادية مبنية بأحدث معايير الويب الفائق والأداء المعماري المتطور.'
  },
  en: {
    // Brand & Header
    brand_title: 'NUKHBA',
    brand_sub: 'The Sovereign Luxury Ecosystem of the Ten Sectors',
    brand_eng: 'THE SOVEREIGN LUXURY ECOSYSTEM',
    lead_architect: 'Lead Systems Architect: Tareq Abuashi',
    creator_tag: 'Designed, Engineered & Authored by: Tareq Abuashi',
    sovereign_badge: 'Kingdom of Saudi Arabia 🇸🇦 • Private Sovereign Platform',
    nav_sectors: 'Sovereign Sectors',
    nav_vault: 'Sovereign Vault',
    nav_dossier: 'Executive VIP Dossier',
    theme_toggle: 'Theme',
    sound_toggle: 'Interactive Audio',
    lang_toggle: 'العربية',
    vault_badge_items: 'Req',

    // Hero
    hero_eyebrow: 'Pinnacle of Sovereign Luxury & Exclusive Mastery',
    hero_headline: 'Ten Sovereign Sectors.. Governed by Absolute Precision & Luxury',
    hero_desc: 'An integrated sovereign ecosystem uniting hypercar atelier dynamics, haute horlogerie chronometers, Red Sea superyachts, royal Arabian stud lineages, investment diamonds, royal falconry, Hasawi gold bishts, haute gastronomy, private aviation, and ultra-luxury estates.',
    hero_cta_explore: 'Explore Sovereign Sectors',
    hero_cta_vault: 'Open Sovereign Vault',
    stat_sectors_num: '10',
    stat_sectors_lbl: 'Integrated Sovereign Sectors',
    stat_bespoke_num: '100%',
    stat_bespoke_lbl: 'Live Interactive Calculators & Simulators',
    stat_prestige_num: '24K',
    stat_prestige_lbl: 'Pure Prestige Standards',

    // Global Sector Action
    btn_add_to_vault: 'Add to Sovereign Vault',
    btn_calculate: 'Recalculate Telemetry',
    btn_export_spec: 'Export Specification Sheet',
    btn_print_dossier: 'Print Executive VIP Dossier',
    btn_clear_vault: 'Clear Vault',
    btn_close: 'Close',
    vault_empty_msg: 'Your Sovereign Vault is currently empty. Customize selections from the 10 sectors below to compile your executive portfolio dossier.',
    currency_sar: 'SAR',

    // 1. Mithmar
    m_dyno_title: 'Engine Dyno Power & Torque Telemetry Simulator',
    m_rpm_slider: 'Engine Crankshaft Speed (RPM)',
    m_hp_label: 'Net Horsepower (BHP)',
    m_torque_label: 'Peak Torque (Nm)',
    m_accel_label: '0 - 100 km/h Sprint',
    m_speed_label: 'Terminal Top Speed',
    m_rev_btn: 'Press & Hold Throttle for V12 Rev 🔊',
    m_rev_hint: 'Hold button to rev engine to redline, release to hear exhaust crackles!',
    m_config_title: 'Hypercar Silhouette, Carbon & Livery Builder',
    m_model_select: 'Hypercar Model',
    m_paint_select: 'Bespoke Livery Finish',
    m_carbon_select: 'Carbon Fiber Package',
    m_wheels_select: 'Forged Wheels & Calipers',
    m_aero_toggle: 'Active Dynamic Aero Rear Wing',

    // 2. Miqat
    mq_canvas_title: 'Live Mechanical Escapement Simulator (4Hz Tick-Tock)',
    mq_canvas_hint: 'Harmonic balance wheel oscillation, hairspring recoil, and Swiss lever pallet clicks',
    mq_builder_title: 'Sovereign Chronometer Bespoke Builder',
    mq_caliber_lbl: 'Mechanical Caliber & Complication',
    mq_case_lbl: 'Precious Case Metal',
    mq_dial_lbl: 'Bespoke Dial Material',
    mq_strap_lbl: 'Strap & Clasp Assembly',
    mq_cosc_title: 'Certified COSC Chronometer Deviation Telemetry',
    mq_cosc_desc: 'Mean daily rate testing across 5 physical testing positions:',
    mq_cosc_status: 'Official COSC Chronometer Status',

    // 3. Sanbouk
    sb_route_title: 'Red Sea Archipelago Maritime Voyage Planner',
    sb_from_lbl: 'Port of Departure',
    sb_to_lbl: 'Destination Anchorage',
    sb_days_lbl: 'Charter Duration (Days)',
    sb_yacht_lbl: 'Superyacht Class',
    sb_guests_lbl: 'VIP Guests Count',
    sb_catering_lbl: 'Royal Provisioning Tier',
    sb_miles_calc: 'Estimated Nautical Distance',
    sb_fuel_calc: 'Bunker Fuel Consumption',
    sb_total_calc: 'Total Charter & Harbor Fees',
    sb_contract_btn: 'Generate Charter Agreement',

    // 4. Aseel
    as_pedigree_title: 'Royal Arabian Stud Pedigree Tree (Ancestral Strains)',
    as_strain_lbl: 'Purebred Strain',
    as_sire_lbl: 'Sire Lineage',
    as_dam_lbl: 'Dam Lineage',
    as_auction_title: 'Live Sovereign Arabian Equine Auction',
    as_current_horse: 'Current Mare / Stallion in Ring',
    as_current_bid: 'Current Highest Bid',
    as_bid_count: 'Total Verified Bids',
    as_time_left: 'Time to Final Gavel Strike',
    as_place_bid_btn: 'Place Sovereign Bid (+50,000 SAR)',
    as_cert_btn: 'Genetic Authenticity Certificate',

    // 5. Zumurrud
    zm_matrix_title: 'The 4Cs Diamond Evaluation Matrix',
    zm_carat_lbl: 'Carat Weight',
    zm_color_lbl: 'Color Grade',
    zm_clarity_lbl: 'Clarity Scale',
    zm_cut_lbl: 'Cut & Proportions',
    zm_canvas_title: 'Spectral Prismatic Caustic Dispersion Canvas',
    zm_setting_title: 'Investment Solitaire Setting Designer',
    zm_metal_lbl: 'Precious Mounting Metal',
    zm_setting_lbl: 'Setting Architecture',
    zm_valuation_lbl: 'Real-Time GIA Market Valuation',

    // 6. Shaheen
    sh_dive_title: 'Tactical Aerodynamic Stoop Dive Telemetry',
    sh_altitude_slider: 'Stoop Starting Altitude (Meters)',
    sh_speed_calc: 'Terminal Dive Velocity',
    sh_gforce_calc: 'G-Force Peak at Pull-Out',
    sh_time_calc: 'Time-to-Target (Seconds)',
    sh_radar_title: 'Live Flight Radar & Bird Telemetry',
    sh_passport_title: 'Digital Sovereign Falcon Passport',
    sh_passport_btn: 'Issue Biometric Falcon Passport',

    // 7. Qassab
    qs_fabric_title: 'Authentic Hasawi Royal Bisht Atelier',
    qs_fabric_lbl: 'Master Fabric Grade',
    qs_darb_lbl: 'Royal Darbowiyyah Pattern',
    qs_zari_lbl: 'Pure Gold Zari Filament',
    qs_color_lbl: 'Royal Cloak Hue',
    qs_collar_title: 'Golden Collar Embroidery Simulation (Heilah & Burooj)',
    qs_measures_title: 'Tailoring Dimensions (cm)',
    qs_height_lbl: 'Bisht Length (Inches/cm)',
    qs_shoulder_lbl: 'Shoulder Width',
    qs_hours_lbl: 'Artisanal Handcrafting Hours',

    // 8. Maaedah
    md_seat_title: 'Private Chef’s Table Seating Floorplan',
    md_seat_vip: 'Royal Sovereign Booth',
    md_seat_counter: 'Interactive Chef Counter',
    md_seat_majlis: 'Private Majlis Salon',
    md_menu_title: '7-Course Royal Tasting Menu Configuration',
    md_radar_title: 'Sensory Flavor Profile Radar',
    md_allergens_lbl: 'Dietary & Allergen Filtering',
    md_ticket_btn: 'Generate VIP Banquet Ticket',

    // 9. Atheer
    at_calc_title: 'Great-Circle Private Jet Charter Calculator',
    at_origin_lbl: 'Departure Hub',
    at_dest_lbl: 'Arrival Destination',
    at_fleet_lbl: 'Aircraft Configuration',
    at_pax_lbl: 'Executive Passengers',
    at_dist_calc: 'Great-Circle Distance',
    at_duration_calc: 'Cruising Time',
    at_cost_calc: 'Comprehensive Charter Quotation',
    at_quote_btn: 'Export VIP Manifest & Flight Quotation',

    // 10. Iwan
    iw_estate_title: 'Sovereign Real Estate Investment Feasibility',
    iw_type_lbl: 'Trophy Asset Class',
    iw_price_lbl: 'Total Acquisition Value',
    iw_downpay_lbl: 'Cash Down Payment (%)',
    iw_yield_lbl: 'Net Annual Rental Yield',
    iw_caprate_lbl: 'Capitalization Rate (Cap Rate)',
    iw_roi_lbl: '10-Year Cumulative Projected ROI',
    iw_skyline_title: 'Panoramic Penthouse Skyline Simulator',
    iw_time_day: 'Radiant Daytime',
    iw_time_sunset: 'Golden Hour Sunset',
    iw_time_night: 'Midnight City Lights & Stars',

    // Footer
    footer_copy: 'All Rights Reserved © 2026 • Designed, Engineered & Architected by',
    footer_owner: 'Tareq Abuashi',
    footer_sub: 'An ultra-exclusive sovereign ecosystem engineered with state-of-the-art web performance and architectural purity.'
  }
};

export class I18nManager {
  private currentLang: Language = 'ar';

  constructor() {
    const saved = localStorage.getItem('nukhba_lang') as Language;
    if (saved === 'ar' || saved === 'en') {
      this.currentLang = saved;
    }
  }

  public getLang(): Language {
    return this.currentLang;
  }

  public setLang(lang: Language) {
    this.currentLang = lang;
    localStorage.setItem('nukhba_lang', lang);
    this.apply();
  }

  public toggle(): Language {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('nukhba_lang', this.currentLang);
    this.apply();
    return this.currentLang;
  }

  public t(key: string): string {
    return DICTIONARY[this.currentLang][key] || key;
  }

  public apply() {
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';

    const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
    elements.forEach((el) => {
      const key = el.dataset.i18n;
      if (key && DICTIONARY[this.currentLang][key]) {
        el.textContent = DICTIONARY[this.currentLang][key];
      }
    });

    const placeholders = document.querySelectorAll<HTMLInputElement>('[data-i18n-ph]');
    placeholders.forEach((el) => {
      const key = el.dataset.i18nPh;
      if (key && DICTIONARY[this.currentLang][key]) {
        el.placeholder = DICTIONARY[this.currentLang][key];
      }
    });
  }
}

export const i18n = new I18nManager();
