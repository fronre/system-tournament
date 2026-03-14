# Tournament System

منصة احترافية لإدارة البطولات الرياضية وبطولات الألعاب

---

## 🗂️ هيكل المشروع

```
tournament-system/
├── frontend/
│   ├── index.html          ← الصفحة الرئيسية
│   ├── pages/
│   │   ├── 1v1.html        ← بطولة 1 ضد 1
│   │   ├── 2v2.html        ← بطولة 2 ضد 2
│   │   ├── 3v3.html        ← بطولة 3 ضد 3
│   │   └── groups.html     ← دور المجموعات
│   ├── css/
│   │   ├── style.css       ← الثيم الداكن
│   │   ├── cards.css       ← بطاقات الاختيار
│   │   └── bracket.css     ← شجرة البطولة
│   └── js/
│       ├── api.js          ← استدعاءات FastAPI
│       ├── ui.js           ← مساعدات UI
│       ├── players.js      ← إدارة اللاعبين
│       ├── wheel.js        ← عجلة Canvas
│       ├── matches.js      ← إنشاء المباريات
│       ├── bracket.js      ← شجرة البطولة
│       └── groups.js       ← دور المجموعات
│
└── backend/
    ├── requirements.txt
    └── app/
        ├── main.py
        ├── core/config.py
        ├── domain/entities/
        │   ├── player.py
        │   ├── team.py
        │   ├── match.py
        │   └── tournament.py
        ├── usecases/       ← 7 use cases
        ├── infrastructure/database/
        │   ├── database.py
        │   └── models.py
        └── api/routes/
            ├── players.py
            ├── teams.py
            ├── matches.py
            └── tournaments.py
```

---

## 🚀 تشغيل المشروع

### الخطوة 1: تشغيل الـ Backend

```bash
# انقر دبل كليك على:
start_backend.bat

# أو يدوياً:
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### الخطوة 2: فتح الـ Frontend

افتح الملف في المتصفح:
```
frontend/index.html
```

أو استخدم Live Server في VS Code (Right-click → Open with Live Server)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/players/` | جلب جميع اللاعبين |
| POST | `/players/` | إضافة لاعب |
| DELETE | `/players/{id}` | حذف لاعب |
| POST | `/teams/` | إنشاء فريق |
| GET | `/teams/` | جلب الفرق |
| POST | `/matches/` | إنشاء مباراة |
| PATCH | `/matches/{id}/winner` | تحديد الفائز |
| POST | `/tournament/create` | إنشاء بطولة |
| GET | `/tournament/{id}/bracket` | جلب الشجرة |
| GET | `/tournament/spin/wheel` | تدوير العجلة |
| GET | `/tournament/groups/generate` | إنشاء المجموعات |

### Swagger UI (توثيق تفاعلي):
```
http://localhost:8000/docs
```

---

## ✨ الميزات

- **بطولة 1v1**: عجلة Canvas + اختيار اللاعبين + شجرة بطولة
- **بطولة 2v2**: فرق ثنائية + شجرة بطولة
- **بطولة 3v3**: فرق ثلاثية + شجرة بطولة
- **دور المجموعات**: تقسيم تلقائي + جدول نقاط مباشر
- يعمل **بدون إنترنت** (بدون Google Fonts)
- يعمل **بدون Backend** (وضع offline تلقائي)
