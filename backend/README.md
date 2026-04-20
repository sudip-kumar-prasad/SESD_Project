# KiranaQuick Backend API

The robust, scalable backend server for the ShopSmart ecosystem, handling business logic, authentication, and real-time communications.

## ⚡ Features
- **Secure Auth**: JWT-based authentication with role-based access control (RBAC).
- **Real-time Engine**: Socket.io integration for instant order notifications and delivery tracking.
- **RESTful API**: Clean, versioned endpoints for all business operations.
- **Data Integrity**: Strongly typed Mongoose models and business logic validation.

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express (TypeScript)
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Security**: BcryptJS, JWT, CORS, Dotenv

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CLIENT_URL=http://localhost:5173
   ```

3. **Seed Database**:
   To populate the database with initial test data:
   ```bash
   npm run seed
   ```

4. **Run Server**:
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm run build
   npm start
   ```

## 📂 Key Directories
- `src/controllers`: Request handlers and business logic.
- `src/models`: Database schemas.
- `src/routes`: API endpoint definitions.
- `src/utils/socket.ts`: Real-time event handling.

---
Part of the [ShopSmart Ecosystem](../README.md).
