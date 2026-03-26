# GEFELL.AZ
**Corporate Platform — Production Frontend · Designed Backend**

🌐 **Live:** [gefell.az](https://gefell.az)

---

## Overview

Official web platform for **GEFELL MMC**, a window and door hardware distributor operating with showroom and warehouse infrastructure in Azerbaijan.

The frontend is live in production. The backend is fully architected and implemented, held in isolation until warehouse integration and admin workflows are operationally ready for deployment.

---

## Architecture

### Production (Current)

```
Client → Static Frontend → Vercel CDN
```

### Planned Full Stack

```
Client
  ↓
REST API  (Node.js + Express)
  ↓
PostgreSQL
  ↓
Redis  (Caching Layer)
```

---

## Frontend

**Stack:** HTML5 · CSS3 · Vanilla JS (ES6+) · Vercel

**Key decisions:**
- No framework — minimizes bundle size and maximizes Lighthouse scores
- Static deployment chosen for speed, cost efficiency, and SEO-first structure
- Folder-based routing with clear separation of layout, logic, and assets

The current business workflow doesn't require dynamic rendering. Static deployment is the right tool for this stage.

---

## Backend (`server-replica/`)

A complete REST API architecture prepared for production, kept local until business operations require it.

```
server-replica/
├── config/
│   ├── db.js              → PostgreSQL connection pooling
│   ├── redis.js           → Redis client setup
│   └── schema.sql         → Full database schema
├── controllers/
│   └── productController.js
├── middleware/
│   └── auth.js            → JWT verification & role-based access
├── models/
│   └── Product.js         → Data abstraction layer
├── routes/
│   └── productRoutes.js
├── server.js              → Express app entry point
└── package.json
```

**Covers:**
- Product CRUD
- Inventory management
- Admin authentication with role-based access control
- Warehouse integration hooks
- Future e-commerce expansion path

**Why not deployed yet:**
Business operations are still managed manually, warehouse integration is pending, and exposing API endpoints before authentication is finalized is an unnecessary security risk. The system is engineered first — deployed when the business requires it.

---

## Engineering Decisions

**Express** — minimal overhead, maximum flexibility for a custom REST surface.

**PostgreSQL** — relational model fits structured inventory (products, categories, brands, stock levels). Normalized schema scales beyond 1,000+ SKUs without restructuring.

**Redis** — prepared to cache high-read product listings, reduce DB load, and support horizontal scaling. Not active until traffic justifies the overhead.

**MVC pattern** — routes own the API surface, controllers own business logic, models own data access, middleware owns security. Clean separation makes each layer independently testable.

---

## Database Schema (Planned)

`products` · `categories` · `brands` · `admin_users` · `stock_levels` · `orders` *(future)*

Normalized, indexed for read-heavy workloads.

---

## Security (Planned for Production)

- JWT authentication
- Role-based access control
- Input validation middleware
- Rate limiting
- Environment-based credential management — no secrets in repository

---

## CI/CD

`.github/workflows/deploy.yml` is included and ready to trigger automated deployment once the backend moves to production.

---

## Roadmap

- [x] Static frontend deployment
- [x] Backend architectural design & implementation
- [ ] Database finalization
- [ ] Admin authentication
- [ ] Warehouse API integration
- [ ] Production backend deployment
- [ ] Monitoring & logging

---

