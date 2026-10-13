import { NextResponse } from 'next/server';
import { updateOrderPaymentStatus, getOrderByIdOrRef } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, order_reference } = body;

    const refToVerify = reference || order_reference;

    if (!refToVerify) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (paystackSecret) {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(refToVerify)}`,
        {
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.status && data.data.status === 'success') {
        const orderRef = order_reference || data.data.reference;
        const updatedOrder = await updateOrderPaymentStatus(
          orderRef,
          'paid',
          data.data.reference
        );

        return NextResponse.json({
          success: true,
          message: 'Payment verified successfully',
          order: updatedOrder,
        });
      } else {
        if (order_reference) {
          await updateOrderPaymentStatus(order_reference, 'failed', refToVerify);
        }
        return NextResponse.json(
          {
            success: false,
            message: data.message || 'Payment verification failed',
          },
          { status: 400 }
        );
      }
    } else {
      // Development / Test mode fallback
      const targetRef = order_reference || refToVerify;
      const order = await getOrderByIdOrRef(targetRef);

      if (order) {
        const updatedOrder = await updateOrderPaymentStatus(
          targetRef,
          'paid',
          refToVerify
        );

        return NextResponse.json({
          success: true,
          message: 'Payment verified successfully (Development Mode)',
          order: updatedOrder,
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified (Development Mode)',
      });
    }
  } catch (err) {
    console.error('Error verifying Paystack transaction:', err);
    return NextResponse.json(
      { error: 'Internal server error verifying payment' },
      { status: 500 }
    );
  }
}
