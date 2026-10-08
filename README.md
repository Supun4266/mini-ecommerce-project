# Mini E-Commerce Platform

A full-stack online store with a **Node.js / Express REST API** and **MongoDB**. Customers browse products, add them to a cart and place orders; an admin manages products, customers and orders. Product images are stored on **Cloudinary**.

## Features

**Customers**
- Register and log in (bcrypt-hashed passwords, JWT authentication)
- Browse products and view product details
- Shopping cart, checkout and order placement
- View their own order history and profile

**Admin**
- Separate admin login and dashboard
- Add, edit and delete products with image upload (Multer → Cloudinary)
- View all orders and customers

**Backend quality**
- Role-based access with `authUser` and `authAdmin` middleware
- Request validation with Joi and validator
- Secrets loaded from environment variables

## Tech stack

| Area | Technology |
|---|---|
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| File uploads | Multer, Cloudinary |
| Validation | Joi, validator |
| Front end | HTML, CSS, JavaScript |

## API overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/products/get-products` | User |
| GET | `/api/products/get-products/:productId` | User |
| POST | `/api/products/add-product` | Admin |
| PATCH | `/api/products/update-product/:productId` | Admin |
| DELETE | `/api/products/delete-product/:productId` | Admin |
| POST | `/api/orders/add-order` | User |
| GET | `/api/orders/get-orders` | Admin |
| GET | `/api/orders/get-orders/:userId` | User |

## Project structure

```
mini-ecommerce-project-main/
├── backend/
│   ├── config/        # MongoDB and Cloudinary setup
│   ├── controllers/   # user, product and order logic
│   ├── middleware/    # auth, validation, file upload
│   ├── models/        # Mongoose schemas
│   └── routes/        # Express routers
└── frontend/          # customer and admin pages
```

## Run locally

```bash
cd mini-ecommerce-project-main/backend
npm install
cp .env.example .env   # then fill in your MongoDB, JWT and Cloudinary values
npm start              # or: npm run server (auto-reload)
```

The API runs on http://localhost:4000. Open the HTML files in `frontend/` (for example with VS Code Live Server) to use the store.
