# Eco Storefront API - Simple E-commerce Backend

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## Overview
**Eco Storefront API** is a robust, production-ready e-commerce backend engine. Built with **Node.js** and **TypeScript**, the project implements a **Clean Layered Architecture** (Controllers, Services, Models) to ensure scalability and maintainability. It handles complex product lifecycles, secure order processing, and multi-tier admin governance.

## Tech Stack
*   **Backend:** Node.js & Express.js.
*   **Language:** TypeScript (Strict Type Safety).
*   **Architecture:** Modular MVC with a dedicated Service Layer.
*   **Database:** MongoDB with Mongoose ODM.
*   **Security & Protection:** 
    *   **JWT:** Stateful authentication with Role-Based Access Control (User, Admin, Super Admin).
    *   **Bcrypt:** Secure password hashing.
    *   **Helmet:** HTTP header security management.
    *   **Rate Limiting:** Request throttling for Auth and Upload endpoints.
    *   **Mongo-Sanitize:** Protection against NoSQL Injection.
*   **Validation:** Schema-based request validation using **Zod**.
*   **Documentation:** Interactive API documentation via **Swagger UI**.

## Key Features
- **Comprehensive Product Management:** Full CRUD operations with automatic **SKU generation** and stock tracking.
- **Advanced Order System:** Handles order creation, product-specific updates, and cancellations with dynamic price calculation.
- **Admin Dashboard & Analytics:** Real-time statistics including total order volume, completion rates, and transaction history.
- **Role-Based Access Control (RBAC):** Granular permissions for Users, Admins (inventory management), and Super Admins (role management).
- **Hardened Security:** Integrated middleware for error handling, data sanitization, and brute-force prevention.
- **Clean Codebase:** Fully typed interfaces and centralized error management using custom `ApiError` and `catchAsync` utilities.

## API Endpoints Summary

### Authentication & User Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/users/signup` | Register a new user account |
| POST | `/api/users/login` | Authenticate and receive a JWT |
| PUT | `/api/users/banned` | Ban a user account (Admin only) |
| PUT | `/api/users/change-role` | Change user permissions (Super Admin only) |

### Product Catalog
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/products` | Retrieve all active products |
| POST | `/api/products/add` | Create a new product (Admin only) |
| PUT | `/api/products/update/:id` | Update product details (Admin only) |
| DELETE | `/api/products/delete/:id` | Remove a product (Admin only) |

### Orders & Sales
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/orders/add` | Place a new order |
| GET | `/api/orders` | Get current user's order history |
| PUT | `/api/orders/cancel/:id` | Cancel a pending order |
| GET | `/api/orders/statistics` | View global store analytics (Admin only) |

- **API Documentation:** [Swagger UI Docs](https://backend-shop-practise-production.up.railway.app/docs)

## ⚙️ Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Omar-BEDev/Backend-shop.git
   cd Backend-shop
2. **Install dependencies:**
```bash
npm install
```
3. **Configure Environment Variables:**
Create a .env file in the root directory:

```Env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
LOGIN_SIGNUP_WINDOW_MS=900000 defult
LOGIN_SIGNUP_MAX_REQUESTS=100 default
```
4. **Run in development mode:**
```bash
npm run dev
```
5. **Build for production:**
```Bash
npm run build
npm start
