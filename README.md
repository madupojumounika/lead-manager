# LeadFlow — Modern Full-Stack Lead Management CRM

A clean, responsive, and production-quality Lead Management web application designed and built for the **Full Stack Developer screening assignment at Meru Technosoft Pvt. Ltd.**

LeadFlow empowers sales and business development teams to capture, organize, qualify, and convert sales prospects through an intuitive SaaS CRM interface backed by a robust REST API architecture.

---

## 1. Project Overview

LeadFlow is built from the ground up to reflect production-grade software engineering practices. It replaces clumsy spreadsheets and disjointed tracking mechanisms with a centralized CRM platform:
- **Instant Prospect Capture:** Add new leads with comprehensive contact and qualification data.
- **Dynamic Pipeline Analytics:** Live dashboard metrics computed directly via database aggregations.
- **Search & Multi-Dimensional Filtering:** Query leads across name, email, and company while isolating statuses and acquisition sources.
- **End-to-End Type Safety & Validation:** Identical Zod validation schemas running on both client and server to prevent invalid states and duplicate email registrations.
- **Responsive Architecture:** Fully responsive desktop data table and mobile-optimized card layout.

---

## 2. Features

### A. Lead Creation & Duplicate Prevention
- Capture full name, email, phone number, company name, lead source, and pipeline status.
- Strict format validation on both client (interactive feedback) and server.
- Guaranteed unique email constraint with `409 Conflict` error handling.
- Instant success feedback with auto-dismissing toast notifications.

### B. Lead Listing & Sorting
- High-density data table displaying contact details, company, source badge, pipeline status badge, and creation timestamp.
- Column sorting by **Name (A–Z / Z–A)** and **Creation Date (Newest / Oldest)**.
- Mobile-optimized responsive cards for viewports under 768px.
- Informative empty states with direct call-to-action buttons.

### C. Lead Editing & Inline Status Transitions
- Edit modal pre-populated with existing lead data for quick updates.
- Fast, single-click inline status switcher directly from the table row without opening modals.
- Real-time updates reflected immediately in both table and dashboard statistics.

### D. Delete Confirmation Dialog
- Accessible danger-themed confirmation modal preventing accidental deletions.
- Instant cache synchronization and pagination self-healing upon deletion.

### E. Search & Filtering Toolbar
- Debounced search across Lead Name, Email, and Company.
- Filter dropdowns for Lead Status (`All`, `New`, `Contacted`, `Qualified`, `Lost`) and Acquisition Source (`Website`, `Referral`, `LinkedIn`, `Social Media`, `Advertisement`, `Other`).
- Active filter pill tags with one-click individual dismissal and a "Clear all" button.

### F. Pipeline Dashboard
- Live count of **Total Leads**, **New Leads**, **Contacted Leads**, **Qualified Leads**, and **Lost Leads**.
- Computed through MongoDB aggregation pipelines (no hardcoded mocks).
- Interactive cards: clicking any card instantly filters the lead list to that status.

---

## 3. Tech Stack

### Frontend
- **Framework:** React 18+ (SPA architecture)
- **Tooling & Bundler:** Vite (ultrafast HMR and optimized production bundling)
- **Styling:** Custom Vanilla CSS with modern CSS custom properties (design system with deep navy typography, slate borders, and SaaS blue accents)
- **Icons:** `lucide-react` (clean, consistent stroke icons)
- **Validation:** Zod (declarative schema parsing and error formatting)

### Backend
- **Runtime:** Node.js (v18+ / v20+ / v24+)
- **Framework:** Express.js (modular REST API architecture)
- **Database ODM:** Mongoose (schema enforcement, hooks, and indexes)
- **Validation & Sanitization:** Zod middleware with structured error responses
- **Security & Logging:** Helmet (HTTP security headers), CORS (origin whitelisting), Morgan (HTTP logger)

### Database
- **Database Engine:** MongoDB (MongoDB Atlas cloud cluster or local `mongod` daemon)
- **In-Memory Fallback:** Automated `mongodb-memory-server` support for automated tests and zero-configuration local review.

### Testing
- **Test Runner:** Vitest
- **HTTP Assertions:** Supertest
- **In-Memory Database:** MongoMemoryServer (isolated, deterministic integration tests)

---

## 4. System Architecture

```
                      +-----------------------------+
                      |   React 18 Single Page App  |
                      |   (Vite, CSS Modules, Zod)  |
                      +--------------+--------------+
                                     |
                                REST API
                                 (JSON)
                                     v
                      +-----------------------------+
                      |     Express.js REST API     |
                      |  - Helmet / CORS Security   |
                      |  - Zod Request Validator    |
                      |  - Central Error Handler    |
                      +--------------+--------------+
                                     |
                                  Mongoose
                                     v
                      +-----------------------------+
                      |       MongoDB Database      |
                      |  - Unique Indexes           |
                      |  - Aggregation Pipelines    |
                      +-----------------------------+
```

---

## 5. Project Directory Structure

```
lead-manager/
├── client/                     # Frontend Vite + React application
│   ├── public/
│   │   └── vite.svg            # Favicon & branding assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   └── StatCards.jsx         # 5 live pipeline metric cards
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx            # App header with CTA & health badge
│   │   │   │   └── Sidebar.jsx           # Responsive sidebar navigation
│   │   │   ├── Leads/
│   │   │   │   ├── DeleteConfirmModal.jsx # Accessible delete dialog
│   │   │   │   ├── LeadModal.jsx         # Create & Edit lead modal form
│   │   │   │   ├── LeadTable.jsx         # Responsive table & mobile cards
│   │   │   │   └── StatusBadge.jsx       # Color-coded status indicator
│   │   │   └── UI/
│   │   │       ├── Pagination.jsx        # Smart pagination controls
│   │   │       ├── SearchFilterBar.jsx   # Search, filters, sort toolbar
│   │   │       └── Toast.jsx             # Alert toast notifications
│   │   ├── hooks/
│   │   │   └── useToast.js               # Toast notification manager
│   │   ├── services/
│   │   │   └── api.js                    # Centralized Fetch API client
│   │   ├── utils/
│   │   │   ├── formatters.js             # Date, phone, and badge formatters
│   │   │   └── validators.js             # Zod validation schemas
│   │   ├── App.jsx                       # Main application state orchestrator
│   │   ├── main.jsx                      # Application entry point
│   │   └── styles.css                    # Professional SaaS CRM styling
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── server/                     # Backend Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # MongoDB connection & fallback
│   │   ├── controllers/
│   │   │   ├── dashboardController.js   # Pipeline aggregation stats
│   │   │   └── leadController.js        # Lead CRUD operations
│   │   ├── middleware/
│   │   │   ├── errorHandler.js          # Centralized error handler
│   │   │   └── validateRequest.js       # Zod validation middleware
│   │   ├── models/
│   │   │   └── Lead.js                  # Mongoose Lead schema & indexes
│   │   ├── routes/
│   │   │   ├── dashboardRoutes.js       # /api/dashboard routes
│   │   │   ├── healthRoutes.js          # /api/health route
│   │   │   └── leadRoutes.js            # /api/leads CRUD routes
│   │   ├── validators/
│   │   │   └── leadValidator.js         # Zod schemas for request payloads
│   │   ├── app.js                       # Express app configuration
│   │   └── server.js                    # HTTP server listener & shutdown
│   ├── test/
│   │   └── lead.test.js                 # Complete Vitest integration test suite
│   ├── package.json
│   └── .env.example
├── .gitignore
├── package.json                 # Root orchestration scripts
└── README.md                    # Project documentation
```

---

## 6. Database Schema

The `Lead` model is defined with strict typing, custom validators, and indexes:

| Field | Type | Required | Unique | Details / Constraints |
|---|---|---|---|---|
| `name` | String | Yes | No | Trimmed, 2–100 characters |
| `email` | String | Yes | Yes | Trimmed, lowercased, valid email regex |
| `phone` | String | Yes | No | Trimmed, 7–20 characters |
| `company` | String | Yes | No | Trimmed, 1–100 characters |
| `source` | String | Yes | No | Enum: `['Website', 'Referral', 'LinkedIn', 'Social Media', 'Advertisement', 'Other']` |
| `status` | String | Yes | No | Enum: `['New', 'Contacted', 'Qualified', 'Lost']`, default `'New'` |
| `createdAt` | Date | Auto | No | Mongoose timestamp |
| `updatedAt` | Date | Auto | No | Mongoose timestamp |

### Indexes
- `{ email: 1 }` (Unique index for instantaneous collision detection)
- `{ status: 1 }` (Index for pipeline filtering)
- `{ source: 1 }` (Index for channel filtering)
- `{ createdAt: -1 }` (Index for chronological sorting)
- Compound text index `{ name: 'text', company: 'text', email: 'text' }`

---

## 7. REST API Documentation

### Health Check
- **`GET /api/health`**
  - **Description:** Verifies service availability and uptime.
  - **Response `200 OK`:**
    ```json
    {
      "status": "ok",
      "uptime": 142,
      "timestamp": "2026-11-21T10:00:00.000Z"
    }
    ```

### Leads Endpoints

- **`GET /api/leads`**
  - **Description:** Returns paginated, filtered, and sorted leads.
  - **Query Parameters:**
    - `page` (number, default: `1`)
    - `limit` (number, default: `10`)
    - `search` (string, searches name, email, company)
    - `status` (`All`, `New`, `Contacted`, `Qualified`, `Lost`)
    - `source` (`All`, `Website`, `Referral`, `LinkedIn`, `Social Media`, `Advertisement`, `Other`)
    - `sortBy` (`createdAt`, `name`, `company`, `status`, `email`)
    - `sortOrder` (`asc`, `desc`, default: `desc`)
  - **Response `200 OK`:**
    ```json
    {
      "success": true,
      "count": 1,
      "pagination": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1,
        "hasNextPage": false,
        "hasPrevPage": false
      },
      "data": [
        {
          "id": "673f1d5e3c1a2b3c4d5e6f7a",
          "name": "Sarah Jenkins",
          "email": "sarah@acme.com",
          "phone": "+1 555-0199",
          "company": "Acme Corp",
          "source": "LinkedIn",
          "status": "New",
          "createdAt": "2026-11-21T09:30:00.000Z",
          "updatedAt": "2026-11-21T09:30:00.000Z"
        }
      ]
    }
    ```

- **`GET /api/leads/:id`**
  - **Description:** Retrieve details for a single lead.
  - **Response `200 OK`** or **`404 Not Found`** / **`400 Bad Request`** (invalid ID format).

- **`POST /api/leads`**
  - **Description:** Create a new prospect.
  - **Request Body:**
    ```json
    {
      "name": "Sarah Jenkins",
      "email": "sarah@acme.com",
      "phone": "+1 555-0199",
      "company": "Acme Corp",
      "source": "LinkedIn",
      "status": "New"
    }
    ```
  - **Response `201 Created`:**
    ```json
    {
      "success": true,
      "message": "Lead created successfully",
      "data": { ...leadObject }
    }
    ```
  - **Response `409 Conflict`:** If email already exists.
  - **Response `400 Bad Request`:** If payload validation fails.

- **`PUT /api/leads/:id`**
  - **Description:** Update lead contact details and status.
  - **Response `200 OK`** or **`409 Conflict`** if email collides with another record.

- **`PATCH /api/leads/:id/status`**
  - **Description:** Quick status transition.
  - **Request Body:**
    ```json
    {
      "status": "Qualified"
    }
    ```
  - **Response `200 OK`:**
    ```json
    {
      "success": true,
      "message": "Lead status updated successfully",
      "data": { ...leadObject }
    }
    ```

- **`DELETE /api/leads/:id`**
  - **Description:** Permanently delete a lead record.
  - **Response `200 OK`:**
    ```json
    {
      "success": true,
      "message": "Lead deleted successfully"
    }
    ```

### Dashboard Analytics

- **`GET /api/dashboard/stats`**
  - **Description:** Returns aggregate count across all lead stages.
  - **Response `200 OK`:**
    ```json
    {
      "success": true,
      "data": {
        "total": 24,
        "new": 10,
        "contacted": 6,
        "qualified": 5,
        "lost": 3
      }
    }
    ```

---

## 8. Environment Variables

### Backend (`server/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | HTTP port the server listens on | `5000` |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | `development` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/lead_manager` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (leave empty in local dev to use Vite proxy) | `http://localhost:5000` (or `""` for dev proxy) |

---

## 9. Local Installation & Setup

### Prerequisites
- **Node.js:** v18.x or later (recommended: v20+ or v24)
- **npm:** v9.x or later
- **MongoDB:** Local MongoDB installation, Docker container, or free MongoDB Atlas cluster. (If no local mongod is active, the app automatically initializes an in-memory MongoDB server in development mode).

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/madupojumounika/lead-manager.git
   cd lead-manager
   ```

2. **Install all dependencies:**
   ```bash
   # Install root, backend, and frontend dependencies
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

3. **Configure Environment Variables:**
   ```bash
   # In server directory:
   cp server/.env.example server/.env

   # In client directory:
   cp client/.env.example client/.env
   ```

4. **Run the Application in Development Mode:**
   ```bash
   # Run both server and client concurrently from root:
   npm run dev

   # Or run individually in separate terminals:
   # Terminal 1 (Backend API):
   npm run dev:server

   # Terminal 2 (Frontend Client):
   npm run dev:client
   ```

5. **Open in Browser:**
   - Frontend UI: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api/health`

---

## 10. Automated Testing

The backend includes a comprehensive automated test suite with Vitest and Supertest testing all requirements:
- Health check verification
- Lead creation with valid fields
- Rejection of invalid email formats
- Rejection of missing required fields
- Prevention of duplicate email collisions (`409 Conflict`)
- Querying leads with search, source filter, status filter, and pagination
- Retrieval of a single lead by ID
- Rejection of malformed MongoDB ObjectIds
- Complete update and partial status transitions
- Deletion of records
- Dashboard metrics aggregation accuracy

### Running Tests
```bash
# Run tests from root:
npm test

# Or directly in server directory:
cd server
npm test
```

---

## 11. Production Deployment

### Frontend Deployment (Vercel)
1. Push project to GitHub.
2. In the Vercel dashboard, click **Add New Project** and select `lead-manager`.
3. Set the **Root Directory** to `client`.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Environment Variables:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g., `https://lead-manager-api.onrender.com`).
8. Deploy!

### Backend Deployment (Render)
1. Create a new **Web Service** on Render connected to `lead-manager`.
2. Root Directory: `server`.
3. Environment: `Node`.
4. Build Command: `npm install`.
5. Start Command: `npm start`.
6. Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render defaults)
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `CLIENT_URL`: URL of your deployed frontend (e.g., `https://lead-manager.vercel.app`).
7. Deploy!

---

## 12. Assumptions, Limitations & Future Improvements

### Assumptions
- CRM users belong to a single organization working on a shared prospect pipeline.
- Leads require unique email addresses as the primary prospect identifier.

### Limitations
- Authentication and multi-tenancy are intentionally omitted to focus on core screening requirements and ensure zero-friction local evaluation.
- Exporting leads to CSV/Excel is not currently built-in.

### Future Improvements
1. **Role-Based Authentication (RBAC):** Add JWT authentication with Sales Representative and Admin roles.
2. **Activity Timeline & Notes:** Allow logging calls, meetings, and follow-up notes on each lead.
3. **CSV Export / Import:** Bulk import prospects from CSV and export filtered lists.
4. **Email Integration:** Send outreach templates directly from the lead profile.

---

## 13. Author & Submission Details

- **Candidate:** Mounika Madupoju
- **Email:** madupojumounika0@gmail.com
- **Role:** Full Stack Developer Screening Assignment
- **Company:** Meru Technosoft Pvt. Ltd.
- **Repository:** [https://github.com/madupojumounika/lead-manager](https://github.com/madupojumounika/lead-manager)
