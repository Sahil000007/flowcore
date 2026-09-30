# Deploy FlowCore: Vercel, Render, and MySQL

The frontend is a Vite single-page app for Vercel. The backend uses the Dockerfile under `flowcore-backend` for Render. MySQL must be hosted separately by a MySQL provider that allows connections from Render; Render's Blueprint database service is PostgreSQL, not MySQL.

## 1. Push the repository to GitHub

Push the `flowcore` repository, including the deployment config files. Do not commit either `.env` file or the local H2 files in `flowcore-backend/data`.

## 2. Create the hosted MySQL database

Create a MySQL database with your chosen database provider. Keep its host, port, database name, username, and password handy. Use the provider's public connection endpoint if its private network is not shared with Render.

## 3. Deploy the backend on Render

In Render, create a Blueprint instance from the GitHub repository and select `render.yaml`, or create a Web Service manually with:

- Root directory: `flowcore-backend`
- Runtime: Docker
- Dockerfile: `Dockerfile`

Set these backend environment variables using the MySQL provider's connection values:

```text
SPRING_DATASOURCE_URL=jdbc:mysql://<mysql-host>:<mysql-port>/<database>?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=<mysql-username>
SPRING_DATASOURCE_PASSWORD=<mysql-password>
SEED_DEMO_USERS=false
ADMIN_INITIAL_PASSWORD=<a unique strong password>
JWT_SECRET=<a long random secret>
CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>
```

The Blueprint generates a `JWT_SECRET` and prompts for the other secret or provider-specific values. Do not put real credentials in `render.yaml` or source files. After the service deploys, copy its `https://...onrender.com` URL.

## 4. Deploy the frontend on Vercel

Import the same GitHub repository in Vercel and set the project root directory to `flowcore-frontend`. Vercel should detect Vite; use build command `npm run build` and output directory `dist`. Add this environment variable for Production (and Preview if needed):

```text
VITE_API_URL=https://<your-render-service>.onrender.com/api
```

Deploy and copy the Vercel HTTPS domain. The included `vercel.json` rewrites frontend routes to `index.html` so React Router deep links work.

## 5. Set CORS and redeploy

In Render, set `CORS_ALLOWED_ORIGINS` to the exact Vercel origin, with no trailing slash, for example `https://flowcore-app.vercel.app`. Save and redeploy the backend. If you use Vercel preview deployments, add the preview origin(s) too as a comma-separated list.

Optional Stripe checkout requires `STRIPE_SECRET_KEY` on the Render service. Set `FRONTEND_URL` to the Vercel origin for checkout redirects.

The first deploy initializes an empty database and creates the `admin` login with the value of `ADMIN_INITIAL_PASSWORD`. Existing local database records are not migrated automatically.
