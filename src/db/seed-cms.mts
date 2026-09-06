import { createClient } from "@libsql/client";

const db = createClient({ url: "file:local.db" });
const now = new Date().toISOString();

// ── Create tables ─────────────────────────────────────────────────────────────
await db.execute(`CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  initials TEXT NOT NULL DEFAULT '',
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isActive INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  isFeatured INTEGER NOT NULL DEFAULT 0,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  isActive INTEGER NOT NULL DEFAULT 1,
  uploadedAt TEXT NOT NULL
)`);

// ── Seed testimonials ─────────────────────────────────────────────────────────
const testimonials = [
  {
    id: "test-001",
    quote: "We've booked Saravana Caters for three family weddings. Every time, the food is what guests talk about on the drive home. The sambar alone is worth picking up the phone.",
    name: "Rajasekaran M.",
    detail: "Wedding · 450 guests · Erode",
    initials: "RM",
    sortOrder: 1,
  },
  {
    id: "test-002",
    quote: "Two days' notice, 200 corporate guests. They made it work — hot food, clean buffet, zero complaints. That's the kind of caterer you keep on speed-dial.",
    name: "Priya Krishnamurthy",
    detail: "Corporate Lunch · 200 guests · Erode",
    initials: "PK",
    sortOrder: 2,
  },
  {
    id: "test-003",
    quote: "My daughter's naming ceremony needed to feel like home but look professionally organised. That balance is exactly what we got. Even our 85-year-old grandmother was happy.",
    name: "Geetha Ramachandran",
    detail: "House Function · 80 guests · Gobichettipalayam",
    initials: "GR",
    sortOrder: 3,
  },
  {
    id: "test-004",
    quote: "350 people, strict dietary requirements, a very specific timeline. Everything went flawlessly. Genuinely impressive team.",
    name: "Suresh Babu",
    detail: "Corporate Event · 350 guests · Bhavani",
    initials: "SB",
    sortOrder: 4,
  },
];

for (const t of testimonials) {
  await db.execute({
    sql: "INSERT OR IGNORE INTO testimonials VALUES (?,?,?,?,?,?,1,?,?)",
    args: [t.id, t.quote, t.name, t.detail, t.initials, t.sortOrder, now, now],
  });
  console.log(`  ✅ Testimonial: ${t.name}`);
}

// ── Seed gallery images ───────────────────────────────────────────────────────
const images = [
  { id: "gal-001", url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&q=80", alt: "Traditional South Indian banana leaf meal", category: "Weddings", isFeatured: 1, sortOrder: 1 },
  { id: "gal-002", url: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=700&q=80", alt: "Crispy medu vada with coconut chutney", category: "Food", isFeatured: 0, sortOrder: 2 },
  { id: "gal-003", url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=700&q=80", alt: "Aromatic South Indian biryani", category: "Food", isFeatured: 0, sortOrder: 3 },
  { id: "gal-004", url: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=700&q=80", alt: "South Indian breakfast spread", category: "Food", isFeatured: 0, sortOrder: 4 },
  { id: "gal-005", url: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=700&q=80", alt: "Catering team at a traditional wedding", category: "Weddings", isFeatured: 0, sortOrder: 5 },
  { id: "gal-006", url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&q=80", alt: "Rich golden payasam dessert", category: "Sweets & Desserts", isFeatured: 0, sortOrder: 6 },
  { id: "gal-007", url: "https://images.unsplash.com/photo-1626132647523-66c7e0e00873?w=700&q=80", alt: "Freshly made idli with chutney", category: "Food", isFeatured: 0, sortOrder: 7 },
  { id: "gal-008", url: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=900&q=80", alt: "Wedding banquet hall with banana leaf settings", category: "Weddings", isFeatured: 0, sortOrder: 8 },
  { id: "gal-009", url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=700&q=80", alt: "Full South Indian thali with multiple curries", category: "Food", isFeatured: 0, sortOrder: 9 },
  { id: "gal-010", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&q=80", alt: "Traditional South Indian sweets platter", category: "Sweets & Desserts", isFeatured: 0, sortOrder: 10 },
  { id: "gal-011", url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&q=80", alt: "Fragrant biryani with whole spices", category: "Food", isFeatured: 0, sortOrder: 11 },
  { id: "gal-012", url: "https://images.unsplash.com/photo-1630914441924-56a15cde7f80?w=700&q=80", alt: "South Indian sambar with drumstick", category: "Food", isFeatured: 0, sortOrder: 12 },
];

for (const img of images) {
  await db.execute({
    sql: "INSERT OR IGNORE INTO gallery_images VALUES (?,?,?,?,?,?,1,?)",
    args: [img.id, img.url, img.alt, img.category, img.isFeatured, img.sortOrder, now],
  });
  console.log(`  ✅ Gallery image: ${img.alt}`);
}

// ── Seed stats config keys ────────────────────────────────────────────────────
const adminRow = await db.execute("SELECT id FROM users LIMIT 1");
const adminId = adminRow.rows[0]?.id as string;

if (adminId) {
  const statsConfig = [
    { key: "stats.eventsCount",   value: "1000",   label: "Events Completed (count)",   category: "stats" },
    { key: "stats.yearsOfService", value: "20",    label: "Years of Service (count)",   category: "stats" },
    { key: "stats.guestsServed",  value: "100000", label: "Guests Served (count)",      category: "stats" },
    { key: "stats.menuVarieties", value: "50",     label: "Menu Varieties (count)",     category: "stats" },
  ];
  for (const s of statsConfig) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO config (key, value, category, label, updatedAt, updatedBy) VALUES (?,?,?,?,?,?)",
      args: [s.key, s.value, s.category, s.label, now, adminId],
    });
    console.log(`  ✅ Config key: ${s.key}`);
  }
} else {
  console.warn("  ⚠ No admin user found — stats config keys skipped (run db:seed first)");
}

console.log("\n✅ All done!");
db.close();
