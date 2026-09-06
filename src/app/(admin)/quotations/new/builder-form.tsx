"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateQuotation } from "@/features/quotations/actions";
import { Button } from "@/components/ui/button";

export default function BuilderForm({ customers, serviceModels, dishes, prefilledEnquiry }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(prefilledEnquiry?.customerId || "");
  const [serviceModelId, setServiceModelId] = useState("");
  const [eventType, setEventType] = useState(prefilledEnquiry?.eventType || "WEDDING");
  const [eventDate, setEventDate] = useState(prefilledEnquiry?.eventDate || "");
  const [guests, setGuests] = useState<number>(prefilledEnquiry?.expectedGuests || 100);
  const [venue, setVenue] = useState(prefilledEnquiry?.venue || "");
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  const toggleDish = (id: string) => {
    setSelectedDishes(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await generateQuotation({
        enquiryId: prefilledEnquiry?.id,
        customerId,
        serviceModelId,
        eventType,
        eventDate,
        guests,
        venue,
        selectedDishIds: selectedDishes,
        discountPercent: discount,
      });
      if (res.success) {
        router.push("/quotations");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating quote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* 1. Event Details */}
      <div className="p-6 border border-outline/20 rounded-lg bg-surface-container-low/30 space-y-4">
        <h2 className="text-xl font-medium text-on-surface">1. Event Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-on-surface-variant font-medium">Customer</label>
            <select required value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full p-2 rounded border border-outline/50 bg-background text-on-surface">
              <option value="">Select Customer...</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-on-surface-variant font-medium">Event Type</label>
            <input required type="text" value={eventType} onChange={e => setEventType(e.target.value)} className="w-full p-2 rounded border border-outline/50 bg-background text-on-surface" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-on-surface-variant font-medium">Event Date</label>
            <input required type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full p-2 rounded border border-outline/50 bg-background text-on-surface" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-on-surface-variant font-medium">Expected Guests</label>
            <input required type="number" min="1" value={guests} onChange={e => setGuests(Number(e.target.value))} className="w-full p-2 rounded border border-outline/50 bg-background text-on-surface" />
          </div>
        </div>
      </div>

      {/* 2. Service & Pricing */}
      <div className="p-6 border border-outline/20 rounded-lg bg-surface-container-low/30 space-y-4">
        <h2 className="text-xl font-medium text-on-surface">2. Service & Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-on-surface-variant font-medium">Service Model</label>
            <select required value={serviceModelId} onChange={e => setServiceModelId(e.target.value)} className="w-full p-2 rounded border border-outline/50 bg-background text-on-surface">
              <option value="">Select Package...</option>
              {serviceModels.map((m: any) => <option key={m.id} value={m.id}>{m.displayName} ({m.pricingBasis.replace("_", " ")})</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-on-surface-variant font-medium">Discount (%)</label>
            <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full p-2 rounded border border-outline/50 bg-background text-on-surface" />
          </div>
        </div>
      </div>

      {/* 3. Menu Selection */}
      <div className="p-6 border border-outline/20 rounded-lg bg-surface-container-low/30 space-y-4">
        <h2 className="text-xl font-medium text-on-surface">3. Menu Selection</h2>
        <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
          {dishes.map((dish: any) => (
            <label key={dish.id} className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${selectedDishes.includes(dish.id) ? 'border-primary bg-primary/5' : 'border-outline/30 hover:bg-surface-container'}`}>
              <input type="checkbox" checked={selectedDishes.includes(dish.id)} onChange={() => toggleDish(dish.id)} className="mt-1 accent-primary" />
              <div>
                <div className="font-medium text-on-surface text-sm">{dish.name}</div>
                <div className="text-xs text-on-surface-variant">{dish.category}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white w-48">
          {loading ? "Generating..." : "Generate Quotation"}
        </Button>
      </div>
    </form>
  );
}
