# Yüksek Düzey Özet

**SpaceLink AI**, modern uzay endüstrisi ekosistemi için özel olarak geliştirilmiş yapay zeka destekli bir eşleştirme (matchmaking) platformudur. Hızla büyüyen "Yeni Uzay" (New Space) çağında; havacılık ve uzay mühendislerini, yörünge teknolojileri geliştiren girişimleri, uydu firmalarını ve uzay odaklı yatırımcıları tek bir merkezde toplar. Projemiz, paydaşlar arasındaki iletişimsizliği ve doğru yetenek/proje eşleştirmesindeki zorlukları ortadan kaldırmayı hedefler. Geliştirdiğimiz "Neural Matching Engine" (Sinirsel Eşleştirme Motoru) sayesinde kullanıcılar; teknik sinerji, yetkinlikler ve proje gereksinimlerine göre en uygun mühendislik ve yatırım ortaklarıyla saniyeler içinde eşleşebilir. Uzay teknolojileri sektöründeki işbirliklerini ivmelendirerek, yörünge ve ötesindeki inovasyon süreçlerini hızlandıran yenilikçi bir köprü görevi görmektedir.

# Detaylı Çözüm

Uzay endüstrisinde projelerin başarıya ulaşması, yüksek uzmanlık gerektiren çok disiplinli ekiplerin (aviyonik, itki sistemleri, yörünge mekaniği vb.) ve doğru fon kaynaklarının bir araya gelmesine bağlıdır. SpaceLink AI, bu ihtiyaca yönelik kapsamlı ve odaklı bir çözüm sunar:

*   **Dinamik Profiller ve Görev Rehberi:** Kullanıcılar uzmanlık alanlarına, sahip oldukları telemetrik yetenek verilerine veya aradıkları/yürüttükleri projelere (Mission Directory) göre profillerini şekillendirir.
*   **Akıllı Eşleştirme (Neural Matching):** Yetkinlik tabanlı verileri analiz eden sistemimiz, doğru beceri setlerine sahip mühendisleri ve doğru vizyona sahip yatırımcıları doğrudan ilgili projelere yönlendirerek bir ağ (network) yaratır.
*   **Gerçek Zamanlı İletişim:** Eşleşen taraflar, entegre uçtan uca anlık mesajlaşma altyapısı sayesinde kesintisiz, hızlı ve güvenli bir şekilde iletişim kurarak proje detaylarını şekillendirebilir.
*   **Gelişmiş Gösterge Paneli:** Kullanıcılar, "Celestial Architect" adı verilen cam yansıması (glassmorphism) temelli estetik ve fonksiyonel arayüz üzerinden tüm uzay endüstrisi bağlantılarını, yeni eşleşmelerini ve aktif projelerini 360 derecelik bir açıyla aynı ekrandan kolayca yönetebilir.

# Teknik Yaklaşım

SpaceLink AI, yüksek performans, anlık tepkime süresi ve ölçeklenebilirlik kriterlerini sağlamak için modüler ve modern bir **MERN Stack** (MongoDB, Express.js, React.js, Node.js) mimarisi üzerine inşa edilmiştir:

*   **Yapay Zeka & Algoritma:** Eşleştirme motorumuz, kullanıcıların yetenek havuzları ile proje gereksinimleri arasındaki örtüşmeyi hassas bir şekilde hesaplamak için veri analizinde **Ağırlıklı Jaccard Benzerlik Algoritması** (Weighted Jaccard Similarity) ile güçlendirilmiş yenilikçi bir yapı kullanır.
*   **Frontend (İstemci):** Kullanıcı arayüzü **React 18** ve **Vite** ile geliştirilmiş, SPA (Tek Sayfa Uygulaması) prensibiyle yapılandırılmıştır. i18next mimarisi ile İngilizce ve Türkçe çift dil (i18n) desteği gerçek zamanlı render edilmekte, böylece hem yerel hem de global pazara uyum sağlanmaktadır. UI tasarımı "Vanilla CSS" standartlarında özgün olarak tasarlanmıştır.
*   **Backend & Veri Mimarisi:** Sunucu tarafında asenkron ve olay güdümlü **Node.js/Express.js** ile kapsamlı bir REST API geliştirilmiştir. Veri tutarlılığı ve esneklik, belge yönelimli NoSQL veritabanı **MongoDB** ve **Mongoose ODM** ile sağlanmaktadır.
*   **Gerçek Zamanlı Altyapı:** Eşleşmeler sonrası iletişim için **Socket.io** (WebSockets) kullanılarak çift yönlü, düşük gecikmeli, kesintisiz bir iletişim katmanı projeye entegre edilmiştir.
*   **Güvenlik Katmanı:** Uygulamadaki tüm kullanıcı kimlik denetimleri **JWT (JSON Web Token)** protokolü ile sürdürülürken, kritik veri güvenliğini sağlamak amacıyla şifreler **Bcrypt** algoritması ile hashlenerek saklanmaktadır.
