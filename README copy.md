# GAIL Heroku Prototype

Minimal bare-bones version of the Generative AI for Learning (GAIL) application for Heroku deployment.

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:8080

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Set Node.js version
heroku config:set NODE_VERSION=18.16.0

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

## What's Included

- ✅ Next.js 16 with App Router
- ✅ GDS (Government Design System) styling
- ✅ TypeScript support
- ✅ Basic page layout
- ✅ Health check endpoint

## What's Removed (vs Full App)

- ❌ AWS integrations
- ❌ Authentication
- ❌ Redux state management
- ❌ Complex context providers
- ❌ File upload functionality
- ❌ API integrations
- ❌ Testing suite

## File Structure

```
heroku-prototype/
├── app/
│   ├── api/health/route.ts    # Health check
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/                 # Minimal GDS components
├── public/static/             # Static assets
├── package.json               # Dependencies
├── next.config.mjs            # Next.js config
├── tsconfig.json              # TypeScript config
├── Procfile                   # Heroku process
└── .gitignore                 # Git ignore rules
```

## Environment Variables

No environment variables required for basic prototype.

## Monitoring

Check app health: `https://your-app-name.herokuapp.com/api/health`

View logs: `heroku logs --tail`

## Scaling

```bash
heroku ps:scale web=1
```

## Next Steps

1. Copy these files to your Heroku repo
2. Run `npm install`
3. Test locally with `npm run dev`
4. Deploy to Heroku
5. Add features incrementally as needed
