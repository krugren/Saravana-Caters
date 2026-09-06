import { db } from "@/db";
import { customers, service_models, dishes, enquiries } from "@/db/schema";
import { eq } from "drizzle-orm";
import BuilderForm from "./builder-form";

export default async function NewQuotationPage(props: { searchParams: Promise<{ enquiryId?: string }> }) {
  const searchParams = await props.searchParams;
  
  const [custList, models, dishList] = await Promise.all([
    db.select().from(customers),
    db.select().from(service_models).where(eq(service_models.isActive, true)),
    db.select().from(dishes).where(eq(dishes.isActive, true)),
  ]);

  let prefilledEnquiry = null;
  if (searchParams.enquiryId) {
    const res = await db.select().from(enquiries).where(eq(enquiries.id, searchParams.enquiryId)).limit(1);
    prefilledEnquiry = res[0] || null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold text-on-surface">Quotation Generator</h1>
        <p className="text-on-surface-variant">Build a custom pricing quote.</p>
      </div>

      <BuilderForm 
        customers={custList} 
        serviceModels={models} 
        dishes={dishList} 
        prefilledEnquiry={prefilledEnquiry} 
      />
    </div>
  );
}
