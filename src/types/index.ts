export type UserRole = "recycler" | "waste_producer";

export type ScrapStatus = "available" | "booked" | "collected";

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
  role: UserRole;
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
  created_at: string;
}

export interface Scrap {
  id: string;
  seller_id: string;
  company_id: string;
  title: string;
  category: ScrapCategory;
  quantity: number;
  unit: string;
  price: number;
  description: string | null;
  images: string[];
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  status: ScrapStatus;
  created_at: string;
}

export interface Booking {
  id: string;
  buyer_id: string;
  seller_id: string;
  scrap_id: string;
  status: "pending" | "confirmed" | "collected" | "cancelled";
  scheduled_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_status: boolean;
  created_at: string;
}
