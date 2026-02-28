# GEFELL MMC - Corporate Platform

[Live Website](https://gefell.az)

## 📌 Overview
This repository contains the full-stack source code for the official corporate website of GEFELL MMC, a company specializing in window and door accessories. Developed to establish the company's digital presence, showcase dynamic product catalogs, and streamline client inquiries.

## 🏗️ Architecture & Tech Stack
This project is structured as a monorepo containing both the client-side UI and the server-side API.

**Frontend (`/frontend`)**
* **Technologies:** HTML5, CSS3, Vanilla JavaScript
* **Features:** Responsive UI, dynamic product rendering, multilingual support architecture.
* **Deployment:** Vercel

**Backend (`/backend`)**
* **Technologies:** Node.js, Express.js
* **Database:** PostgreSQL
* **Security:** JWT (JSON Web Tokens) for secure admin routing
* **Features:** RESTful API for inventory management, secure admin dashboard authentication, database schemas for hardware lines.

## ✨ Key Features
* **Dynamic Product Catalog:** PostgreSQL database manages various window and door hardware lines, served via Express API.
* **Secure Admin Access:** JWT-based authentication ensures only authorized company staff can update website content.
* **Responsive UI/UX:** Seamless browsing experience across desktop and mobile devices for prospective clients.

## 🚀 Local Setup
Instructions on how to run the project locally.

### Prerequisites
* Node.js
* PostgreSQL

### Installation
1. Clone the repository: `git clone https://github.com/combat269/gefell.az.git`
2. **Backend:** Navigate to `/backend`, run `npm install`, set up your `.env` variables, and start the server with `npm start`.
3. **Frontend:** Navigate to `/frontend` and open `index.html` in your browser or use a live server extension.
