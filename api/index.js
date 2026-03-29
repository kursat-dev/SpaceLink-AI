const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load env vars
require('dotenv').config();

const connectDB = require('../server/config/db');

// ----- Express App -----
const app = express();
app.set('trust proxy', 1); // Fixes rate-limit X-Forwarded-For warning behind Vercel edge

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(apiLimiter);
app.use(express.json({ limit: '10mb' }));

// Language middleware
app.use((req, res, next) => {
  req.language = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
  next();
});

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/users', require('../server/routes/users'));
app.use('/api/projects', require('../server/routes/projects'));
app.use('/api/matches', require('../server/routes/matches'));
app.use('/api/recommendations', require('../server/routes/recommendations'));
app.use('/api/messages', require('../server/routes/messages'));
app.use('/api/notifications', require('../server/routes/notifications'));

// Health check (works even if DB is down)
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({
      status: 'ok',
      message: 'SpaceLink AI API is running on Vercel',
      timestamp: new Date()
    });
  } catch (e) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed'
    });
  }
});

// TEMPORARY SEED ROUTE
app.get('/api/internal/seed', async (req, res) => {
  try {
    await connectDB();
    const User = require('../server/models/User');
    const Project = require('../server/models/Project');
    const bcrypt = require('bcryptjs');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);
    
    // Engineers
    const engineers = [
      { name: 'Aslı Demir', email: 'asli.demir@orbital.tech', password, role: 'Engineer', title: 'Kıdemli Uzay Biyoloğu', bio: 'Mars ve Ay kolonizasyonunda sürdürülebilir yaşam destek sistemleri üzerine 8+ yıl deneyimli bilim insanı.', skills: ['Astrobiyoloji', 'Yaşam Destek Sistemleri', 'Hidroponik'], interests: ['Mars Kolonizasyonu'], location: 'Ankara, TR', isVerified: true, experienceLevel: 'Senior' },
      { name: 'Caner Yılmaz', email: 'caner.yilmaz@spacetech.io', password, role: 'Engineer', title: 'Aviyonik ve Yazılım Lideri', bio: 'Gömülü sistemler ve fırlatma araçları için uçuş kontrol yazılımları geliştirme konusunda uzman.', skills: ['Embedded systems', 'FPGA', 'C++', 'RTOS'], interests: ['Fırlatma Sistemleri'], location: 'İstanbul, TR', isVerified: true, experienceLevel: 'Lead' },
      { name: 'Elif Aksoy', email: 'elif.aksoy@satcom.net', password, role: 'Engineer', title: 'Uydu Haberleşme Uzmanı', bio: 'Ka-band ve L-band uydu haberleşme terminalleri ve yer istasyonu altyapıları üzerine uzmanlaşmış haberleşme mühendisi.', skills: ['Uydu Haberleşme', 'RF Design', 'Digital Signal Processing'], interests: ['Genişbant İnternet'], location: 'Ankara, TR', isVerified: false, experienceLevel: 'Mid-Level' }
    ];

    for (const eng of engineers) {
      const exists = await User.findOne({ email: eng.email });
      if (!exists) await User.create(eng);
    }

    // Companies
    const companies = [
      { name: 'Plan-S Uydu Teknolojileri', email: 'info@plan-s.tech', password, role: 'Company', title: 'Yeni Nesil Uydu Takım Yıldızı İşletmecisi', bio: 'Türkiye\'nin ilk ticari küp uydu takım yıldızını inşa eden teknoloji şirketi.', location: 'Ankara, TR', website: 'https://plan-s.tech', isVerified: true },
      { name: 'DeltaV Uzay Teknolojileri', email: 'contact@deltav.com.tr', password, role: 'Startup', title: 'Hibrit Roket Sistemleri Geliştiricisi', bio: 'Ay misyonları ve fırlatma araçları için hibrit roket motoru teknolojileri geliştiren öncü havacılık kuruluşu.', location: 'İstanbul, TR', website: 'https://deltav.com.tr', isVerified: true },
      { name: 'MoonGate Lojistik', email: 'hello@moongate.space', password, role: 'Startup', title: 'Ay Yörüngesi Lojistik Ağı', bio: 'Gateway istasyonu ve Ay yüzeyi arasında kargo transferi için otonom taşıyıcılar geliştiren uluslararası bir girişim.', location: 'Remote', website: 'https://moongate.space', isVerified: false }
    ];

    let createdCompanies = [];
    for (const comp of companies) {
      let existingComp = await User.findOne({ email: comp.email });
      if (!existingComp) existingComp = await User.create(comp);
      createdCompanies.push(existingComp);
    }

    // Projects
    const plansId = createdCompanies.find(c => c.name === 'Plan-S Uydu Teknolojileri')._id;
    const deltaVId = createdCompanies.find(c => c.name === 'DeltaV Uzay Teknolojileri')._id;
    const moongateId = createdCompanies.find(c => c.name === 'MoonGate Lojistik')._id;

    const projects = [
      { title: 'IoT Küp Uydu Takım Yıldızı Faz II', description: '6U form faktöründe 12 adet küp uydunun yörüngeye yerleştirilmesi ve veri transferi ağının optimize edilmesi projesi.', owner: plansId, requiredSkills: ['Uydu Haberleşme', 'Embedded systems', 'Yörünge Mekaniği'], tags: ['Küp Uydu', 'IoT', 'LEO'], budget: '2.5M - 5M TL', duration: '18 Ay', status: 'active' },
      { title: 'Hibrit Tahrikli Ay İniş Modülü Testleri', description: 'Ay yüzeyine yumuşak iniş gerçekleştirecek olan insansız modülün hibrit motor ateşleme ve stabilizasyon testleri.', owner: deltaVId, requiredSkills: ['İtki Sistemleri', 'Propulsion', 'Termal Analiz'], tags: ['Roket', 'Ay Misyonu'], budget: '1M - 2M TL', duration: '12 Ay', status: 'active' },
      { title: 'Otonom Lunar Transfer Aracı (LTA)', description: 'Gateway istasyonundan Ay yüzeyindeki üssümüze otonom kargo transferi yapacak olan uzay aracının kontrol yazılımı.', owner: moongateId, requiredSkills: ['Otonom Uçuş', 'AI/ML', 'C++'], tags: ['Lunar', 'Lojistik', 'Otonom'], budget: '$150k - $300k', duration: '24 Ay', status: 'active' }
    ];

    for (const proj of projects) {
      const exists = await Project.findOne({ title: proj.title });
      if (!exists) await Project.create(proj);
    }

    res.json({ status: 'success', message: 'Production seed completed' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Express Error:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// ----- Serverless Handler -----
module.exports = async (req, res) => {
  try {
    // Always connect to DB before handling any request
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('SERVERLESS HANDLER ERROR:', error);
    res.status(500).json({
      status: 'error',
      message: 'API boot error'
    });
  }
};
