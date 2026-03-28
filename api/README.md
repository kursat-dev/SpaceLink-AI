# SpaceLink AI - API Dokümantasyonu 📚

**SpaceLink AI API**, modern uzay endüstrisi ekosistemi için geliştirilmiş RESTful API'dir. JWT yetkilendirmesi, gerçek zamanlı mesajlaşma ve yapay zeka destekli eşleştirme algoritmaları sunar.

![API Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Version](https://img.shields.io/badge/Version-v1.0.0-blue)
![Base URL](https://img.shields.io/badge/Base%20URL-http://localhost:5001-orange)

---

## 🌟 Genel Bakış

### API Özellikleri
- **RESTful Architecture**: Standart HTTP metodları
- **JWT Authentication**: Güvenli kimlik doğrulama
- **Real-time Communication**: Socket.io WebSocket desteği
- **Neural Matching**: AI destekli eşleştirme
- **Internationalization**: Çoklu dil desteği
- **Rate Limiting**: API koruma mekanizması

### Base URL
```
Development: http://localhost:5001/api
Production: https://spacelink-ai.vercel.app/api
```

### Content-Type
Tüm API istekleri için:
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication

### JWT Token Yapısı
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user",
    "iat": 1516239022,
    "exp": 1516242622
  }
}
```

### Token Kullanımı
```javascript
// Request headers
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

### Token Yenileme
Access token 15 dakika geçerlidir. Refresh token ile yenileme:
```bash
POST /api/auth/refresh
{
  "refreshToken": "refresh_token_here"
}
```

---

## 👤 Authentication Endpoints

### Kullanıcı Kaydı
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "title": "Aerospace Engineer",
    "company": "SpaceTech Inc",
    "bio": "5+ years experience in satellite systems",
    "skills": ["satellite-communications", "orbital-mechanics", "python"],
    "experience": "senior",
    "location": "Istanbul, Turkey"
  },
  "preferences": {
    "language": "tr",
    "notifications": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "profile": { ... }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

### Kullanıcı Girişi
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

### Profil Getirme
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "profile": { ... },
    "preferences": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Profil Güncelleme
```http
PUT /api/auth/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Smith",
    "title": "Senior Aerospace Engineer",
    "company": "Advanced Space Systems",
    "bio": "10+ years in satellite communications",
    "skills": ["satellite-communications", "orbital-mechanics", "python", "machine-learning"],
    "experience": "senior",
    "location": "Ankara, Turkey"
  }
}
```

---

## 👥 User Endpoints

### Kullanıcı Listesi
```http
GET /api/users?page=1&limit=10&skill=satellite-communications
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Sayfa numarası (default: 1)
- `limit`: Kullanıcı sayısı (default: 10, max: 50)
- `skill`: Yetenek filtresi
- `location`: Konum filtresi
- `experience`: Deneyim seviyesi

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "profile": {
          "firstName": "John",
          "lastName": "Doe",
          "title": "Aerospace Engineer",
          "skills": ["satellite-communications", "orbital-mechanics"],
          "location": "Istanbul, Turkey"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

### Kullanıcı Detayı
```http
GET /api/users/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "profile": { ... },
    "projects": [
      {
        "id": "507f1f77bcf86cd799439012",
        "title": "Satellite Communication System",
        "status": "active"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🚀 Project Endpoints

### Proje Listesi
```http
GET /api/projects?page=1&limit=10&category=satellite&status=active
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Sayfa numarası
- `limit`: Proje sayısı
- `category`: Proje kategorisi
- `status`: Proje durumu
- `owner`: Proje sahibi ID

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "507f1f77bcf86cd799439012",
        "title": "Low Earth Orbit Satellite Network",
        "description": "Building a global satellite communication network",
        "category": "satellite",
        "status": "active",
        "owner": {
          "id": "507f1f77bcf86cd799439011",
          "username": "johndoe",
          "profile": { ... }
        },
        "requirements": {
          "skills": ["satellite-communications", "rf-engineering"],
          "experience": "intermediate",
          "budget": "$500K",
          "timeline": "12 months"
        },
        "team": ["507f1f77bcf86cd799439013"],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### Yeni Proje Oluşturma
```http
POST /api/projects
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Mars Colony Communication System",
  "description": "Developing communication systems for Mars colony",
  "category": "research",
  "requirements": {
    "skills": ["deep-space-communication", "antenna-design", "signal-processing"],
    "experience": "senior",
    "budget": "$2M",
    "timeline": "24 months"
  }
}
```

### Proje Detayı
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

### Proje Güncelleme
```http
PUT /api/projects/:id
Authorization: Bearer <token>
```

### Proje Silme
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

---

## 💬 Message Endpoints

### Mesaj Listesi
```http
GET /api/messages?page=1&limit=20&unread=true
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Sayfa numarası
- `limit`: Mesaj sayısı
- `unread`: Sadece okunmamış mesajlar (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "507f1f77bcf86cd799439014",
        "sender": {
          "id": "507f1f77bcf86cd799439011",
          "username": "johndoe",
          "profile": { ... }
        },
        "recipient": {
          "id": "507f1f77bcf86cd799439013",
          "username": "janedoe"
        },
        "content": "I'm interested in your satellite project",
        "timestamp": "2024-01-01T12:00:00.000Z",
        "read": false,
        "type": "text"
      }
    ],
    "pagination": { ... }
  }
}
```

### Yeni Mesaj Gönderme
```http
POST /api/messages
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recipient": "507f1f77bcf86cd799439013",
  "content": "I'd like to discuss collaboration opportunities",
  "type": "text"
}
```

### Mesaj Okundu İşaretleme
```http
PUT /api/messages/:id/read
Authorization: Bearer <token>
```

---

## 🎯 Matching Endpoints

### Kullanıcı Eşleştirmeleri
```http
GET /api/matches/users?limit=10&skill=python
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "user": {
          "id": "507f1f77bcf86cd799439011",
          "username": "johndoe",
          "profile": { ... }
        },
        "score": 0.85,
        "matchedSkills": ["python", "machine-learning", "data-analysis"],
        "reason": "High skill compatibility in AI and data science"
      }
    ]
  }
}
```

### Proje Eşleştirmeleri
```http
GET /api/matches/projects?limit=10&category=satellite
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "project": {
          "id": "507f1f77bcf86cd799439012",
          "title": "Satellite Communication System",
          "requirements": { ... }
        },
        "score": 0.92,
        "matchedSkills": ["satellite-communications", "rf-engineering"],
        "reason": "Perfect match for satellite communication expertise"
      }
    ]
  }
}
```

### Eşleşme Skoru Hesaplama
```http
POST /api/matches/calculate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "user-project",
  "userId": "507f1f77bcf86cd799439011",
  "projectId": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 0.87,
    "breakdown": {
      "skills": 0.75,
      "experience": 0.90,
      "location": 0.80,
      "availability": 0.95
    },
    "recommendations": [
      "Strong match in satellite communications",
      "Compatible experience level",
      "Same geographic region"
    ]
  }
}
```

---

## 📁 File Upload Endpoints

### Profil Resmi Yükleme
```http
POST /api/upload/profile-picture
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [image file]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/profile-pictures/user123.jpg",
    "filename": "user123.jpg",
    "size": 245760
  }
}
```

### Proje Dosyası Yükleme
```http
POST /api/upload/project-file
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [document file]
projectId: "507f1f77bcf86cd799439012"
```

---

## 🔌 Socket.io Events

### Connection Events
```javascript
// Client connection
socket.emit('authenticate', { token: 'jwt_token' });

// Server response
socket.on('authenticated', (user) => {
  console.log('Authenticated as:', user.username);
});

socket.on('authentication_error', (error) => {
  console.error('Authentication failed:', error);
});
```

### Message Events
```javascript
// Send message
socket.emit('send_message', {
  recipient: 'user_id',
  content: 'Hello!',
  type: 'text'
});

// Receive message
socket.on('new_message', (message) => {
  console.log('New message:', message);
});

// Typing indicators
socket.emit('typing', { recipient: 'user_id' });
socket.on('user_typing', (user) => {
  console.log(user.username, 'is typing...');
});
```

### Online Status Events
```javascript
// User online status
socket.on('user_online', (userId) => {
  console.log('User came online:', userId);
});

socket.on('user_offline', (userId) => {
  console.log('User went offline:', userId);
});

// Get online users
socket.emit('get_online_users');
socket.on('online_users', (users) => {
  console.log('Online users:', users);
});
```

---

## 🚨 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "type": "ValidationError",
    "message": "Invalid input data",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "INVALID_EMAIL"
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/auth/register"
}
```

### HTTP Status Codes
- `200 OK`: Başarılı işlem
- `201 Created`: Yeni kaynak oluşturuldu
- `400 Bad Request`: Geçersiz istek
- `401 Unauthorized`: Yetkilendirme hatası
- `403 Forbidden`: Erişim reddedildi
- `404 Not Found`: Kaynak bulunamadı
- `409 Conflict`: Çakışma (duplicate data)
- `422 Unprocessable Entity`: Veri doğrulama hatası
- `429 Too Many Requests`: Rate limit aşıldı
- `500 Internal Server Error`: Sunucu hatası

### Error Types
- `ValidationError`: Veri doğrulama hataları
- `AuthenticationError`: Kimlik doğrulama hataları
- `AuthorizationError`: Yetkilendirme hataları
- `NotFoundError`: Kaynak bulunamadı
- `ConflictError`: Veri çakışması
- `RateLimitError`: Rate limit aşıldı
- `DatabaseError`: Veritabanı hataları

---

## 📊 Rate Limiting

### Rate Limit Kuralları
```javascript
// Authentication endpoints
POST /api/auth/login: 5 requests per 15 minutes
POST /api/auth/register: 3 requests per hour

// General API endpoints
GET /api/*: 100 requests per minute
POST /api/*: 50 requests per minute
PUT /api/*: 50 requests per minute
DELETE /api/*: 20 requests per minute

// File upload
POST /api/upload/*: 10 requests per minute
```

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "type": "RateLimitError",
    "message": "Too many requests",
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 60
  }
}
```

---

## 🔍 Filtering and Searching

### Generic Filtering
```http
GET /api/projects?filter[status]=active&filter[category]=satellite
```

### Search
```http
GET /api/users?search=aerospace&fields=profile.title,profile.bio
```

### Sorting
```http
GET /api/projects?sort=createdAt&order=desc
```

**Available sort fields:**
- `createdAt`: Oluşturulma tarihi
- `updatedAt`: Güncellenme tarihi
- `title`: Başlık
- `name`: İsim
- `score`: Eşleşme skoru

### Field Selection
```http
GET /api/users?fields=id,username,profile.firstName,profile.lastName
```

---

## 🌐 Internationalization

### Language Headers
```http
Accept-Language: tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7
```

### Localized Responses
```json
{
  "success": true,
  "data": {
    "message": "Profil başarıyla güncellendi"
  }
}
```

### Supported Languages
- `tr`: Türkçe
- `en`: İngilizce

---

## 📝 API Usage Examples

### JavaScript (Axios)
```javascript
// Login
const login = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', {
      email,
      password
    });
    
    const { token } = response.data.data;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data.data;
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
};

// Get projects
const getProjects = async (filters = {}) => {
  try {
    const response = await axios.get('/api/projects', {
      params: filters
    });
    return response.data.data.projects;
  } catch (error) {
    console.error('Failed to get projects:', error.response.data);
  }
};
```

### Python (requests)
```python
import requests

# Login
def login(email, password):
    response = requests.post('http://localhost:5001/api/auth/login', json={
        'email': email,
        'password': password
    })
    
    if response.status_code == 200:
        data = response.json()
        token = data['data']['token']
        return token
    else:
        print(f"Login failed: {response.json()}")

# Get projects
def get_projects(token, filters=None):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get('http://localhost:5001/api/projects', 
                          headers=headers, params=filters)
    
    if response.status_code == 200:
        return response.json()['data']['projects']
    else:
        print(f"Failed to get projects: {response.json()}")
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get projects with token
curl -X GET http://localhost:5001/api/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## 🧪 Testing

### Postman Collection
```json
{
  "info": {
    "name": "SpaceLink AI API",
    "description": "Complete API documentation and testing collection"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  }
}
```

### Environment Variables
```json
{
  "base_url": "http://localhost:5001/api",
  "jwt_token": "",
  "user_id": "",
  "project_id": ""
}
```

---

## 📈 Monitoring and Analytics

### API Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "database": "connected",
  "memory": {
    "used": "150MB",
    "total": "512MB"
  },
  "requests": {
    "total": 1250,
    "errors": 12,
    "rate": "21req/min"
  }
}
```

---

**SpaceLink AI API** — *Uzay endüstrisi için güçlü, güvenli ve ölçeklenebilir API çözümü.*
