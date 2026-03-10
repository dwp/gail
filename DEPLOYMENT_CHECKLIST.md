# Heroku Deployment Checklist

## Pre-Deployment

- [ ] Copy all files from `heroku-prototype/` to your Heroku repo
- [ ] Run `npm install` to verify dependencies
- [ ] Test locally with `npm run dev`
- [ ] Verify app loads at http://localhost:8080
- [ ] Check health endpoint at http://localhost:8080/api/health

## Heroku Setup

- [ ] Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
- [ ] Login: `heroku login`
- [ ] Create app: `heroku create your-app-name`
- [ ] Set Node version: `heroku config:set NODE_VERSION=18.16.0`

## Deployment

- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Commit: `git commit -m "Initial Heroku deployment"`
- [ ] Add Heroku remote (if not auto-added): `heroku git:remote -a your-app-name`
- [ ] Deploy: `git push heroku main`

## Post-Deployment

- [ ] Check build logs for errors
- [ ] Visit your app: `heroku open`
- [ ] Test health endpoint: `https://your-app-name.herokuapp.com/api/health`
- [ ] Monitor logs: `heroku logs --tail`

## Troubleshooting

### Build fails
```bash
# Check logs
heroku logs --tail

# Verify buildpack
heroku buildpacks

# Should show: heroku/nodejs
```

### App crashes on startup
```bash
# Check if web dyno is running
heroku ps

# Restart if needed
heroku restart

# Check for PORT binding issues in logs
```

### Styling not loading
- Verify govuk-frontend is in dependencies
- Check that SCSS files are being processed
- Ensure public/static/ directory exists

## File Count Summary

Total files needed: ~15-20 files

**Core (7 files):**
- package.json
- next.config.mjs
- tsconfig.json
- Procfile
- .gitignore
- app/layout.tsx
- app/page.tsx

**Components (6 files):**
- components/index.ts
- components/SkipLink/SkipLink.tsx
- components/TopNavBar/TopNavBar.tsx
- components/PhaseBanner/PhaseBanner.tsx
- components/ContentFooter/ContentFooter.tsx
- components/GlobalStyle/GlobalStyle.tsx

**API (1 file):**
- app/api/health/route.ts

**Static (1 file):**
- public/static/favicon.ico

**Documentation (2 files):**
- README.md
- DEPLOYMENT_CHECKLIST.md

## Success Criteria

✅ App builds successfully
✅ App starts without crashes
✅ Home page loads with GDS styling
✅ Health endpoint returns JSON
✅ No console errors

## Next Steps After Success

1. Add more pages incrementally
2. Integrate backend APIs (if needed)
3. Add authentication (if needed)
4. Monitor performance with Heroku metrics
5. Scale as needed: `heroku ps:scale web=2`
