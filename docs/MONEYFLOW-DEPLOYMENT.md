# MoneyFlow deployment checklist

MoneyFlow uses the existing Razorpay Standard Checkout credentials but has separate endpoints and product notes so the Smart Parking Sticker flow is not changed.

## Before enabling sales

1. Upload these two files to private object storage (not this public GitHub repository and not the Vite `public/` folder):
   - `MoneyFlow_Global_Budget_Planner_v1_9_4_Excel_and_Sheets.xlsx`
   - `MoneyFlow_README_and_Quick_Start_Guide.pdf`
2. Configure the following server-side Vercel environment variables for the deployment environment:
   - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — use the existing Razorpay credentials already used by the parking integration.
   - `MONEYFLOW_DOWNLOAD_SECRET` — a new random secret with at least 32 characters. Do not reuse the Razorpay secret.
   - `MONEYFLOW_WORKBOOK_PRIVATE_URL` — private-object URL for the XLSX.
   - `MONEYFLOW_GUIDE_PRIVATE_URL` — private-object URL for the PDF.
   - `MONEYFLOW_ASSET_STORAGE_TOKEN` — if the storage provider requires a bearer token. If URLs are pre-signed, keep their expiry longer than a single request and rotate them as needed.
3. Redeploy after setting the environment variables. These variables must not use the `VITE_` prefix.
4. Make a low-value test purchase in Razorpay test mode. Confirm the order is ₹299 INR, the order notes contain `product=moneyflow-budget-planner`, both downloads work, and an invalid/expired token is rejected.
5. Switch to live Razorpay credentials only after the test flow and storage permissions have been verified.

## Security notes

- The browser never receives the Razorpay secret or private-storage token.
- The verification endpoint checks the Razorpay signature and independently fetches the order and payment from Razorpay. It only accepts a captured ₹299 INR payment for the MoneyFlow product.
- Download tokens expire after 30 minutes. Each download request verifies the token and rechecks the order/payment status with Razorpay.
- Keep the object storage private. A publicly readable file URL defeats the download gate even if the API endpoint verifies payment.
- The dashboard illustration on the product page uses sample figures and is not a live financial account or an exact screenshot of the workbook.

## Endpoints

- `POST /api/razorpay/moneyflow-create-order`
- `POST /api/razorpay/moneyflow-verify-payment`
- `GET /api/razorpay/moneyflow-download?asset=workbook&token=...`
- `GET /api/razorpay/moneyflow-download?asset=guide&token=...`

These endpoints are separate from the existing Smart Parking Sticker endpoints.
