# Deploying to Koyeb

The Chat is designed to run on Koyeb, which provides a full Node.js runtime environment for both the Socket.io server and Next.js frontend.

## Prerequisites

- GitHub account with the repository
- Koyeb account (free tier available at https://www.koyeb.com)
- Git CLI

## Deployment Steps

### 1. Push Code to GitHub

```bash
git push origin main
```

### 2. Deploy to Koyeb

1. Go to [Koyeb Console](https://app.koyeb.com)
2. Click "Create Service"
3. Select "GitHub" as the source
4. Connect your GitHub account and select the `v` repository
5. Configure the service:
   - **Service name**: `the-chat` (or your preference)
   - **Build command**: `npm run build`
   - **Run command**: `npm run start`
   - **Environment**: 
     - `NODE_ENV`: `production`
     - `NEXT_PUBLIC_SOCKET_URL`: `https://<your-service-url>.koyeb.app` (set after first deployment)

6. Click "Deploy"

### 3. Update Environment Variable

After the service deploys, update the `NEXT_PUBLIC_SOCKET_URL` environment variable:

1. Go to your service in Koyeb Console
2. Click on "Environment"
3. Add/update `NEXT_PUBLIC_SOCKET_URL` with your Koyeb service URL (e.g., `https://the-chat-xxxx.koyeb.app`)
4. Redeploy the service

## How It Works

- The Socket.io server runs on the same Koyeb instance as the Next.js frontend
- Both the frontend and backend are served from the same domain
- WebSocket connections work seamlessly without CORS issues
- All users connect through the Koyeb instance

## Testing Locally Before Deployment

To test the full setup locally:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Troubleshooting

### Messages not appearing
- Check that Socket.io is connected (browser DevTools → Network → WS)
- Verify `NEXT_PUBLIC_SOCKET_URL` environment variable is set correctly
- Check Koyeb service logs for errors

### Users not visible
- Ensure the Socket.io connection is established
- Check that the service is running (not in failed state)
- Restart the service from the Koyeb Console

### Port issues
- Koyeb automatically exposes port 3000
- The service will receive traffic on port 3000
- No configuration needed

## Performance Notes

- Koyeb's free tier is suitable for small groups (10-20 concurrent users)
- Voice calling and game scores work best with low latency
- For larger deployments, consider upgrading Koyeb plan

## Cost

- Koyeb free tier includes:
  - 2 services
  - 2 vCPU
  - 512 MB RAM per service
  - WebSocket support

For production use with many users, consider a paid Koyeb plan.
