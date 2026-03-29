const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');

const MONGODB_URI = "mongodb+srv://dbUser:m3pmyJMujCa7@cluster0.ilogswy.mongodb.net/spacelinkaı?appName=Cluster0";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Cluster for Seeding...');

    // 1. Create Diverse Engineers
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);
    
    const engineers = [
      {
        name: 'Aslı Demir',
        email: 'asli.demir@orbital.tech',
        password,
        role: 'Engineer',
        title: 'Kıdemli Uzay Biyoloğu',
        bio: 'Mars ve Ay kolonizasyonunda sürdürülebilir yaşam destek sistemleri üzerine 8+ yıl deneyimli bilim insanı. NASA Ames Research Center ile ortak projeler yürütmüştür.',
        skills: ['Astrobiyoloji', 'Yaşam Destek Sistemleri', 'Hidroponik', 'Biyo-sensörler'],
        interests: ['Mars Kolonizasyonu', 'Sürdürülebilirlik', 'Derin Uzay Araştırmaları'],
        location: 'Ankara, TR',
        isVerified: true,
        experienceLevel: 'Senior'
      },
      {
        name: 'Caner Yılmaz',
        email: 'caner.yilmaz@spacetech.io',
        password,
        role: 'Engineer',
        title: 'Aviyonik ve Yazılım Lideri',
        bio: 'Gömülü sistemler ve fırlatma araçları için uçuş kontrol yazılımları geliştirme konusunda uzman. FPGA ve gerçek zamanlı işletim sistemleri (RTOS) mimarı.',
        skills: ['Embedded systems', 'FPGA', 'C++', 'RTOS', 'Simulink'],
        interests: ['Fırlatma Sistemleri', 'Uydular', 'Otonom Uçuş'],
        location: 'İstanbul, TR',
        isVerified: true,
        experienceLevel: 'Lead'
      },
      {
        name: 'Elif Aksoy',
        email: 'elif.aksoy@satcom.net',
        password,
        role: 'Engineer',
        title: 'Uydu Haberleşme Uzmanı',
        bio: 'Ka-band ve L-band uydu haberleşme terminalleri ve yer istasyonu altyapıları üzerine uzmanlaşmış haberleşme mühendisi.',
        skills: ['Uydu Haberleşme', 'RF Design', 'Digital Signal Processing', 'Anten Tasarımı'],
        interests: ['Genişbant İnternet', 'Küp Uydular', 'Yer İstasyonları'],
        location: 'Ankara, TR',
        isVerified: false,
        experienceLevel: 'Mid-Level'
      }
    ];

    // Check for duplicates first before inserting
    for (const eng of engineers) {
      const exists = await User.findOne({ email: eng.email });
      if (!exists) {
        await User.create(eng);
        console.log(`Engineer ${eng.name} added.`);
      }
    }

    // 2. Create Company Entities
    const companies = [
      {
        name: 'Plan-S Uydu Teknolojileri',
        email: 'info@plan-s.tech',
        password,
        role: 'Company',
        title: 'Yeni Nesil Uydu Takım Yıldızı İşletmecisi',
        bio: 'Türkiye\'nin ilk ticari küp uydu takım yıldızını inşa eden teknoloji şirketi. IoT ve yer gözlemi alanında devrim yaratmayı hedefliyoruz.',
        location: 'Ankara, TR',
        website: 'https://plan-s.tech',
        isVerified: true
      },
      {
        name: 'DeltaV Uzay Teknolojileri',
        email: 'contact@deltav.com.tr',
        password,
        role: 'Startup',
        title: 'Hibrit Roket Sistemleri Geliştiricisi',
        bio: 'Ay misyonları ve fırlatma araçları için hibrit roket motoru teknolojileri geliştiren öncü savunma ve havacılık kuruluşu.',
        location: 'İstanbul, TR',
        website: 'https://deltav.com.tr',
        isVerified: true
      },
      {
        name: 'MoonGate Lojistik',
        email: 'hello@moongate.space',
        password,
        role: 'Startup',
        title: 'Ay Yörüngesi Lojistik Ağı',
        bio: 'Gateway istasyonu ve Ay yüzeyi arasında kargo transferi için otonom taşıyıcılar geliştiren uluslararası bir girişim.',
        location: 'Remote',
        website: 'https://moongate.space',
        isVerified: false
      }
    ];

    let createdCompanies = [];
    for (const comp of companies) {
      let existingComp = await User.findOne({ email: comp.email });
      if (!existingComp) {
        existingComp = await User.create(comp);
        console.log(`Company ${comp.name} added.`);
      }
      createdCompanies.push(existingComp);
    }

    // 3. Create Projects linked to Companies
    const plansId = createdCompanies.find(c => c.name === 'Plan-S Uydu Teknolojileri')._id;
    const deltaVId = createdCompanies.find(c => c.name === 'DeltaV Uzay Teknolojileri')._id;
    const moongateId = createdCompanies.find(c => c.name === 'MoonGate Lojistik')._id;

    const projects = [
      {
        title: 'IoT Küp Uydu Takım Yıldızı Faz II',
        description: '6U form faktöründe 12 adet küp uydunun yörüngeye yerleştirilmesi ve veri transferi ağının optimize edilmesi projesi. LEO yörüngesinde düşük gecikmeli haberleşme hedeflenmektedir.',
        owner: plansId,
        requiredSkills: ['Uydu Haberleşme', 'Embedded systems', 'Yörünge Mekaniği', 'Python'],
        tags: ['Küp Uydu', 'IoT', 'LEO', 'Haberleşme'],
        budget: '2.5M - 5M TL',
        duration: '18 Ay',
        location: 'Ankara / Hibrit',
        status: 'active'
      },
      {
        title: 'Hibrit Tahrikli Ay İniş Modülü Testleri',
        description: 'Ay yüzeyine yumuşak iniş gerçekleştirecek olan insansız modülün hibrit motor ateşleme ve stabilizasyon testleri için uzmanlar aranıyor.',
        owner: deltaVId,
        requiredSkills: ['İtki Sistemleri', 'Propulsion', 'Termal Analiz', 'Simulink'],
        tags: ['Roket', 'Ay Misyonu', 'Hibrit Motor', 'Test'],
        budget: '1M - 2M TL',
        duration: '12 Ay',
        location: 'İstanbul / Saha Testi',
        status: 'active'
      },
      {
        title: 'Otonom Lunar Transfer Aracı (LTA) Geliştirme',
        description: 'Gateway istasyonundan Ay yüzeyindeki üssümüze otonom kargo transferi yapacak olan uzay aracının navigasyon ve kontrol yazılımı üzerine çalışılacaktır.',
        owner: moongateId,
        requiredSkills: ['Otonom Uçuş', 'AI/ML', 'C++', 'Yörünge Mekaniği'],
        tags: ['Lunar', 'Lojistik', 'Otonom', 'Derin Uzay'],
        budget: '$150k - $300k',
        duration: '24 Ay',
        location: 'Uzaktan (Global)',
        status: 'active'
      },
      {
        title: 'Yörüngesel Enkaz Yakalama Ağı Tasarımı',
        description: 'Alçak Dünya yörüngesindeki aktif olmayan uydu parçalarını güvenli bir şekilde atmosferde imha etmek için geliştirdiğimiz ağ yakalama mekanizmasının mekanik tasarımı.',
        owner: plansId,
        requiredSkills: ['Mekanik Tasarım', 'Robotik', 'Yörünge Mekaniği', 'Malzeme Bilimi'],
        tags: ['Uzay Temizliği', 'Sürdürülebilirlik', 'Mekanik', 'Robotik'],
        budget: '500k - 1M TL',
        duration: '9 Ay',
        location: 'Ankara',
        status: 'active'
      }
    ];

    for (const proj of projects) {
      const exists = await Project.findOne({ title: proj.title });
      if (!exists) {
        await Project.create(proj);
        console.log(`Project ${proj.title} added.`);
      }
    }

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
