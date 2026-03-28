# SpaceLink AI 🚀

**SpaceLink AI**, modern uzay endüstrisi için özel olarak tasarlanmış akıllı bir ekosistem eşleştirme platformudur. Havacılık mühendislerini, yörünge girişimlerini, uydu işletmelerini ve uzay odaklı yatırımcıları teknik sinerji ve proje gereksinimlerine göre bağlamak için sinirsel bir eşleştirme motoru kullanır.

![SpaceLink AI Preview](https://img.shields.io/badge/Status-Beta-purple)
![SpaceLink AI Tech](https://img.shields.io/badge/Stack-MERN-blue)
![SpaceLink AI i18n](https://img.shields.io/badge/i18n-EN%20%7C%20TR-green)

---

## 🌌 Temel Özellikler

- **Sinirsel Eşleştirme Motoru**: Mükemmel teknik ortakları bulmak için yetenekleri ve ilgi alanlarını analiz eden tescilli yapay zeka (Ağırlıklı Jaccard Benzerliği).
- **Görev Dizini**: Aktif yörünge projeleri, faydalı yükler ve alt sistemler için merkezi bir üs.
- **Gerçek Zamanlı Mesajlaşma**: Eşleşen taraflar arasında güvenli iletişim kanalları.
- **Uluslararasılaştırma (i18n)**: Gerçek zamanlı arayüz değiştirme ile İngilizce ve Türkçe dilleri için yerel destek.
- **Göksel Kontrol Paneli**: Yörünge ağ durumunuzun 360 derecelik bir görünümünü sunan, yüksek kaliteli, glassmorphism esintili bir kullanıcı arayüzü ("Celestial Architect").
- **Dinamik Profiller**: Havacılık ve uzay işgücü için yetenek tabanlı telemetri ve deneyim takibi.

---

## 🏗️ Proje Yapısı

Proje, modüler bir full-stack mimarisini takip eder:

```text
SpaceLink-AI/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Yeniden kullanılabilir kullanıcı arayüzü bileşenleri
│   │   ├── pages/          # Bireysel ekran tanımları
│   │   ├── context/        # Kimlik doğrulama (Auth) ve global durum (state)
│   │   ├── locales/        # i18n (EN/TR) çeviri sözlükleri
│   │   └── api.js          # JWT interceptor'ları ile Axios istemcisi
│   └── index.html          # Giriş noktası
├── server/                 # Backend (Node.js + Express)
│   ├── models/             # Mongoose şemaları (User, Project, Message)
│   ├── routes/             # API uç noktaları (Auth, Matches, Projects, vb.)
│   ├── middleware/         # Kimlik doğrulama korumaları ve Dil ayrıştırma
│   ├── config/             # Veritabanı ve Sunucu yapılandırması
│   └── seed.js             # Sahte veri (mock data) oluşturma betiği
└── stitch/                 # Tasarım varlıkları ve orijinal stil rehberi
```

---

## 🛠️ Teknoloji Yığını

- **Frontend**: React 18, Vite, React Router 6, i18next, Vanilla CSS (Celestial Architect Tasarım Sistemi).
- **Backend**: Node.js, Express, JWT, Bcrypt.
- **Veritabanı**: MongoDB + Mongoose.
- **İkonlar**: Google Material Symbols.

---

## 🚀 Başlangıç

### 1. Ön Koşullar
- Node.js (v16+)
- MongoDB (Yerel olarak veya Atlas üzerinden çalışan)

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

### 4. Veritabanını Doldurma (Seeding)
Uygulamayı sahte uzay endüstrisi verileriyle doldurmak için:
```bash
cd server
node seed.js
```

---

## 🛡️ Lisans
MIT Lisansı altında dağıtılmaktadır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---

**SpaceLink AI** — *Akıllı bağlantılar aracılığıyla Yörünge Ekonomisine öncülük ediyor.*
