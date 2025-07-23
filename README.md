# 🧑‍💼 User Service

**User Service** is a backend microservice handling user management and authentication.  
It is built with [NestJS](https://nestjs.com), powered by [TypeORM](https://typeorm.io) and PostgreSQL, and follows modern best practices such as JWT-based auth, secure session handling, and CI-driven semantic versioning.

---

## 🚀 Features

- ✅ User registration & login
- 🔐 JWT access tokens + secure refresh token rotation
- 🍪 HTTP-only cookie session management
- 📘 Auto-generated Swagger documentation
- 🧪 Unit & integration testing with Jest
- 🔁 Semantic Release for automated versioning
- 🐳 Full Docker-based local development

---

## 🐳 Getting Started (with Docker)

### 1. 📥 Clone the repository

```bash
git clone https://github.com/your-org/user-service.git
cd user-service
```

### 2. ⚙️ Configure environment variables

Create a `.env` file at the root of the project:

```env
DATABASE_URL=postgres://postgres:postgres@postgres:5432/user_service
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

> These values must align with the config used in `docker-compose.dev.yml`.

---

### 3. 🚀 Start the service

```bash
npm run dev
```

Which runs:

```bash
docker compose -f docker-compose.dev.yml up --build
```

This will start:
- 🛠 The NestJS `user-service` app
- 🐘 A PostgreSQL database instance

> The API is accessible at: [http://localhost:3000](http://localhost:3000)

---

## 📘 API Documentation

The Swagger UI is automatically available at:

```
http://localhost:3000/api
```

This is powered by `@nestjs/swagger`.

---

## 🧪 Running Tests

To run tests inside the container:

```bash
docker exec -it <user-service-container-name> npm test
```

> Get the container name with: `docker ps`
