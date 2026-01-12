# 🚀 Deployment Guide for Vercel

Your project has been successfully pushed to GitHub! Now follow these steps to deploy on Vercel.

## Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Choose: `DevCadbury/Fabulousflame`

## Step 2: Configure Environment Variables

Before deploying, add these **3 environment variables** in Vercel:

| Variable Name | Value |
|---------------|-------|
| `COC_EMAIL` | `eddie002809@gmail.com` |
| `COC_PASSWORD` | `.chaman1` |
| `ADMIN_PASSWORD` | `UCUPBOSS` |

### How to Add Environment Variables:

1. In the Vercel import screen, scroll to **"Environment Variables"**
2. Add each variable:
   - Click **"Add"**
   - Enter variable name (e.g., `COC_EMAIL`)
   - Enter value (e.g., `eddie002809@gmail.com`)
   - Make sure it's available for **Production, Preview, and Development**
3. Repeat for all 3 variables

## Step 3: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll get a live URL like: `https://fabulousflame.vercel.app`

## Step 4: Verify Deployment

Test these URLs after deployment:

- ✅ Homepage: `https://your-domain.vercel.app/`
- ✅ Clan page: `https://your-domain.vercel.app/clan/YOUR_CLAN_TAG`
- ✅ Admin panel: `https://your-domain.vercel.app/admin`

## 🔧 Post-Deployment Configuration

### Add Your Clans

1. Visit: `https://your-domain.vercel.app/admin`
2. Enter admin password: `UCUPBOSS`
3. Add clan tags (format: `#TAG123`)
4. Set clans per row (optional)
5. Click **"Save Configuration"**

## 🎨 Custom Domain (Optional)

To use a custom domain like `fabulousflame.com`:

1. Go to your Vercel project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed by Vercel

## 🔄 Automatic Deployments

Every time you push to GitHub, Vercel will automatically redeploy:

```bash
git add .
git commit -m "Update message"
git push origin main
```

Changes will be live in 2-3 minutes!

## 📊 Monitor Your App

- **View Logs**: Vercel Dashboard → Your Project → Functions
- **Analytics**: Vercel Dashboard → Your Project → Analytics
- **Performance**: Check build times and function execution

## ⚠️ Important Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Environment variables** are stored securely in Vercel
3. **API credentials** are only on the server, never exposed to users
4. **Cache duration**: 5 minutes (300 seconds) for API data

## 🆘 Troubleshooting

### Build Fails

- Check that all 3 environment variables are set correctly
- Verify your Clash of Clans API credentials are valid

### API Errors

- Go to Vercel Dashboard → Functions → View Logs
- Check if COC_EMAIL and COC_PASSWORD are correct
- Test login at: [developer.clashofclans.com](https://developer.clashofclans.com)

### Can't Access Admin Panel

- Make sure `ADMIN_PASSWORD` is set to `UCUPBOSS` (no spaces)
- Clear browser cache and try again

## 📞 Support

- **GitHub Repository**: https://github.com/DevCadbury/Fabulousflame
- **Vercel Documentation**: https://vercel.com/docs
- **Clash of Clans API**: https://developer.clashofclans.com

---

Made with 🔥 by FABULOUS FLAME