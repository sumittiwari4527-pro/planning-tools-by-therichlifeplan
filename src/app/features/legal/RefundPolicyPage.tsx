import React from "react";
import { RefreshCcw } from "lucide-react";

export function RefundPolicyPage() {
  return (
    <div className="pt-16 min-h-screen bg-[#f8f9fb]">
      <section className="bg-[#0f1523] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-mono uppercase tracking-widest mb-4">
            <RefreshCcw size={14} /> Refunds
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Refund & Cancellation Policy
          </h1>
          <p className="text-[#c4cad9]">Last updated: 6 October 2026</p>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white border border-[#e4e8f0] rounded-3xl p-6 sm:p-10 shadow-sm space-y-10 text-[#334155] leading-7">
          <section>
            <h2>1. Overview</h2>
            <p>This policy applies to purchases made from RichLifeTools, operated by <strong>Sumit Kumar Tiwari</strong>, Noida, Uttar Pradesh, India. It applies to Smart Parking Stickers, digital products, and other paid products or services offered by RichLifeTools.</p>
            <p>We do not offer discretionary change-of-mind cancellations. This policy does not limit any mandatory cancellation, withdrawal, refund, repair, replacement, guarantee, or other consumer right that applies under the law of your location.</p>
          </section>

          <section>
            <h2>2. Smart Parking Sticker refunds</h2>
            <p>We may provide a refund or replacement where:</p>
            <ul>
              <li>the sticker we send is materially different from the product ordered;</li>
              <li>the sticker arrives damaged or defective;</li>
              <li>the QR code does not work because of an error in our production or generation process;</li>
              <li>we cannot fulfil the order; or</li>
              <li>a refund or other remedy is required by applicable consumer law.</li>
            </ul>
            <p>Because Smart Parking Stickers may be personalized or produced specifically for an order, we do not offer discretionary cancellation for a change of mind. If you provide incorrect name, phone, email, vehicle, delivery, or other order information, we are not responsible for resulting personalization or delivery errors, except where applicable law requires otherwise.</p>
          </section>

          <section>
            <h2>3. Digital product refunds</h2>
            <p>We may provide a refund where a digital product is materially defective, cannot be accessed or delivered because of a problem on our side, is materially different from its description, or where a refund is required by applicable law.</p>
            <p>We do not offer discretionary refunds solely because you changed your mind after purchasing or accessing a digital product, except where applicable law gives you a non-waivable withdrawal or refund right.</p>
          </section>

          <section>
            <h2>4. Duplicate or incorrect charges</h2>
            <p>If you are charged more than once for the same order, or a payment is taken because of an error attributable to us, contact us and we will review the transaction and provide an appropriate refund where warranted.</p>
          </section>

          <section>
            <h2>5. Payment providers</h2>
            <p>Payments may be processed through Razorpay or Lemon Squeezy. For Lemon Squeezy transactions where it acts as merchant of record, its applicable buyer terms and refund process may also apply. For Razorpay transactions, we will handle eligible refunds through the applicable payment route, subject to our policy and applicable law.</p>
          </section>

          <section>
            <h2>6. Refund request process</h2>
            <p>To request a refund, contact <a className="text-[#4f46e5] font-medium" href="mailto:richlifetools.support@gmail.com">richlifetools.support@gmail.com</a> and include your order number, purchase email, and a brief description of the problem. We may request reasonable information or evidence needed to verify the transaction or issue.</p>
          </section>

          <section>
            <h2>7. Refund method and timing</h2>
            <p>Approved refunds will normally be issued to the original payment method. The time for the funds to appear in your account depends on the payment provider, card issuer, bank, or other financial institution. We do not guarantee a specific settlement time after a refund has been initiated.</p>
          </section>

          <section>
            <h2>8. Statutory consumer rights</h2>
            <p>This policy is intended to provide a clear commercial refund framework and does not exclude or reduce rights that cannot legally be excluded. If mandatory law in your country or region gives you a withdrawal, cancellation, refund, repair, replacement, guarantee, or other consumer remedy, that right remains available to you.</p>
          </section>

          <section>
            <h2>9. Goodwill refunds</h2>
            <p>We may, at our discretion, provide a refund or another resolution outside the situations described above. A goodwill refund in one case does not create an obligation to provide the same resolution in another case.</p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>For refund questions or requests:</p>
            <p><strong>Sumit Kumar Tiwari</strong><br />Noida, Uttar Pradesh, India<br /><a className="text-[#4f46e5] font-medium" href="mailto:richlifetools.support@gmail.com">richlifetools.support@gmail.com</a></p>
          </section>

          <style>{`
            h2 { font-size: 1.25rem; line-height: 1.4; font-weight: 700; color: #0f1523; margin-bottom: 0.75rem; }
            p { margin-top: 0.65rem; }
            ul { list-style: disc; padding-left: 1.35rem; margin-top: 0.75rem; }
            li { margin-top: 0.45rem; }
          `}</style>
        </div>
      </article>
    </div>
  );
}
