# MERN Stack Setup Instructions

## MongoDB Setup Options

### Option 1: Local MongoDB Installation
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB following the installation guide for Windows
3. Start MongoDB service:
   - Windows Service: MongoDB should start automatically
   - Manual start: Run `mongod` in command prompt
4. Verify installation: Run `mongo` to connect to the local instance

### Option 2: MongoDB Atlas (Cloud - Recommended)
1. Create a free account at: https://www.mongodb.com/atlas
2. Create a new cluster (free tier available)
3. Get your connection string from the cluster dashboard
4. Update your `.env` file:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/studentmindscape?retryWrites=true&w=majority
   ```

### Option 3: Docker MongoDB (Alternative)
```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

## Current Setup
- The application is configured for MERN stack (MongoDB, Express, React, Node.js)
- MongoDB models are defined in `server/models.ts`
- API routes use Mongoose for database operations
- Authentication is implemented with JWT tokens
- The app gracefully handles MongoDB connection failures

## Features Implemented
✅ User authentication (register/login)
✅ JWT-based authorization
✅ Mood tracking with enhanced features
✅ Goal management with categories and progress
✅ Journal entries with emotions and tags
✅ Crisis reporting system
✅ Comprehensive data validation

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/chat` - AI wellness chat (requires auth)
- `POST /api/mood` - Create/update mood entry (requires auth)
- `GET /api/mood/history` - Get mood history (requires auth)
- `GET /api/goals` - Get user goals (requires auth)
- `POST /api/goals` - Create new goal (requires auth)
- `PATCH /api/goals/:id` - Update goal (requires auth)
- `DELETE /api/goals/:id` - Delete goal (requires auth)
- `GET /api/journal` - Get journal entries (requires auth)
- `POST /api/journal` - Create journal entry (requires auth)
- `POST /api/crisis-report` - Submit crisis report (no auth required for anonymous reports)

## Environment Variables Required
```
MONGODB_URI=mongodb://localhost:27017/studentmindscape
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

## Testing the Setup
1. Start the development server: `npm run dev`
2. Register a new user via API or frontend
3. Login to get JWT token
4. Test protected endpoints with Authorization header: `Bearer <token>`

## Frontend Integration
The frontend components are already set up to work with these APIs:
- Update frontend API calls to include authentication headers
- Handle JWT token storage (localStorage/sessionStorage)
- Implement login/register forms
- Update existing components to use new enhanced data models