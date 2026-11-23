# LeadFlow — Lead Management CRM

A full-stack CRM application built for the **Full Stack Developer Screening Assignment at Meru Technosoft Pvt. Ltd.**

LeadFlow helps teams manage prospective clients, organize lead information, track sales pipeline stages, and monitor performance through a clean, responsive dashboard.

## Overview

LeadFlow provides an end-to-end lead management workflow with a React frontend, Express REST API, and MongoDB database.

### Features

- **Lead Management:** Create, view, edit, and delete leads.
- **Lead Tracking:** Manage leads through New, Contacted, Qualified, and Lost stages.
- **Search:** Find leads by name, email, or company.
- **Filtering:** Filter leads by status and source.
- **Sorting & Pagination:** Organize and navigate lead records.
- **Dashboard:** View total leads and status-wise statistics.
- **Form Validation:** Validate input on both frontend and backend.
- **Duplicate Prevention:** Prevent duplicate email addresses.
- **Responsive Design:** Interface optimized for desktop and mobile screens.
- **API Health Check:** Monitor backend availability.

## Tech Stack

| Frontend | Backend | Database & Testing |
|---|---|---|
| React 18 | Node.js | MongoDB |
| JavaScript | Express.js | Mongoose |
| Vite | REST API | Vitest |
| CSS | Zod | Supertest |
| Lucide React | Helmet, CORS | MongoDB Memory Server |

## Application Structure

\`\`\`text
lead-manager/
├── client/
│   └── src/
│       ├── components/     # Dashboard, leads, layout and UI
│       ├── hooks/          # Reusable React hooks
│       ├── services/       # API integration
│       ├── utils/          # Validation and formatting
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Application logic
│   │   ├── middleware/    # Validation and error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # REST API routes
│   │   ├── validators/     # Zod schemas
│   │   ├── app.js
│   │   └── server.js
│   └── test/               # API integration tests
│
├── package.json
└── README.md
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB (local installation or MongoDB Atlas)

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/madupojumounika/lead-manager.git
cd lead-manager
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure environment variables

Create the backend environment file:

\`\`\`bash
cp server/.env.example server/.env
\`\`\`

Configure `server/.env`:

\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/lead_manager
CLIENT_URL=http://localhost:5173
\`\`\`

Update `MONGODB_URI` with your MongoDB connection string if required.

### 4. Start the application

\`\`\`bash
npm run dev
\`\`\`

The frontend and backend start together.

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend Health | http://localhost:5000/api/health |

To run them separately:

\`\`\`bash
npm run dev:server
npm run dev:client
\`\`\`

## REST API

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API health |
| GET | `/api/leads` | List leads |
| GET | `/api/leads/:id` | Get a lead |
| POST | `/api/leads` | Create a lead |
| PUT | `/api/leads/:id` | Update a lead |
| PATCH | `/api/leads/:id/status` | Update lead status |
| DELETE | `/api/leads/:id` | Delete a lead |
| GET | `/api/dashboard/stats` | Get dashboard statistics |

The lead listing endpoint supports search, status and source filters, sorting, and pagination.

## Validation & Error Handling

- Frontend validation provides immediate feedback.
- Backend validation independently checks incoming requests.
- Duplicate email addresses are rejected.
- Invalid IDs and missing records are handled appropriately.
- Centralized error-handling middleware manages API errors.

## Testing

Run the backend test suite:

\`\`\`bash
npm test
\`\`\`

Tests cover:

- API health checks.
- Lead creation and validation.
- Duplicate email prevention.
- Lead listing, search, filtering, and pagination.
- Lead retrieval and updates.
- Status changes and deletion.
- Dashboard statistics.

### Verified Results

- **Backend tests:** 21/21 passed.
- **Frontend production build:** Passed.
- **API health check:** Passed.
- **Frontend-backend integration:** Verified.
- **Lead CRUD operations:** Manually tested.

## Production Build

Build the frontend:

\`\`\`bash
npm run build
\`\`\`

Production assets are generated in `client/dist/`.

For production deployment, configure a persistent MongoDB database and set the appropriate backend and frontend environment variables.

> **Database note:** During development, the backend can fall back to an in-memory MongoDB instance if a local database is unavailable. This is temporary storage; records are lost when the server stops. Use MongoDB Atlas or another persistent MongoDB deployment for production.

## Future Improvements

- User authentication and role-based access.
- Lead activity history and follow-up reminders.
- CSV import and export.
- Advanced analytics and reporting.

## Author

**Mounika Madupoju**

Full Stack Developer Screening Assignment  
**Meru Technosoft Pvt. Ltd.**

[GitHub Profile](https://github.com/madupojumounika) · [Project Repository](https://github.com/madupojumounika/lead-manager)
