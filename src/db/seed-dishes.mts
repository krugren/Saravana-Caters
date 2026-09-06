/**
 * seed-dishes.mts
 * Seeds all 52 dishes from the public menu page into the dishes table.
 * Safe to re-run — uses INSERT OR IGNORE (won't overwrite existing edits).
 *
 * Run: pnpm tsx src/db/seed-dishes.mts
 */
import { createClient } from "@libsql/client";

const client = createClient({ url: process.env.DATABASE_URL ?? "file:local.db" });

// ─── Ensure missing columns exist first ────────────────────────────────────
const getColumns = async (table: string) => {
  const r = await client.execute(`PRAGMA table_info("${table}")`);
  return new Set(r.rows.map((x) => x.name as string));
};
const ensureCol = async (table: string, col: string, type: string) => {
  const cols = await getColumns(table);
  if (!cols.has(col)) {
    await client.execute(`ALTER TABLE "${table}" ADD COLUMN "${col}" ${type}`);
    console.log(`  ✅ Added column: ${table}.${col}`);
  }
};

console.log("Checking schema...");
await ensureCol("dishes", "nameTamil", "TEXT");
await ensureCol("dishes", "dietType", "TEXT");
await ensureCol("dishes", "description", "TEXT");
await ensureCol("dishes", "tags", "TEXT");
await ensureCol("dishes", "isActive", "INTEGER");

// ─── Full dish catalogue from the public menu ──────────────────────────────
type DishRow = {
  id: string;
  name: string;
  nameTamil?: string;
  category: string;
  dietType: string;
  description: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const now = new Date().toISOString();
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const dishes: DishRow[] = [
  // ── BREAKFAST & TIFFIN ─────────────────────────────────────────────────
  { id: slug("Idli"), name: "Idli", nameTamil: "இட்லி", category: "BREAKFAST", dietType: "VEG",
    description: "Steamed rice cakes — soft, fluffy, served with sambar and chutneys",
    tags: ["All-Time Favourite", "Signature Dish"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Medu Vada"), name: "Medu Vada", nameTamil: "மேது வடை", category: "BREAKFAST", dietType: "VEG",
    description: "Crispy lentil doughnuts, served hot with coconut chutney and sambar",
    tags: ["Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Masala Dosa"), name: "Masala Dosa", nameTamil: "மசால் தோசை", category: "BREAKFAST", dietType: "VEG",
    description: "Thin crisp crêpe filled with spiced potato masala",
    tags: ["All-Time Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Plain Dosa"), name: "Plain Dosa", nameTamil: "தோசை", category: "BREAKFAST", dietType: "VEG",
    description: "Classic golden crêpe, served with chutney",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Rava Upma"), name: "Rava Upma", nameTamil: "ரவை உப்மா", category: "BREAKFAST", dietType: "VEG",
    description: "Semolina cooked with mustard, curry leaves and vegetables",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Pongal Ven"), name: "Pongal (Ven)", nameTamil: "வெண் பொங்கல்", category: "BREAKFAST", dietType: "VEG",
    description: "Savoury rice-lentil porridge with ghee, pepper and cumin",
    tags: ["Signature Dish"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Poori and Kurma"), name: "Poori & Kurma", nameTamil: "பூரி & குர்மா", category: "BREAKFAST", dietType: "VEG",
    description: "Puffed wheat bread with a mild vegetable korma",
    tags: ["Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Sabudana Khichdi"), name: "Sabudana Khichdi", nameTamil: "ஜவ்வரிசி கிச்சடி", category: "BREAKFAST", dietType: "VEG",
    description: "Sago pearls tempered with peanuts, green chilli and coconut",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Bread Upma"), name: "Bread Upma", nameTamil: "பிரட் உப்மா", category: "BREAKFAST", dietType: "VEG",
    description: "Pan-fried bread pieces tossed with onion and spices",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Ragi Koozh"), name: "Ragi Koozh", nameTamil: "ராகி கூழ்", category: "BREAKFAST", dietType: "VEG",
    description: "Traditional millet porridge — a heritage breakfast",
    tags: ["Heritage Recipe"], isActive: true, createdAt: now, updatedAt: now },

  // ── RICE & BIRYANIS ────────────────────────────────────────────────────
  { id: slug("Steamed Rice"), name: "Steamed Rice", nameTamil: "வெள்ளை சாதம்", category: "RICE", dietType: "VEG",
    description: "Freshly cooked par-boiled or sona masoori rice",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Sambar Sadam"), name: "Sambar Sadam", nameTamil: "சாம்பார் சாதம்", category: "RICE", dietType: "VEG",
    description: "Rice cooked and mixed with sambar — comfort food at its finest",
    tags: ["All-Time Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Lemon Rice"), name: "Lemon Rice", nameTamil: "எலுமிச்சை சாதம்", category: "RICE", dietType: "VEG",
    description: "Turmeric-tinted rice with mustard, curry leaves and lemon",
    tags: ["Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Tamarind Rice Puliyodharai"), name: "Tamarind Rice (Puliyodharai)", nameTamil: "புளியோதரை", category: "RICE", dietType: "VEG",
    description: "Tangy, spiced tamarind rice — a temple classic",
    tags: ["Heritage Recipe", "Signature Dish"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Coconut Rice"), name: "Coconut Rice", nameTamil: "தேங்காய் சாதம்", category: "RICE", dietType: "VEG",
    description: "Freshly grated coconut tossed with seasoned rice",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Tomato Rice"), name: "Tomato Rice", nameTamil: "தக்காளி சாதம்", category: "RICE", dietType: "VEG",
    description: "Tangy tomato-based rice with spices and peanuts",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Curd Rice"), name: "Curd Rice", nameTamil: "தயிர் சாதம்", category: "RICE", dietType: "VEG",
    description: "Creamy rice mixed with yoghurt, finished with a curry leaf tadka",
    tags: ["All-Time Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Veg Biryani"), name: "Veg Biryani", nameTamil: "வெஜ் பிரியாணி", category: "RICE", dietType: "VEG",
    description: "Fragrant basmati rice layered with saffron and mixed vegetables",
    tags: ["Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Seeraga Samba Biryani"), name: "Seeraga Samba Biryani", nameTamil: "சீரக சம்பா பிரியாணி", category: "RICE", dietType: "NON_VEG",
    description: "Short-grain aromatic biryani — a Tirunelveli specialty. Available veg or non-veg",
    tags: ["Signature Dish", "Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  // ── CURRIES & GRAVIES ──────────────────────────────────────────────────
  { id: slug("Sambar"), name: "Sambar", nameTamil: "சாம்பார்", category: "GRAVIES", dietType: "VEG",
    description: "The backbone of the South Indian plate — lentil and tamarind broth with seasonal vegetables",
    tags: ["Signature Dish", "All-Time Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Rasam"), name: "Rasam", nameTamil: "ரசம்", category: "GRAVIES", dietType: "VEG",
    description: "Thin, peppery soup — aids digestion, always part of a proper feast",
    tags: ["Heritage Recipe"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Kara Kuzhambu"), name: "Kara Kuzhambu", nameTamil: "கார குழம்பு", category: "GRAVIES", dietType: "VEG",
    description: "Spicy tamarind-based gravy with drumstick or small onions",
    tags: ["Signature Dish"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Vatha Kuzhambu"), name: "Vatha Kuzhambu", nameTamil: "வத்தக் குழம்பு", category: "GRAVIES", dietType: "VEG",
    description: "Concentrated tamarind gravy with sun-dried berries",
    tags: ["Heritage Recipe"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Mor Kuzhambu"), name: "Mor Kuzhambu", nameTamil: "மோர் குழம்பு", category: "GRAVIES", dietType: "VEG",
    description: "Mild buttermilk curry with cumin and coconut — balances the spice",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Kootu"), name: "Kootu", nameTamil: "கூட்டு", category: "GRAVIES", dietType: "VEG",
    description: "Lentil and vegetable stir-fry in coconut-based sauce",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Aviyal"), name: "Aviyal", nameTamil: "அவியல்", category: "GRAVIES", dietType: "VEG",
    description: "Mixed vegetables in a coconut-yoghurt gravy — a Kerala-Tamil classic",
    tags: ["All-Time Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Poriyal 3 types"), name: "Poriyal (3 types)", nameTamil: "பொரியல்", category: "GRAVIES", dietType: "VEG",
    description: "Dry-cooked seasonal vegetables with mustard and grated coconut",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Papad and Pickle"), name: "Papad & Pickle", nameTamil: "அப்பளம் & ஊறுகாய்", category: "GRAVIES", dietType: "VEG",
    description: "Served alongside — roasted papad, mango or lime pickle",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  // ── STARTERS & SNACKS ─────────────────────────────────────────────────
  { id: slug("Onion Pakoda"), name: "Onion Pakoda", nameTamil: "வெங்காய பஜ்ஜி", category: "STARTERS", dietType: "VEG",
    description: "Crunchy fritters with thinly sliced onions and curry leaves",
    tags: ["Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Mirchi Bajji"), name: "Mirchi Bajji", nameTamil: "மிளகாய் பஜ்ஜி", category: "STARTERS", dietType: "VEG",
    description: "Whole green chillies dipped in gram flour batter and fried",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Bonda"), name: "Bonda", nameTamil: "போண்டா", category: "STARTERS", dietType: "VEG",
    description: "Spiced potato balls in crispy gram flour shell",
    tags: ["Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Samosa"), name: "Samosa", nameTamil: "சமோசா", category: "STARTERS", dietType: "VEG",
    description: "Triangular pastry filled with potato and peas",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Paneer Tikka"), name: "Paneer Tikka", nameTamil: "பனீர் டிக்கா", category: "STARTERS", dietType: "VEG",
    description: "Marinated cottage cheese grilled with capsicum and onion",
    tags: ["Premium"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Kuzhi Paniyaram"), name: "Kuzhi Paniyaram", nameTamil: "குழி பணியாரம்", category: "STARTERS", dietType: "VEG",
    description: "Small soft-centered rice cake balls — sweet or savoury",
    tags: ["Heritage Recipe"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Mini Idli 65"), name: "Mini Idli (65)", nameTamil: "மினி இட்லி 65", category: "STARTERS", dietType: "VEG",
    description: "Bite-sized idlis tossed in a spiced, crispy coating",
    tags: ["Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Bread Roll"), name: "Bread Roll", nameTamil: "பிரட் ரோல்", category: "STARTERS", dietType: "VEG",
    description: "Spiced potato filling wrapped in crustless bread and fried",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  // ── SWEETS & DESSERTS ─────────────────────────────────────────────────
  { id: slug("Kesari Rava Halwa"), name: "Kesari (Rava Halwa)", nameTamil: "கேசரி", category: "SWEETS", dietType: "VEG",
    description: "Semolina sweet with saffron, ghee, cashews and raisins",
    tags: ["All-Time Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Sakkarai Pongal"), name: "Sakkarai Pongal", nameTamil: "சக்கரை பொங்கல்", category: "SWEETS", dietType: "VEG",
    description: "Sweet rice-jaggery porridge with cardamom and ghee — a temple staple",
    tags: ["Heritage Recipe", "Signature Dish"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Payasam 3 types"), name: "Payasam (3 types)", nameTamil: "பாயசம்", category: "SWEETS", dietType: "VEG",
    description: "Semiya, rice, or moong dal payasam — rich milk-based dessert",
    tags: ["All-Time Favourite", "Premium"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Laddu"), name: "Laddu", nameTamil: "லட்டு", category: "SWEETS", dietType: "VEG",
    description: "Round chickpea flour sweets — besan or boondi style",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Mysore Pak"), name: "Mysore Pak", nameTamil: "மைசூர் பாக்", category: "SWEETS", dietType: "VEG",
    description: "Melt-in-the-mouth gram flour fudge with generous ghee",
    tags: ["Signature Dish", "Premium"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Gulab Jamun"), name: "Gulab Jamun", nameTamil: "குலாப் ஜாமுன்", category: "SWEETS", dietType: "VEG",
    description: "Soft khoya dumplings soaked in rose-flavoured syrup",
    tags: ["Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Jangiri"), name: "Jangiri", nameTamil: "ஜாங்கிரி", category: "SWEETS", dietType: "VEG",
    description: "Urad dal flower-shaped sweet fried and dipped in sugar syrup",
    tags: ["Heritage Recipe"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Halwa varieties"), name: "Halwa (varieties)", nameTamil: "அல்வா", category: "SWEETS", dietType: "VEG",
    description: "Carrot, wheat, or banana halwa — cooked slow and rich",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  // ── BEVERAGES ─────────────────────────────────────────────────────────
  { id: slug("Filter Coffee"), name: "Filter Coffee", nameTamil: "ஃபில்டர் காபி", category: "BEVERAGES", dietType: "VEG",
    description: "South Indian decoction coffee — the true welcome drink",
    tags: ["Signature Dish", "All-Time Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Masala Chai"), name: "Masala Chai", nameTamil: "மசாலா தேநீர்", category: "BEVERAGES", dietType: "VEG",
    description: "Spiced milk tea with ginger, cardamom and tulsi",
    tags: ["All-Time Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Buttermilk Mor"), name: "Buttermilk (Mor)", nameTamil: "மோர்", category: "BEVERAGES", dietType: "VEG",
    description: "Salted, spiced churned buttermilk — served chilled",
    tags: ["Heritage Recipe"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Fresh Lime Soda"), name: "Fresh Lime Soda", nameTamil: "எலுமிச்சை சோடா", category: "BEVERAGES", dietType: "VEG",
    description: "Sweet or salt — a refreshing palate cleanser",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Panakam"), name: "Panakam", nameTamil: "பானகம்", category: "BEVERAGES", dietType: "VEG",
    description: "Jaggery-lime-ginger traditional temple drink",
    tags: ["Heritage Recipe"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Rose Milk"), name: "Rose Milk", nameTamil: "ரோஸ் மில்க்", category: "BEVERAGES", dietType: "VEG",
    description: "Chilled sweetened milk with rose syrup — a South Indian favourite",
    tags: ["Crowd Favourite"], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Fruit Juice seasonal"), name: "Fruit Juice (seasonal)", nameTamil: "பழச்சாறு", category: "BEVERAGES", dietType: "VEG",
    description: "Watermelon, mango, grape — based on availability",
    tags: [], isActive: true, createdAt: now, updatedAt: now },

  { id: slug("Tender Coconut"), name: "Tender Coconut", nameTamil: "இளநீர்", category: "BEVERAGES", dietType: "VEG",
    description: "Served whole for premium events and weddings",
    tags: ["Premium"], isActive: true, createdAt: now, updatedAt: now },
];

// ─── Insert all dishes via raw SQL (avoids Drizzle schema resolution issues) ─
console.log(`\nSeeding ${dishes.length} dishes...`);
let inserted = 0;
let skipped = 0;

for (const dish of dishes) {
  try {
    await client.execute({
      sql: `INSERT OR IGNORE INTO dishes
            (id, name, nameTamil, category, dietType, description, tags, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        dish.id,
        dish.name,
        dish.nameTamil ?? null,
        dish.category,
        dish.dietType,
        dish.description,
        JSON.stringify(dish.tags),
        dish.isActive ? 1 : 0,
        dish.createdAt,
        dish.updatedAt,
      ],
    });
    inserted++;
    process.stdout.write(`  ✅ ${dish.name}\n`);
  } catch (e: any) {
    console.error(`  ❌ ${dish.name}: ${e.message}`);
    skipped++;
  }
}

console.log(`\n=== Done ===`);
console.log(`Inserted: ${inserted} | Skipped (already exist): ${skipped}`);
console.log(`Total dishes in catalogue: ${dishes.length}`);

client.close();
