import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  secondary_image_url: string | null;
  badge: string | null;
  in_stock: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type ProductWithCategory = Product & {
  categories: Category | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  reference: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  total: number;
  status: string;
  paystack_reference: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
};
