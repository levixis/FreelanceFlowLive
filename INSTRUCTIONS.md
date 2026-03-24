# FreelanceFlow MERN Setup Guide

## Prerequisites
1.  **Node.js** (v18+ recommended)
2.  **MongoDB** (Running locally on port 27017 or use MongoDB Atlas)

## 1. Backend Setup (Server)

Open a terminal and navigate to the `server` directory:

```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/freelanceflow
JWT_SECRET=your_super_secret_key_change_this
API_KEY=your_google_gemini_api_key
```

Start the backend server:
```bash
npm start
```
*The server should run on `http://localhost:5001`*

## 2. Frontend Setup (Client)

Open a **new terminal** and navigate to the project root directory (where `vite.config.ts` is):

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```

Open your browser and navigate to the URL shown (usually `http://localhost:5173`).

## 3. Usage
1.  Register a new account.
2.  Log in.
3.  Start tracking time!

## Troubleshooting
- **Address in use (EADDRINUSE)**: If port 5001 is also taken, edit `server/server.js`, `constants.ts`, and `vite.config.ts` to use a different port (e.g., 5002).
- **Network Error / CORS**: If you see connection errors, ensure the Backend is running on port 5001. The `vite.config.ts` handles the proxying of `/api` requests to `http://localhost:5001`.
- **Database Connection**: Ensure MongoDB is running locally. If using Atlas, replace `MONGODB_URI` in `server/.env` with your connection string.
- **AI Features**: To use the invoice summary features, you must get an API Key from [Google AI Studio](https://aistudio.google.com/) and add it to your `server/.env` file (if you move the AI logic to backend) or `package.json` environment if keeping it client-side. Note: The current `geminiService.ts` runs on the client, so for local dev, you might need to prefix the env variable with `VITE_` in `vite.config.ts` or hardcode it for testing.
