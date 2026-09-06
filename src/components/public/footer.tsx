import Link from "next/link";
import { Phone, MapPin, Clock, Mail } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

const SERVICES = [
  "Grand Weddings",
  "Wedding Receptions",
  "Corporate Events",
  "Birthday Celebrations",
  "House Functions",
  "Temple Functions",
  "Engagements",
];

export default function PublicFooter() {
  return (
    <footer className="bg-[#1b4332] text-white">
      {/* Main footer */}
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <p className="font-display text-2xl font-bold text-white leading-tight">Saravana Caters</p>
            <p className="font-tamil text-sm text-white/60 mt-0.5">சாரவண கேட்டர்ஸ்</p>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Bringing the warmth of traditional South Indian cuisine to every milestone in your life. 
            Trusted by families across Erode for over two decades.
          </p>
          {/* Social */}
          <div className="flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c8a951] transition-colors duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#c8a951] transition-colors duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase text-[#c8a951] mb-5">Quick Links</h3>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase text-[#c8a951] mb-5">We Cater For</h3>
          <ul className="space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s} className="text-sm text-white/70">{s}</li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase text-[#c8a951] mb-5">Reach Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#c8a951] shrink-0 mt-0.5" />
              <div>
                <a href="tel:+919842722977" className="text-sm text-white hover:text-[#c8a951] transition-colors font-medium">
                  +91 98427 22977
                </a>
                <br />
                <a href="tel:+919842822977" className="text-sm text-white/70 hover:text-[#c8a951] transition-colors">
                  +91 98428 22977
                </a>
                <p className="text-xs text-white/50 mt-0.5">WhatsApp &amp; calls</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#c8a951] shrink-0 mt-0.5" />
              <a href="mailto:saravanacaters@gmail.com" className="text-sm text-white/80 hover:text-[#c8a951] transition-colors break-all">
                saravanacaters@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#c8a951] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Erode, Tamil Nadu<br />
                  Serving Erode, Gobichettipalayam,<br />
                  Bhavani & Sathyamangalam
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#c8a951] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/80">Mon – Sun, 8 AM – 8 PM</p>
                <p className="text-xs text-white/50 mt-0.5">Book at least 2 weeks in advance</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Saravana Caters, Erode. All rights reserved.</p>
          <p>Crafted with care for authentic traditions.</p>
        </div>
      </div>
    </footer>
  );
}
