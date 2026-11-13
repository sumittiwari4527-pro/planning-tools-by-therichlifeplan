# Digital Product Playbook launch setup

## Page and product
- Sales page: `/products/digital-product-playbook`
- Catalog entry: Digital Products
- India price: INR 499 (Razorpay order amount 49,900 paise)
- International price: USD 9.99 (Razorpay order amount 999 cents)
- Currency is selected automatically from the browser's preferred locale region; Asia/Kolkata is the fallback when the locale has no region. Visitors with an India locale see INR; other locales see USD. This is a convenience signal, not verified billing-country detection.
- Checkout endpoints are separate from the existing Smart Parking Sticker and MoneyFlow flows.

## Upload the product assets after merging this branch
Extract `digital-product-playbook-site-assets.zip` and preserve these paths:
- `public/images/digital-product-playbook-cover.webp`
- `public/images/playbook-preview-ideas.webp`
- `public/images/playbook-preview-chatgpt.webp`
- `public/images/playbook-preview-claude.webp`
- `public/images/playbook-preview-selling.webp`
- `public/images/playbook-preview-etsy.webp`
- `public/images/playbook-preview-launch.webp`
- `private-assets/digital-product-playbook-v5.pdf.enc`

The PDF is AES-256-GCM encrypted. Do not upload a plaintext copy of the PDF to `public/`.

## Vercel environment variable
Add `PLAYBOOK_DOWNLOAD_SECRET` to the Vercel project for Production and Preview. Use the generated secret supplied separately with the launch handoff. Do not add it to GitHub, source code, or this file. Redeploy after setting it.

Existing `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are reused. No new Razorpay credentials are required.

## Payment and download flow
1. `/api/razorpay/playbook-create-order` creates a fixed-price INR or USD order. The server ignores client-supplied amounts.
2. Razorpay Checkout collects payment.
3. `/api/razorpay/playbook-verify-payment` validates the signature and checks that the payment is captured for the expected amount and currency.
4. The verified response includes a 24-hour signed download token.
5. `/api/razorpay/playbook-download` validates the token, rechecks the captured Razorpay payment, downloads the encrypted private asset from this repository and decrypts it for the customer.

The token is time-limited but is not single-use; a database would be needed to enforce a download count or revoke individual links.

## Before launch
- Upload the asset bundle to the repository on `main`.
- Add `PLAYBOOK_DOWNLOAD_SECRET` in Vercel Production and Preview.
- Confirm international USD currency is available for Razorpay Orders on the account.
- Test an INR payment in Razorpay test mode and test USD with an eligible international test flow before switching live.
- Verify payment failure, modal dismissal, successful verification, expired token and PDF download.
- Check Meta Pixel ViewContent, InitiateCheckout and Purchase events for both currencies.
