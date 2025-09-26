# Week 3 — Library API (Books & Authors)

Quick start:
1. Copy `.env.example` to `.env` and fill `MONGODB_URL`.
2. `npm install`
3. `npm run generate-swagger`
4. `npm start`
5. Open Swagger UI: `http://localhost:3000/api-docs`

Deploy notes:
- Create new GitHub repo and push.
- Create a new Render web service, connect to repo.
- Add `MONGODB_URL` in Render environment variables.
- Render runs `npm install` which triggers `postinstall` (generates swagger.json).
- After deploy, open: `https://<your-render-app>.onrender.com/api-docs`

Project structure:
- `server.js`
- `data/database.js`
- `routes/` (index.js, books.js, authors.js, swagger.js)
- `controllers/` (books.js, authors.js)
- `swagger.js`, `swagger.json`
- `routes.rest` (REST Client tests)
