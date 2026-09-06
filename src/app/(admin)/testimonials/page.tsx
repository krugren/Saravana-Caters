import { getTestimonials } from "@/features/testimonials/actions";
import TestimonialsClient from "./testimonials-client";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsClient testimonials={testimonials} />;
}
