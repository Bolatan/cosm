import { NextResponse } from 'next/server';
import { getOrderByIdOrRef } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idOrRef = params.id;
    if (!idOrRef) {
      return NextResponse.json(
        { error: 'Order ID or Reference is required' },
        { status: 400 }
      );
    }

    const order = await getOrderByIdOrRef(idOrRef);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
