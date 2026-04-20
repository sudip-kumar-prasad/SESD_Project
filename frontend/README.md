# KiranaQuick Frontend

The frontend of the ShopSmart ecosystem, built with React and TypeScript, optimized for high performance and premium aesthetics.

## ⚡ Features
- **Dynamic Dashboards**: Custom-tailored views for different user roles.
- **Real-time Updates**: Live socket connections for order status and tracking.
- **Glassmorphic Design**: Modern UI with vibrant gradients and smooth micro-animations.
- **State Management**: Optimized Cart and Auth context providers.

## 🛠 Tech Stack
- **Framework**: React 18 (TypeScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion / CSS Transitions
- **HTTP Client**: Axios

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in this directory:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 📂 Key Directories
- `src/api`: Axios instance with interceptors for JWT.
- `src/context`: Authentication and Cart state management.
- `src/pages`: Main application views (Dashboard, StorePage, LiveTracking, etc.).
- `src/components`: Shared UI elements.

---
Part of the [ShopSmart Ecosystem](../README.md).
