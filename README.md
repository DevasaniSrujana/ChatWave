## ChatWave

Real-time chat application with authentication, online status, and responsive UI.

### Tech Stack

- **Frontend**: React, Vite, Redux Toolkit, React Router, TailwindCSS + DaisyUI, Socket.IO client
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO, Multer, JWT auth

### Project Structure

- `Frontend/` – React SPA (Vite)
  - `src/pages/Home/Chat.jsx` – main chat page
  - `src/components/` – sidebar, chat window, messages, auth UI, etc.
- `Backend/` – API + WebSocket server
  - `server.js` – Express + Socket.IO setup
  - `controllers/` – auth and message logic
  - `models/` – Mongoose models
  - `socket/` – Socket.IO server and user socket map

### Prerequisites

- Node.js (LTS recommended)
- MongoDB connection string

### Environment Variables

Create `Backend/.env` with at least:

```bash
PORT=5000
MONGODB_URL=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXP=7d
COOKIE_EXP=7
CLIENT_URL=http://localhost:5173
```

Create `Frontend/.env` with:

```bash
VITE_DB_URL=http://localhost:5000/api/v1
VITE_DB_ORIGIN=http://localhost:5000
```

Adjust ports/origins if you change the backend port.

### Install & Run

From the project root:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

Run backend:

```bash
cd Backend
npm run dev
```

Run frontend:

```bash
cd Frontend
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173/`).

### Build for Production (Frontend)

```bash
cd Frontend
npm run build
```

The static assets will be in `Frontend/dist/`.

