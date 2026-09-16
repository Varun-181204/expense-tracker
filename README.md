# 💰 Expense Track — Personal Finance & Expense Tracker

<p align="center">
  <strong>A full-stack MERN application for managing personal finances, tracking expenses, setting budgets, and understanding spending patterns.</strong>
</p>

<p align="center">
  <a href="https://expense-tracker-theta-eosin-15.vercel.app">
    🚀 Live Demo
  </a>
</p>

---

## 🏷️ Tech Badges

<p align="center">





\

</p>

---

## 🌐 Live Application

🚀 **Frontend:**
https://expense-tracker-theta-eosin-15.vercel.app

⚙️ **Backend API:**
https://expense-tracker-pqf2.onrender.com

---

## 📖 About the Project

**ExpenseTrack** is a full-stack personal finance management application built using the **MERN stack**.

The application allows users to securely manage their income and expenses, organize transactions using categories, create monthly budgets, and analyze their financial activity through interactive dashboards and reports.

The project follows a separate **React frontend + Express backend + MongoDB database** architecture and uses JWT authentication for protected user data.

---

# ✨ Features

## 🔐 Authentication & Security

* 👤 User registration and login
* 🔑 JWT-based authentication
* 🔒 Password hashing using `bcryptjs`
* 🛡️ Protected routes
* 💾 Persistent login using local storage
* 👥 User-specific data access
* 🔐 Secure environment variable configuration

---

## 📊 Financial Dashboard

* 💰 Total balance
* 📥 Total income
* 📤 Total expenses
* 📅 Current month spending
* 📈 Monthly income and expense trends
* 🥧 Expense category breakdown
* ⚠️ Budget spending alerts
* 🧾 Recent transactions

---

## 💳 Transaction Management

* ➕ Add transactions
* ✏️ Edit transactions
* 🗑️ Delete transactions
* 💵 Income and expense classification
* 🏷️ Category selection
* 📅 Transaction dates
* 📝 Optional notes
* 🔎 Search transactions
* 🎯 Filter by category
* 📌 Filter by transaction type
* 📆 Filter by date range
* ↕️ Sort transactions
* 📄 Export transactions to CSV

---

## 🏷️ Category Management

* 💸 Separate income and expense categories
* 📂 Default categories for new users
* ➕ Create custom categories
* 🎨 Custom category colors
* 🗑️ Delete categories safely
* 🔄 Transactions can be remapped to the `Other` category

---

## 🎯 Budget Management

* 💰 Create monthly budgets
* 🏷️ Category-specific spending limits
* 📊 Track budget usage
* 💵 Calculate remaining budget
* 📈 Visual budget progress
* ⚠️ Spending threshold alerts
* 📅 Review budgets by month and year

---

## 📈 Financial Reports & Analytics

* 📅 This Month
* 📅 Last Month
* 📊 Last 6 Months
* 📆 This Year
* 📚 All Time
* 🗓️ Custom date range
* 💵 Total income
* 💸 Total expenses
* 💰 Net savings
* 📊 Savings rate
* 📈 Cashflow trends
* 🥧 Expense category analysis
* 📉 Monthly savings trends
* 📄 CSV export
* 🖨️ Printable reports

---

## ⚙️ Profile & Settings

* 👤 View account information
* ✏️ Update display name
* 📧 Update email
* 🔑 Change password
* 🚪 Secure logout

---

# 🖥️ Screenshots

> 📌 Add your actual screenshots to the `screenshots/` folder using the filenames shown below.

## 🔐 Login

## 📝 Register

## 📊 Dashboard

## 💳 Transactions

## 🏷️ Categories

## 🎯 Budgets

## 📈 Reports

## ⚙️ Settings

---

# 🏗️ Application Architecture

```text
                    👤 USER
                      │
                      ▼
              ┌───────────────┐
              │ React + Vite  │
              │  Frontend     │
              └───────┬───────┘
                      │
                  Axios API
                      │
                      ▼
              ┌───────────────┐
              │ Express.js    │
              │ REST API      │
              └───────┬───────┘
                      │
              🔑 JWT Authentication
                      │
                      ▼
              ┌───────────────┐
              │ MongoDB Atlas │
              │   Database    │
              └───────────────┘
```

---

# 🛠️ Tech Stack

### 🎨 Frontend

* ⚛️ React 19
* ⚡ Vite
* 🎨 Tailwind CSS v4
* 🧭 React Router
* 📡 Axios
* 📊 Recharts
* 🎨 React Icons
* 🔔 React Toastify

### ⚙️ Backend

* 🟢 Node.js
* 🚂 Express.js
* 🍃 MongoDB Atlas
* 🧩 Mongoose
* 🔑 JSON Web Token
* 🔐 bcryptjs
* 🌐 CORS
* 🔧 dotenv

### ☁️ Deployment

* ▲ Vercel — Frontend
* 🚀 Render — Backend
* 🍃 MongoDB Atlas — Database

---

# 📁 Project Structure

```text
expense-tracker/
│
├── 📄 .gitignore
├── 📄 README.md
│
├── 📂 backend/
│   │
│   ├── 📂 config/
│   │   └── db.js
│   │
│   ├── 📂 controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── categoryController.js
│   │   ├── budgetController.js
│   │   ├── reportController.js
│   │   └── dashboardController.js
│   │
│   ├── 📂 middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── 📂 models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── Category.js
│   │   └── Budget.js
│   │
│   ├── 📂 routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── reportRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── 📂 utils/
│   │   └── defaultCategories.js
│   │
│   ├── 🔒 .env.example
│   ├── 📦 package.json
│   └── 🚀 server.js
│
├── 📂 frontend/
│   │
│   ├── 📂 public/
│   │
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   ├── 📂 context/
│   │   ├── 📂 pages/
│   │   ├── 📂 services/
│   │   ├── 📂 utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── 🔒 .env.example
│   ├── 📦 package.json
│   ├── vercel.json
│   └── vite.config.js
│
└── 📂 screenshots/
    ├── login.png
    ├── register.png
    ├── dashboard.png
    ├── transactions.png
    ├── categories.png
    ├── budgets.png
    ├── reports.png
    └── settings.png
```

---

# 💻 Local Development

## 📋 Prerequisites

Before running the project locally, install:

* 🟢 Node.js 18+
* 🍃 MongoDB Atlas account or local MongoDB
* 📦 npm
* 🔧 Git

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Varun-181204/expense-tracker.git
cd expense-tracker
```

---

## 2️⃣ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# ☁️ Production Deployment

## ▲ Frontend — Vercel

The frontend is deployed using **Vercel**.

### Configuration

```text
Root Directory: frontend
```

Environment variable:

```text
VITE_API_URL=https://expense-tracker-pqf2.onrender.com/api
```

### 🌐 Live URL

https://expense-tracker-theta-eosin-15.vercel.app

---

## 🚀 Backend — Render

The backend is deployed using **Render**.

### Configuration

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Required environment variables:

```text
PORT
MONGO_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
FRONTEND_URL
```

### ⚙️ Backend URL

https://expense-tracker-pqf2.onrender.com

---

# 🔒 Security Practices

ExpenseTrack follows basic security practices for a full-stack application:

* 🔐 Password hashing with `bcryptjs`
* 🔑 JWT authentication
* 🛡️ Protected API routes
* 👤 User-specific resource access
* 🔒 Environment variables for sensitive configuration
* 🚫 `.env` files excluded from Git
* 🧹 Database validation through Mongoose schemas

> ⚠️ Never upload your real `.env` file, passwords, API keys, database credentials, or JWT secrets to GitHub.

---

# 🔄 Development Workflow

```text
💻 Make Changes
      │
      ▼
🧪 Test Locally
      │
      ▼
📦 git add .
      │
      ▼
📝 git commit -m "Update project"
      │
      ▼
🚀 git push origin main
      │
      ▼
🐙 GitHub
      │
      ├───────────────┐
      ▼               ▼
     ▲ Vercel       🚀 Render
   Frontend         Backend
      │               │
      └───────┬───────┘
              ▼
        🌐 Live Application
```

---

# 📌 Future Improvements

* 🔁 Recurring transactions
* 🎯 Financial goal tracking
* 📊 More advanced analytics
* 📱 Further mobile UI improvements
* 🔔 Custom financial notifications
* 📈 More detailed spending insights
* 📤 Additional export formats

---

# 👨‍💻 Project

**Expense Track** is a full-stack web application developed as a personal finance management project using modern web development technologies.

---

<p align="center">

💰 **Expense Track**
Built with ❤️ using the MERN Stack

</p>
