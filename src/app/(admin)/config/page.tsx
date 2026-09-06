import { db } from "@/db";
import { config } from "@/db/schema";
import { asc } from "drizzle-orm";
import BusinessSettingsClient from "./settings-client";

export default async function ConfigPage() {
  const configs = await db.select().from(config).orderBy(asc(config.category), asc(config.key));
  return <BusinessSettingsClient configs={configs} />;
}
