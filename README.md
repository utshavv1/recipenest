# RecipeNest

Full‑stack recipe sharing platform for chefs and food lovers.

## Project Structure

- `/backend` – Node.js + Express + MongoDB REST API
- `/frontend` – React + Vite + Tailwind CSS client

## Features

- JWT authentication (chef & admin roles)
- File upload for avatars and recipe images
- Recipe CRUD (create, read, update, soft delete)
- Chef dashboard with profile management
- Admin dashboard (dark theme) with real analytics
- Public chefs listing and recipe browsing
- Social sharing modal

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` file (see `.env.example`)
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Ensure backend runs on `http://localhost:8080`

## Environment Variables (Backend)

Create `backend/.env`:
DB_URL=mongodb+srv://utshav:%40utshav10@cluster0.a6acmwm.mongodb.net/recipenest?retryWrites=true&w=majority
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=mySuperSecretKeyForRecipeNest
JWT_EXPIRES_IN=7d


## Tech Stack

- **Backend**: Node.js, Express, MongoDB, JWT, bcrypt, multer
- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios, React Icons

## License

MIT