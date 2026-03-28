# SpaceLink AI - Server 🚀

**SpaceLink AI Backend**, modern uzay endüstrisi ekosistemi için geliştirilmiş Node.js tabanlı, yüksek performanslı REST API sunucusudur. JWT yetkilendirmesi, gerçek zamanlı mesajlaşma ve yapay zeka destekli eşleştirme algoritmaları ile güçlendirilmiştir.

![Backend Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.18.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)

---

## 🌟 Özellikler

- **RESTful API**: Express.js tabanlı modern API mimarisi
- **JWT Yetkilendirmesi**: Güvenli kimlik doğrulama sistemi
- **Sinirsel Eşleştirme**: Ağırlıklı Jaccard Benzerlik algoritması
- **Gerçek Zamanlı İletişim**: Socket.io ile WebSocket desteği
- **Veritabanı**: MongoDB + Mongoose ODM
- **Seed Data**: Test için sahte uzay endüstrisi verileri
- **CORS Desteği**: Cross-origin resource sharing
- **Hata Yönetimi**: Merkezi hata handling middleware

---

## 🏗️ Proje Yapısı

```text
server/
├── config/
│   └── db.js              # MongoDB bağlantı yapılandırması
├── middleware/
│   ├── auth.js            # JWT doğrulama middleware
│   ├── cors.js            # CORS ayarları
│   └── errorHandler.js    # Hata yönetimi
├── models/
│   ├── User.js            # Kullanıcı şeması
│   ├── Project.js         # Proje şeması
│   ├── Message.js         # Mesaj şeması
│   └── Match.js           # Eşleşme şeması
├── routes/
│   ├── auth.js            # Kimlik doğrulama endpoint'leri
│   ├── users.js           # Kullanıcı yönetimi
│   ├── projects.js        # Proje yönetimi
│   ├── messages.js        # Mesajlaşma
│   ├── matches.js         # Eşleştirme algoritması
│   └── upload.js          # Dosya yükleme
├── utils/
│   ├── matching.js        # Eşleştirme algoritması
│   └── validation.js      # Veri doğrulama
├── seed.js                # Veritabanı doldurma betiği
├── server.js              # Ana sunucu dosyası
├── socket.js              # Socket.io yapılandırması
├── .env                   # Ortam değişkenleri
└── package.json           # Bağımlılıklar
```

---

## 🛠️ Teknoloji Yığını

### Core Technologies
- **Node.js 18+**: JavaScript runtime environment
- **Express 4.18**: Web framework
- **MongoDB 6.0+**: NoSQL veritabanı
- **Mongoose 7.0**: MongoDB ODM

### Authentication & Security
- **JWT**: JSON Web Token authentication
- **Bcrypt**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

### Real-time Communication
- **Socket.io**: WebSocket library
- **Socket.io JWT**: JWT authentication for sockets

### Development Tools
- **Nodemon**: Auto-restart during development
- **Morgan**: HTTP request logger
- **Dotenv**: Environment variable management

---

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
- Node.js (v18+)
- MongoDB (yerel veya MongoDB Atlas)

### 2. Kurulum
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production modda çalıştır
npm start

# Veritabanını doldur
npm run seed
```

### 3. Ortam Değişkenleri
`.env` dosyası oluşturun:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/spacelink-ai
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

---

## 📊 Veritabanı Şemaları

### User Model
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // Bcrypt hash
  profile: {
    firstName: String,
    lastName: String,
    title: String,
    company: String,
    bio: String,
    skills: [String],
    experience: String,
    location: String
  },
  preferences: {
    language: String, // 'tr' or 'en'
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String, // 'satellite', 'launch', 'research', etc.
  status: String, // 'active', 'completed', 'cancelled'
  owner: ObjectId, // User ID
  requirements: {
    skills: [String],
    experience: String,
    budget: String,
    timeline: String
  },
  team: [ObjectId], // User IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  _id: ObjectId,
  sender: ObjectId, // User ID
  recipient: ObjectId, // User ID
  content: String,
  timestamp: Date,
  read: Boolean,
  type: String // 'text', 'file', 'system'
}
```

---

## 🔐 API Endpoint'leri

### Authentication (/api/auth)
- `POST /register` - Yeni kullanıcı kaydı
- `POST /login` - Kullanıcı girişi
- `GET /profile` - Kullanıcı profili (JWT gerekli)
- `PUT /profile` - Profil güncelleme (JWT gerekli)

### Users (/api/users)
- `GET /` - Tüm kullanıcıları listele (Admin)
- `GET /:id` - Kullanıcı detayı
- `PUT /:id` - Kullanıcı güncelleme
- `DELETE /:id` - Kullanıcı silme

### Projects (/api/projects)
- `GET /` - Proje listesi
- `POST /` - Yeni proje oluştur (JWT gerekli)
- `GET /:id` - Proje detayı
- `PUT /:id` - Proje güncelleme (JWT gerekli)
- `DELETE /:id` - Proje silme (JWT gerekli)

### Messages (/api/messages)
- `GET /` - Kullanıcı mesajları (JWT gerekli)
- `POST /` - Yeni mesaj gönder (JWT gerekli)
- `PUT /:id/read` - Mesajı okundu olarak işaretle (JWT gerekli)

### Matching (/api/matches)
- `GET /users` - Kullanıcı eşleştirmeleri (JWT gerekli)
- `GET /projects` - Proje eşleştirmeleri (JWT gerekli)
- `POST /calculate` - Eşleşme skoru hesapla (JWT gerekli)

---

## 🧠 Sinirsel Eşleştirme Algoritması

### Ağırlıklı Jaccard Benzerliği
```javascript
function weightedJaccardSimilarity(userSkills, projectRequirements) {
  const intersection = userSkills.filter(skill => 
    projectRequirements.includes(skill)
  );
  const union = [...new Set([...userSkills, ...projectRequirements])];
  
  // Ağırlıklandırma
  const weights = {
    technical: 0.6,
    experience: 0.3,
    location: 0.1
  };
  
  return intersection.length / union.length;
}
```

### Eşleşme Süreci
1. **Veri Toplama**: Kullanıcı yetenekleri ve proje gereksinimleri
2. **Benzerlik Hesaplama**: Jaccard benzerlik skoru
3. **Ağırlıklandırma**: Farklı kriterlere göre ağırlık uygula
4. **Sıralama**: En yüksek skorlu eşleşmeler
5. **Öneri**: Frontend'e sonuç gönder

---

## 🔌 Socket.io Gerçek Zamanlı İletişim

### Event'ler
- `connection`: Yeni kullanıcı bağlantısı
- `disconnect`: Kullanıcı ayrılması
- `join-room`: Odaya katılma
- `leave-room`: Odadan ayrılma
- `new-message`: Yeni mesaj
- `typing`: Yazıyor durumu
- `user-online`: Kullanıcı çevrimiçi

### Socket Middleware
```javascript
// JWT authentication for sockets
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.userId = decoded.userId;
    next();
  });
});
```

---

## 🛡️ Güvenlik

### JWT Implementation
- Access token: 15 dakika
- Refresh token: 7 gün
- Token blacklist sistemi
- Secure cookie settings

### Password Security
- Bcrypt ile hash'leme (salt rounds: 12)
- Minimum password length: 8 karakter
- Karmaşık karakter zorunluluğu

### Rate Limiting
- Login endpoint: 5 deneme/15 dakika
- API endpoint: 100 istek/dakika
- Upload endpoint: 10 istek/dakika

### CORS Settings
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://spacelink-ai.vercel.app']
    : ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

---

## 📝 Hata Yönetimi

### Error Types
- `ValidationError`: Veri doğrulama hataları
- `AuthenticationError`: Yetkilendirme hataları
- `NotFoundError`: Kaynak bulunamadı
- `DatabaseError`: Veritabanı hataları
- `RateLimitError`: Rate limit aşıldı

### Error Response Format
```javascript
{
  success: false,
  error: {
    type: 'ValidationError',
    message: 'Invalid input data',
    details: [
      {
        field: 'email',
        message: 'Invalid email format'
      }
    ]
  },
  timestamp: '2024-01-01T00:00:00.000Z'
}
```

---

## 🧪 Test Verileri (Seed)

### Seed Script Özellikleri
- **50+ Kullanıcı**: Farklı uzay endüstrisi rolleri
- **30+ Proje**: Çeşitli kategorilerde
- **100+ Mesaj**: Gerçekçi mesajlaşma verileri
- **Eşleşmeler**: Önceden hesaplanmış eşleşme skorları

### Seed Çalıştırma
```bash
# Veritabanını temizle ve yeniden doldur
npm run seed

# Sadece yeni veriler ekle
node seed.js --append
```

---

## 📊 Performance Optimizasyonu

### Database Indexing
```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ "profile.skills": 1 });

// Project indexes
db.projects.createIndex({ owner: 1 });
db.projects.createIndex({ category: 1 });
db.projects.createIndex({ status: 1 });

// Message indexes
db.messages.createIndex({ sender: 1, recipient: 1 });
db.messages.createIndex({ timestamp: -1 });
```

### Caching Strategy
- **Redis**: Session management
- **Memory Cache**: Frequent queries
- **CDN**: Static assets

### API Response Optimization
- Pagination: `limit` ve `skip` parametreleri
- Field selection: `fields` query parametresi
- Compression: Gzip response compression

---

## 🚀 Dağıtım

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/spacelink-ai
JWT_SECRET=super-secure-production-secret
CORS_ORIGIN=https://spacelink-ai.vercel.app
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'spacelink-server',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    }
  }]
};
```

---

## 🔍 Monitoring ve Logging

### Winston Logging
```javascript
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Check Endpoint
```javascript
GET /api/health
{
  status: 'ok',
  timestamp: '2024-01-01T00:00:00.000Z',
  uptime: 3600,
  database: 'connected',
  memory: {
    used: '150MB',
    total: '512MB'
  }
}
```

---

## 📝 Geliştirme İpuçları

### Code Organization
- Route'ları ayrı dosyalarda tutun
- Middleware'leri yeniden kullanılabilir yapın
- Validation'ları merkezi yönetin

### Best Practices
- Async/await kullanın
- Error handling için try-catch blokları
- Input validation her zaman yapın
- Loglama için structured logging kullanın

### Security Considerations
- Never store passwords in plain text
- Always validate and sanitize input
- Use HTTPS in production
- Implement rate limiting

---

**SpaceLink AI Server** — *Güvenli, ölçeklenebilir ve akıllı uzay endüstrisi API'si.*
