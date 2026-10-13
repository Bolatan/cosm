import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const categoryIdParam = searchParams.get('category_id');

  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  const category_id = categoryIdParam || undefined;

  const products = await getProducts({ limit, category_id });
  return NextResponse.json(products);
}
