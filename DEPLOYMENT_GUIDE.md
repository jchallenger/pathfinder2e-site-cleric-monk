# Deployment Guide - Talon Tracker

Complete guide for deploying Talon Tracker to GitHub and Netlify.

---

## ✅ Step 1: Create GitHub Repository

### Option A: Using GitHub CLI (Fastest)

If you have [GitHub CLI](https://cli.github.com/) installed:

```bash
# Create repository and push in one command
gh repo create talon-tracker --public --source=. --remote=origin --push
```

This will:
- Create a new public repository named "talon-tracker"
- Add it as the origin remote
- Push your code automatically

### Option B: Using GitHub Website

1. **Go to GitHub**: https://github.com/new

2. **Repository settings**:
   - Repository name: `talon-tracker`
   - Description: "Pathfinder 2e Remaster character sheet for Minotaur Warpriest"
   - Visibility: Public (or Private)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

3. **Create repository**

4. **Push your code**:
   ```bash
   cd c:\Users\JK\Documents\GitHub\react-campaign-tracker\talon-tracker

   # Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/talon-tracker.git

   # Push code
   git push -u origin main
   ```

---

## ✅ Step 2: Deploy to Netlify

### Option A: Using Netlify CLI (Recommended)

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```
   This opens a browser window to authenticate.

3. **Initialize Netlify**:
   ```bash
   cd c:\Users\JK\Documents\GitHub\react-campaign-tracker\talon-tracker
   netlify init
   ```

4. **Follow prompts**:
   - **Create & configure a new site**: Yes
   - **Team**: Select your team
   - **Site name**: talon-tracker (or custom name)
   - **Build command**: `npm run build` (auto-detected)
   - **Publish directory**: `dist` (auto-detected)
   - **Link to GitHub**: Yes (for automatic deployments)

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option B: Using Netlify Website

1. **Go to Netlify**: https://app.netlify.com

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to Git provider**:
   - Choose GitHub
   - Authorize Netlify to access your repositories

4. **Select repository**:
   - Find and select `talon-tracker`

5. **Configure build settings** (auto-detected from `netlify.toml`):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Branch**: `main`

6. **Click "Deploy site"**

7. **Wait for deployment** (~1-2 minutes)

8. **Your site is live!** 🎉

---

## 📝 Post-Deployment Steps

### 1. Update README with Live URL

Once deployed, update the README.md file:

```bash
# Get your Netlify URL
netlify status

# Or check in Netlify dashboard
```

Then edit README.md and replace:
```markdown
**[View Live Site](https://your-site-name.netlify.app)**
```

With your actual Netlify URL:
```markdown
**[View Live Site](https://talon-tracker.netlify.app)**
```

Commit and push:
```bash
git add README.md
git commit -m "Update README with live site URL"
git push
```

### 2. Configure Custom Domain (Optional)

If you have a custom domain:

1. In Netlify dashboard → **Domain settings**
2. Click **Add custom domain**
3. Enter your domain (e.g., `talon.example.com`)
4. Follow DNS configuration instructions
5. Netlify provides free SSL certificate

### 3. Set Up Automatic Deployments

**Already configured!** Every push to `main` branch will trigger a new deployment.

To deploy from a different branch:
1. Netlify dashboard → **Site settings** → **Build & deploy**
2. Edit production branch
3. Change from `main` to your preferred branch

---

## 🔧 Environment Variables (If Needed)

If you need to configure environment variables:

### Netlify Dashboard Method:
1. Site settings → **Environment variables**
2. Add variables (e.g., `VITE_OLLAMA_API_URL`)
3. Redeploy site

### Netlify CLI Method:
```bash
netlify env:set VITE_OLLAMA_API_URL "http://100.1.100.201:11434"
```

**Note**: Vite requires env vars to be prefixed with `VITE_` to be exposed to the client.

---

## 🚀 Deployment Commands Reference

### Build Locally
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Netlify CLI
```bash
netlify dev          # Run local dev server with Netlify functions
netlify build        # Build site locally
netlify deploy       # Deploy draft
netlify deploy --prod  # Deploy to production
netlify status       # Check site status
netlify open         # Open site in browser
netlify logs         # View deployment logs
```

### Git Commands
```bash
git status           # Check status
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Push to GitHub (triggers Netlify deploy)
```

---

## 📊 Monitoring & Analytics

### Netlify Analytics

Enable analytics in Netlify dashboard:
1. **Analytics** tab
2. Enable Netlify Analytics ($9/month)

OR use free alternatives:
- Google Analytics
- Plausible Analytics
- Simple Analytics

### Build Status Badge

Add to README.md:
```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)
```

Get your site ID from Netlify dashboard → Site settings → General.

---

## 🐛 Troubleshooting

### Build Fails on Netlify

1. **Check build logs**:
   - Netlify dashboard → Deploys → Click failed deploy → View logs

2. **Common issues**:
   - **Missing dependencies**: Make sure `package-lock.json` is committed
   - **Build command**: Verify in `netlify.toml`
   - **Node version**: Specified in `netlify.toml` (Node 18)

3. **Test build locally**:
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

### Site Not Updating

1. **Clear cache and redeploy**:
   ```bash
   netlify build --clear-cache
   netlify deploy --prod
   ```

2. **Force new deploy**:
   - Netlify dashboard → Deploys → **Trigger deploy** → Clear cache and deploy

### 404 Errors on Page Refresh

This is fixed by the redirect rule in `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

If still having issues, verify `netlify.toml` is committed and deployed.

### Ollama API Not Working

The site will work without Ollama, but storytelling features won't function. This is expected if deploying publicly.

**Options**:
1. **Disable storytelling** in production (feature detection)
2. **Use public API** (OpenAI, Anthropic) - requires backend
3. **Deploy Ollama** to a publicly accessible server

---

## 📈 Performance Optimization

### Already Implemented:
- ✅ Vite build optimization
- ✅ Code splitting
- ✅ Asset compression
- ✅ Cache headers in `netlify.toml`

### Additional Optimizations:

1. **Enable Netlify CDN** (automatic)

2. **Compress images**:
   ```bash
   npm install -D vite-plugin-imagemin
   ```

3. **Analyze bundle**:
   ```bash
   npm run build -- --mode production
   npx vite-bundle-visualizer
   ```

---

## 🔒 Security

### Headers Configured (in netlify.toml):
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Content-Security-Policy

### Additional Security:
1. Keep dependencies updated: `npm audit`
2. Use Dependabot on GitHub
3. Enable 2FA on Netlify and GitHub

---

## ✅ Deployment Checklist

Before deploying:
- [ ] All tests passing (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] .gitignore configured properly
- [ ] Sensitive data removed (API keys, passwords)
- [ ] README.md complete with instructions
- [ ] netlify.toml configured

After deploying:
- [ ] Site loads correctly
- [ ] All routes work (no 404s)
- [ ] Features function as expected
- [ ] Performance is acceptable
- [ ] Analytics configured (optional)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)

---

## 🎉 You're Done!

Your Talon Tracker is now live and accessible to the world!

**Next steps**:
1. Share the URL with your gaming group
2. Monitor usage and performance
3. Gather feedback and iterate
4. Add new features and improvements

**Useful Links**:
- **Netlify Docs**: https://docs.netlify.com
- **GitHub Docs**: https://docs.github.com
- **Vite Docs**: https://vitejs.dev

---

## 📞 Support

If you run into issues:
1. Check Netlify build logs
2. Review this deployment guide
3. Search Netlify support docs
4. Ask in Netlify community forums

**Happy deploying!** 🚀
