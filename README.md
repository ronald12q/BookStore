<div align="center">

# 📚 BookStore

### Full-Stack E-Commerce Bookstore

A complete bookstore application built with **React**, **Express**, **Prisma** and **PostgreSQL**.
Browse books, manage your cart, place orders, and leave reviews — all with a modern UI.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

**[Live Demo](https://bookstore.ronaldmode123.workers.dev/)** 🚀

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Register & login with JWT, role-based access (Admin / Customer) |
| 📖 **Book Catalog** | Browse all books, search by title, view detailed book pages |
| 📂 **Categories** | Filter books by category |
| 🛒 **Shopping Cart** | Add/remove items, quantity management |
| 💳 **Checkout & Payment** | Simulated payment flow with order confirmation |
| ⭐ **Reviews** | Rate and review books (1–5 stars), one review per user per book |
| 👤 **User Profile** | View order history |
| 🛠️ **Admin Dashboard** | Manage books, categories, orders, and users |
| 📱 **Responsive UI** | Mobile-first design with HeroUI components |

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
| Technology | Purpose |
|---|---|
| ⚛️ React 19 | UI Library |
| 🟦 TypeScript 5.9 | Type Safety |
| ⚡ Vite 8 | Build Tool & Dev Server |
| 🎨 Tailwind CSS 4 | Utility-first Styling |
| 🧩 HeroUI | Component Library |
| 🗂️ React Router 7 | Client-side Routing |
| 🐻 Zustand | State Management |
| 🎯 Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| 🟢 Express 5 | HTTP Server & Routing |
| 🟦 TypeScript 6 | Type Safety |
| 💎 Prisma 7 | ORM & Database Toolkit |
| 🐘 PostgreSQL | Relational Database |
| 🔑 JWT | Authentication |
| 🔒 bcryptjs | Password Hashing |
| ✅ Zod | Request Validation |
| ☁️ Cloudinary | Image Hosting |
| 📁 Multer | File Uploads |

### Infrastructure
| Service | Purpose |
|---|---|
| ☁️ Cloudflare Pages | Frontend Hosting |
| 🖥️ Render | Backend Hosting |
| 🐘 Neon | PostgreSQL Database |

</div>

---

## 📁 Project Structure

```
BookStore/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # DB migrations
│   └── src/
│       ├── index.ts                 # Entry point
│       ├── Controllers/             # Route handlers
│       ├── Routes/                  # API routes
│       ├── Middlewares/             # Auth middleware
│       ├── lib/                     # Prisma & Cloudinary config
│       ├── utilities/               # JWT helpers
│       └── scripts/                 # Admin management CLI
│
└── frontend/
    ├── src/
    │   ├── components/              # Reusable UI components
    │   ├── pages/                   # Route pages
    │   ├── hooks/                   # Custom React hooks
    │   ├── store/                   # Zustand state stores
    │   ├── lib/                     # API config
    │   ├── layout/                  # Layout wrappers
    │   └── utilities/               # TypeScript interfaces
    └── wrangler.json                # Cloudflare Pages config
```

---

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js 18+
- 🐘 PostgreSQL database
- 🔑 Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/BookStore.git
cd BookStore
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env    # Configure your environment variables
npm install
npx prisma migrate dev
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env    # Configure VITE_API_URL
npm install
npm run dev
```

The app will be available at `http://localhost:5173` 🎉

---

## 🔧 Environment Variables

### Backend (`.env`)

```env
PORT=4000
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
JWT_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CORS_ORIGIN="http://localhost:5173"
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:4000
```

---

## 📡 API Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & get JWT token |

### 📖 Books
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/Book/getBooks` | Public | List all books |
| `GET` | `/api/Book/:slug` | Public | Get book by slug |
| `POST` | `/api/Book/createBook` | Admin | Create a book |
| `PATCH` | `/api/Book/:id` | Admin | Update a book |
| `DELETE` | `/api/Book/:id` | Admin | Delete a book |

### 📂 Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/Category/getCategory` | Public | List all categories |
| `POST` | `/api/Category/createCategory` | Admin | Create a category |
| `DELETE` | `/api/Category/:id` | Admin | Delete a category |

### 🛒 Cart
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/Cart/getCart` | User | Get user's cart |
| `POST` | `/api/Cart/addItem` | User | Add item to cart |
| `DELETE` | `/api/Cart/:id` | User | Remove item from cart |

### 💳 Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/Order/checkout` | User | Create order from cart |
| `POST` | `/api/Order/confirm-payment` | User | Confirm payment |
| `GET` | `/api/Order/my-orders` | User | Get user's orders |
| `GET` | `/api/Order/all` | Admin | Get all orders |
| `PATCH` | `/api/Order/:id` | Admin | Update order status |

### ⭐ Reviews
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/Review/:bookId` | Public | Get reviews for a book |
| `POST` | `/api/Review` | User | Create a review |
| `DELETE` | `/api/Review/:reviewId` | User/Admin | Delete a review |

---

## 📊 Database Schema

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │────<│   Cart   │────<│ CartItem │>────│   Book   │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
      │                                                  │
      │────<┌──────────┐     ┌──────────┐               │
      │     │  Review  │>────│          │               │
      │────<└──────────┘     │          │               │
      │                      │          │               │
      │────<┌──────────┐     │          │               │
           │  Order   │────<│ OrderItem │>──────────────┘
           └──────────┘     └──────────┘
```

**Enums:** `Role` (ADMIN, CUSTOMER), `OrderStatus` (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)

---

## 🌐 Deployment

### Frontend — Cloudflare Pages

```bash
cd frontend
npm run build
npx wrangler pages deploy dist
```

Set `VITE_API_URL` as an environment variable in the Cloudflare Pages dashboard.

### Backend — Render

1. Connect your GitHub repository
2. Set environment variables in the Render dashboard
3. Set the build command: `npm install && npx prisma generate && npm run build`
4. Set the start command: `npm start`

---

## 👨‍💻 Author

**Ronald Mode** — [GitHub](https://github.com/ronaldmode)

---

<div align="center">

Made with ❤️ using React, Express & Prisma

</div>
