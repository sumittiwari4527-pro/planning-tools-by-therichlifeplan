import React from "react";
import { Mail, ShieldCheck } from "lucide-react";

export function PrivacyPolicyPage() {
  return (
    <div className="pt-16 min-h-screen bg-[#f8f9fb]">
      <section className="bg-[#0f1523] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-mono uppercase tracking-widest mb-4">
            <ShieldCheck size={14} /> Privacy
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Privacy Policy
          </h1>
          <p className="text-[#c4cad9]">Last updated: 6 October 2026</p>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white border border-[#e4e8f0] rounded-3xl p-6 sm:p-10 shadow-sm space-y-10 text-[#334155] leading-7">
          <section>
            <h2>1. Who we are</h2>
            <p><strong>Operated by:</strong> Sumit Kumar Tiwari<br /><strong>Address:</strong> Noida, Uttar Pradesh, India</p>
            <p>RichLifeTools ("RichLifeTools", "we", "us", or "our") operates <strong>richlifetools.com</strong> and provides online calculators, articles, digital products, and Smart Parking Sticker services.</p>
            <p>For privacy questions or requests concerning your personal data, contact us at <a className="text-[#4f46e5] font-medium" href="mailto:richlifetools.support@gmail.com">richlifetools.support@gmail.com</a>.</p>
          </section>

          <section>
            <h2>2. Data controller and representatives</h2>
            <p><strong>Data controller/operator:</strong> Sumit Kumar Tiwari, Noida, Uttar Pradesh, India.</p>
            <p>RichLifeTools is responsible for the personal information covered by this Policy. Our privacy contact is <a className="text-[#4f46e5] font-medium" href="mailto:richlifetools.support@gmail.com">richlifetools.support@gmail.com</a>. If a local representative or Data Protection Officer is legally required and appointed for a jurisdiction, we will provide the applicable details in this Policy.</p>
          </section>

          <section>
            <h2>3. Scope</h2>
            <p>This Policy is intended for users worldwide. The rights and obligations that apply to you may depend on where you live and on the laws applicable to the particular processing. Where mandatory local law gives you stronger rights or protections, those rights are not limited by this Policy.</p>
          </section>

          <section>
            <h2>4. Information we collect</h2>
            <p>Depending on how you use the site, we may process:</p>
            <ul>
              <li><strong>Contact information:</strong> name, email address, phone number, and the contents of messages you send us.</li>
              <li><strong>Smart Parking Sticker information:</strong> name, phone number, email address if supplied, vehicle identifier/registration information, sticker style, delivery selection, and order-related identifiers.</li>
              <li><strong>Transaction information:</strong> order number, payment status, payment identifier, product purchased, currency, and related transaction metadata. We do not intentionally collect or store your full card number or banking credentials.</li>
              <li><strong>Technical information:</strong> information that may be automatically provided by your browser, hosting provider, security services, or third-party payment/form providers, such as IP address, device/browser information, timestamps, and request information.</li>
              <li><strong>Calculator inputs:</strong> information you enter into our calculators may be processed in your browser to generate results. Unless a feature specifically states otherwise, we do not require you to create an account or submit calculator inputs to us.</li>
            </ul>
          </section>

          <section>
            <h2>5. How and why we use personal information</h2>
            <p>We use personal data only as reasonably necessary for purposes such as:</p>
            <ul>
              <li>responding to enquiries and providing customer support;</li>
              <li>processing and confirming purchases and payments;</li>
              <li>creating, delivering, and supporting Smart Parking Stickers and digital products;</li>
              <li>communicating about an order, support request, or service issue;</li>
              <li>preventing fraud, misuse, security incidents, and unauthorized transactions;</li>
              <li>maintaining, troubleshooting, and improving the website and services;</li>
              <li>complying with legal, tax, accounting, regulatory, and dispute-resolution obligations; and</li>
              <li>protecting our rights, users, property, and services.</li>
            </ul>
            <p>Where a law such as the GDPR or UK GDPR requires a lawful basis, the basis may include performance of a contract, compliance with a legal obligation, our legitimate interests such as security and service operation, consent where required, or another lawful basis permitted by applicable law. We do not sell personal information for money.</p>
          </section>

          <section>
            <h2>6. Sensitive information</h2>
            <p>Please do not submit sensitive personal information through ordinary website forms or Smart Parking Sticker fields unless specifically requested and necessary. We do not intentionally request health, biometric, precise geolocation, financial-account credentials, government identification, or similar sensitive information through ordinary website forms.</p>
          </section>

          <section>
            <h2>7. Smart Parking Sticker and QR data</h2>
            <p>The Smart Parking Sticker can encode information such as your name, phone number, email address (if supplied), vehicle identifier, and sticker/order information. The QR payload is encrypted before the QR code is generated. However, you should treat the information encoded in a sticker as information that may be viewed by anyone who obtains or scans the sticker.</p>
            <p>We recommend including only information you are comfortable making available to a person who scans the sticker. We do not guarantee that encryption or any internet-connected service can never be compromised.</p>
          </section>

          <section>
            <h2>8. Service providers and sharing</h2>
            <p>We may share the minimum information reasonably necessary with trusted service providers that help us operate the site and fulfil transactions. These may include:</p>
            <ul>
              <li><strong>Razorpay</strong> for payment processing and related transaction services;</li>
              <li><strong>Lemon Squeezy</strong> for checkout, payment processing, order management, and digital-product transactions where its checkout is used. Lemon Squeezy states that it acts as merchant of record for applicable purchases;</li>
              <li><strong>FormSubmit</strong> for transmitting contact and order-notification form submissions to our support email;</li>
              <li>website hosting, content delivery, security, email, analytics, or other infrastructure providers we may use from time to time.</li>
            </ul>
            <p>These providers may process information under their own privacy policies and terms. We may also disclose information where required by law, court order, government authority, fraud investigation, or to establish or defend legal claims.</p>
          </section>

          <section>
            <h2>9. Payments</h2>
            <p>Payment details are handled through the payment provider presented at checkout. We do not intentionally store complete card numbers, CVV codes, UPI PINs, or banking passwords on our website servers. Payment providers may collect additional information required to authenticate and process a transaction, prevent fraud, meet regulatory requirements, and issue receipts.</p>
          </section>

          <section>
            <h2>10. Cookies and similar technologies</h2>
            <p>RichLifeTools does not intentionally use advertising cookies or sell browsing profiles. The website and its third-party services may nevertheless use cookies, local/session storage, scripts, or similar technologies where necessary for functionality, security, payment checkout, preferences, or service operation. Third-party providers may set their own technologies when you interact with their services.</p>
          </section>

          <section>
            <h2>11. Data retention</h2>
            <p>We retain personal data only for as long as reasonably necessary for the purpose for which it was collected, including customer support, order fulfilment, accounting, fraud prevention, legal compliance, and dispute resolution. Retention periods can vary by the type of information and by the requirements of our service providers and applicable law.</p>
          </section>

          <section>
            <h2>12. Security and breach response</h2>
            <p>We use reasonable technical and organizational measures appropriate to the nature of the information we process. No method of transmission or storage over the internet is completely secure. If a data incident occurs, we will assess it and make notifications to affected individuals, regulators, or authorities where required by applicable law.</p>
          </section>

          <section>
            <h2>13. Lawful bases and regional privacy laws</h2>
            <p>For people in the European Economic Area, the United Kingdom, and other jurisdictions that require a defined legal basis, we process personal information on an appropriate legal basis such as contract, legal obligation, legitimate interests, consent where required, or another permitted basis. For India, we intend to comply with the Digital Personal Data Protection framework to the extent applicable. For California and other U.S. states with comprehensive privacy laws, we provide applicable rights and disclosures and do not knowingly sell personal information for money.</p>
          </section>

          <section>
            <h2>14. Your privacy rights</h2>
            <p>Depending on your location and applicable law, you may have rights to be informed, access your personal information, obtain a copy, correct inaccurate information, request deletion, restrict processing, object to certain processing, withdraw consent, request portability, opt out of certain sales/sharing or targeted advertising, and exercise rights relating to automated decision-making. These rights are subject to legal conditions and exceptions.</p><p>For California residents, where applicable privacy law applies to us, this may include rights to know/access, correct, delete, opt out of sale or sharing, limit certain uses of sensitive personal information, and non-discrimination. If a legally required opt-out or preference mechanism applies to our processing, we will provide it.</p>
            <p>To make a request, email <a className="text-[#4f46e5] font-medium" href="mailto:richlifetools.support@gmail.com">richlifetools.support@gmail.com</a> with enough information for us to understand and verify the request. We may need to verify your identity before acting on a request.</p>
          </section>

          <section>
            <h2>15. Automated decision-making and profiling</h2>
            <p>We do not intentionally use personal information to make decisions that produce legal or similarly significant effects through solely automated decision-making. Our calculators generate informational outputs based on user inputs and are not intended to determine eligibility for credit, employment, insurance, or essential services.</p>
          </section>

          <section>
            <h2>16. Children</h2>
            <p>Our services are not directed to children. We do not knowingly request personal data from children in circumstances where parental consent is required. If you believe a child has provided personal data to us, please contact us so that we can review the information and take appropriate action.</p>
          </section>

          <section>
            <h2>17. Complaints and supervisory authorities</h2>
            <p>If you believe we have handled your personal information unlawfully, contact us first. Where applicable law gives you the right to complain to a privacy regulator, you may do so with the authority in your country, state, or region of residence, work, or the place of the alleged infringement.</p>
          </section>

          <section>
            <h2>18. International processing</h2>
            <p>Our service providers may process information in countries other than the country in which you live. Where required, we will take steps appropriate under applicable law in relation to such processing.</p>
          </section>

          <section>
            <h2>19. Changes to this Policy</h2>
            <p>We may update this Policy when our services, providers, or legal obligations change. The revised Policy will be posted on this page with an updated "Last updated" date. Your continued use of the website after an update means the revised Policy will apply to future use, to the extent permitted by law.</p>
          </section>

          <section>
            <h2>20. Contact</h2>
            <p>If you have a privacy question, request, or complaint, contact us:</p>
            <p className="flex items-center gap-2"><Mail size={16} className="text-[#4f46e5]" /><a className="text-[#4f46e5] font-medium" href="mailto:richlifetools.support@gmail.com">richlifetools.support@gmail.com</a></p>
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
