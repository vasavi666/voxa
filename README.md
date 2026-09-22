# VOXA Translation App

VOXA is a modern, real-time voice and text translation application. It features a React frontend and a Spring Boot backend, utilizing the MyMemory Translation API for fully free and open translation without needing API keys.

## Features
- **Real-Time Speech-to-Text**: Speak naturally into your microphone and the app converts it to text (Chrome & Edge).
- **Auto-Translation**: When you stop speaking, the app automatically translates your text.
- **Text-to-Speech**: Listen to translations with native pronunciation.
- **Conversation Mode**: Two-way bilingual chat interface for communicating with someone in another language.
- **Translation History**: All translations are saved to a database so you can review them later.

## Tech Stack
- **Frontend**: React, Vite, Lucide Icons, pure CSS (No Tailwind)
- **Backend**: Java 17, Spring Boot, Spring Data JPA
- **Database**: H2 In-Memory Database
- **API**: MyMemory Translation API (Free tier)

---

## Getting Started (Local Development)

### 1. Start the Backend (Spring Boot)
Requires Java 17 and Maven.

```bash
cd backend
./mvnw spring-boot:run
```
*(The backend will start on `http://localhost:8080`)*

### 2. Start the Frontend (Vite/React)
Requires Node.js.

```bash
cd frontend
npm install
npm run dev
```
*(The frontend will start on `http://127.0.0.1:5173`)*

---

## Deployment Guide

The app is fully prepared for production deployment.

### Deploying the Frontend (Vercel, Netlify, Render)
1. Set the root directory to `frontend/`.
2. Build command: `npm run build`
3. Output directory: `dist/`
4. **Environment Variables**: You must set `VITE_API_URL` to the URL of your deployed backend (e.g., `https://your-backend.onrender.com/api`).

### Deploying the Backend (Render, Railway, Heroku)
1. Set the root directory to `backend/`.
2. Ensure the environment is set to Java 17.
3. Build command: `./mvnw clean package -DskipTests`
4. Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

*Note: By default, VOXA uses an H2 in-memory database (`jdbc:h2:mem:voxadb`). This means your Translation History will be wiped every time the backend server restarts. For true production use, you should update `application.properties` to connect to a persistent PostgreSQL or MySQL database.*
