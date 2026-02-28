# GEFELL MMC - Corporate Platform & Backend Architecture

This repository contains the source code for the GEFELL MMC corporate website, a window and door accessories company based in Baku, Azerbaijan. It includes both the production frontend and a replica of the backend system architecture.

## 🌐 Live Demo
The live production frontend can be viewed at: **[gefell.az](https://gefell.az)**

---

## 🏗️ System Architecture & Setup

**Important Note on the Backend:**
To comply with company data privacy and hosting constraints, the live website is currently deployed as a static, frontend-only build optimized for speed. 

However, the complete backend architecture I designed for the system is included in the `server-replica` directory. This replica demonstrates the backend logic, database structure, and security measures used for the company's inventory management, without exposing sensitive corporate data or actual database credentials.

### Tech Stack
* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend Server:** Node.js, Express.js
* **Database:** PostgreSQL (with normalized schema and indexing for 1000+ records)
* **Caching:** Redis (to reduce database load on product catalog reads)
* **Security:** JWT (JSON Web Tokens) for role-based admin access
* **CI/CD:** GitHub Actions for automated deployment pipelines

---

## 📁 Repository Structure

* `/` *(Root)* - Contains the frontend files (HTML, CSS, JS) used in the live production build.
* `/server-replica` - The backend architecture replica.
  * `/config` - PostgreSQL connection pool, Redis client setup, and the database schema (`schema.sql`).
  * `/controllers` - Business logic for fetching and updating inventory.
  * `/middleware` - JWT authentication and admin role verification.
  * `/models` - Database interaction models.
  * `/routes` - API endpoints for the public catalog and secure admin dashboard.
* `/.github/workflows` - CI/CD pipeline configuration (`deploy.yml`).

---

