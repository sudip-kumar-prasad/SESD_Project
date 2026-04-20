# ShopSmart (KiranaQuick) - Hyperlocal E-commerce Ecosystem

ShopSmart is a modern, full-stack hyperlocal e-commerce platform designed to digitalize local "Kirana" stores and streamline community-driven commerce. Built with a focus on speed, security, and real-time transparency, it provides a unified experience for customers, shop owners, and delivery partners.

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Distinct portals for Customers, Shop Owners, Delivery Partners, and Admins.
- **Real-time Tracking**: Live order status updates and delivery tracking powered by Socket.io.
- **Digital Storefront**: Easy-to-use inventory management and store profile customization for shop owners.
- **Smart Logistics**: Efficient delivery request system for partners with OTP-based verification.
- **Premium UI/UX**: A state-of-the-art, responsive interface built with React, Tailwind CSS, and Lucide icons.

## 🛠 Technology Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express (TypeScript), MongoDB (Mongoose), Socket.io.
- **Authentication**: JWT-based secure session management with BcryptJS password hashing.
- **State Management**: React Context API for global state (Auth, Cart).

## 📁 Project Structure

```text
├── backend/            # Express API & Socket.io Server
│   ├── src/
│   │   ├── config/     # DB and environment configuration
│   │   ├── controllers/# Business logic
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── utils/      # Socket.io and helper services
├── frontend/           # React Application
│   ├── src/
│   │   ├── api/        # Axios configuration
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth and Cart state
│   │   └── pages/      # Route-level components
├── diagrams/           # Architecture diagrams (ER, Class, Sequence, Use Case)
```

## ⚙️ Setup Instructions

### Backend
1. Navigate to the `backend/` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`.
4. Start development server: `npm run dev`

### Frontend
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## 📊 Architecture & Documentation

Comprehensive architecture diagrams are available in the `/diagrams` directory:
- [ER Diagram](ErDiagram.md): Database schema and relationships.
- [Class Diagram](ClassDiagram.md): Backend structure and logic.
- [Sequence Diagram](SequenceDiagram.md): Order fulfillment workflow.
- [Use Case Diagram](UseCaseDiagram.md): User roles and system interactions.

## 🔒 Security
- All environment variables are masked in templates.
- Production builds use secure cookie/header patterns and sanitized business logic.
- Password hashing using enterprise-grade BcryptJS.

---
© 2026 KiranaQuick Ecosystem. All rights reserved.
