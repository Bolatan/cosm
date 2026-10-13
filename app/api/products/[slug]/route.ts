import { NextResponse } from 'next/server';
import { getProductBySlug, getRelatedProducts } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const related = await getRelatedProducts(product.category_id, product.id, 4);

  return NextResponse.json({ product, related });
}
