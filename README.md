<div align="center">

# EchoChat

Modern, privacy-friendly 1:1 chat app with real‑time messaging, clean dark UI, and JWT auth.

</div>

## Overview

EchoChat is a full‑stack chat application built for speed and simplicity. It uses a REST API for auth and history, and Socket.IO for real‑time messaging. The frontend is a dark, elegant interface designed to feel modern and polished.

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS v4 (CSS-first), shadcn/ui, axios
- **Backend:** Node.js, Express, Prisma, PostgreSQL (Neon), Socket.IO
- **Auth:** JWT (Bearer), bcrypt

## Features

- ✅ Register/Login with JWT
- ✅ Protected `GET /auth/me`
- ✅ User list (`GET /users`) excluding self
- ✅ Chat history (`GET /messages/:userId`)
- ✅ Real‑time messaging with Socket.IO
- ✅ Online presence indicators
- ✅ Dark theme with teal accents
- ✅ Mobile‑friendly responsive layout

Coming soon: audio/video calling, attachments, emoji picker, image sharing.

## Project Structure

```
EchoChat/
├── frontend/                 # Next.js app
│   ├── app/                  # App Router pages
│   ├── components/           # UI + Chat views
│   ├── lib/                  # API, socket, hooks
│   └── types/                # Shared types
└── backend/                  # Express + Socket.IO API
    ├── controllers/          # Auth, users, messages
    ├── routes/               # /auth, /users, /messages
    ├── prisma/               # Prisma schema & migrations
    └── index.js              # Server entry
```

## Quickstart

Open two terminals—one for the backend, one for the frontend.

### Backend

```bash
cd backend
npm install

# Environment
cp .env.example .env   # or create .env
# Required vars:
# DATABASE_URL=postgres://...
# JWT_SECRET=your-secret
# PORT=8000

# Prisma setup
npx prisma migrate dev --name init

# Run
npm run dev
# API: http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install

# Environment
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local

# Run
npm run dev
# App: http://localhost:3000
```

## Environment Variables

- Backend: `DATABASE_URL`, `JWT_SECRET`, `PORT` (defaults to `8000`)
- Frontend: `NEXT_PUBLIC_BACKEND_URL` (e.g., `http://localhost:8000`)

## API Summary

- `POST /auth/register` – create user
- `POST /auth/login` – login and receive JWT
- `GET /auth/me` – current user (Bearer token)
- `GET /users` – list users (excludes current)
- `GET /messages/:userId` – chat history

## Development Notes

- Socket connects only after auth; token sent via `socket.auth`
- Online users are tracked and broadcast via Socket.IO
- Message timestamps come from Prisma `createdAt`
- Tailwind v4 (CSS-first); theme variables defined in `frontend/app/globals.css`

## Screenshots

See the images in the issue/attachments for the latest dark UI (sidebar, chat, profile).

## Roadmap

- Audio/Video calling
- File & image sharing
- Emoji picker + reactions
- Read receipts, typing indicators
- Group chats

---

Built with ❤️ for learning and speed.
