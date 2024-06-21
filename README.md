# Backend Server

## Description
This is a backend server made with Express and TypeScript. It uses a JSON file as a database to store form submissions.

## Endpoints
- `GET /ping` - Returns `true`.
- `POST /submit` - Accepts `name`, `email`, `phone`, `github_link`, and `stopwatch_time` as parameters to save a new submission.
- `GET /read` - Accepts a query parameter `index` to retrieve the (index+1)th form submission.
- `DELETE /delete` - Accepts `index` as a parameter to delete the corresponding submission.
- `PUT /edit` - Accepts `index`, `name`, `email`, `phone`, `github_link`, and `stopwatch_time` as parameters to edit an existing submission.
- `GET /search` - Accepts `email` as a query parameter to search for submissions by email.

## How to Run
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the server in development mode.
4. The server will run on `http://localhost:8080`.

## Notes
- The database is a simple JSON file (`db.json`), and it will be created in the `src` directory.
- Ensure the server is stopped properly to save all changes to `db.json`.
