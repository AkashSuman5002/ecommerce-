# Ecommerce

This repository is split into two top-level apps:

- `frontend/` - the React + Vite storefront
- `backend/` - the Node + Express API

The old `shooping/` folder was replaced by this cleaner layout.

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

## GitHub

This project is intended to be pushed as a single private repository with both folders in the root.