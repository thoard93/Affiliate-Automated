# Fix Package - Affiliate Automated

This package contains:
1. **Missing `src/lib/` files** - Fixes the build error
2. **Brand Outreach Module** - New feature Chase requested

## How to Apply

### Option 1: Copy files manually
1. Extract this zip
2. Copy all contents into your `affiliate-automated` folder, merging with existing files
3. Push to GitHub:
```bash
cd C:\Users\thoar\Downloads\affiliate-automated-platform\affiliate-automated
git add .
git commit -m "Add missing lib files and brand outreach module"
git push
```

### Option 2: Use GitHub Desktop
1. Extract this zip into your project folder
2. GitHub Desktop will detect the changes
3. Commit and push

## Files Included

### Build Fix (src/lib/)
- `src/lib/utils.ts` - Utility functions (formatCurrency, cn, etc.)
- `src/lib/db.ts` - Prisma database client
- `src/lib/auth.ts` - NextAuth configuration
- `src/lib/tiktok.ts` - TikTok Shop API client

### Brand Outreach Module (New Feature)
- `src/app/admin/brands/page.tsx` - Brand management dashboard
- `src/app/api/admin/brands/route.ts` - Brands CRUD API
- `src/app/api/admin/brands/outreach/route.ts` - Email outreach API
- `src/app/api/admin/email-templates/route.ts` - Email templates API
- `src/app/admin/layout.tsx` - Updated with "Brand Outreach" nav link
- `prisma/schema.prisma` - Updated with Brand, OutreachEmail, EmailTemplate models

## After Pushing

Render will auto-deploy. After deploy succeeds, run database migration:
1. Go to Render dashboard → Shell
2. Run: `npx prisma db push`

## Brand Outreach Features

- Pipeline management (Lead → Contacted → Negotiating → Partnered)
- Contact info tracking
- Email templates with variables
- Commission rate negotiation tracking
- Priority levels (Low/Medium/High/Urgent)
