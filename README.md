# TVS Digital Employee Pulse & Feedback App

A full-stack React + TypeScript enterprise feedback platform for TVS Digital employees.

## Stack

- React + TypeScript + Vite
- Tailwind CSS + Framer Motion + Recharts
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- JWT authentication

## Features

- `tvsd.ai` email restriction during registration and email login
- Employee login with employee ID or company email
- One feedback submission per business day
- Daily reset logic at `9:00 AM`
- Animated employee dashboard and admin analytics panel
- Confidential feedback with anonymous toggle
- Rule-based AI insight summaries and concern categorization
- Seed script for demo users and sample analytics

## Folder Structure

- `client` - React + TypeScript frontend
- `server` - Express + MongoDB backend

## Quick Start

### 1. Start MongoDB locally

Use a local MongoDB instance on:

```bash
mongodb://127.0.0.1:27017/tvs_feedback
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy `server/.env.example` to `server/.env` and update values if needed.

### 4. Seed demo data

```bash
npm run seed
```

### 5. Start the app

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Demo Credentials

### Admin

- Email: `admin@tvsd.ai`
- Password: `Admin@123`

### Employees

- Email: `anita@tvsd.ai`
- Employee ID: `TVS1001`
- Password: `Password@123`

- Email: `rahul@tvsd.ai`
- Employee ID: `TVS1002`
- Password: `Password@123`

- Email: `meena@tvsd.ai`
- Employee ID: `TVS1003`
- Password: `Password@123`

## Notes

- Browser notifications work while the employee dashboard is open and notification permission is granted.
- The 9:00 AM reset is enforced by backend business-day logic, so duplicate submissions are blocked automatically.
- External LLM providers are not required to run this locally; the current build includes rule-based insight generation that can be replaced later with OpenAI or Gemini.
