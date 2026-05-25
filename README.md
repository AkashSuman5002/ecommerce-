# Ecommerce

This repository is split into two top-level apps:

- `frontend/` - the React + Vite storefront
- `backend/` - the Node + Express API


## Project Structure

```text
Ecommerce/
  frontend/
  backend/
```

## Requirements

- Node.js 18 or newer
- npm

## Install

Install dependencies for each app separately:

```bash
npm install --prefix frontend
npm install --prefix backend
```

## Run Locally

Start the backend API:

```bash
npm --prefix backend run dev
```

Start the frontend app:

```bash
npm --prefix frontend run dev
```

You can also run the backend from the frontend package if needed:

```bash
npm --prefix frontend run dev:backend
```

## Build

Build the frontend for production:

```bash
npm --prefix frontend run build
```

## Backend Notes

- The backend runs from `backend/server.js`.
- By default it listens on port `4000`.
- Environment variables are loaded through `.env` in `backend/`.
- If SMTP is not configured, email verification still works in development with a dev code in the response.

## Frontend Notes

- The frontend uses Vite.
- API requests are proxied to `http://localhost:4000` during development.

## Deploying To Vercel And Render

### Frontend On Vercel

- Set the project root directory to `frontend`.
- Build command: `npm run build`
- Output directory: `dist`
- Add an environment variable named `VITE_API_BASE_URL` with your Render backend URL, for example `https://your-backend.onrender.com/api`.

### Backend On Render

- Set the root directory to `backend`.
- Build command: leave empty.
- Start command: `npm start`
- Add any backend environment variables in the Render dashboard, including SMTP values if you want email verification to send real mail.
- Render will set `PORT` automatically, and the backend already reads it.

## GitHub

This project is intended to be pushed as a single private repository with both folders in the root.