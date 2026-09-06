import { getKitchenPlans } from "@/features/kitchen/actions";
import KitchenClient from "./kitchen-client";

export default async function KitchenPage() {
  const plans = await getKitchenPlans();
  return <KitchenClient plans={plans} />;
}
