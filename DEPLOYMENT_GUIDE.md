# FlowCore deployment

Use [DEPLOY_VERCEL_RENDER.md](DEPLOY_VERCEL_RENDER.md) for the current deployment steps. The backend requires database connection values, `JWT_SECRET`, and `CORS_ALLOWED_ORIGINS` to be configured in Render. Set `ADMIN_INITIAL_PASSWORD` for the first deployment so the application can create its initial admin account.

Never put production credentials in source files or commit `.env` files. The backend no longer seeds demo accounts or uses local database and JWT fallback credentials.
