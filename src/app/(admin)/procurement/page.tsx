import { getStockMovements, getIngredients, getSuppliers } from "@/features/inventory/actions";
import ProcurementClient from "./procurement-client";

export default async function ProcurementPage() {
  const [movements, ingredients, suppliers] = await Promise.all([
    getStockMovements(),
    getIngredients(),
    getSuppliers(),
  ]);
  return <ProcurementClient movements={movements} ingredients={ingredients} suppliers={suppliers} />;
}
