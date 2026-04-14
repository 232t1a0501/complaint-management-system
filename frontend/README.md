# 🎓 Student Complaint Management

### 🖥️ Frontend Architecture Snapshot

_A modern, responsive, and interactive UI optimized for students and administrators._

---

## 🛠️ THE TECH STACK

_The engines powering the interface._

- **⚛️ React** | Core UI library for component-driven design.
- **⚡ Vite** | Ultra-fast build tool and local dev server.
- **🎨 Tailwind CSS** | Utility-first framework for responsive styling.
- **🛣️ React Router DOM** | Client-side routing & protected navigation.
- **✨ Lucide React** | Beautiful, consistent SVG iconography.
- **📡 Axios** | HTTP client connecting to backend `/api/*`.
- **🍞 React Hot Toast** | Elegant success/error notifications.

---

## 📂 DIRECTORY BLUEPRINT (`src/`)

_How the application logic is organized._

### 1️⃣ The Entry Point

- **`main.jsx`** ➡️ Renders the app into the DOM.
- **`App.jsx`** ➡️ Sets up the Router tree, wraps the app in AuthProvider, and handles role-based rendering (e.g., dynamically serving `StudentDashboard` vs. `AdminDashboard`).

### 2️⃣ Global State

- **🔐 `context/AuthContext.jsx`**
  - The central hub for user authentication.
  - Checks `localStorage` for sessions.
  - Attaches JWT tokens to Axios headers.
  - Manages login and logout flows.

### 3️⃣ Reusable UI Components (`components/`)

- **🧱 `Layout.jsx`**: Main wrapper that pushes content aside when the sidebar toggles.
- **🧭 `Sidebar.jsx`**: Collapsible navigation menu with custom app logo.
- **📝 `ComplaintForm.jsx`**: Slide-down modal for students to submit issues (with custom DatePicker).
- **✏️ `EditComplaintForm.jsx`**: Shared modal for students (editing) and admins (updating status).

### 4️⃣ Main Application Screens (`pages/`)

- **🚪 Login / Register**
  - Two-column modern layout.
  - _Register_: Enforces `@ashokacollege.in` for students; requires a secret key for Admins.
  - _Login_: Built-in secure "Forgot Password" requiring Email + Full Name verification.

- **🎓 Student Dashboard**
  - Fetches only the user's complaints.
  - Includes 4 metric cards, status filters, search bar, and 10-row paginated table.

- **🛡️ Admin Dashboard**
  - Fetches all system complaints.
  - Includes persistent action buttons and a Custom Delete Confirmation Modal to prevent accidents.

- **👤 Profile**
  - Premium design with gradient banner & large initialed avatar.
  - Interactive password update form with real-time strength indicators and mismatch warnings.

---

## 🚀 QUICK START

_Get the frontend running in seconds._

**1. Install Dependencies**

```bash
npm install
```

**2. Start Development Server**

```bash
npm run dev
```

_(App will launch on `http://localhost:5173` and automatically proxy API requests to the backend)._

---

## 🏗️ FOLDER TREE

```text
📦 student-complaint-frontend
 ┣ 📂 src
 ┃ ┣ 📂 components
 ┃ ┃ ┣ 📄 Layout.jsx          # Dynamic wrapper & sidebar behavior
 ┃ ┃ ┣ 📄 Sidebar.jsx         # Collapsible navigation menu
 ┃ ┃ ┣ 📄 ComplaintForm.jsx   # Slide-down modal for new issues
 ┃ ┃ ┗ 📄 EditComplaintForm.jsx # Shared modal (edit/status update)
 ┃ ┣ 📂 context
 ┃ ┃ ┗ 📄 AuthContext.jsx     # Global user state & JWT handling
 ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📄 Login.jsx           # Sign-in & Forgot Password modal
 ┃ ┃ ┣ 📄 Register.jsx        # Role-based sign-up (Student/Admin)
 ┃ ┃ ┣ 📄 StudentDashboard.jsx# Personal complaints & metrics
 ┃ ┃ ┣ 📄 AdminDashboard.jsx  # All complaints & deletion guards
 ┃ ┃ ┗ 📄 Profile.jsx         # Settings & interactive password update
 ┃ ┣ 📄 App.jsx               # Router tree & role-based routing
 ┃ ┗ 📄 main.jsx              # React DOM entry point
 ┣ 📄 index.html
 ┣ 📄 package.json
 ┣ 📄 tailwind.config.js      # Utility styling configuration
 ┗ 📄 vite.config.js          # Build tool configuration
```

---

## 📌 Pushing to GitHub (Frontend)
To push this frontend project to a new GitHub repository, run these commands in your terminal from the `frontend` folder:

```bash
# 1. Initialize Git (if not already done)
git init

# 2. Add all files to staging
git add .

# 3. Commit your changes
git commit -m "Initial frontend commit: Complete UI redesign"

# 4. Link to your empty GitHub repository
git remote add origin https://github.com/kalvapalli523368-ux/frontend.git

# 5. Push to the main branch
git branch -M main
git push -u origin main
```
