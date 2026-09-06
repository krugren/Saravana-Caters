import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saravana Caters",
    short_name: "Saravana Caters",
    description:
      "Erode's trusted traditional South Indian catering for weddings, corporate events, and house functions. Call +91 98427 22977.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f5ed",
    theme_color: "#1b4332",
    orientation: "portrait",
    scope: "/",
    lang: "en-IN",
    categories: ["food", "lifestyle", "business"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    screenshots: [
      {
        src: "/images/hero-cinematic.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "Saravana Caters — Traditional South Indian feast",
      },
    ],
    shortcuts: [
      {
        name: "Book a Consultation",
        short_name: "Book Now",
        description: "Fill out an enquiry form for your event",
        url: "/contact",
        icons: [{ src: "/favicon.ico", sizes: "any" }],
      },
      {
        name: "View Menu",
        short_name: "Menu",
        description: "Browse our traditional South Indian catering menu",
        url: "/menu",
        icons: [{ src: "/favicon.ico", sizes: "any" }],
      },
    ],
    related_applications: [
      {
        platform: "web",
        url: "https://saravanacaters.in",
      },
    ],
    prefer_related_applications: false,
  };
}
