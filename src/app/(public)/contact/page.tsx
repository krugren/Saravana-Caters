import type { Metadata } from "next";
import ContactForm from "./_contact-form";
import { Phone, MapPin, Clock, MessageCircle, Mail } from "lucide-react";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Contact Us — Book Your Event",
  description:
    "Get in touch with Saravana Caters for weddings, corporate events, and house functions in Erode. We usually respond within 2 hours. Call +91 98427 22977.",
  alternates: { canonical: "https://saravanacaters.in/contact" },
  openGraph: {
    url: "https://saravanacaters.in/contact",
    title: "Contact Saravana Caters — Book Your Event in Erode",
    description: "Get in touch with Erode's most trusted caterers. We respond within 2 hours. Call or WhatsApp +91 98427 22977.",
  },
};

const REACH_ITEMS = [
  {
    icon: Phone,
    title: "Call or WhatsApp",
    lines: ["+91 98427 22977", "+91 98428 22977", "Mon – Sun, 8 AM – 8 PM"],
    href: "tel:+919842722977",
    cta: "Call now",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Chat",
    lines: ["Quick replies on WhatsApp", "Send your event details"],
    href: "https://wa.me/919842722977?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20catering.",
    cta: "Open WhatsApp",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["saravanacaters@gmail.com"],
    href: "mailto:saravanacaters@gmail.com",
    cta: "Send an email",
  },
  {
    icon: MapPin,
    title: "Service Area",
    lines: ["Erode, Gobichettipalayam", "Bhavani, Sathyamangalam"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Monday – Sunday", "8:00 AM to 8:00 PM"],
  },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "Contact Us", url: "https://saravanacaters.in/contact" }]}
      />
      <div className="bg-[#fbf9f1]">
      {/* Hero */}
      <div className="bg-[#1b4332] pt-28 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,0 Q15,60 10,120 M35,0 Q40,60 35,120 M60,0 Q65,60 60,120 M85,0 Q90,60 85,120 M110,0 Q115,60 110,120' stroke='white' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="font-tamil text-[#c8a951] text-base mb-3">தொடர்பு கொள்ளுங்கள்</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Let's Plan Your Event</h1>
          <p className="text-white/75 text-lg leading-relaxed">
            Tell us about your event and we'll get back to you with a personalised
            menu and quote. We usually respond within 2 hours.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Reach info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1b1c17] mb-1">Reach Us</h2>
              <p className="text-sm text-[#40493d]">Prefer to talk? We're happy to take a call.</p>
            </div>
            {REACH_ITEMS.map(({ icon: Icon, title, lines, href, cta }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-5 bg-[#f5f4ec] rounded-xl border border-[#e4e3db] hover:border-[#0d631b]/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-[#beead1] flex items-center justify-center text-[#0d631b] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1b1c17] text-sm mb-1">{title}</p>
                  {lines.map((l) => (
                    <p key={l} className="text-sm text-[#40493d]">{l}</p>
                  ))}
                  {href && cta && (
                    <a
                      href={href}
                      className="inline-block mt-2 text-xs font-bold text-[#0d631b] hover:underline"
                    >
                      {cta} →
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Book in advance note */}
            <div className="bg-[#0d631b]/5 border border-[#0d631b]/15 rounded-xl p-5">
              <p className="text-sm text-[#1b4332] font-medium leading-relaxed">
                <strong>Planning tip:</strong> Most event dates fill up 3–4 weeks in advance,
                especially for weekends and auspicious days. The earlier you reach out, the better
                we can serve you.
              </p>
            </div>
          </div>

          {/* Enquiry form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#e4e3db] shadow-sm p-8">
              <h2 className="font-display text-2xl font-bold text-[#1b1c17] mb-1">Send an Enquiry</h2>
              <p className="text-sm text-[#40493d] mb-8">
                Fill in your details and we'll prepare a personalised response.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
