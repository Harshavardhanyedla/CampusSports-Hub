# 🚀 Deploying CampusSports Hub to Vercel

## Prerequisites ✅
- GitHub repository: https://github.com/Harshavardhanyedla/CampusSports-Hub
- Vercel account (free): https://vercel.com/signup
- Supabase project with database set up

---

## 🔥 Quick Deployment Steps

### Step 1: Push Your Code to GitHub

Make sure all your latest changes are pushed to GitHub:

```bash
cd "/Users/yadlaharshavardhan/Documents/CampusSports Hub"
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Important:** Make sure `.env` is in your `.gitignore` (it already is!) so your credentials don't get pushed to GitHub.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Website (Easiest)

1. **Go to Vercel**
   - Visit [https://vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find `CampusSports-Hub` in your repository list
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)

4. **Add Environment Variables** ⚠️ **CRITICAL STEP!**
   
   Click "Environment Variables" and add these:
   
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://ecmdsubaynlrnwqcndoh.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_6WPyZu0PpKgoPQ5Z3xqjkA_mH5CWRNM` |

5. **Deploy!**
   - Click "Deploy"
   - ⏳ Wait 2-3 minutes for build
   - ✅ Your app will be live!

#### Option B: Using Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? N
# - Project name: campussports-hub
# - Directory: ./ (press Enter)
# - Override settings? N

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste: https://ecmdsubaynlrnwqcndoh.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: sb_publishable_6WPyZu0PpKgoPQ5Z3xqjkA_mH5CWRNM

# Deploy to production
vercel --prod
```

---

## 🔒 Configure Supabase for Production

After deployment, you need to allow your Vercel domain in Supabase:

1. **Go to Supabase Dashboard**
   - Project Settings → API → URL Configuration

2. **Add Allowed Origins**
   - Add your Vercel URL: `https://your-app.vercel.app`
   - Also add: `https://*.vercel.app` (for preview deployments)

3. **Update Authentication URLs** (if you add auth later)
   - Site URL: Your Vercel URL
   - Redirect URLs: Your Vercel URL

---

## 📋 Post-Deployment Checklist

After your app is deployed:

- [ ] Visit your Vercel URL
- [ ] Test creating a tournament
- [ ] Test student registration
- [ ] Test viewing registrations
- [ ] Test CSV export
- [ ] Check mobile responsiveness

---

## 🎯 Your Deployment URLs

After deployment, Vercel will give you:

- **Production**: `https://campussports-hub.vercel.app` (or similar)
- **Preview**: Unique URL for each git branch/PR
- **Dashboard**: `https://vercel.com/dashboard`

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

- **Push to `main` branch** → Deploys to production
- **Push to other branches** → Creates preview deployment
- **Pull requests** → Automatic preview deployments

---

## ⚠️ Important Notes

### Environment Variables
- **Never commit `.env`** to GitHub (already in `.gitignore`)
- **Always add env vars** in Vercel dashboard for each deployment
- **Different environments** can have different env vars (dev vs prod)

### Build Settings
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Node version: 18.x (automatic)

### Custom Domain (Optional)
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### API Errors
- Verify Supabase URL and key in Vercel env vars
- Check Supabase allowed origins
- Check browser console for specific errors

### 404 on Routes
- The `vercel.json` file handles SPA routing
- If routes don't work, verify `vercel.json` is in root directory

### Blank Page
- Check browser console for errors
- Verify build completed successfully
- Check environment variables are correct

---

## 🎉 Success!

Once deployed, share your live tournament management system:
- 🌐 Public URL for students to register
- 🎛️ Admin panel for tournament management
- 📊 Real-time data with Supabase
- 🚀 Global CDN for fast loading

---

## 📞 Quick Commands Reference

```bash
# View deployment logs
vercel logs

# List all deployments
vercel ls

# Open project in Vercel dashboard
vercel open

# Redeploy
vercel --prod

# Remove deployment
vercel remove
```

---

**Ready to deploy? Good luck! 🚀**
