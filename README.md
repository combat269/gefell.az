# GEFELL.AZ  
**Corporate Platform Architecture (Frontend Live • Backend Designed)**

---

## Overview

This repository contains the source code for the official website of **GEFELL MMC**, a window and door hardware distributor operating with showroom and warehouse infrastructure.

The project currently consists of:

- A production frontend (live)
- A structured backend architecture (not yet deployed)

The backend is intentionally kept isolated from production until operational requirements (inventory automation, admin dashboard, warehouse integration) are finalized.

**Live website:** https://gefell.az

---

## System Architecture

### Current Production Setup

Static Frontend deployed via Vercel CDN.

### Planned Full Architecture

```
Client
  ↓
REST API (Node.js + Express)
  ↓
PostgreSQL
  ↓
Redis (Caching Layer)
```

The backend implementation exists inside the `server-replica/` directory and represents the designed API system.

---

## Frontend (Production)

### Stack

- HTML5 (semantic structure)
- CSS3 (custom layout system)
- Vanilla JavaScript (ES6+)
- Hosted on Vercel

### Design Decisions

- No heavy frameworks to minimize bundle size
- Static deployment for maximum performance
- SEO-first structure
- Folder-based routing
- Separation of layout, logic, and assets

The current business workflow does not require dynamic API-driven rendering. Static deployment was chosen for simplicity, speed, and cost efficiency.

---

## Backend (Replica Architecture – Not Live)

Located in:

```
server-replica/
```

The backend is a REST API architecture prepared for:

- Product CRUD operations
- Inventory management
- Admin authentication
- Role-based access control
- Warehouse integration
- Future e-commerce expansion

### Why It Is Not Deployed

The backend is intentionally not live because:

1. Business operations are currently managed manually.
2. Warehouse system integration is still pending.
3. Deploying prematurely would increase infrastructure cost.
4. Exposing API endpoints without finalized authentication would increase security risk.

The system is engineered first and deployed when required by business logic.

---

## Backend Structure

```
server-replica/
│
├── config/
│   ├── db.js          → PostgreSQL connection pooling
│   ├── redis.js       → Redis client configuration
│   └── schema.sql     → Database schema
│
├── controllers/
│   └── productController.js
│
├── middleware/
│   └── auth.js        → JWT verification & role checks
│
├── models/
│   └── Product.js     → Data abstraction layer
│
├── routes/
│   └── productRoutes.js
│
├── server.js          → Express app bootstrap
└── package.json
```

---

## Engineering Decisions

### Express
Chosen for minimal overhead and flexibility.

### PostgreSQL
Relational model fits structured inventory:

- Products
- Categories
- Brands
- Admin users
- Stock tracking

Normalization allows scalability beyond 1,000+ products.

### Redis
Prepared to:

- Cache high-read product listings
- Reduce database load
- Improve response times
- Enable horizontal scaling later

### MVC Separation

- Routes → API surface
- Controllers → Business logic
- Models → Data layer
- Middleware → Security & validation

Clear separation improves maintainability and testing.

---

## Database Design (Planned Entities)

- products
- categories
- brands
- admin_users
- stock_levels
- orders (future)

Schema is normalized and indexed for read-heavy workloads.

---

## Security Considerations

Planned for production:

- JWT authentication
- Role-based access control
- Input validation middleware
- Rate limiting
- Environment-based configuration
- Separation of credentials from repository

Backend remains local to avoid exposing API before authentication and warehouse integration are finalized.

---

## CI/CD

`.github/workflows/deploy.yml` is included to support automated deployment pipelines once backend transitions to production.

---

## Development Roadmap

- [x] Static frontend deployment
- [x] Backend architectural design
- [ ] Database finalization
- [ ] Admin authentication
- [ ] Warehouse API integration
- [ ] Production backend deployment
- [ ] Monitoring & logging

---

## What This Project Demonstrates

- Production frontend deployment
- Backend system architecture design
- Database normalization
- Caching strategy preparation
- Security planning
- DevOps pipeline preparation
- Engineering decisions aligned with business constraints

This repository represents an evolving full-stack system designed for scalable corporate infrastructure.

---

## Author

Mulkum Badalov  
Computer Engineering Student – METU  
Focus: Backend Systems & Scalable Architecture
