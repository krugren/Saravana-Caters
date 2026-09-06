import { z } from "zod";

export const EVENT_TYPES = [
  "GRAND_WEDDING",
  "RECEPTION",
  "TEMPLE_FESTIVAL",
  "PRIVATE_EVENT",
  "CORPORATE_EVENT",
  "EDUCATIONAL_FESTIVAL",
] as const;
export type EventType = typeof EVENT_TYPES[number];

export const SERVICE_MODELS = [
  "LABOUR",
  "FULL_CONTRACT",
  "TRADITIONAL",
  "CORPORATE",
] as const;
export type ServiceModel = typeof SERVICE_MODELS[number];

export const ENQUIRY_STATUSES = ["NEW", "CONTACTED", "QUOTED", "CONVERTED", "CLOSED"] as const;
export type EnquiryStatus = typeof ENQUIRY_STATUSES[number];

export const BOOKING_STATUSES = ["TENTATIVE", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];

export const MOVEMENT_TYPES = ["PURCHASE", "USED", "WASTE", "DAMAGE", "RETURN", "ADJUSTMENT"] as const;
export type MovementType = typeof MOVEMENT_TYPES[number];

export const DISH_CATEGORIES = ["BREAKFAST", "LUNCH", "SNACKS", "DESSERTS"] as const;
export type DishCategory = typeof DISH_CATEGORIES[number];

export const INGREDIENT_CATEGORIES = ["GRAIN", "VEGETABLE", "SPICE", "OIL", "DAIRY", "MEAT", "OTHER"] as const;
export type IngredientCategory = typeof INGREDIENT_CATEGORIES[number];

export const USER_ROLES = ["OWNER", "ADMIN", "KITCHEN"] as const;
export type UserRole = typeof USER_ROLES[number];

export const ENQUIRY_SOURCES = ["PHONE", "WHATSAPP", "WEBSITE", "WALK_IN", "REFERRAL"] as const;
export type EnquirySource = typeof ENQUIRY_SOURCES[number];

export const INTERACTION_TYPES = ["CALL", "WHATSAPP", "EMAIL", "NOTE"] as const;
export type InteractionType = typeof INTERACTION_TYPES[number];

export const PRICING_BASES = ["STAFF_COUNT", "PER_PLATE", "CUSTOM_QUOTE"] as const;
export type PricingBasis = typeof PRICING_BASES[number];

export const TIME_SLOTS = ["EARLY_MORNING", "MORNING", "MIDDAY", "AFTERNOON"] as const;
export type TimeSlot = typeof TIME_SLOTS[number];

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type TaskPriority = typeof TASK_PRIORITIES[number];

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = typeof TASK_STATUSES[number];

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");
export const guestCountSchema = z.coerce.number().int().positive();
export const dateSchema = z.string().datetime();
