import { NextResponse } from 'next/server';
import { createOrder, getOrderByIdOrRef, OrderItem } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      full_name,
      phone,
      address,
      city,
      state,
      items,
      payment_method,
      total,
    } = body;

    if (
      !email ||
      !full_name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !payment_method ||
      !['paystack', 'pod'].includes(payment_method)
    ) {
      return NextResponse.json(
        { error: 'Invalid or missing required fields' },
        { status: 400 }
      );
    }

    const computedTotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const reference = 'DANG-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const orderItems: OrderItem[] = items.map(
      (item: {
        product_id?: string;
        product_name: string;
        price: number;
        quantity: number;
      }) => ({
        id: 'item_' + Math.random().toString(36).substring(2, 9),
        order_id: '',
        product_id: item.product_id || null,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
      })
    );

    const newOrder = await createOrder({
      reference,
      email,
      full_name,
      phone,
      address,
      city,
      state,
      total: total || computedTotal,
      status: payment_method === 'pod' ? 'processing' : 'pending',
      payment_method,
      payment_status: payment_method === 'pod' ? 'pending' : 'pending',
      paystack_reference: null,
      items: orderItems,
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Error creating order:', err);
    return NextResponse.json(
      { error: 'Internal server error creating order' },
      { status: 500 }
    );
  }
}
