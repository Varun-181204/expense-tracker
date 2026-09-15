# ExpenseTrack — Full-Stack MERN Personal Finance & Expense Tracker

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)

A modern, production-grade MERN (MongoDB, Express, React, Node.js) Full-Stack Personal Finance & Expense Tracker application. Built with a clean architecture, real-time database aggregations, interactive charts, category management, monthly budgeting, financial reports, and JWT authentication.

---

## ✨ Features

### 1. 🔐 Authentication & Security
- User registration and login with JWT (JSON Web Tokens).
- Secure password hashing using `bcryptjs`.
- Persistent session storage in `localStorage` with automatic profile verification.
- Protected client-side routes and server-side authorization middleware (`Bearer` token).
- Strict user-data isolation: each user can only query, modify, or delete their own data.

### 2. 📊 Live Financial Dashboard
- **Real Database Aggregations**: No hardcoded or fake statistics.
- 4 dynamic KPI cards: Total Balance, Total Income, Total Expenses, and Current Month Spending.
- **Monthly Spending Trend**: Interactive multi-bar comparison of Income vs. Expense over the last 6 months (powered by Recharts).
- **Expense Breakdown**: Donut chart displaying proportion of expenditures by category.
- **Budget Threshold Alerts**: Reactive warning cards if monthly spending exceeds 80% or breaches 100% of the allocated budget.
- **Recent Transactions**: Quick summary of the latest financial events with direct link to the full ledger.

### 3. 💳 Transactions Management
- Add, edit, and delete transactions with intuitive modal dialogs.
- Detailed fields: Title, Amount, Type (Income vs. Expense), Category, Date, and Optional Notes/Description.
- **Multi-Filter & Search Engine**: Real-time search across titles and notes, filtered by Category, Type, and Custom Date range.
- **Sorting**: Order by newest/oldest date, highest/lowest amount.
- **Export to CSV**: Download filtered transaction histories directly into Excel/CSV format.

### 4. 🏷️ Category Management
- Categorized tabs for **Expense Categories** and **Income Categories**.
- Default seeded categories on registration:
  - *Expenses*: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other.
  - *Income*: Salary, Freelance, Business, Investment, Other.
- Create custom categories with custom color palettes.
- Safely delete categories with automatic transaction remapping to "Other".

### 5. 🎯 Monthly Budgeting
- Set overall monthly budgets or category-specific spending caps.
- Dynamic visual progress bars calculating amount spent vs. remaining budget.
- Real-time warnings when nearing (≥80%) or exceeding (≥100%) limits.
- Historical and future budget review with interactive month & year pickers.

### 6. 📈 Financial Reports & Analytics
- Multi-period filters: *This Month*, *Last Month*, *Last 6 Months*, *This Year*, *All Time*, or *Custom Range*.
- Detailed summary metrics (Total Income, Total Expenses, Net Savings, and Savings Rate %).
- Cashflow trends, expense category distribution, and monthly net savings area charts.
- Printable financial statements and CSV export.

### 7. ⚙️ Profile & Settings
- View account metadata and active status.
- Update user display name and primary email address.
- Change passwords securely with current password verification.
- Safe session sign out.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, Axios, Recharts, React Icons, React Toastify |
| **Backend** | Node.js, Express.js, MongoDB Atlas, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv |
| **Deployment** | Vercel (Frontend SPA rewrite), Render (Backend web service) |

---

## 📁 Project Structure

```text
Expense-Tracker/
├── .gitignore               # Excludes .env, node_modules, dist, and log files
├── README.md                # Project documentation
│
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile, password
│   │   ├── transactionController.js # Transaction CRUD, search, filter
│   │   ├── categoryController.js    # Category CRUD & seeding
│   │   ├── budgetController.js      # Monthly & category budgets
│   │   ├── reportController.js      # Time-range aggregations & trends
│   │   └── dashboardController.js   # Live dashboard summary metrics
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification & req.user injection
│   │   └── errorMiddleware.js       # 404 & global error handler
│   ├── models/
│   │   ├── User.js          # User schema with bcrypt pre-save hook
│   │   ├── Transaction.js   # Transaction schema with compound indexes
│   │   ├── Category.js      # Category schema with user reference
│   │   └── Budget.js        # Budget schema with unique month/year index
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── reportRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   └── defaultCategories.js     # Default category seeds
│   ├── .env.example         # Backend environment template
│   ├── package.json         # Backend dependencies & scripts
│   └── server.js            # Express server initialization
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx           # Responsive desktop & mobile drawer
    │   │   ├── Navbar.jsx            # Top bar with quick actions & greetings
    │   │   ├── Layout.jsx            # Application shell
    │   │   ├── ProtectedRoute.jsx    # Auth route guard
    │   │   ├── StatCard.jsx          # KPI card with color schemes
    │   │   ├── TransactionModal.jsx  # Add/edit transaction dialog
    │   │   ├── CategoryModal.jsx     # Add/edit category dialog
    │   │   ├── BudgetModal.jsx       # Set monthly budget dialog
    │   │   ├── LoadingSkeleton.jsx   # Skeleton placeholders
    │   │   ├── EmptyState.jsx        # Empty data illustrations
    │   │   └── DeleteConfirmModal.jsx # Confirmation prompt
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global auth state & persistence
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Transactions.jsx
    │   │   ├── Categories.jsx
    │   │   ├── Budgets.jsx
    │   │   ├── Reports.jsx
    │   │   ├── Settings.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── NotFound.jsx
    │   ├── services/
    │   │   ├── api.js                # Central Axios instance with interceptors
    │   │   ├── authService.js
    │   │   ├── transactionService.js
    │   │   ├── categoryService.js
    │   │   ├── budgetService.js
    │   │   ├── reportService.js
    │   │   └── dashboardService.js
    │   ├── utils/
    │   │   └── formatters.js         # Currency & date helpers
    │   ├── App.jsx                   # Route configuration
    │   ├── main.jsx                  # React DOM entrypoint
    │   └── index.css                 # Tailwind CSS directives
    ├── .env.example         # Frontend environment template
    ├── package.json         # Frontend dependencies & scripts
    ├── vercel.json          # SPA route rewrite for Vercel
    └── vite.config.js       # Vite build configuration
```

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Varun-181204/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup
1. Open a terminal and navigate into the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file (refer to `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expenseTracker?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`. Test the health check at `http://localhost:5000/api/health`.

### 3. Frontend Setup
1. Open a new terminal and navigate into the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file (refer to `.env.example`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Push your repository to GitHub.
2. Import your GitHub repository on [Vercel](https://vercel.com).
3. Set the **Root Directory** to `frontend`.
4. Add the Environment Variable:
   - `VITE_API_URL`: `https://<your-render-backend-url>/api`
5. The included [`vercel.json`](frontend/vercel.json) rewrites all SPA routes to `/index.html`, ensuring clean refreshes on any route.

### Backend (Render)
1. In [Render Dashboard](https://render.com), create a new **Web Service**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variables:
   - `PORT`: `5000` (or leave default for Render)
   - `MONGO_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A strong random secret key
   - `FRONTEND_URL`: `https://<your-vercel-app-url>.vercel.app`
7. Ensure MongoDB Atlas Network Access whitelist allows connections from anywhere (`0.0.0.0/0`) for Render instances.

---

## 🔒 Security Best Practices Implemented
- **No Secrets in Source Control**: `.gitignore` strictly protects `.env` files and logs.
- **Password Protection**: Passwords salted and hashed with `bcryptjs`.
- **JWT Authentication**: Expiring tokens verified on every protected API endpoint.
- **Resource Ownership Verification**: Every update and delete operation verifies that `resource.user.toString() === req.user._id.toString()`.
- **Data Sanitization**: Mongoose schemas enforce data types, trimming, and required constraints.

---

## 📄 License
This project is open source and available under the [ISC License](LICENSE).
