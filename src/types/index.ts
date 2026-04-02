export type UserRole = "recycler" | "waste_producer" | "both" | "admin";

export type ScrapStatus = "live" | "matched" | "picked" | "completed" | "cancelled";

export type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type VerificationStatus = "pending" | "verified" | "rejected";

export type TransactionStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type ScrapCategory =
  | "Metal"
  | "E-waste"
  | "Plastic"
  | "Paper"
  | "Glass"
  | "Mixed Scrap";

export interface User {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  role: UserRole | null;
  is_approved: boolean;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  industry_type: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  description: string | null;
  gst_number: string | null;
  waste_categories: string[];
  contact_person: string | null;
  phone: string | null;
  verification_status: VerificationStatus;
  created_at: string;
}

export interface RecyclerProfile {
  id: string;
  user_id: string;
  waste_types_accepted: string[];
  service_radius_km: number | null;
  min_quantity_kg: number | null;
  max_quantity_kg: number | null;
  processing_types: string[];
  pricing_model: "fixed" | "negotiable" | "market_rate" | null;
  cpcb_license_url: string | null;
  epr_authorization_url: string | null;
  iso_certificate_url: string | null;
  verification_status: VerificationStatus;
  verified_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Scrap {
  id: string;
  seller_id: string;
  company_id: string;
  title: string;
  category: ScrapCategory;
  sub_type: string | null;
  quantity: number;
  unit: string;
  price: number;
  price_expectation: number | null;
  description: string | null;
  images: string[];
  photos: string[];
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  status: ScrapStatus;
  matched_recycler_id: string | null;
  created_at: string;
}

export interface ListingBid {
  id: string;
  listing_id: string;
  recycler_id: string;
  offered_price: number;
  estimated_pickup_date: string | null;
  message: string | null;
  status: BidStatus;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  listing_id: string;
  bid_id: string | null;
  producer_id: string;
  recycler_id: string;
  final_price: number;
  final_quantity_kg: number | null;
  pickup_date: string | null;
  pickup_otp: string | null;
  otp_verified_at: string | null;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  booking_id: string | null;
  transaction_id: string | null;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_status: boolean;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  read_at: string | null;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  author_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Deprecated — kept for backward compat during transition
export interface Booking {
  id: string;
  buyer_id: string;
  seller_id: string;
  scrap_id: string;
  status: "pending" | "confirmed" | "collected" | "cancelled";
  scheduled_at: string | null;
  created_at: string;
}
