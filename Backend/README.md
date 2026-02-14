# StartupTeam Backend API

Production-ready REST API for the StartupTeam platform built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm
- MongoDB v5+ (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- Gmail/SendGrid account (for emails)
- Twilio account (optional, for WhatsApp)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your credentials:
   - MongoDB connection string
   - JWT secrets
   - Cloudinary credentials
   - Email configuration
   - OAuth credentials (Google/LinkedIn)
   - Twilio credentials (optional)

3. **Start development server**
   ```bash
   npm run dev
   ```

   The API will be running at `http://localhost:5000`

4. **For production**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/verify-email` | Verify email with OTP | Public |
| POST | `/auth/resend-otp` | Resend verification OTP | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout user | Private |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password | Public |
| GET | `/auth/me` | Get current user | Private |
| GET | `/auth/google` | Google OAuth login | Public |
| GET | `/auth/linkedin` | LinkedIn OAuth login | Public |

### Founder Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/founder/profile` | Get founder profile | Founder |
| PUT | `/founder/profile` | Update founder profile | Founder |
| POST | `/founder/startup` | Create startup | Founder |
| GET | `/founder/startup` | Get startup | Founder |
| PUT | `/founder/startup/:id` | Update startup | Founder |
| POST | `/founder/roles` | Create role posting | Founder |
| GET | `/founder/roles` | Get all roles | Founder |
| PUT | `/founder/roles/:id` | Update role | Founder |
| DELETE | `/founder/roles/:id` | Close role | Founder |
| GET | `/founder/applications` | Get applications | Founder |
| PUT | `/founder/applications/:id/accept` | Accept application | Founder |
| PUT | `/founder/applications/:id/reject` | Reject application | Founder |
| GET | `/founder/dashboard` | Get dashboard stats | Founder |

### Member Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/member/profile` | Get member profile | Member |
| PUT | `/member/profile` | Update member profile | Member |
| GET | `/member/startups` | Explore startups | Member |
| GET | `/member/startups/:id` | Get startup details | Member |
| POST | `/member/startups/:id/save` | Save startup | Member |
| DELETE | `/member/startups/:id/save` | Unsave startup | Member |
| GET | `/member/startups/saved` | Get saved startups | Member |
| POST | `/member/applications` | Apply to role | Member |
| GET | `/member/applications` | Get my applications | Member |
| DELETE | `/member/applications/:id` | Cancel application | Member |
| GET | `/member/dashboard` | Get dashboard stats | Member |

### Upload Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/upload/avatar` | Upload user avatar | Private |
| POST | `/upload/startup-logo` | Upload startup logo | Founder |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the Authorization header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Token Refresh
Access tokens expire after 15 minutes. Use the refresh token to get a new access token:

```javascript
POST /api/auth/refresh
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

## 📊 Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
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
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Startup (Founder)
```bash
curl -X POST http://localhost:5000/api/founder/startup \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TechVenture",
    "industry": "SaaS",
    "stage": "Seed",
    "teamSize": "1-5",
    "tagline": "Revolutionizing team collaboration",
    "description": "Building the next generation of team tools"
  }'
```

### Explore Startups (Member)
```bash
curl -X GET "http://localhost:5000/api/member/startups?industry=SaaS,AI/ML&page=1&limit=12" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Refresh token rotation
- ✅ Rate limiting on auth endpoints
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Email verification required
- ✅ Role-based access control

## 📧 Email Templates

The API sends professional HTML emails for:
- Email verification (OTP)
- Password reset
- Application status updates
- New application notifications

## 📱 WhatsApp Integration

When configured with Twilio, the API sends WhatsApp notifications for:
- Application accepted (with founder contact)
- Role match alerts based on skills

## 🗄️ Database Schema

### Main Collections
- **users** - User accounts and authentication
- **founderprofiles** - Founder profile data
- **memberprofiles** - Member profile data
- **startups** - Startup information
- **roles** - Job/role postings
- **applications** - Application submissions
- **savedstartups** - Bookmarked startups

### Indexes
- Email (unique)
- Text search on startup name/tagline/description
- Compound indexes for efficient queries

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens

### Optional
- `CLOUDINARY_*` - For file uploads
- `EMAIL_*` - For email notifications
- `TWILIO_*` - For WhatsApp notifications
- `GOOGLE_*` - For Google OAuth
- `LINKEDIN_*` - For LinkedIn OAuth

## 🚀 Deployment

### Recommended Platforms
- **Backend**: Render, Railway, Heroku, AWS
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure CORS with actual frontend URL
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Set up monitoring (PM2, New Relic)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

For issues or questions, please open an issue on GitHub.
