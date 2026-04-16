# 🔧 Fix for Vercel 500 Error - FUNCTION_INVOCATION_FAILED

## Problem Identified
Your backend had a **configuration mismatch** between Railway and Vercel setup, causing Prisma connection failures.

## What Was Fixed

### 1. ✅ Created `vercel.json`
- Properly configures Vercel for Next.js serverless functions
- Sets up environment variable linking

### 2. ✅ Fixed Prisma Client (src/prisma.ts)
- Changed from creating new instance on each request → singleton pattern
- Prevents connection pool exhaustion in serverless
- Better for production environments

### 3. ✅ Updated API Routes
- `pages/api/movies/index.ts` - Now uses Prisma singleton
- `pages/api/movies/[id].ts` - Now uses Prisma singleton
- Added better error logging to identify issues

## Next Steps: Setup Vercel Environment Variables

Go to **Vercel Dashboard** → Your Project → Settings → Environment Variables

Add these variables:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/netflix?retryWrites=true&w=majority` |
| `NEXTAUTH_URL` | Your deployed domain | `https://your-domain.vercel.app` |
| `NEXTAUTH_SECRET` | Generate a secure key | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console | Required for Google OAuth |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console | Required for Google OAuth |
| `GITHUB_ID` | From GitHub Settings | Required for GitHub OAuth |
| `GITHUB_SECRET` | From GitHub Settings | Required for GitHub OAuth |
| `NODE_ENV` | `production` | - |

## How to Generate NEXTAUTH_SECRET

**Option 1: Using PowerShell (Windows)**
```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**Option 2: Using Node.js (any OS)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Deployment Steps

1. **Push changes to GitHub:**
```bash
git add .
git commit -m "fix: Fix Vercel 500 error - Add vercel.json and fix Prisma client"
git push origin main-v2
```

2. **Redeploy on Vercel:**
   - Go to Vercel Dashboard → Deployments
   - Click "Redeploy" on latest deployment
   - **OR** push to main branch to trigger auto-deploy

3. **Monitor the deployment:**
   - Watch build logs for errors
   - Check function logs after deployment

## Testing Locally

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Start development server
npm run dev
```

Visit: `http://localhost:5000/api/health` to test

## If Error Still Occurs

Check Vercel logs:
1. Go to Vercel Dashboard → Deployments
2. Click on your failed deployment
3. Go to "Runtime Logs" tab
4. Look for exact error message

Common issues:
- ❌ `DATABASE_URL not set` → Add it in Environment Variables
- ❌ `Prisma schema not generated` → Build step will handle this
- ❌ `Connection timeout` → Check MongoDB connection string, IP whitelist

## Additional Notes

- Your project uses both **Express** (src/index.ts) and **Next.js API routes** (pages/api/)
- For Vercel: Use the Next.js API routes (they work as serverless)
- For Railway: Use the Express server in src/index.ts
- Never commit `.env.local` - it's in `.gitignore`
