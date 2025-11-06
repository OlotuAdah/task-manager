# SoftAlliance Backend Developer Assessement: Task Manager API

A comprehensive task management system built with NestJS, implementing Clean Architecture and CQRS pattern.

## Developer Name: Adah Olotu

## Features

- **User Authentication**: JWT-based registration and login
- **Task Management**: Full CRUD operations with ownership validation
- **Background Jobs**: Automatic notifications when tasks are completed
- **Comments System**: Add comments to tasks
- **Pagination**: Efficient data retrieval with pagination support
- **Clean Architecture**: CQRS pattern with command/query separation
- **Database Transactions**: Pessimistic locking for data consistency
- **API Documentation**: Swagger/OpenAPI integration

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Background Jobs**: Bull Queue with Redis
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Clean Architecture with CQRS

## Prerequisites

- Docker and Docker Compose
- Node.js (v18 or higher) - for local development
- PostgreSQL - for local development
- Redis - for local development

## Installation

### Docker Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/OlotuAdah/task-manager.git
   cd task-manager
   ```

2. **Start with Docker Compose**

   ```bash
   # Start all services (PostgreSQL, Redis, API)
   docker compose up -d

   # View logs
   docker compose logs -f app
   ```

3. **Database tables are automatically created** using TypeORM synchronization

### Local Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database and Redis configurations:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=password
   DATABASE_NAME=taskmanager

   JWT_SECRET=your-super-secret-jwt-key-here!
   JWT_EXPIRES_IN=7d

   REDIS_HOST=localhost
   REDIS_PORT=6379

   PORT=3000
   NODE_ENV=development
   ```

3. **Database Setup**

   ```bash
   # Create PostgreSQL database
   createdb taskmanager
   ```

4. **Start the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, visit:

- **Swagger UI**: <{{BaseUrl}}/api/v1/docs>
- **API Base URL**: <{{BaseUrl}}/api/v1>

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Tasks

- `GET /api/v1/tasks` - Get user tasks (with pagination and filtering)
- `GET /api/v1/tasks/:id` - Get specific task
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Comments (Bonus)

- `GET /api/v1/tasks/:taskId/comments` - Get task comments (with pagination)
- `POST /api/v1/tasks/:taskId/comments` - Add comment to task

## Usage Examples

### 1. Register User

```bash
curl -X POST {{BaseUrl}}/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "adaholotu@gmail.com",
    "password": "Test@123456789",
    "firstName": "Adah",
    "lastName": "Olotu"
  }'
```

### 2. Login

```bash
curl -X POST {{BaseUrl}}/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "adaholotu@gmail.com",
    "password": "Test@123456789"
  }'
```

### 3. Create Task

```bash
curl -X POST {{BaseUrl}}/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending"
  }'
```

### 4. Update Task Status (Triggers Notification)

```bash
curl -X PUT {{BaseUrl}}/api/v1/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "completed"
  }'
```

## Architecture

### Clean Architecture Layers

1. **Controllers**: Handle HTTP requests and responses
2. **Commands/Queries**: CQRS implementation for business logic separation
3. **Handlers**: Execute commands and queries
4. **Entities**: Database models with TypeORM
5. **Events**: Domain events for background processing

### CQRS Pattern

- **Commands**: Create, Update, Delete operations
- **Queries**: Read operations with optimized data retrieval
- **Events**: Asynchronous processing for notifications

### Database Design

- **Users**: Authentication and user management
- **Tasks**: Core task entity with status tracking
- **Comments**: Bonus feature
- **Indexes**: Optimized for efficient data retrieval

## Background Jobs

When a task status is updated to "completed":

1. Event is published (`TaskCompletedEvent`)
2. Event handler enqueues background job
3. Notification processor simulates email sending
4. Notification is logged to `notifications.log` file inside the container

### Viewing Notifications

```bash
# View notification log
docker compose exec app cat /app/notifications.log

# Follow notifications in real-time
docker compose exec app tail -f /app/notifications.log

# Copy log file to host
docker compose cp taskmanager-api:/app/notifications.log ./notifications.log
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

### Docker Development

```bash
# Rebuild after code changes
docker compose up --build -d

# Rebuild only app service
docker compose up --build -d app

# View logs
docker compose logs -f app

# Restart without rebuild
docker compose restart app
```

### Local Development

```bash
# Watch mode
npm run start:dev

# Debug mode
npm run start:debug

# Lint code
npm run lint

# Format code
npm run format
```

## Production Deployment

### ⚠️ Important Production Considerations

**Before deploying to production, you MUST:**

1. **Disable TypeORM Synchronization**
   - Set `NODE_ENV=production` to disable `synchronize: true`
   - Use proper database migrations instead of auto-sync

2. **Setup Database Migrations**

   ```bash
   # Generate initial migration from current entities
   npm run typeorm migration:generate -- -n InitialSchema

   # Run migrations in production
   npm run typeorm migration:run
   ```

3. **Security Hardening**
   - Change default JWT secret to a strong, unique value
   - Use environment variables for all secrets (never hardcode)
   - Configure proper CORS origins for your domain
   - Set up SSL/TLS certificates
   - Use a reverse proxy (nginx/Apache) in front of the app

4. **Environment Variables for Production**

   ```env
   NODE_ENV=production
   DATABASE_HOST=your-prod-db-host
   DATABASE_PORT=5432
   DATABASE_USERNAME=your-db-user
   DATABASE_PASSWORD=your-secure-db-password
   DATABASE_NAME=taskmanager_prod

   JWT_SECRET=your-very-long-random-secret-key-here
   JWT_EXPIRES_IN=1h  # Shorter expiry for production

   REDIS_HOST=your-redis-host
   REDIS_PORT=6379

   ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
   RATE_LIMIT_TTL=60000
   RATE_LIMIT_MAX=50  # Lower limit for production

   PORT=3000
   ```

### Docker Production

1. **Create production docker-compose.yml**

   ```yaml
   services:
     app:
       build: .
       environment:
         NODE_ENV: production
         DATABASE_HOST: postgres
         # ... other production env vars
       restart: unless-stopped
   ```

2. **Deploy with Docker Compose**

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

### Manual Production Deployment

1. **Install dependencies and build**

   ```bash
   npm ci --only=production
   npm run build
   ```

2. **Run database migrations**

   ```bash
   npm run typeorm migration:run
   ```

3. **Start with process manager**

   ```bash
   # Using PM2
   pm2 start dist/src/main.js --name task-manager-api

   # Or systemd service
   systemctl start task-manager-api
   ```

### Migration Setup (Required for Production)

1. **Add migration scripts to package.json**

   ```json
   {
     "scripts": {
       "typeorm": "typeorm-ts-node-commonjs",
       "migration:generate": "npm run typeorm -- migration:generate",
       "migration:run": "npm run typeorm -- migration:run",
       "migration:revert": "npm run typeorm -- migration:revert"
     }
   }
   ```

2. **Create TypeORM config file** (`ormconfig.ts`)

   ```typescript
   import { DataSource } from "typeorm";

   export default new DataSource({
     type: "postgres",
     host: process.env.DATABASE_HOST,
     port: parseInt(process.env.DATABASE_PORT),
     username: process.env.DATABASE_USERNAME,
     password: process.env.DATABASE_PASSWORD,
     database: process.env.DATABASE_NAME,
     entities: ["src/**/*.entity.ts"],
     migrations: ["src/migrations/*.ts"],
     synchronize: false, // NEVER true in production
   });
   ```

3. **Generate and run migrations**

   ```bash
   # Generate migration from current entities
   npm run migration:generate -- src/migrations/InitialSchema

   # Run migrations
   npm run migration:run
   ```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: class-validator with XSS protection
- **Rate Limiting**: Configurable request throttling (100 req/min default)
- **Security Headers**: Helmet middleware for security headers
- **CORS**: Restricted cross-origin resource sharing
- **Input Sanitization**: XSS filtering on all text inputs
- **SQL Injection Protection**: TypeORM parameterized queries
- **Ownership Validation**: Users can only access their own resources
- **Request Logging**: Security monitoring and audit trails

## Performance Optimizations

- **Database Indexing**: Optimized indexes for common queries
- **Pagination**: Efficient data retrieval with limit/offset
- **Pessimistic Locking**: Prevents race conditions during updates
- **Connection Pooling**: TypeORM connection management
- **Background Processing**: Non-blocking notification system

## Docker Services

- **taskmanager-api**: NestJS application (port 3000)
- **taskmanager-postgres**: PostgreSQL database (port 5433)
- **taskmanager-redis**: Redis cache (port 6379)
- **task-manager-network**: Custom bridge network

## Monitoring

- **Logging**: Structured logging with NestJS Logger
- **Health Checks**: Database and Redis connectivity
- **Error Handling**: Global exception filters
- **Notification Logs**: File-based notification tracking
- **Container Logs**: `docker compose logs -f app`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.
