# Deploying Clearlite CRM to Railway.app

This guide will walk you through deploying the Clearlite CRM application to Railway.app, a platform that simplifies deployment with automatic PostgreSQL provisioning and free tier hosting.

## Prerequisites

- A GitHub account
- A Railway.app account (sign up at [railway.app](https://railway.app))
- Your Clearlite CRM code pushed to a GitHub repository

## Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Clearlite CRM"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/clearlite-crm.git

# Push to GitHub
git push -u origin main
```

## Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub repositories
5. Select your `clearlite-crm` repository

## Step 3: Set Up PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision a PostgreSQL database
4. The `DATABASE_URL` environment variable is automatically added

## Step 4: Deploy Backend

### Create Backend Service

1. Click **"+ New"** → **"GitHub Repo"** → Select your repository again
2. Name it **"Backend"**
3. Railway will detect it as a Node.js project

### Configure Backend Environment Variables

Click on the Backend service → **"Variables"** tab → Add the following:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `JWT_SECRET` | Generate a secure random string (e.g., use `openssl rand -base64 32`) |
| `FRONTEND_URL` | Leave empty for now, we'll add this after frontend deployment |

> **Note**: `DATABASE_URL` is automatically provided by Railway's PostgreSQL service.

### Configure Backend Build Settings

1. Click **"Settings"** tab
2. Under **"Build Command"**, ensure it shows: `npm run build`
3. Under **"Start Command"**, ensure it shows: `npm start`
4. Under **"Root Directory"**, set to: `backend`

### Generate Public URL

1. Click **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://your-backend.up.railway.app`)

## Step 5: Deploy Frontend

### Create Frontend Service

1. Go back to your project dashboard
2. Click **"+ New"** → **"GitHub Repo"** → Select the same repository
3. Name it **"Frontend"**

### Configure Frontend Environment Variables

Click on the Frontend service → **"Variables"** tab → Add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your backend URL from Step 4 (e.g., `https://your-backend.up.railway.app`) |

### Configure Frontend Build Settings

1. Click **"Settings"** tab
2. Under **"Build Command"**, ensure it shows: `npm run build`
3. Under **"Start Command"**, set to: `npx vite preview --port $PORT --host`
4. Under **"Root Directory"**, leave as: `/` (root)

### Generate Public URL

1. Click **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://your-frontend.up.railway.app`)

## Step 6: Update Backend CORS

1. Go back to Backend service → **"Variables"**
2. Update **`FRONTEND_URL`** with your frontend URL from Step 5

## Step 7: Seed the Database

You need to run the seed script once to populate the database with default users and data.

### Option A: Use Railway CLI (Recommended)

1. Install Railway CLI:

   ```bash
   npm install -g @railway/cli
   ```

2. Login:

   ```bash
   railway login

   ```

3. Link to your project:

   ```bash
   railway link
   ```

4. Run seed script:

   ```bash
   railway run npm run seed --service backend
   ```

### Option B: Temporarily Modify Start Script

1. In your local repository, открыть `backend/package.json`
2. Temporarily change the `start` script:

   ```json
   "start": "npm run seed && node dist/server.js"
   ```

3. Commit and push:

   ```bash
   git add backend/package.json
   git commit -m "Temporary: Run seed on startup"
   git push
   ```

4. Railway will redeploy automatically and run the seed
5. **Revert the change** after deployment completes:

   ```json
   "start": "node dist/server.js"
   ```

6. Commit and push again to restore normal operation

## Step 8: Verify Deployment

1. Open your **frontend URL** in a browser
2. You should see the Clearlite CRM login page
3. Test login with default credentials:
   - **Admin**: `admin@clearlitesolutionllc.com` / `Admin@2024`
   - **Inputer**: `inputer@clearlitesolutionllc.com` / `Inputer@2024`
   - **Authorizer**: `authorizer@clearlitesolutionllc.com` / `Authorizer@2024`

## Troubleshooting

### Frontend shows "Cannot connect to API"

- Check that `VITE_API_URL` in frontend variables matches your backend URL
- Ensure backend service is deployed and running
- Check backend logs for errors

### Database connection failed

- Verify `DATABASE_URL` is present in backend environment variables
- Check PostgreSQL service is running
- Review backend logs in Railway dashboard

### CORS errors in browser console

- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check that both services are using HTTPS

### Build failures

- Check Railway logs for specific error messages
- Verify all dependencies are listed in `package.json`
- Ensure Node.js version compatibility (Railway uses Node 18+)

## Post-Deployment Security

1. **Change default passwords** immediately after first login
2. **Set strong JWT_SECRET**: Generate a new secure random string
3. **Enable 2FA** on your Railway account
4. **Review CORS settings**: Ensure only your frontend URL is allowed

## Monitoring

Railway provides built-in monitoring:

- **Logs**: Click any service → "Deployments" → View logs
- **Metrics**: View CPU, memory, and network usage
- **Alerts**: Set up notifications for downtime

## Updating Your Application

Railway automatically redeploys when you push to GitHub:

```bash
# Make your changes
git add .
git commit -m "Update feature X"
git push

# Railway will automatically rebuild and redeploy
```

## Custom Domain (Optional)

To use your own domain:

1. Go to Frontend service → "Settings" → "Domains"
2. Click "Custom Domain"
3. Enter your domain (e.g., `crm.yourdomain.com`)
4. Add the provided CNAME record to your DNS provider
5. Repeat for backend if desired

## Cost Considerations

Railway's free tier includes:

- **$5 of usage per month**
- Idle services sleep after 45 minutes (wake on request)
- 500MB memory per service
- PostgreSQL database included

For production use, consider upgrading to the **Developer Plan** ($5/month) for always-on services.

---

## Support Resources

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Community Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Status Page**: [status.railway.app](https://status.railway.app)

---

**🎉 Congratulations!** Your Clearlite CRM is now deployed and accessible worldwide!
