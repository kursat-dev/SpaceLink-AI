# SpaceLink AI 🚀

**SpaceLink AI**, modern uzay endüstrisi için özel olarak tasarlanmış akıllı bir ekosistem eşleştirme platformudur. Havacılık mühendislerini, yörünge girişimlerini, uydu işletmelerini ve uzay odaklı yatırımcıları teknik sinerji ve proje gereksinimlerine göre bağlamak için sinirsel bir eşleştirme motoru kullanır.

---

### 🛰️ TUA Astrohackathon Projesi

Bu proje, **Türkiye Uzay Ajansı (TUA)** tarafından düzenlenen **[TUA Astrohackathon](https://tuaastrohackathon.com/tr)** için özel olarak geliştirilmiştir. 

*   **Kurum:** [Türkiye Uzay Ajansı (TUA)](https://tua.gov.tr/tr)
*   **Etkinlik:** [TUA Astrohackathon](https://tuaastrohackathon.com/tr)
*   **Misyon:** Uzay endüstrisindeki paydaşları bir araya getirerek "Yeni Uzay" (New Space) ekosistemini güçlendirmek.

---

![SpaceLink AI Preview](https://img.shields.io/badge/Status-Beta-purple)
![SpaceLink AI Tech](https://img.shields.io/badge/Stack-MERN-blue)
![SpaceLink AI i18n](https://img.shields.io/badge/i18n-EN%20%7C%20TR-green)
![SpaceLink AI License](https://img.shields.io/badge/License-MIT-green)

---

## 🌌 Temel Özellikler

- **Sinirsel Eşleştirme Motoru**: Mükemmel teknik ortakları bulmak için yetenekleri ve ilgi alanlarını analiz eden tescilli yapay zeka (Ağırlıklı Jaccard Benzerliği).
- **Görev Dizini (Mission Directory)**: Aktif yörünge projeleri, faydalı yükler ve alt sistemler için merkezi bir üs.
- **Gerçek Zamanlı Mesajlaşma**: Eşleşen taraflar arasında güvenli iletişim kanalları (Socket.io).
- **Uluslararasılaştırma (i18n)**: İngilizce ve Türkçe dilleri için tam destek ve gerçek zamanlı geçiş.
- **Göksel Kontrol Paneli (Celestial Architect)**: Glassmorphism esintili, modern ve premium kullanıcı arayüzü ile 360 derecelik ekosistem görünümü.
- **Dinamik Profiller**: Havacılık ve uzay profesyonelleri için yetenek tabanlı telemetri ve deneyim takibi.

---

## 🏗️ Proje Yapısı

Proje, modüler bir full-stack mimarisini takip eder:

```text
SpaceLink-AI/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Yeniden kullanılabilir UI bileşenleri
│   │   ├── pages/          # Sayfa tanımları
│   │   ├── context/        # Auth ve Global State
│   │   ├── locales/        # i18n (EN/TR) sözlükleri
│   │   └── api.js          # Axios istemcisi
├── server/                 # Backend (Node.js + Express)
│   ├── models/             # Mongoose (User, Project, Message)
│   ├── routes/             # API uç noktaları
│   ├── middleware/         # Auth ve Dil ayrıştırma
│   ├── config/             # DB ve Sunucu config
│   └── seed.js             # Mock veri oluşturma
├── api/                    # API dokümantasyonu
├── stitch/                 # Tasarım varlıkları ve stil rehberi
└── architecture_analysis.md # Detaylı teknik analiz
```

---

## 🛠️ Teknoloji Yığını

- **Frontend**: React 18, Vite, React Router 6, i18next, Vanilla CSS (Celestial Architect Design System).
- **Backend**: Node.js, Express, JWT, Bcrypt, Socket.io.
- **Veritabanı**: MongoDB + Mongoose.
- **İkonlar**: Google Material Symbols.
- **Dağıtım**: Vercel.

---

## 🚀 Başlangıç

### 1. Ön Koşullar
- Node.js (v16+)
- MongoDB (Yerel veya Atlas)

### 2. Backend Kurulumu
```bash
cd server
npm install
npm run dev
```
*Not: `MONGO_URI`, `JWT_SECRET` ve `PORT=5001` içeren bir `.env` dosyası oluşturun.*

### 3. Frontend Kurulumu
```bash
cd client
npm install
npm run dev
```

### 4. Veri Doldurma (Seeding)
Uygulamayı sektörel verilerle test etmek için:
```bash
cd server
node seed.js
```

---

## 📄 Dokümantasyon

- [İstemci (Client)](./client/README.md)
- [Sunucu (Server)](./server/README.md)
- [API Rehberi](./api/README.md)
- [Tasarım Rehberi](./stitch/README.md)
- [Mimari Analiz](./architecture_analysis.md)

---

## 🛡️ Lisans

MIT Lisansı altında dağıtılmaktadır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---

**SpaceLink AI** — *Akıllı bağlantılar aracılığıyla Yörünge Ekonomisine öncülük ediyor (Leading the Orbital Economy).*
