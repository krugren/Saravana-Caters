import { getEnquiries } from "@/features/crm/actions";
import EnquiriesClient from "./enquiries-client";

export default async function EnquiriesPage() {
  const enquiriesList = await getEnquiries();
  return <EnquiriesClient enquiriesList={enquiriesList} />;
}
