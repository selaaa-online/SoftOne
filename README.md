# Task Management Application

A full-stack task management application built with .NET Web API (Clean Architecture) and Angular (Feature Modules).

## 🎯 Project Overview

This is a complete task management system where users can create, edit, delete, and organize their tasks with priorities, due dates, and completion status. The application features a modern, responsive UI with real-time updates and comprehensive filtering/sorting capabilities.

## 📁 Project Structure

```
SoftOne/
├── WebAPI/                 # Backend (.NET 10 Web API)
│   ├── TaskManagement.Domain/
│   ├── TaskManagement.Application/
│   ├── TaskManagement.Infrastructure/
│   └── TaskManagement.API/
├── FE/                     # Frontend (Angular 21)
│   └── src/app/
│       ├── features/       # Feature modules
│       │   ├── auth/
│       │   └── tasks/
│       ├── services/       # Core services
│       ├── models/         # TypeScript interfaces
│       ├── guards/         # Route guards
│       └── shared/         # Shared components
└── Database/               # SQL scripts
```

## 📸 Application Screenshots

### Login Page
Modern gradient authentication interface with form validation.

### Task Dashboard
Side-by-side layout with task list on the left and create/edit form on the right.

**Features visible:**
- Sorting controls (Date, Title, Priority, Due Date)
- Filter by status (All, Pending, Completed)
- Filter by priority (All, Low, Medium, High)
- Real-time task updates
- Priority badges (color-coded)
- Complete/Incomplete toggle
- Delete functionality
- Responsive design

## 🏗️ Architecture Details

### Backend Architecture (Clean Architecture)

### Layers

1. **Domain Layer** (`TaskManagement.Domain`)
   - Contains core business entities
   - Entities: `User`, `TaskItem`
   - No dependencies on other layers

2. **Application Layer** (`TaskManagement.Application`)
   - Contains business logic interfaces and DTOs
   - Interfaces: `IAuthService`, `ITaskService`
   - DTOs for data transfer

3. **Infrastructure Layer** (`TaskManagement.Infrastructure`)
   - Data access implementation (EF Core)
   - Service implementations
   - Database context and migrations

4. **API Layer** (`TaskManagement.API`)
   - Controllers and middleware
   - Entry point of the application
   - CORS, Session, and Swagger configuration

### Frontend Architecture (Feature Modules)

**Core Modules:**
- `AuthModule` - Authentication features (login, register)
- `TasksModule` - Task management features
- `SharedModule` - Reusable components (navbar, toast)

**Services (Observable-based):**
- `AuthService` - User authentication with BehaviorSubject for state
- `TaskService` - CRUD operations for tasks
- `ToastService` - Notification system using Subject

**Guards:**
- `AuthGuard` - Protects routes requiring authentication

**No Signals, No State Management Libraries** - Pure RxJS Observables as requested

## Database Schema

### Users Table
| Column       | Type         | Description           |
|--------------|--------------|----------------------|
| UserId       | int (PK)     | Auto-increment ID    |
| Username     | nvarchar(50) | Unique username      |
| PasswordHash | nvarchar(255)| BCrypt hashed password|
| CreatedDate  | datetime2    | Account creation date|

### Tasks Table
| Column      | Type         | Description                |
|-------------|--------------|---------------------------|
| TaskId      | int (PK)     | Auto-increment ID         |
| Title       | nvarchar(200)| Task title (required)     |
| Description | nvarchar(4000)| Optional description     |
| IsCompleted | bit          | Completion status         |
| Priority    | int          | 1=Low, 2=Medium, 3=High   |
| DueDate     | datetime2    | Optional due date         |
| CreatedDate | datetime2    | Creation timestamp        |
| UpdatedDate | datetime2    | Last update timestamp     |
| UserId      | int (FK)     | Foreign key to Users      |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/current-user` - Get current authenticated user
- `POST /api/auth/register` - Register new user

### Tasks
- `GET /api/tasks` - Get all tasks (with sorting & filtering)
  - Query params: `sortBy`, `isCompleted`, `priority`
- `GET /api/tasks/{id}` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion

## 🚀 Getting Started

Follow these steps to run the application locally:

### Prerequisites
- .NET 10 SDK
- Node.js 24+ and npm
- Angular CLI 21+
- SQL Server or SQL Server Express
- Visual Studio Code or Visual Studio 2022

### Installation Steps

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/selaaa-online/SoftOne.git
   cd SoftOne
   ```

2. **Setup Database**:
   ```bash
   cd WebAPI
   dotnet ef database update --project TaskManagement.Infrastructure --startup-project TaskManagement.API
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../FE
   npm install
   ```

4. **Run Backend** (Terminal 1):
   ```bash
   cd WebAPI
   dotnet run --project TaskManagement.API/TaskManagement.API.csproj
   ```

5. **Run Frontend** (Terminal 2):
   ```bash
   cd FE
   ng serve
   ```

6. **Access the Application**:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5269
   - Swagger: http://localhost:5269/swagger

### Running the Backend

```bash
cd WebAPI
dotnet run --project TaskManagement.API/TaskManagement.API.csproj
```

The API will be available at: `http://localhost:5269`

Swagger UI: `http://localhost:5269/swagger`

### Running the Frontend

```bash
cd FE
ng serve
```

The application will be available at: `http://localhost:4200`

It will automatically open in your default browser.

### Default Credentials
- Username: `admin`
- Password: `Admin@123`

## Technologies Used

### Backend
- .NET 10
- ASP.NET Core Web API
- Entity Framework Core 10
- SQL Server
- BCrypt.Net-Next (Password hashing)
- Swashbuckle (Swagger/OpenAPI)
- Session-based authentication

### Frontend
- Angular 21
- TypeScript
- RxJS (Observables for HTTP requests)
- Bootstrap 5
- SCSS
- Feature Modules Architecture

## ✨ Features Implemented

### Backend Features
✅ Clean Architecture with 4 layers  
✅ Entity Framework Core with Code-First approach  
✅ Database with proper relationships and constraints  
✅ Session-based authentication  
✅ Password hashing with BCrypt  
✅ Full CRUD operations for tasks  
✅ Sorting (title, priority, date, due date)  
✅ Filtering (completion status, priority)  
✅ Input validation and error handling  
✅ CORS configured for Angular  
✅ Swagger documentation  

### Frontend Features
✅ Feature module architecture (Auth, Tasks)  
✅ Observable-based HTTP services  
✅ Login & Registration  
✅ Route guards for protected routes  
✅ Side-by-side task list and form layout  
✅ Real-time task updates  
✅ Sorting and filtering controls  
✅ Priority indicators (Low, Medium, High)  
✅ Task completion toggle  
✅ Toast notifications  
✅ Responsive Bootstrap UI  
✅ Modern gradient styling  

## Development Notes

- Clean Architecture ensures separation of concerns
- Domain layer has no dependencies
- Infrastructure layer implements interfaces from Application layer
- API layer is thin and only handles HTTP concerns
- Session-based authentication for simplicity (as per requirements)
- BCrypt used for secure password hashing
- EF Core migrations track database schema changes

## License

This is a practice assignment project.
