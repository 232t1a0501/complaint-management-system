# Student Complaint Management — Backend

This is the backend server for the Student Complaint Management system. It provides a RESTful API for user authentication and complaint management, originally designed for MySQL but currently running on a locally-stored SQLite database for easy development and testing.

## 📦 Core Dependencies & Tools

Our backend uses several key libraries to ensure security, performance, and reliability. Below is a breakdown of what each one does and why it's included:

### 1. **Express.js** (`express`)
- **What it does**: The core web framework for Node.js.
- **How it works**: It handles all incoming HTTP requests (GET, POST, PUT, DELETE) and routes them to the correct logic. It makes creating a RESTful API significantly easier by managing request/response objects and middleware.

### 2. **CORS** (`cors`)
- **What it does**: Cross-Origin Resource Sharing.
- **How it works**: Browsers block requests from one domain (the frontend) to another (the backend). This package allows us to securely permit our React frontend to talk to our Express backend.

### 3. **Dotenv** (`dotenv`)
- **What it does**: Environment Variable Management.
- **How it works**: It loads sensitive configuration like secrets, port numbers, and database paths from a `.env` file into `process.env`. This keeps secrets out of our code and away from public eyes on GitHub.

### 4. **Bcryptjs** (`bcryptjs`)
- **What it does**: Secure Password Hashing.
- **How it works**: We **never** store plain-text passwords. Bcrypt hashes human passwords into long, uncrackable salt-and-hash strings. Even if a database is leaked, user passwords remain safe.

### 5. **JSON Web Token** (`jsonwebtoken`)
- **What it does**: Stateless Authentication.
- **How it works**: After a user logs in, we issue them a "token" (JWT). The user sends this token with every subsequent request. The server verifies the token to know exactly who the user is without needing to check the database constantly.

### 6. **SQLite3 & SQLite** (`sqlite3`, `sqlite`)
- **What it does**: Lightweight Database Engine.
- **How it works**: Instead of needing a heavy server like MySQL, SQLite stores everything in a single `.sqlite` file. The `sqlite` wrapper provides a modern, Promise-based API for interacting with the database using standard SQL.

---

## 📂 Project Structure

```text
📁 backend/
├── 📄 server.js             # Main entry point
├── 🗄️ db.js                 # SQLite connection
├── 📜 schema.sql            # Table definitions (Users, Complaints)
├── 📁 routes/
│   ├── 🔐 auth.js           # Auth (Login/Register)
│   └── 📝 complaints.js     # Complaints (submission, resolution, and admin_remark)
├── 📁 middleware/
│   └── 🛡️ authMiddleware.js # JWT + Role-based access
└── ⚙️ .env                  # Environment secrets
```

---

## ⚙️ Technology Stack
- **Node.js**: Core server framework.
- **Express.js**: API development.
- **SQLite3**: Lightweight database with zero configuration.
- **Bcryptjs**: Secure password hashing.
- **JWT**: Stateless session management.

---

## 🏗️ Latest Enhancements
- **Admin Remarks**: New `admin_remark` field in the `complaints` table to allow administrators to provide feedback/solutions.
- **Schema Cleanup**: Removed legacy `image_url` column to optimize the data model.
- **Automatic Sync**: The `db.js` system automatically initializes the database on startup.

---

## 🚀 Running the Server
Make sure dependencies are installed (`npm install`), then run:

```bash
node server.js
```

The database `database.sqlite` will be created automatically if it doesn't exist.

---

## 🛡️ Security Check
Ensure `.env` contains a secure **`JWT_SECRET`**.

---

## 🏆 Development Credits
This project was enhanced and modernized by **Antigravity**, a powerful agentic AI coding assistant designed by Google Deepmind.
