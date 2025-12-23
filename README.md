# EchoChat

A simple, secure 1-to-1 chat application built with modern web technologies.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - High-quality, accessible React components
- **Axios** - HTTP client for API requests

### Backend
- **Node.js + Express** - Fast, minimalist web framework
- **PostgreSQL (Neon)** - Cloud-based relational database
- **JWT (jsonwebtoken)** - Secure token-based authentication
- **bcrypt** - Password hashing and security
- **CORS** - Cross-origin resource sharing for secure API access

## Project Structure

```
EchoChat/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── page.tsx         # Home page
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utilities
│   └── types/               # TypeScript types
│
└── backend/                  # Express API
    ├── controllers/          # Business logic
    ├── routes/              # API endpoints
    ├── middleware/          # Authentication middleware
    ├── utils/               # Helper functions
    ├── db/                  # Database schema
    └── index.js             # Server entry point
```

## Features

### Authentication
- ✅ User registration with email and password
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Email validation
- ✅ Input validation on both frontend and backend

### Security
- JWT-based token authentication
- Bcrypt password hashing
- CORS enabled for frontend requests
- Input validation and error handling

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL database (Neon or local)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment variables** (.env):
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

3. **Setup database:**
   ```bash
   psql your_database < db/schema.sql
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## API Endpoints

### Authentication

**POST /api/auth/register**
- Register a new user
- Body: `{ name, email, password }`
- Returns: `{ id, name, email, token }`

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`
- Returns: `{ id, name, email, token }`

## Future Enhancements

- WebSocket support for real-time messaging
- Message history and persistence
- User online status
- Typing indicators
- Message read receipts
- User search and friend list
- Group chat support
- File sharing

## Notes

- Tokens are valid for 7 days
- All passwords are hashed before storage
- Email must be unique per user
- Simple modular structure for easy maintenance and scaling

---

**Built with ❤️**
