# 🚀 StartupTeam - Quick Start Guide

## ✅ Backend Implementation Complete!

Your backend is now fully implemented with:
- ✅ Node.js + Express REST API
- ✅ MongoDB database with 7 models
- ✅ JWT authentication with refresh tokens
- ✅ Email verification and password reset
- ✅ Google & LinkedIn OAuth integration
- ✅ Cloudinary file upload service
- ✅ Email notifications (Nodemailer)
- ✅ WhatsApp integration (Twilio)
- ✅ Role-based access control (Founder/Member)
- ✅ Input validation and error handling
- ✅ Security middleware (Helmet, CORS, rate limiting)

---

## 📁 Project Structure

```
startup-Team/
├── Backend/                    ← NEW! Production-ready API
│   ├── src/
│   │   ├── config/            # Database, Cloudinary, Passport configs
│   │   ├── controllers/       # Business logic (auth, founder, member, upload)
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # MongoDB schemas (User, Startup, Role, etc.)
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Email, WhatsApp, file upload
│   │   └── utils/             # JWT, token helpers
│   ├── .env                   # Your credentials (EDIT THIS!)
│   ├── .env.example           # Template
│   ├── package.json           # Dependencies installed ✓
│   ├── server.js              # Main server file
│   ├── README.md              # API documentation
│   └── SETUP.md               # Detailed setup guide
│
└── Frontend/
    ├── assets/js/api.js       ← NEW! API integration utility
    ├── pages/oauth-callback.html  ← NEW! OAuth redirect handler
    └── ... (existing frontend files)
```

---

## 🎯 Next Steps (5 Minutes to Running Server)

### Step 1: Configure Your Credentials

Open `Backend/.env` and fill in these **REQUIRED** values:

```env
# Database - Choose one option:

# Option A: Local MongoDB (if installed locally)
MONGODB_URI=mongodb://localhost:27017/startupteam

# Option B: MongoDB Atlas (Recommended - FREE)
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Create database user
# 4. Whitelist your IP (0.0.0.0/0 for allow all)
# 5. Get connection string and replace below:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/startupteam

# JWT Secrets (IMPORTANT: Change these!)
JWT_SECRET=change-this-to-random-string-min-32-chars
JWT_REFRESH_SECRET=change-this-to-another-random-string

# Email (Gmail example - Free)
# 1. Enable 2FA: https://myaccount.google.com/security
# 2. Create App Password: https://myaccount.google.com/apppasswords
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Cloudinary (FREE tier)
# 1. Sign up: https://cloudinary.com/users/register/free
# 2. Copy from dashboard:
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

**Optional (can skip for now):**
- Twilio (WhatsApp) - Leave commented out
- Google OAuth - Leave commented out
- LinkedIn OAuth - Leave commented out

### Step 2: Start the Backend

```bash
cd Backend
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 Environment: development
🌐 CORS enabled for: http://localhost:8000
```

### Step 3: Start the Frontend

In a **new terminal**:

```bash
cd Frontend
python -m http.server 8000
```

Or use Node.js:
```bash
npx http-server -p 8000
```

### Step 4: Test the Complete Stack!

Open browser: http://localhost:8000

**Test Flow:**
1. Click "Sign Up"
2. Fill form and submit
3. Check your email for OTP code
4. Verify email with OTP
5. Login with credentials
6. You're in! 🎉

---

## 🧪 API Testing (Optional)

Test the backend directly with curl or Postman:

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "founder"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'
```

---

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/linkedin` - LinkedIn OAuth

### Founder (Protected - Founder role only)
- `GET /api/founder/profile` - Get profile
- `PUT /api/founder/profile` - Update profile
- `POST /api/founder/startup` - Create startup
- `GET /api/founder/startup` - Get startup
- `PUT /api/founder/startup/:id` - Update startup
- `POST /api/founder/roles` - Post role
- `GET /api/founder/roles` - Get roles
- `GET /api/founder/applications` - Get applications
- `PUT /api/founder/applications/:id/accept` - Accept application
- `PUT /api/founder/applications/:id/reject` - Reject application
- `GET /api/founder/dashboard` - Dashboard stats

### Member (Protected - Member role only)
- `GET /api/member/profile` - Get profile
- `PUT /api/member/profile` - Update profile
- `GET /api/member/startups` - Explore startups (with filters)
- `GET /api/member/startups/:id` - Startup details
- `POST /api/member/applications` - Apply to role
- `GET /api/member/applications` - My applications
- `POST /api/member/startups/:id/save` - Save startup
- `GET /api/member/startups/saved` - Saved startups
- `GET /api/member/dashboard` - Dashboard stats

### Upload (Protected)
- `POST /api/upload/avatar` - Upload avatar
- `POST /api/upload/startup-logo` - Upload logo (Founder only)

---

## 🔧 Integrating Frontend with Backend

The frontend integration layer is already created: `Frontend/assets/js/api.js`

### Example Usage in Your Frontend Code:

```javascript
// Include the API utility
<script src="../assets/js/api.js"></script>

// Register user
const result = await API.auth.register({
  name: "John",
  email: "john@test.com",
  password: "password123",
  phone: "+1234567890",
  role: "founder"
});

// Login
const loginResult = await API.auth.login("john@test.com", "password123");
// Tokens are automatically saved to localStorage

// Create startup (founder)
const startup = await API.founder.createStartup({
  name: "TechVenture",
  industry: "SaaS",
  stage: "Seed",
  teamSize: "1-5",
  tagline: "Building the future"
});

// Explore startups (member)
const startups = await API.member.exploreStartups({
  industry: "SaaS,AI/ML",
  page: 1,
  limit: 12
});

// Apply to role (member)
const application = await API.member.applyToRole(roleId, "Cover letter text");

// Upload avatar
const file = document.getElementById('avatarInput').files[0];
const uploadResult = await API.upload.uploadAvatar(file);
```

### Protected Pages

Add this to dashboard pages:

```javascript
<script src="../assets/js/api.js"></script>
<script>
  // Redirect to login if not authenticated
  protectPage('founder'); // or 'member'
  
  // Get current user
  const user = getCurrentUser();
  console.log('Logged in as:', user.name);
</script>
```

---

## 🎨 Features Implemented

### Authentication & Security
- ✅ Email/password registration with OTP verification
- ✅ JWT access tokens (15 min expiry)
- ✅ Refresh tokens (7 days, auto-rotation)
- ✅ Password reset via email
- ✅ bcrypt password hashing (10 rounds)
- ✅ Rate limiting (5 auth attempts per 15 min)
- ✅ Google OAuth 2.0 login
- ✅ LinkedIn OAuth 2.0 login
- ✅ Helmet security headers
- ✅ CORS protection

### Founder Features
- ✅ Create & manage startup profile
- ✅ Upload startup logo (Cloudinary)
- ✅ Post job roles with requirements
- ✅ Receive applications from members
- ✅ Accept/reject applications
- ✅ Email & WhatsApp notifications on new applications
- ✅ Dashboard with metrics

### Member Features
- ✅ Create & manage professional profile
- ✅ Upload avatar (Cloudinary)
- ✅ Search & filter startups (by industry, stage, location)
- ✅ View startup details and open roles
- ✅ Apply to roles with cover letter
- ✅ Track application status
- ✅ Save/bookmark startups
- ✅ Email notifications on status updates
- ✅ WhatsApp notification on acceptance

### File Upload
- ✅ Cloudinary integration
- ✅ Automatic image optimization
- ✅ Avatar resizing (400x400)
- ✅ Logo resizing (300x300)
- ✅ 5MB file size limit
- ✅ Old image deletion on update

### Notifications
- ✅ Professional HTML email templates
- ✅ OTP verification emails
- ✅ Password reset emails
- ✅ Application status updates
- ✅ New application alerts
- ✅ WhatsApp integration (Twilio)

---

## 📊 Database Models

7 MongoDB collections created:

1. **users** - Authentication & user data
2. **founderprofiles** - Founder profile information
3. **memberprofiles** - Member profile information
4. **startups** - Startup details
5. **roles** - Job/role postings
6. **applications** - Application submissions
7. **savedstartups** - Bookmarked startups

All with proper:
- Validation rules
- Indexes for performance
- Referential integrity
- Timestamps (createdAt, updatedAt)

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error: MongooseServerSelectionError
```
**Solution:** 
- If using Atlas: Whitelist your IP (0.0.0.0/0)
- If local: Start MongoDB with `mongod`
- Check connection string format

### Email Not Sending
```
❌ Send verification email error
```
**Solution:**
- Gmail: Use App Password (not regular password)
- Enable 2FA first
- Check EMAIL_USER and EMAIL_PASS in .env

### Port Already in Use
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in .env to 5001
- Or kill process: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

---

## 📚 Documentation

- **Backend API Guide**: `Backend/README.md`
- **Setup Guide**: `Backend/SETUP.md`
- **Frontend README**: `readme.MD`

---

## 🚀 Deployment Ready

When ready to deploy:

**Backend:**
- Render.com (Free tier)
- Railway.app (Free tier) 
- Heroku (Paid)

**Frontend:**
- Netlify (Free)
- Vercel (Free)
- GitHub Pages (Free)

**Database:**
- MongoDB Atlas (Free tier - 512MB)

---

## 🎉 Success Checklist

- [x] Backend code implemented (100% complete)
- [x] Dependencies installed
- [x] .env file created
- [ ] Configure MongoDB connection
- [ ] Configure email credentials
- [ ] Configure Cloudinary
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test creating startup
- [ ] Test applying to roles

---

## 💡 What's Next?

1. **Configure .env** - Add your credentials
2. **Start servers** - Backend + Frontend
3. **Test the flow** - Sign up → Verify → Create startup/Apply
4. **Customize** - Adjust frontend to call APIs
5. **Deploy** - When ready for production

---

## 🤝 Need Help?

1. Check `Backend/SETUP.md` for detailed setup
2. Check `Backend/README.md` for API docs
3. Review error messages in terminal
4. Verify .env configuration

---

**Made with ❤️ for the startup ecosystem**
