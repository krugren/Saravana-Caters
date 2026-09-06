import { getCustomers } from "@/features/crm/actions";
import CustomersClient from "./customers-client";

export default async function CustomersPage() {
  const customersList = await getCustomers();
  return <CustomersClient customersList={customersList} />;
}
