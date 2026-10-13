import { MongoClient, Db } from 'mongodb';

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

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
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
  status: string; // e.g. 'pending', 'processing', 'completed', 'cancelled'
  payment_method: 'paystack' | 'pod';
  payment_status: 'pending' | 'paid' | 'failed';
  paystack_reference: string | null;
  items: OrderItem[];
  created_at: string;
};

const inMemoryOrders: Order[] = [];

// Initial default data for fallback or seed
export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Formulated for melanin-rich skin to brighten, hydrate and repair.',
  },
  {
    id: 'cat-2',
    name: 'Fragrance',
    slug: 'fragrance',
    description: 'Captivating, long-lasting luxury fragrances and signature scents.',
  },
  {
    id: 'cat-3',
    name: 'Body Care',
    slug: 'body-care',
    description: 'Nourishing body butters, oils and polishes for glowing skin.',
  },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Azelaic Acid Niacinamide Serum',
    slug: 'azelaic-acid-niacinamide-serum',
    description:
      'Powerful serum targeting hyperpigmentation, dark spots, and uneven skin texture for a radiant, smooth complexion.',
    price: 18500,
    category_id: 'cat-1',
    image_url:
      'https://images.pexels.com/photos/39452544/pexels-photo-39452544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    secondary_image_url:
      'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    badge: 'Bestseller',
    in_stock: true,
    created_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Hydrating Facial Cleanser',
    slug: 'hydrating-facial-cleanser',
    description:
      'Gentle, non-stripping cleanser that effectively removes makeup and impurities while retaining your skin natural moisture balance.',
    price: 12000,
    category_id: 'cat-1',
    image_url:
      'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    secondary_image_url: null,
    badge: 'New',
    in_stock: true,
    created_at: new Date('2026-01-02').toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Vitamin C Glow Moisturizer',
    slug: 'vitamin-c-glow-moisturizer',
    description:
      'Lightweight cream enriched with antioxidant Vitamin C and nourishing botanical extracts for 24-hour hydration and natural radiance.',
    price: 22000,
    category_id: 'cat-1',
    image_url:
      'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    secondary_image_url: null,
    badge: 'Premium',
    in_stock: true,
    created_at: new Date('2026-01-03').toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Snail Mucin Repair Essence',
    slug: 'snail-mucin-repair-essence',
    description:
      'Ultra-hydrating repair essence that calms irritated skin, boosts elasticity, and restores compromised skin barriers.',
    price: 16500,
    category_id: 'cat-1',
    image_url:
      'https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    secondary_image_url: null,
    badge: null,
    in_stock: true,
    created_at: new Date('2026-01-04').toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Amber Oud Eau de Parfum',
    slug: 'amber-oud-eau-de-parfum',
    description:
      'Rich, opulent blend of warm amber, rare oud wood, vanilla, and dark spices. Designed for an unforgettable impression.',
    price: 45000,
    category_id: 'cat-2',
    image_url:
      'https://images.pexels.com/photos/12456276/pexels-photo-12456276.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    secondary_image_url: null,
    badge: 'Bestseller',
    in_stock: true,
    created_at: new Date('2026-01-05').toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Midnight Jasmine Perfume Oil',
    slug: 'midnight-jasmine-perfume-oil',
    description:
      'Concentrated roll-on fragrance oil featuring intoxicating night-blooming jasmine, creamy sandalwood, and soft musk.',
    price: 28000,
    category_id: 'cat-2',
    image_url:
      'https://images.pexels.com/photos/965981/pexels-photo-965981.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    secondary_image_url: null,
    badge: 'New',
    in_stock: true,
    created_at: new Date('2026-01-06').toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Velvet Rose & Vanilla Perfume',
    slug: 'velvet-rose-vanilla-perfume',
    description:
      'A romantic fusion of damask rose petals, warm vanilla bean, and subtle amber undertones.',
    price: 42000,
    category_id: 'cat-2',
    image_url:
      'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    secondary_image_url: null,
    badge: null,
    in_stock: true,
    created_at: new Date('2026-01-07').toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Whipped Shea Body Butter',
    slug: 'whipped-shea-body-butter',
    description:
      'Decadent, airy shea butter infused with jojoba and coconut oils. Deeply nourishes dry skin and leaves a subtle glow.',
    price: 15000,
    category_id: 'cat-3',
    image_url:
      'https://images.pexels.com/photos/39281916/pexels-photo-39281916.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    secondary_image_url: null,
    badge: 'Bestseller',
    in_stock: true,
    created_at: new Date('2026-01-08').toISOString(),
  },
  {
    id: 'prod-9',
    name: 'Glowing Body Oil - Gold Shimmer',
    slug: 'glowing-body-oil-gold-shimmer',
    description:
      'Lightweight nourishing body oil with fine golden minerals for a radiant shimmer and silky smooth skin.',
    price: 19500,
    category_id: 'cat-3',
    image_url:
      'https://images.pexels.com/photos/3321416/pexels-photo-3321416.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    secondary_image_url: null,
    badge: 'New',
    in_stock: true,
    created_at: new Date('2026-01-09').toISOString(),
  },
];

const uri = process.env.MONGODB_URI;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

async function getDb(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(process.env.MONGODB_DB_NAME || 'cosmetics');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) {
    return initialCategories;
  }
  try {
    const categories = await db
      .collection<Category>('categories')
      .find({}, { projection: { _id: 0 } })
      .sort({ name: 1 })
      .toArray();

    if (categories.length === 0) {
      await db.collection('categories').insertMany(initialCategories);
      return initialCategories;
    }
    return categories;
  } catch (err) {
    console.error('Error fetching categories from MongoDB:', err);
    return initialCategories;
  }
}

export async function getProducts(options?: {
  limit?: number;
  category_id?: string;
}): Promise<Product[]> {
  const db = await getDb();
  if (!db) {
    let result = [...initialProducts];
    if (options?.category_id) {
      result = result.filter((p) => p.category_id === options.category_id);
    }
    result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (options?.limit) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  try {
    const query: Record<string, unknown> = {};
    if (options?.category_id) {
      query.category_id = options.category_id;
    }

    let cursor = db
      .collection<Product>('products')
      .find(query, { projection: { _id: 0 } })
      .sort({ created_at: -1 });

    if (options?.limit) {
      cursor = cursor.limit(options.limit);
    }

    const products = await cursor.toArray();
    if (products.length === 0 && Object.keys(query).length === 0) {
      await db.collection('products').insertMany(initialProducts);
      return options?.limit
        ? initialProducts.slice(0, options.limit)
        : initialProducts;
    }
    return products;
  } catch (err) {
    console.error('Error fetching products from MongoDB:', err);
    let result = [...initialProducts];
    if (options?.category_id) {
      result = result.filter((p) => p.category_id === options.category_id);
    }
    if (options?.limit) {
      result = result.slice(0, options.limit);
    }
    return result;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await getDb();
  if (!db) {
    return initialProducts.find((p) => p.slug === slug) || null;
  }

  try {
    const product = await db
      .collection<Product>('products')
      .findOne({ slug }, { projection: { _id: 0 } });

    if (!product) {
      return initialProducts.find((p) => p.slug === slug) || null;
    }
    return product;
  } catch (err) {
    console.error('Error fetching product by slug from MongoDB:', err);
    return initialProducts.find((p) => p.slug === slug) || null;
  }
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4
): Promise<Product[]> {
  const db = await getDb();
  if (!db) {
    return initialProducts
      .filter((p) => p.category_id === categoryId && p.id !== excludeProductId)
      .slice(0, limit);
  }

  try {
    const products = await db
      .collection<Product>('products')
      .find(
        { category_id: categoryId, id: { $ne: excludeProductId } },
        { projection: { _id: 0 } }
      )
      .limit(limit)
      .toArray();

    return products;
  } catch (err) {
    console.error('Error fetching related products from MongoDB:', err);
    return initialProducts
      .filter((p) => p.category_id === categoryId && p.id !== excludeProductId)
      .slice(0, limit);
  }
}

export async function createOrder(
  orderData: Omit<Order, 'id' | 'created_at'>
): Promise<Order> {
  const id = 'ord_' + Math.random().toString(36).substring(2, 11);
  const newOrder: Order = {
    ...orderData,
    id,
    created_at: new Date().toISOString(),
  };

  const db = await getDb();
  if (!db) {
    inMemoryOrders.push(newOrder);
    return newOrder;
  }

  try {
    await db.collection('orders').insertOne({ ...newOrder });
    return newOrder;
  } catch (err) {
    console.error('Error saving order to MongoDB:', err);
    inMemoryOrders.push(newOrder);
    return newOrder;
  }
}

export async function getOrderByIdOrRef(
  idOrRef: string
): Promise<Order | null> {
  const db = await getDb();
  if (!db) {
    return (
      inMemoryOrders.find(
        (o) => o.id === idOrRef || o.reference === idOrRef
      ) || null
    );
  }

  try {
    const order = await db
      .collection<Order>('orders')
      .findOne(
        { $or: [{ id: idOrRef }, { reference: idOrRef }] },
        { projection: { _id: 0 } }
      );
    if (!order) {
      return (
        inMemoryOrders.find(
          (o) => o.id === idOrRef || o.reference === idOrRef
        ) || null
      );
    }
    return order;
  } catch (err) {
    console.error('Error fetching order from MongoDB:', err);
    return (
      inMemoryOrders.find(
        (o) => o.id === idOrRef || o.reference === idOrRef
      ) || null
    );
  }
}

export async function updateOrderPaymentStatus(
  reference: string,
  paymentStatus: 'paid' | 'failed' | 'pending',
  paystackReference?: string
): Promise<Order | null> {
  const db = await getDb();

  const updateFields: Partial<Order> = {
    payment_status: paymentStatus,
  };
  if (paymentStatus === 'paid') {
    updateFields.status = 'processing';
  }
  if (paystackReference) {
    updateFields.paystack_reference = paystackReference;
  }

  const inMemIndex = inMemoryOrders.findIndex((o) => o.reference === reference);
  if (inMemIndex !== -1) {
    inMemoryOrders[inMemIndex] = {
      ...inMemoryOrders[inMemIndex],
      ...updateFields,
    };
  }

  if (!db) {
    return inMemIndex !== -1 ? inMemoryOrders[inMemIndex] : null;
  }

  try {
    await db
      .collection('orders')
      .updateOne({ reference }, { $set: updateFields });
    return getOrderByIdOrRef(reference);
  } catch (err) {
    console.error('Error updating order status in MongoDB:', err);
    return inMemIndex !== -1 ? inMemoryOrders[inMemIndex] : null;
  }
}
