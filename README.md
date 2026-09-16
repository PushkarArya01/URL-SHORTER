# URL Shortener

Make your URLs shorter. Create short, clean, and shareable links in seconds — track clicks and manage all your shortened URLs from one place.

**Live App:** [url-shorter-phi-blond.vercel.app](https://url-shorter-phi-blond.vercel.app)

## Features

- Shorten any long URL into a compact, shareable link
- Automatic redirect from short code to original URL
- Click tracking for every shortened link
- Copy and delete links from a clean dashboard
- Real-time stats: total URLs, total clicks, system status

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB (Mongoose) via MongoDB Atlas
- CORS

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

## Project Structure

```
004-URL/
├── backend/
│   ├── src/
│   │   ├── app/           # Express app setup
│   │   ├── config/        # DB connection & config
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Helper functions (e.g. code generation)
│   │   └── server.js      # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/            # Main App component
    │   └── main.jsx
    ├── public/
    └── package.json
```

## Getting Started (Local Setup)

### Prerequisites
- Node.js installed
- A MongoDB Atlas connection string

### 1. Clone the repository
```bash
git clone https://github.com/PushkarArya01/URL-SHORTER.git
cd URL-SHORTER
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```
MONGO_URI=your_mongodb_atlas_connection_string
```

Run the backend:
```bash
npm run dev
```
Backend runs on `http://localhost:3000`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```
VITE_API_URL=http://localhost:3000
```

Run the frontend:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint          | Description                     |
|--------|-------------------|----------------------------------|
| GET    | `/api/url`        | Fetch all shortened URLs         |
| POST   | `/api/url`        | Create a new shortened URL       |
| DELETE | `/api/url/:id`    | Delete a shortened URL           |
| GET    | `/:code`          | Redirect to the original URL     |

## Deployment Notes

- The backend must have `MONGO_URI` set as an environment variable on the hosting platform (Render), since `.env` files are not committed to the repository.
- MongoDB Atlas Network Access must allow connections from `0.0.0.0/0`, since cloud hosting providers use dynamic IPs.
- The frontend must have `VITE_API_URL` set as an environment variable on Vercel, pointing to the deployed backend URL.

## Live Url
https://url-shorter-phi-blond.vercel.app/

## License

This project is open source and available for personal or educational use.
