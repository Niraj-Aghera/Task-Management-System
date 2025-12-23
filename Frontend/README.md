# Task Management Application

A simple task management application with user authentication and task CRUD operations.

## Features

- User signup and login with JWT authentication
- Create tasks with title and description
- View all your tasks
- Mark tasks as completed
- Delete tasks
- Simple and clean interface

## Tech Stack

**Frontend**
- Next.js 16 with JavaScript
- React
- Tailwind CSS

**Backend** (provided separately)
- FastAPI
- PostgreSQL
- JWT authentication

## Getting Started

### Prerequisites

- Node.js 18+
- FastAPI backend running at `http://localhost:8000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

The app will redirect you to the login page. You can sign up for a new account or login if you already have one.

## API Integration

The frontend connects to these FastAPI endpoints:

**Authentication**
- `POST /api/v1/auth/signup` - Create new user account
- `POST /api/v1/auth/login` - Login and get JWT token

**Tasks** (requires authentication)
- `POST /api/v1/tasks/` - Create new task
- `GET /api/v1/tasks/` - Get all tasks for logged-in user
- `PUT /api/v1/tasks/{task_id}` - Update task (mark as completed)
- `DELETE /api/v1/tasks/{task_id}` - Delete task

All task endpoints require a Bearer token in the Authorization header.

## Database Models

**User**
- id: Integer (Primary Key)
- email: String (Unique)
- hashed_password: String
- created_at: DateTime

**Task**
- id: Integer (Primary Key)
- title: String (required)
- description: String (optional)
- completed: Boolean (default: false)
- user_id: Integer (Foreign Key)
- created_at: DateTime
- updated_at: DateTime

## Usage

1. Go to the signup page and create an account with your email and password
2. Login with your credentials to receive a JWT token
3. Create tasks with a title and optional description
4. Check the checkbox to mark tasks as completed
5. Click the Delete button to remove tasks
6. Click Logout to end your session

## Configuration

The app is configured to connect to `http://localhost:8000` by default. If your backend is running on a different URL, update the fetch URLs in:
- `app/login/page.js`
- `app/signup/page.js`
- `app/tasks/page.js`

## License

MIT
