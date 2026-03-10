# Test Coupons - Manual Creation

## Stripe Dashboard Setup

Since API version conflicts are blocking automated creation, create these manually:

### Step 1: Create Coupons (100% off)
Go to: https://dashboard.stripe.com/coupons

Create 4 coupons with these settings:

| Coupon Name | Percent Off | Duration |
|-------------|-------------|----------|
| "TEST - OpenClaw Masterclass" | 100% | Once |
| "TEST - Agent Security" | 100% | Once |
| "TEST - Trading Bot" | 100% | Once |
| "TEST - X Monetization" | 100% | Once |

### Step 2: Create Promotion Codes
For each coupon above, click "Add promotion code" and set:

| Product | Code | Max Redemptions |
|---------|------|-----------------|
| OpenClaw Masterclass | **TESTOCM** | 10 |
| Agent Security Field Guide | **TESTASFG** | 10 |
| Trading Bot Blueprint | **TESTTBB** | 10 |
| X Monetization System | **TESTXMS** | 10 |

### Step 3: Test the Flow

1. Go to your store page
2. Add product to cart
3. At checkout, enter code: **TESTOCM** (or appropriate code)
4. Price should drop to $0.00
5. Complete "purchase" 
6. Check Firestore - order should appear
7. Verify content access is granted

## Product Details Summary

| Product | Price ID | Price | Code |
|---------|----------|-------|------|
| OpenClaw Masterclass | price_1T9DnSRpLFWUKDnHi3HELdZo | $49 | TESTOCM |
| Agent Security Field Guide | price_1T9DntRpLFWUKDnHsZ7cKk83 | $27 | TESTASFG |
| Trading Bot Blueprint | price_1T9DnuRpLFWUKDnHT4WjjoZn | $97 | TESTTBB |
| X Monetization System | price_1T9DnuRpLFWUKDnHzY6OZ0zG | $67 | TESTXMS |

## Next: I'll Build the Store Integration

Once you confirm the coupons work:
1. I'll populate the Store page with real products (not sample data)
2. Connect checkout to these Stripe prices
3. Generate product images
4. Write sales copy
5. **WAIT for your approval** before any X posts

Create those coupons and test one purchase - let me know when you're ready for the next phase!
