# SpaceLink AI - Stitch 🎨

**Stitch**, SpaceLink AI projesinin tasarım varlıkları, stil rehberleri ve UI/UX prensiplerini içeren merkezi tasarım deposudur. "Celestial Architect" tasarım sisteminin orijinalleri ve görsel kaynakları bu klasörde organize edilmiştir.

![Design Status](https://img.shields.io/badge/Status-Design%20System-purple)
![Figma](https://img.shields.io/badge/Tool-Figma-orange)
![Adobe XD](https://img.shields.io/badge/Tool-Adobe%20XD-blue)
![Sketch](https://img.shields.io/badge/Tool-Sketch-orange)

---

## 🌟 Tasarım Felsefesi

### Celestial Architect
SpaceLink AI'nın görsel kimliği, modern uzay endüstrisinin yenilikçi ruhunu yansıtan "Celestial Architect" konsepti üzerine kuruludur:

- **Glassmorphism**: Modern ve şeffaf arayüz elementleri
- **Uzay Teması**: Koyu arka planlar ve parlak vurgular
- **Teknoloji Odaklı**: Temiz, minimalist ve fonksiyonel tasarım
- **Erişilebilirlik**: WCAG 2.1 AA standartlarına uygunluk

---

## 🏗️ Klasör Yapısı

```text
stitch/
├── astra_nova/                 # Ana marka kimliği ve logo
│   ├── logo_variants/          # Logo farklı formatları
│   ├── color_palette/          # Renk paleti ve kuralları
│   └── brand_guidelines/       # Marka kullanım rehberi
├── spacelink_ai_dashboard/      # Ana kontrol paneli tasarımı
│   ├── wireframes/              # Wireframe tasarımları
│   ├── mockups/                # Yüksek çözünürlüklü mockup'lar
│   ├── components/              # UI bileşenleri
│   └── interactions/           # Etkileşim desenleri
├── spacelink_ai_landing_page/   # Ana sayfa tasarımı
│   ├── hero_section/            # Hero bölümü
│   ├── features/                # Özellikler bölümü
│   └── call_to_action/          # Eylem çağrıları
├── spacelink_ai_matching_system/ # Eşleştirme sistemi UI
│   ├── algorithm_visualization/ # Algoritma görselleştirmesi
│   ├── matching_cards/          # Eşleşme kartları
│   └── filters/                 # Filtreleme arayüzü
├── spacelink_ai_project_detail/  # Proje detay sayfaları
│   ├── project_overview/        # Proje genel bakış
│   ├── team_management/         # Takım yönetimi
│   └── progress_tracking/       # İlerleme takibi
└── spacelink_ai_user_profile/    # Kullanıcı profili
    ├── profile_layout/          # Profil düzeni
    ├── skills_section/          # Yetenekler bölümü
    └── portfolio/               # Portfolyo gösterimi
```

---

## 🎨 Renk Sistemi

### Ana Renk Paleti
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-900: #1e3a8a;

  /* Secondary Colors */
  --secondary-50: #faf5ff;
  --secondary-100: #f3e8ff;
  --secondary-500: #a855f7;
  --secondary-600: #9333ea;
  --secondary-900: #581c87;

  /* Accent Colors */
  --accent-50: #f0fdfa;
  --accent-100: #ccfbf1;
  --accent-500: #14b8a6;
  --accent-600: #0d9488;
  --accent-900: #134e4a;

  /* Neutral Colors */
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-500: #64748b;
  --neutral-900: #0f172a;
}
```

### Tema Renkleri
- **Koyu Tema**: `--neutral-900` arka plan
- **Açık Vurgular**: `--primary-500` ve `--secondary-500`
- **Başarı**: `--accent-500` yeşil tonları
- **Uyarı**: Turuncu ve sarı tonları
- **Hata**: Kırmızı tonları

---

## 🔤 Tipografi

### Font Hiyerarşisi
```css
/* Headings */
h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
h2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }

/* Body Text */
p { font-size: 1rem; font-weight: 400; line-height: 1.6; }
small { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }

/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Tipografi Kuralları
- **Ana Başlık**: 2.5rem, Bold, `--neutral-50`
- **İkincil Başlık**: 2rem, Semibold, `--neutral-100`
- **Metin**: 1rem, Regular, `--neutral-300`
- **Küçük Metin**: 0.875rem, Regular, `--neutral-400`

---

## 🎯 Glassmorphism Efektleri

### Temel Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-dark {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Glassmorphism Varyasyonları
- **Card**: Hafif blur, şeffaf arka plan
- **Modal**: Yüksek blur, daha opak
- **Navigation**: Orta blur, kenar vurgusu
- **Buttons**: Minimal blur, hover efektleri

---

## 🖼️ İkon Sistemi

### Material Symbols
SpaceLink AI, Google Material Symbols ikon setini kullanır:

```css
/* Icon Sizes */
.icon-xs { font-size: 16px; }
.icon-sm { font-size: 20px; }
.icon-md { font-size: 24px; }
.icon-lg { font-size: 32px; }
.icon-xl { font-size: 48px; }

/* Icon Colors */
.icon-primary { color: var(--primary-500); }
.icon-secondary { color: var(--secondary-500); }
.icon-accent { color: var(--accent-500); }
.icon-neutral { color: var(--neutral-400); }
```

### Özel İkonlar
- **SpaceLink Logo**: Özel tasarım SVG
- **Uzay Temalı**: Roket, uydu, gezegen ikonları
- **Teknoloji**: Kod, API, veritabanı ikonları

---

## 📱 Responsive Tasarım

### Breakpoint'ler
```css
/* Mobile */
@media (max-width: 767px) {
  /* Mobile-specific styles */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet-specific styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop-specific styles */
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Large desktop styles */
}
```

### Grid Sistemi
- **Mobile**: 1 column (320px+)
- **Tablet**: 2 columns (768px+)
- **Desktop**: 3-4 columns (1024px+)
- **Large**: 4-6 columns (1440px+)

---

## 🎭 Bileşen Tasarımları

### Card Bileşeni
```css
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}
```

### Button Bileşeni
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
}
```

### Input Bileşeni
```css
.input-field {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--neutral-100);
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

---

## 🌊 Animasyon ve Geçişler

### Temel Animasyonlar
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide In */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### Geçiş Süreleri
- **Hızlı**: 0.15s (hover efektleri)
- **Normal**: 0.3s (bileşen geçişleri)
- **Yavaş**: 0.5s (sayfa geçişleri)
- **Çok Yavaş**: 1s (yüklenme animasyonları)

---

## 🎯 Erişilebilirlik

### WCAG 2.1 AA Standartları
- **Kontrast Oranları**: Minimum 4.5:1 (normal metin)
- **Klavye Navigasyonu**: Tüm interactive elementler
- **Screen Reader**: Semantic HTML ve ARIA etiketleri
- **Odak Yönetimi**: Clear focus indicators

### Erişilebilirlik Özellikleri
- **High Contrast Modu**: Gelişmiş kontrast seçeneği
- **Large Text**: Font boyutu artırma
- **Keyboard Shortcuts**: Klavye kısayolları
- **Screen Reader Support**: NVDA, JAWS uyumluluğu

---

## 📐 Grid ve Layout

### Container Grid
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

### Flexbox Utilities
```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.gap-4 { gap: 16px; }
```

---

## 🎨 Özel Efektler

### Gradient'ler
```css
.gradient-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
}

.gradient-accent {
  background: linear-gradient(135deg, var(--accent-500), var(--primary-500));
}

.gradient-dark {
  background: linear-gradient(135deg, var(--neutral-900), var(--neutral-800));
}
```

### Shadow Efektleri
```css
.shadow-sm { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }
.shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.shadow-lg { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }
.shadow-xl { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1); }
```

---

## 📱 Mobil Optimizasyon

### Touch Targets
- **Minimum Boyut**: 44px × 44px
- **Spacing**: Elementler arası minimum 8px
- **Gesture Support**: Swipe, pinch, tap desteği

### Mobil İlk Yaklaşım
- **Thumb Zone**: Alt kısımda önemli elementler
- **Progressive Disclosure**: Bilgiyi aşamalı göster
- **Mobile Navigation**: Hamburger menü veya bottom nav

---

## 🔧 Tasarım Araçları

### Figma
- **Component Library**: Yeniden kullanılabilir bileşenler
- **Design Tokens**: Renk, tipografi, spacing
- **Prototyping**: Interactive prototipler
- **Version Control**: Tasarım geçmişi

### Adobe XD
- **Wireframing**: Hızlı wireframe oluşturma
- **Voice Prototyping**: Sesli komutlar
- **Auto-Animate**: Otomatik animasyonlar
- **Design Specs**: Geliştirici teslimatı

---

## 📝 Tasarım Dokümantasyonu

### Component Documentation
Her bileşen için:
- **Purpose**: Bileşenin amacı
- **Props**: Kullanılabilir özellikler
- **States**: Farklı durumlar (hover, active, disabled)
- **Usage**: Kullanım örnekleri
- **Accessibility**: Erişilebilirlik notları

### Design Tokens
```json
{
  "colors": {
    "primary": {
      "50": "#eff6ff",
      "500": "#3b82f6",
      "900": "#1e3a8a"
    }
  },
  "typography": {
    "fontFamily": "Inter",
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "md": "1rem",
      "lg": "1.125rem"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px"
  }
}
```

---

## 🚀 Implementation Guide

### CSS-to-React Conversion
```jsx
// CSS Variable kullanımı
const Card = ({ children, className }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

// Styled Components ile
const StyledCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
`;
```

### Performance Optimizasyonı
- **CSS-in-JS**: Dinamik stiller için
- **Critical CSS**: Önemli stiller inline
- **Image Optimization**: Modern formatlar (WebP, AVIF)
- **Lazy Loading**: Resim ve bileşenler için

---

## 🔄 Design System Maintenance

### Version Control
- **Semantic Versioning**: Major.Minor.Patch
- **Changelog**: Değişiklik logu
- **Migration Guide**: Sürüm geçiş rehberi
- **Deprecation**: Eski bileşenlerin kaldırılması

### Quality Assurance
- **Design Reviews**: Düzenli tasarım incelemeleri
- **User Testing**: Kullanıcı testleri
- **Accessibility Audit**: Erişilebilirlik denetimleri
- **Performance Testing**: Performans testleri

---

**SpaceLink AI Stitch** — *Uzay endüstrisi için tutarlı, modern ve etkileyici tasarım sistemi.*
