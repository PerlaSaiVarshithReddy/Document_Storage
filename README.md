# Document Storage Project

A full-stack document storage application with user authentication, file upload, download, and management features. Built with React (frontend) and Node.js/Express (backend), featuring Material-UI for a modern, responsive UI/UX.

## Features

- User registration and login with JWT authentication
- Secure file upload and storage
- File listing with metadata (name, size, upload date)
- Download and delete files
- Responsive design with Material-UI
- Clean, user-friendly interface

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- React Router DOM
- Axios for API calls

### Backend
- Node.js
- Express.js
- Multer for file uploads
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Installation

1. Clone or download the project files.

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
   The server will run on http://localhost:5000

2. In a new terminal, start the frontend:
   ```
   cd frontend
   npm start
   ```
   The app will open in your browser at http://localhost:3000

## Usage

1. Register a new account or login with existing credentials.
2. Upload files using the floating action button.
3. View your uploaded files in the dashboard.
4. Download or delete files as needed.

## Security Notes

- JWT tokens are stored in localStorage (not secure for production).
- Files are stored locally on the server (use cloud storage like AWS S3 in production).
- User data is stored in memory (use a database like MongoDB or PostgreSQL in production).
- Change the JWT_SECRET in server.js for production.

## API Endpoints

- POST /register - Register a new user
- POST /login - Login user
- POST /upload - Upload a file (requires auth)
- GET /files - Get user's files (requires auth)
- GET /download/:id - Download a file (requires auth)
- DELETE /files/:id - Delete a file (requires auth)

## Contributing

Feel free to improve the UI/UX, add features like file sharing, or enhance security.