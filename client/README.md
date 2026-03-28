# SpaceLink AI - Client 🚀

**SpaceLink AI Frontend**, modern uzay endüstrisi ekosistemi için geliştirilmiş React tabanlı, yüksek performanslı kullanıcı arayüzüdür. "Celestial Architect" tasarım sistemi ile görsel olarak etkileyici ve fonksiyonel bir deneyim sunar.

![Frontend Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![React Version](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.0-orange)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20TR-green)

---

## 🌟 Özellikler

- **Tek Sayfa Uygulama (SPA)**: React Router 6 ile yönlendirme
- **Celestial Architect UI**: Glassmorphism temalı modern tasarım sistemi
- **Uluslararasılaştırma**: i18next ile gerçek zamanlı dil değiştirme (TR/EN)
- **Yetkilendirme**: JWT tabanlı kimlik doğrulama sistemi
- **Gerçek Zamanlı Veriler**: Socket.io entegrasyonu
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz

---

## 🏗️ Proje Yapısı

```text
client/
├── public/                 # Statik dosyalar
├── src/
│   ├── components/         # Yeniden kullanılabilir bileşenler
│   │   ├── common/         # Genel bileşenler (Header, Footer, vb.)
│   │   ├── forms/          # Form bileşenleri
│   │   └── ui/             # UI elementleri
│   ├── pages/              # Sayfa bileşenleri
│   │   ├── auth/           # Kimlik doğrulama sayfaları
│   │   ├── dashboard/      # Kontrol paneli
│   │   ├── projects/       # Proje yönetimi
│   │   └── profile/        # Kullanıcı profili
│   ├── context/            # React Context (Auth, Theme)
│   ├── locales/            # i18n çeviri dosyaları
│   ├── assets/             # Resim ve ikonlar
│   ├── api.js              # Axios API istemcisi
│   ├── i18n.js             # i18next yapılandırması
│   ├── index.css           # Global stiller
│   ├── App.jsx             # Ana uygulama bileşeni
│   └── main.jsx            # Uygulama giriş noktası
├── .env                    # Ortam değişkenleri
├── package.json            # Bağımlılıklar
└── vite.config.js          # Vite yapılandırması
```

---

## 🛠️ Teknoloji Yığını

### Core Technologies
- **React 18.2.0**: Modern React özellikleri (Hooks, Concurrent Features)
- **Vite 5.0**: Hızlı geliştirme ve build süreci
- **React Router 6.8**: Client-side routing
- **Axios**: HTTP istemcisi

### UI & Styling
- **Vanilla CSS**: "Celestial Architect" tasarım sistemi
- **Google Material Symbols**: İkon seti
- **CSS Variables**: Tema yönetimi

### Internationalization
- **i18next**: Çeviri yönetimi
- **react-i18next**: React entegrasyonu

### Development Tools
- **ESLint**: Kod kalitesi kontrolü
- **Vite PWA**: Progressive Web App desteği

---

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
- Node.js (v16+)
- npm veya yarn

### 2. Kurulum
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Build için
npm run build

# Preview build
npm run preview
```

### 3. Ortam Değişkenleri
`.env` dosyası oluşturun:
```env
VITE_API_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

---

## 📱 Sayfalar ve Bileşenler

### Ana Sayfalar
- **Landing**: Ana karşılama sayfası
- **Login/Register**: Kimlik doğrulama
- **Dashboard**: Ana kontrol paneli
- **Projects**: Proje listesi ve detayları
- **Profile**: Kullanıcı profili yönetimi
- **Messages**: Gerçek zamanlı mesajlaşma

### Ana Bileşenler
- **Header**: Navigasyon ve kullanıcı menüsü
- **Sidebar**: Ana navigasyon menüsü
- **Card**: Proje ve kullanıcı kartları
- **Modal**: Dialog ve form konteynerleri
- **Loading**: Yüklenme animasyonları

---

## 🎨 Tasarım Sistemi (Celestial Architect)

### Tema Renkleri
```css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --accent: #06b6d4;
  --background: #0f172a;
  --surface: #1e293b;
  --text: #f1f5f9;
}
```

### Glassmorphism Efektleri
- `backdrop-filter: blur(10px)`
- `background: rgba(255, 255, 255, 0.1)`
- `border: 1px solid rgba(255, 255, 255, 0.2)`

### Responsive Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

---

## 🌐 Uluslararasılaştırma

### Desteklenen Diller
- **Türkçe (tr)**: Varsayılan dil
- **İngilizce (en)**: Uluslararası destek

### Çeviri Dosyaları
```text
locales/
├── tr/
│   └── translation.json
└── en/
    └── translation.json
```

### Kullanım
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

---

## 🔧 API Entegrasyonu

### Axios İstemcisi
```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Request interceptor for JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Socket.io Bağlantısı
```javascript
// Gerçek zamanlı veri akışı
const socket = io(import.meta.env.VITE_SOCKET_URL);
socket.on('new-message', (message) => {
  // Mesaj işleme
});
```

---

## 🚀 Dağıtım

### Vercel Dağıtımı
```bash
# Build ve dağıtım
npm run build
vercel --prod
```

### Ortam Değişkenleri (Vercel)
- `VITE_API_URL`: Backend API URL
- `VITE_SOCKET_URL`: Socket.io URL

---

## 🧪 Geliştirme İpuçları

### Hot Module Replacement (HMR)
Vite ile dosya değişiklikleri anında yansıtılır.

### Component Development
- Bileşenleri `components/` klasöründe organize edin
- Props için TypeScript benzeri PropTypes kullanın
- Custom hooks için `hooks/` klasörü oluşturun

### Performance Optimizasyonu
- `React.memo()` ile gereksiz render'ları önleyin
- `useCallback()` ve `useMemo()` optimizasyonları
- Lazy loading ile code splitting uygulayın

---

## 🔍 Hata Ayıklama

### Common Issues
1. **CORS Hataları**: Backend CORS ayarlarını kontrol edin
2. **JWT Token**: Token süresi ve localStorage kontrolü
3. **Socket Bağlantısı**: Socket.io server durumunu kontrol edin

### Development Tools
- React DevTools
- Vite DevTools
- Browser Console

---

## 📝 Geliştirme Rehberi

1. **Yeni Bileşen**: `components/` klasörüne ekleyin
2. **Yeni Sayfa**: `pages/` klasöründe route tanımlayın
3. **Çeviri**: `locales/` dosyalarını güncelleyin
4. **Stil**: `index.css` veya bileşen içi CSS kullanın

---

**SpaceLink AI Client** — *Uzay endüstrisi için modern ve etkileyici kullanıcı deneyimi.*
