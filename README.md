# MzansiBuilds

A platform where developers build in public, share projects, collaborate, and get celebrated when they ship.

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2
- MySQL
- Spring Data JPA
- BCrypt for password encryption
- Maven

### Frontend
- Angular 21
- TypeScript
- CSS (Green, White, Black theme)
- HttpClient for API calls

## Features

- ✅ User registration and login
- ✅ Create and manage projects
- ✅ Live feed of what developers are building
- ✅ Comment on projects
- ✅ Collaboration requests ("Raise Hand")
- ✅ Project stages (Idea, In Progress, Review, Completed)
- ✅ Milestone tracking
- ✅ Celebration Wall for completed projects
- ✅ User profile page
- ✅ Settings page
- ✅ Responsive design (mobile-first)
- ✅ Green/White/Black theme

## Setup Instructions

### Backend
1. Open IntelliJ and import the `backend` folder
2. Update MySQL credentials in `application.properties`
3. Run `BackendApplication.java`

### Frontend
1. Navigate to `frontend` folder
2. Run `npm install`
3. Run `ng serve --open`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/{id}` | Update project stage |
| GET | `/api/projects/my-projects` | Get user's projects |
| POST | `/api/comments/project/{id}` | Add comment |
| GET | `/api/notifications` | Get notifications |

## Design Theme

- Primary Green: `#2E7D32`
- Dark Green: `#1B5E20`
- White: `#FFFFFF`
- Black: `#111111`

## Author

Tsholofelo Sekome

## License

This project was built for the Derivco Graduate Programme assessment.
