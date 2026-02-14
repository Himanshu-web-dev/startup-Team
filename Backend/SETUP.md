# 🚀 StartupTeam Backend Setup Guide

Complete guide to set up and run the StartupTeam backend API.

## 📋 Prerequisites

Install these before proceeding:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v5 or higher)
   - **Option A - Local Installation**:
     - Download: https://www.mongodb.com/download-center/community
     - Start MongoDB: `mongod`
   - **Option B - MongoDB Atlas (Recommended)**:
     - Create free account: https://www.mongodb.com/cloud/atlas
     - Create cluster and get connection string

3. **Cloudinary Account** (for image uploads)
   - Sign up: https://cloudinary.com/users/register/free
   - Get Cloud Name, API Key, API Secret from dashboard

4. **Email Service** (for sending emails)
   - **Option A - Gmail**:
     - Enable 2FA on your Google account
     - Create App Password: https://myaccount.google.com/apppasswords
   - **Option B - SendGrid** (Recommended for production):
     - Sign up: https://signup.sendgrid.com/
     - Get API key from dashboard

5. **Twilio Account** (optional, for WhatsApp)
   - Sign up: https://www.twilio.com/try-twilio
   - Get Account SID and Auth Token
   - Get WhatsApp sandbox number

## 🛠️ Step-by-Step Setup

### Step 1: Navigate to Backend Directory

```bash
cd Backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including Express, Mongoose, JWT, Cloudinary, etc.

### Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` file and fill in the values:

   **Database (Required)**
   ```env
   MONGODB_URI=mongodb://localhost:27017/startupteam
   # Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/startupteam
   ```

   **JWT Secrets (Required)** - Generate random strings:
   ```env
   JWT_SECRET=your-random-secret-key-here
   JWT_REFRESH_SECRET=another-random-secret-key-here
   ```

   **Cloudinary (Required for file uploads)**
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **Email Configuration (Required)**
   
   For Gmail:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

   For SendGrid:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   ```

   **Twilio (Optional - for WhatsApp notifications)**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

   **OAuth (Optional - for Google/LinkedIn login)**
   
   Google OAuth:
   1. Go to Google Cloud Console: https://console.cloud.google.com/
   2. Create new project
   3. Enable Google+ API
   4. Create OAuth 2.0 credentials
   5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
   
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

   LinkedIn OAuth:
   1. Go to LinkedIn Developers: https://www.linkedin.com/developers/
   2. Create new app
   3. Get Client ID and Secret
   4. Add redirect URI: `http://localhost:5000/api/auth/linkedin/callback`
   
   ```env
   LINKEDIN_CLIENT_ID=your-linkedin-client-id
   LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
   LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback
   ```

   **Other Settings**
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:8000
   SESSION_SECRET=your-session-secret
   ```

### Step 4: Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 Environment: development
🌐 CORS enabled for: http://localhost:8000
```

### Step 5: Test the API

Test if the server is running:
```bash
curl http://localhost:5000/
```

You should get:
```json
{
  "success": true,
  "message": "StartupTeam API Server",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "founder": "/api/founder",
    "member": "/api/member",
    "upload": "/api/upload"
  }
}
```

### Step 6: Start the Frontend

In a new terminal:
```bash
cd Frontend
python -m http.server 8000
# Or: npx http-server -p 8000
```

Access the app at: http://localhost:8000

## 🧪 Testing the Setup

### 1. Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "founder"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for verification code."
}
```

**Check:** You should receive an email with a 6-digit OTP code.

### 2. Verify Email

```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoServerError: Authentication failed`
- Check username/password in MONGODB_URI
- Whitelist your IP address in MongoDB Atlas

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`
- Ensure MongoDB is running: `mongod` (for local)
- Check the connection string format

### Email Not Sending

**Gmail Error:** `Invalid login`
- Enable 2-Factor Authentication
- Create and use App Password (not your regular password)
- Allow less secure apps: https://myaccount.google.com/lesssecureapps

**SendGrid Error:** `Unauthorized`
- Verify API key is correct
- Check sender email is verified in SendGrid

### CORS Errors

**Error:** `Access to fetch blocked by CORS policy`
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check that frontend is running on the specified port

### Port Already in Use

**Error:** `Port 5000 is already in use`
- Change `PORT` in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000

## 📚 Next Steps

1. **Update Frontend** - Connect the frontend to use the API (see `Frontend/assets/js/api.js`)
2. **Test All Features** - Sign up, create startup, post roles, etc.
3. **Deploy** - Follow deployment guide for production

## 🆘 Need Help?

- Check the API documentation in `Backend/README.md`
- Review error logs in the console
- Check MongoDB logs
- Verify all environment variables are set correctly

## 🎉 Success!

If all tests pass, your backend is ready! The API is now:
- ✅ Connected to MongoDB
- ✅ Sending emails
- ✅ Authenticating users with JWT
- ✅ Ready for file uploads
- ✅ Protected with security middleware
