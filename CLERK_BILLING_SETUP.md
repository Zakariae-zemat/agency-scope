# Clerk Billing Setup Guide

## Prerequisites

- Clerk account with a project created
- AgencyScope project running locally
- Database migrations applied

## Step 1: Enable Clerk Billing

1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Select your project (AgencyScope)
3. Navigate to **Configure** > **Billing** in the left sidebar
4. Click **Enable user billing** toggle
5. Click **Manage Plans**

## Step 2: Create Subscription Plans

### Free Plan
1. The free plan is already configured in the code (50 views/day limit)
2. No Clerk configuration needed - this is the default for all users

### Pro Plan
1. In Clerk Dashboard, go to **Subscription plans**
2. Click **+ Create Plan**
3. Configure the plan:
   - **Plan name**: Pro subscription plan
   - **Plan Key**: `pro_subscription_plan` (MUST match exactly)
   - **Billing cycle**: Monthly
   - **Price**: $39.00
   - **Trial period**: Optional (e.g., 14 days)
4. Click **Create plan**

## Step 3: Configure Webhook

Clerk needs to notify your app when subscriptions change.

1. In Clerk Dashboard, go to **Configure** > **Webhooks**
2. Click **+ Add Endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
   - For local testing: Use ngrok or similar tunnel service
   - Example: `https://abc123.ngrok.io/api/webhooks/clerk`
4. **Subscribe to events**:
   - ✅ `subscription.created`
   - ✅ `subscription.updated`
   - ✅ `subscription.deleted`
5. Click **Create**
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Add to your `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_your_secret_here
   ```

## Step 4: Test Locally with ngrok

If testing locally before deployment:

1. Install ngrok: https://ngrok.com/download
2. Run your dev server: `npm run dev`
3. In another terminal, start ngrok:
   ```bash
   ngrok http 3000
   ```
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update Clerk webhook endpoint to: `https://abc123.ngrok.io/api/webhooks/clerk`

## Step 5: Configure Payment Gateway

1. In Clerk Dashboard, go to **Billing** > **Settings**
2. Under **Payment gateway**, select:
   - ✅ **Clerk payment gateway** (Recommended - zero-config)
   - OR **Stripe account** (Optional - connect your Stripe account)
3. Save changes

## Step 6: Verify Setup

### Test Free User Flow
1. Sign up as a new user
2. Go to Dashboard - should show "50 views remaining"
3. View 50 contacts
4. Try to view one more - upgrade modal should appear
5. Click "Upgrade Now" - should go to `/pricing`

### Test Pro Subscription Flow
1. On `/pricing` page, click "Upgrade to Pro"
2. Complete payment (test mode - use Clerk test card)
3. After payment, webhook should fire
4. Check database:
   ```sql
   SELECT * FROM subscriptions WHERE user_id = 'your_user_id';
   ```
5. Dashboard should now show "Unlimited" views
6. Contact view limit should be bypassed

### Test Subscription Management
1. Go to `/manage-subscription`
2. Should show "Pro Plan - Active"
3. Should display next billing date
4. Test "Cancel Subscription" (optional)

## Step 7: Deploy to Production

1. Deploy your app to Vercel (or your preferred platform)
2. Update Clerk webhook URL to production URL:
   ```
   https://your-domain.com/api/webhooks/clerk
   ```
3. Ensure all environment variables are set in production:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_WEBHOOK_SECRET`

## Troubleshooting

### Webhook not working
- Check webhook secret matches `.env.local`
- Verify endpoint URL is accessible
- Check webhook logs in Clerk Dashboard
- Look for errors in your API logs: `/api/webhooks/clerk`

### Subscription not showing in database
- Verify webhook was delivered (check Clerk Dashboard > Webhooks > Logs)
- Check API route logs for errors
- Ensure `userId` in webhook matches Clerk user ID
- Verify database connection

### User still sees view limit after upgrading
- Check subscription status in database
- Verify `planId` is exactly `pro_subscription_plan`
- Verify `status` is `active`
- Clear browser cache and refresh
- Check if subscription query is working: `getUserSubscription(userId)`

### Test Cards (Clerk Test Mode)
Use these cards for testing:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future date for expiry
- Use any 3-digit CVC

## API Routes Reference

### Webhook Handler
- **Path**: `/api/webhooks/clerk/route.ts`
- **Method**: POST
- **Events**: subscription.created, subscription.updated, subscription.deleted
- **Action**: Syncs subscription data to database

### Subscription Helpers
- **Path**: `/lib/subscription.ts`
- **Functions**:
  - `getUserSubscription(userId)` - Get user's subscription
  - `hasProSubscription(userId)` - Check if user has Pro
  - `getCurrentUserSubscription()` - Get current auth user's subscription

## Environment Variables

```env
# Required for billing
CLERK_WEBHOOK_SECRET=whsec_xxxxx  # From Clerk Dashboard > Webhooks

# Existing variables
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

## Database Schema

```prisma
model Subscription {
  id                 String    @id @default(uuid())
  userId             String    @unique
  clerkSubscriptionId String   @unique
  planId             String    // "pro_subscription_plan"
  status             String    // "active", "canceled", etc.
  currentPeriodEnd   DateTime?
  cancelAtPeriodEnd  Boolean   @default(false)
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

## Pages Reference

- `/pricing` - Pricing plans page
- `/manage-subscription` - Manage active subscription
- `/dashboard` - Shows subscription status and view limits

## Next Steps

1. Customize pricing page design
2. Add more subscription tiers (optional)
3. Implement usage analytics
4. Add invoice history
5. Set up email notifications for subscription events

## Support

- Clerk Billing Docs: https://clerk.com/docs/billing/overview
- Webhook Guide: https://clerk.com/docs/integrations/webhooks/overview
- AgencyScope issues: Create an issue on GitHub
