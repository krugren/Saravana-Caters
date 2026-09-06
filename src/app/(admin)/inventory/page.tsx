import { getIngredients, getSuppliers } from "@/features/inventory/actions";
import InventoryClient from "./inventory-client";

export default async function InventoryPage() {
  const [ingredients, suppliers] = await Promise.all([getIngredients(), getSuppliers()]);
  return <InventoryClient ingredients={ingredients} suppliers={suppliers} />;
}
