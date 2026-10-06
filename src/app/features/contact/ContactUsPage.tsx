import { useState } from "react";
import { Mail, Send, MessageSquare, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  "General enquiry",
  "Product support",
  "Smart Parking Sticker",
  "Website feedback",
  "Partnership / collaboration",
  "Content / article",
  "Tool / calculator",
  "Other",
];

const subjectFor = (category: string) =>
  `RichLifeTools Contact — ${category}`;

export function ContactUsPage() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [submitted, setSubmitted] = useState(() => new URLSearchParams(window.location.search).get("sent") === "1");

  return (
    <div className="pt-16 min-h-screen bg-[#f8f9fb]">
      <section className="relative overflow-hidden bg-[#0f1523] text-white">
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-mono uppercase tracking-widest mb-4">
              <Mail size={14} /> Get in touch
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Contact Us
            </h1>
            <p className="text-[#c4cad9] text-base sm:text-lg leading-relaxed">
              Have a question, suggestion, or need help with something? Send us a message and we’ll get back to you.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12 items-start">
          <div className="lg:pt-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center mb-5">
              <MessageSquare size={22} />
            </div>
            <h2 className="text-2xl font-bold text-[#0f1523] mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              We’d love to hear from you
            </h2>
            <p className="text-[#6b7a99] leading-relaxed text-sm sm:text-base">
              Whether you’ve found an issue, have an idea for a new tool, need help with a product, or simply want to say hello, use the form and choose the category that best fits your message.
            </p>
          </div>

          <div className="bg-white border border-[#e4e8f0] rounded-3xl p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <CheckCircle2 size={30} />
                </div>
                <h2 className="text-2xl font-bold text-[#0f1523] mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Message sent successfully!
                </h2>
                <p className="text-[#6b7a99] text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                  Thank you for reaching out to RichLifeTools. We’ve received your message and will get back to you within <strong className="text-[#0f1523]">24–48 hours</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-7 rounded-2xl bg-[#4f46e5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4338ca] transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
            <form
                action="https://formsubmit.co/richlifetools.support@gmail.com"
                method="POST"
                className="space-y-5"
              >
                <input type="hidden" name="_subject" value={subjectFor(category)} />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value="https://www.richlifetools.com/contact?sent=1" />

                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-[#0f1523] mb-2">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-[#e4e8f0] bg-[#f8f9fb] px-4 py-3 text-sm text-[#0f1523] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-[#0f1523] mb-2">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-[#e4e8f0] bg-[#f8f9fb] px-4 py-3 text-sm text-[#0f1523] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <div>
                  <label htmlFor="contact-category" className="block text-sm font-semibold text-[#0f1523] mb-2">What is this about?</label>
                  <select
                    id="contact-category"
                    name="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-2xl border border-[#e4e8f0] bg-[#f8f9fb] px-4 py-3 text-sm text-[#0f1523] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                  >
                    {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-content" className="block text-sm font-semibold text-[#0f1523] mb-2">Message</label>
                  <textarea
                    id="contact-content"
                    name="content"
                    required
                    rows={7}
                    placeholder="Tell us how we can help..."
                    className="w-full resize-y rounded-2xl border border-[#e4e8f0] bg-[#f8f9fb] px-4 py-3 text-sm text-[#0f1523] outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#4f46e5] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-[#4338ca] flex items-center justify-center gap-2"
                >
                  Send Message <Send size={15} />
                </button>
            </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
