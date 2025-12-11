# Brand Outreach Research Summary

## Chase's Request
Automate the process of reaching out to TikTok Shop brands/sellers to negotiate higher commission rates for AA creators.

## Key Finding
**TikTok's Partner API does NOT support automated seller outreach.**

The API follows an authorization-first model where sellers must explicitly connect to partner apps via OAuth before any data exchange occurs.

## TikTok Partner Center Built-in Tools

### 1. Service Proposals (RECOMMENDED)
- URL: `partner.us.tiktokshop.com/seller/contract/create`
- Enter shop name or shop code
- Seller receives proposal in their TikTok dashboard
- Higher response rate than cold email
- **No API available** - must be done manually through UI

### 2. Seller Leads Pool
- Visible in Partner Center sidebar
- May provide list of potential sellers
- Needs exploration

### 3. Seller Management
- Track authorized sellers
- View service orders and proposals

## External Email Options (If Needed)

| Platform | Price | Features |
|----------|-------|----------|
| Smartlead | $39-94/mo | Unlimited accounts, warmup, API |
| Instantly.ai | $37-97/mo | 4.2M warmup network, clean UI |

### Email Infrastructure Required
- 5-10 secondary domains (~$60-120/yr)
- Google Workspace accounts ($6/inbox/mo)
- 4-6 week warmup period before sending
- CAN-SPAM compliance (physical address, opt-out)

### Volume Capacity
- Start: 10-20 emails/day per inbox
- Scale to: 50 emails/day per inbox after warmup
- Target: 500-1000 emails/day with 12-20 inboxes

## Recommended Approach

**Use TikTok's Service Proposal system** with a workflow helper:

1. Build a queue in AA platform with shop names/codes
2. Track outreach status per brand
3. Open TikTok proposal page with pre-filled data
4. Admin manually submits
5. Log responses and follow-ups

### Database Schema for Brand Tracking

```prisma
model Brand {
  id              String      @id @default(cuid())
  name            String
  shopCode        String?     @unique
  contactEmail    String?
  contactName     String?
  status          BrandStatus @default(NOT_CONTACTED)
  lastContactedAt DateTime?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum BrandStatus {
  NOT_CONTACTED
  CONTACTED
  IN_NEGOTIATION
  PARTNERED
  DECLINED
}
```

## Why TikTok's System is Better

1. **Higher response rate** - Sellers see proposals in their dashboard
2. **Legitimate** - Using official TikTok tools
3. **No spam risk** - No domain warming needed
4. **Integrated** - Proposals connect to TikTok's contract system
5. **Free** - No external tool costs

## Implementation Steps

1. Extract unique shop names/codes from product CSV
2. Build brand management page in AA admin
3. Create "Start Proposal" button that opens TikTok's form
4. Track status manually in AA
5. Optional: Build Chrome extension to auto-fill shop name

## TikTok Partner API Limitations

| What You Want | API Available? |
|---------------|----------------|
| Create service proposals | ❌ No |
| Send partnership invitations | ❌ No |
| Browse seller directories | ❌ No |
| Get seller contact info | ❌ No |
| Manage existing partnerships | ✅ Yes (after auth) |
| Access authorized shop data | ✅ Yes (after auth) |

The entire Partner model is **opt-in only** - sellers must discover and install partner apps, not the other way around.
