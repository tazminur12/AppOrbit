# AppOrbit Backend API

This is the backend API for the AppOrbit application, providing user profile management and other features.

## Features

- ✅ User profile management (display name, photo URL)
- ✅ JWT authentication middleware
- ✅ MongoDB integration
- ✅ CORS support
- ✅ Error handling
- ✅ Admin routes for user management

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/apporbit
DB_NAME=apporbit

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration (if needed for server-side uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### User Profile Management

#### GET `/api/users/profile/:email`
Get user profile by email
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile data

#### PATCH `/api/users/profile/:email`
Update user profile (display name and photo URL)
- **Headers**: `Authorization: Bearer <token>`
- **Body**: 
  ```json
  {
    "displayName": "New Display Name",
    "photoURL": "https://example.com/photo.jpg"
  }
  ```
- **Response**: Updated profile data

### Admin Routes

#### GET `/api/users`
Get all users (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of users

#### GET `/api/users/:id`
Get user by ID (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User data

#### DELETE `/api/users/:id`
Delete user (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

### Health Check

#### GET `/health`
Check server status
- **Response**: Server status and timestamp

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  displayName: String,
  photoURL: String,
  membership: String (default: 'free'),
  role: String (default: 'user'),
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Additional details (in development)"
}
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Testing

```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure MongoDB connection string
4. Set up proper CORS origins
5. Use a process manager like PM2

## Security Considerations

- JWT tokens are used for authentication
- Input validation on all endpoints
- CORS is configured for security
- Sensitive data (passwords) are excluded from responses
- Admin routes require proper role verification 