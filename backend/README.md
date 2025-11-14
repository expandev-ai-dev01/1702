# SafeLogin Backend

This is the backend service for the SafeLogin project, built with Node.js, Express, TypeScript, and SQL Server.

## Prerequisites

- Node.js (v18 or later)
- A running SQL Server instance

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd safelogin-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    - Copy the `.env.example` file to a new file named `.env`.
    - Update the `.env` file with your database credentials and other settings.

4.  **Database Setup:**
    - Ensure your SQL Server is running and you have created a database for this project.
    - The deployment pipeline will automatically run the SQL scripts located in the `database/` directory.

## Development

To run the server in development mode with live reloading:

```bash
npm run dev
```

The server will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## Building for Production

To compile the TypeScript code into JavaScript for production:

```bash
npm run build
```

The compiled output will be in the `dist/` directory.

## Running in Production

To start the server from the compiled code:

```bash
npm start
```
