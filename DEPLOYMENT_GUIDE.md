# Flexi-Tip Deployment Guide

This guide covers how to deploy the Flexi-Tip application. We will use **Vercel** for the Frontend (React/Vite) and **Render** for the Backend (Node.js/Express + MySQL).

## Prerequisites

- GitHub Account (code must be pushed to a repository).
- Vercel Account (free tier is fine).
- Render Account (free tier is fine).
- A cloud database (e.g., Clever Cloud, Railway, or Render's PostgreSQL - but we use MySQL, so **Clever Cloud** or **Aiven** free tiers are good options for MySQL).

---

## Part 1: Database Deployment

Before deploying the backend, you need a live MySQL database.
1.  **Create a MySQL Service**: Use a provider like Clever Cloud (it has a free MySQL add-on).
2.  **Get Credentials**: Host, Database Name, User, Password, Port.
3.  **Run Migrations**: You can connect to this remote DB from your local machine using a tool like DBeaver or VS Code Database Client to run the SQL scripts in `backend/database-schema.sql`.

---

## Part 2: Backend Deployment (Render)

Render is recommended because it supports persistent connections (WebSockets) better than Vercel's serverless functions.

1.  **New Web Service**:
    - Go to Render Dashboard > New + > Web Service.
    - Connect your GitHub repository.
2.  **Configuration**:
    - **Root Directory**: `backend` (Important! Your backend code is in this folder).
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
    - **Environment Variables**: Add these (copy from your local `.env`)
        - `PORT`: `10000` (Render default)
        - `DB_HOST`: (your cloud database host)
        - `DB_USER`: (your cloud database user)
        - `DB_PASSWORD`: (your cloud database password)
        - `DB_NAME`: (your cloud database name)
        - `JWT_SECRET`: (generate a strong random string)
        - `GOOGLE_CLIENT_ID`: (from Google Cloud Console)
        - `CLIENT_URL`: `https://your-frontend-project.vercel.app` (You will update this after deploying frontend)

3.  **Deploy**: Click "Create Web Service". Wait for it to go live.
4.  **Copy URL**: Note your backend URL (e.g., `https://flexi-tip-backend.onrender.com`).

---

## Part 3: Frontend Deployment (Vercel)

1.  **New Project**:
    - Go to Vercel Dashboard > Add New > Project.
    - Import your GitHub repository.
2.  **Configuration**:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: `./` (default).
    - **Environment Variables**:
        - `VITE_API_URL`: Paste your **Render Backend URL** here (e.g., `https://flexi-tip-backend.onrender.com`).
        - `VITE_GOOGLE_CLIENT_ID`: (Same as in backend).
3.  **Deploy**: Click "Deploy".

---

## Part 4: Final Connection

1.  **Update Backend**: Go back to Render > Environment Variables. Update `CLIENT_URL` with your **actual Vercel Frontend URL**.
2.  **Update Google Cloud**:
    - Go to Google Cloud Console > APIs & Services > Credentials.
    - Edit your OAuth 2.0 Client ID.
    - **Authorized JavaScript Origins**: Add your Vercel URL (e.g., `https://flexi-tip.vercel.app`).
    - **Authorized Redirect URIs**: Add your Vercel URL.

## Troubleshooting

-   **CORS Errors**: Check `CLIENT_URL` in Backend and `VITE_API_URL` in Frontend. They must match exactly (watch out for trailing slashes).
-   **Database Connection**: Ensure your cloud database allows connections from everywhere (0.0.0.0/0) or check Render's IP addresses if you want to restrict it.
