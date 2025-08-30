# Vercel Deployment Guide

## 🚀 Backend Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy Backend
```bash
cd backend
vercel
```

### 4. Set Environment Variables in Vercel Dashboard
After deployment, go to your Vercel project dashboard and add these environment variables:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=officialcrafixmedia@gmail.com
EMAIL_PASS=gtbc bjmz faeb ojqv
EMAIL_FROM=officialcrafixmedia@gmail.com
EMAIL_TO=officialcrafixmedia@gmail.com
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 5. Update Frontend API URL
Replace `your-backend-domain.vercel.app` in `frontend/script/script.js` with your actual Vercel backend domain.

### 6. Deploy Frontend
```bash
cd frontend
vercel
```

## 🔧 Important Notes

1. **CORS Configuration**: Update the CORS origins in `server.js` with your actual frontend domain
2. **Environment Variables**: Make sure all environment variables are set in Vercel dashboard
3. **Gmail App Password**: Ensure your Gmail app password is correct
4. **Domain Names**: Replace placeholder domains with your actual Vercel domains

## 📧 Testing

After deployment:
1. Test the contact form on your live website
2. Check if emails are received at `officialcrafixmedia@gmail.com`
3. Monitor Vercel function logs for any errors

## 🔄 Updates

To update your deployment:
```bash
vercel --prod
```

