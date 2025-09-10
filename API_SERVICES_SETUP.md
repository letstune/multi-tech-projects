# 🔑 API SERVICES SETUP GUIDE

## 📋 REQUIRED API SERVICES FOR FULL FUNCTIONALITY

### 1. 🗺️ GOOGLE MAPS API SETUP

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing (required for Maps API)

#### Step 2: Enable Required APIs
```
- Maps JavaScript API
- Places API
- Geocoding API
- Directions API
- Distance Matrix API
```

#### Step 3: Create API Key
1. Go to "Credentials" → "Create Credentials" → "API Key"
2. Restrict the key to your domain/IP
3. Add to environment files:
   - Backend: `GOOGLE_MAPS_API_KEY`
   - Frontend: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

#### Usage in System:
- Advanced mapping features
- Geocoding addresses
- Place search and autocomplete
- Route optimization
- Distance calculations

---

### 2. 📧 EMAIL SERVICE SETUP (Gmail SMTP)

#### Step 1: Enable 2-Factor Authentication
1. Go to Google Account settings
2. Enable 2-Factor Authentication

#### Step 2: Generate App Password
1. Go to "Security" → "App passwords"
2. Generate password for "Mail"
3. Use this password (not your regular password)

#### Step 3: Configure Environment
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_16_character_app_password
```

#### Usage in System:
- Alert notifications
- System reports
- User notifications
- Emergency communications

---

### 3. 📱 SMS SERVICE SETUP (Twilio)

#### Step 1: Create Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for free account
3. Get $15 free credit

#### Step 2: Get Credentials
1. Find Account SID and Auth Token
2. Purchase a phone number

#### Step 3: Configure Environment
```env
SMS_API_KEY=your_account_sid
SMS_API_SECRET=your_auth_token
SMS_PHONE_NUMBER=your_twilio_phone_number
```

#### Usage in System:
- Emergency alerts
- Critical notifications
- Mass messaging
- SOS confirmations

---

### 4. 🔥 FIREBASE SETUP

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Google Analytics (optional)

#### Step 2: Enable Services
```
- Cloud Messaging (FCM)
- Analytics
- Crashlytics
```

#### Step 3: Get Configuration
1. Go to Project Settings
2. Copy configuration values
3. Generate server key for FCM

#### Step 4: Configure Environment
```env
# Backend
FCM_SERVER_KEY=your_server_key

# Frontend
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=app_id
```

#### Usage in System:
- Push notifications
- Real-time updates
- Analytics tracking
- Crash reporting

---

### 5. 🌤️ WEATHER API SETUP (OpenWeatherMap)

#### Step 1: Create Account
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Get 1000 calls/day free

#### Step 2: Get API Key
1. Go to API keys section
2. Copy your API key

#### Step 3: Configure Environment
```env
WEATHER_API_KEY=your_openweather_api_key
```

#### Usage in System:
- Weather alerts
- Condition monitoring
- Event planning
- Safety recommendations

---

### 6. 🤖 AI SERVICES SETUP (Optional)

#### OpenAI API
```env
OPENAI_API_KEY=your_openai_api_key
```
**Usage**: Advanced AI features, natural language processing

#### Google Vision API
```env
GOOGLE_VISION_API_KEY=your_vision_api_key
```
**Usage**: Image recognition for Lost & Found system

---

## 🔧 TESTING YOUR SETUP

### 1. Test Backend APIs
```bash
cd backend
npm run dev

# Test endpoints:
curl http://localhost:5000/api/test
curl http://localhost:5000/api/locations
curl http://localhost:5000/api/crowd
```

### 2. Test Frontend
```bash
cd ishtdev-dashboard
npm run dev

# Open: http://localhost:3000
```

### 3. Test External Services
```bash
# Test email (if configured)
curl -X POST http://localhost:5000/api/test/email

# Test SMS (if configured)
curl -X POST http://localhost:5000/api/test/sms

# Test maps
curl http://localhost:5000/api/mobile/directions?from=lat,lng&to=lat,lng
```

---

## 💰 COST ESTIMATES (Monthly)

### Free Tier Limits:
- **Google Maps**: $200 credit/month
- **Twilio**: $15 one-time credit
- **Firebase**: Generous free tier
- **OpenWeatherMap**: 1000 calls/day free
- **OpenAI**: $5 credit for new accounts

### Expected Usage:
- **Small Event** (1000 users): ~$10-20/month
- **Medium Event** (10,000 users): ~$50-100/month
- **Large Event** (100,000 users): ~$200-500/month

---

## 🔒 SECURITY BEST PRACTICES

### API Key Security:
1. **Restrict API keys** to specific domains/IPs
2. **Use environment variables** never hardcode keys
3. **Rotate keys regularly**
4. **Monitor usage** for unusual activity

### Rate Limiting:
```javascript
// Already implemented in backend
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

---

## 🚀 PRODUCTION DEPLOYMENT

### Environment Variables Checklist:
- [ ] All API keys configured
- [ ] Database connection string updated
- [ ] CORS origins set to production domains
- [ ] JWT secret changed from default
- [ ] File upload paths configured
- [ ] Logging configured
- [ ] SSL certificates installed

### Monitoring Setup:
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] API usage monitoring
- [ ] Database monitoring
- [ ] Server health checks

---

## 📞 SUPPORT RESOURCES

### Documentation:
- [Google Maps API Docs](https://developers.google.com/maps/documentation)
- [Twilio SMS Docs](https://www.twilio.com/docs/sms)
- [Firebase Docs](https://firebase.google.com/docs)
- [OpenWeatherMap Docs](https://openweathermap.org/api)

### Community:
- Stack Overflow
- GitHub Issues
- Discord/Slack communities
- Official support channels
