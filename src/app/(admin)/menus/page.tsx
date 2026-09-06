import { getDishes, getServiceModels } from "@/features/menus/actions";
import MenusClient from "./menus-client";

export default async function MenusPage() {
  const [dishes, serviceModels] = await Promise.all([getDishes(), getServiceModels()]);
  return <MenusClient dishes={dishes} serviceModels={serviceModels} />;
}
