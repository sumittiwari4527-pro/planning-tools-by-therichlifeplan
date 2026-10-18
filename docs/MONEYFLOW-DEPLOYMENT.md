# MoneyFlow deployment checklist

MoneyFlow uses the existing Razorpay Standard Checkout credentials and account. It has product-specific endpoints and order notes so the Smart Parking Sticker flow remains unchanged.

## Repository-only secure downloads

The workbook and guide are stored in the repository as AES-256-GCM encrypted binary assets under `private-assets/`. Do not commit plaintext versions of either paid file. The download endpoint verifies the purchase and decrypts the requested asset in server memory.

Encrypted asset format: 12-byte nonce || 16-byte authentication tag || ciphertext. The AES-256 key is SHA-256 of the server-only `MONEYFLOW_DOWNLOAD_SECRET`. Use a unique random nonce for each file. Keep the secret in Vercel server-side environment variables only; never use a `VITE_` prefix or reuse the QR key.

## Before enabling sales

1. Encrypt the original files and commit only these encrypted outputs to the branch used for deployment:
   - `private-assets/MoneyFlow_Global_Budget_Planner_v1_9_4_Excel_and_Sheets.xlsx.enc`
   - `private-assets/MoneyFlow_README_and_Quick_Start_Guide.pdf.enc`
2. In Vercel, configure the existing server-side `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`, plus a new random `MONEYFLOW_DOWNLOAD_SECRET` of at least 32 characters. Keep these server-only; do not prefix with `VITE_`.
3. Redeploy. The encrypted files are fetched from the repository by the server endpoint, then decrypted only after a valid download token and captured payment are confirmed.
4. Test in Razorpay test mode: order is ₹299 INR, order notes contain `product=moneyflow-budget-planner`, both files download correctly, and invalid/expired tokens are rejected.
5. Switch to live payment credentials only after successful testing.

## Security notes

- Public repository viewers can download the encrypted blobs but cannot read the original files without the server secret. Never commit plaintext files or secrets.
- The browser never receives the Razorpay secret or MoneyFlow download secret.
- Payment verification checks Razorpay's signature and independently fetches the order and payment. Only a captured ₹299 INR payment for the MoneyFlow product is accepted.
- Download tokens expire after 30 minutes. Every download rechecks order/payment status.
- The dashboard illustration on the product page uses sample figures and is not a live financial account or an exact screenshot of the workbook.
- The existing Smart Parking Sticker API files are not changed.

## Endpoints

- `POST /api/razorpay/moneyflow-create-order`
- `POST /api/razorpay/moneyflow-verify-payment`
- `GET /api/razorpay/moneyflow-download?asset=workbook&token=...`
- `GET /api/razorpay/moneyflow-download?asset=guide&token=...`

## Redeploy after environment changes

After adding or rotating `MONEYFLOW_DOWNLOAD_SECRET` in Vercel, trigger a new deployment for the target environment so the MoneyFlow API functions receive the updated value. Confirm the variable is configured for that same environment before testing checkout.

## Lemon Squeezy checkout URL

Configure `VITE_LEMON_SQUEEZY_MONEYFLOW_CHECKOUT_URL` in Vercel with the MoneyFlow hosted checkout URL. This is a public frontend URL (not a secret), similar to the existing `VITE_LEMON_SQUEEZY_PARKING_CHECKOUT_URL`. Set it for each environment you use and redeploy so the Vite build picks up the new value. If it is missing, the checkout page displays a configuration notice instead of a broken button.
