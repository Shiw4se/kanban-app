# Kanban Board


A robust, containerized Kanban Board application (Trello-like) built with **React**, **NestJS**, and **PostgreSQL**. Features drag-and-drop task management, automatic database migrations, and a fully automated CI/CD pipeline.

---

## Features

- **Interactive UI**: Drag-and-drop tasks between columns using `@hello-pangea/dnd`.
- **Fullstack Logic**: Complete CRUD operations for Boards and Tasks.
- **Resilient Backend**: NestJS with Prisma ORM and automatic database reconnection logic.
- **Auto-Provisioning**: Database tables are created automatically on container startup.
- **Containerized**: Runs instantly with Docker Compose.

---

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **State Management**: Redux Toolkit
- **Language**: TypeScript (Strict Mode)
- **Styling**: SCSS / CSS Modules

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Validation**: class-validator

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions (Linting, Testing, Building)

---

## Quick Start (Docker)

The easiest way to run the application. No local Node.js or PostgreSQL required.

1. **Clone the repository**
   ```
   git clone https://github.com/Shiw4se/kanban-app.git
   cd kanban-app
    ```

2. **Run with Docker Compose**

    ```docker-compose up --build```


3. **Open in Browser**

* Frontend: http://localhost:5173
* Backend API: http://localhost:3000

---

## Local Development (Manual Setup)

If you want to run services individually without Docker.

**Prerequisites**

* Node.js (v18+)
* PostgreSQL running locally

1. **Backend Setup**

```
cd kanban-backend

# Install dependencies
npm install

# Create .env file (configure your DB credentials)
# DATABASE_URL="postgresql://user:password@localhost:5432/kanban?schema=public"
# PORT=3000

# Run migrations
npx prisma migrate dev

# Start server
npm run start:dev
```

2. **Frontend Setup**

```
cd kanban-frontend

# Install dependencies
npm install

# Create .env file
# VITE_API_URL=http://localhost:3000

# Start development server
npm run dev

```

---

## Testing

The project includes tests for both frontend components and backend API endpoints.

**Run Backend Tests:**

```
cd kanban-backend
npm run test:e2e  # End-to-end tests
```

**Run Frontend Tests:**

```
cd kanban-frontend
npm run test
```
---

## Contact

For any questions or issues, reach out to me on Telegram ([@shiw4se](https://t.me/shiw4se))
or via email ([ausenko476@gmail.com](mailto:ausenko476@gmail.com))
