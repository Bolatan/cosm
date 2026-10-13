'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, PackageCheck, ArrowRight, ShoppingBag, Truck, CreditCard } from 'lucide-react';
import { Order } from '@/lib/db';
import { formatNaira } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${ref}`);
        if (!res.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Could not load order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [ref]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 space-y-6">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold">Thank You for Your Order!</h1>
        <p className="text-muted-foreground">
          Your order reference is <span className="font-mono font-bold text-foreground">{ref || 'N/A'}</span>.
        </p>
        <p className="text-sm text-muted-foreground">
          We have received your order and will process it shortly.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">
            <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="text-center space-y-3 mb-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for shopping with us, <span className="font-semibold text-foreground">{order.full_name}</span>.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="bg-muted/40 border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Order Reference
              </CardTitle>
              <p className="font-mono text-lg font-bold">{order.reference}</p>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                <PackageCheck className="h-3.5 w-3.5" />
                {order.payment_method === 'pod' ? 'Order Placed (POD)' : 'Payment Verified'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Purchased Items */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × {formatNaira(item.price)}
                    </p>
                  </div>
                  <span className="font-medium">{formatNaira(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Delivery & Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                Shipping Address
              </h4>
              <p className="font-medium">{order.full_name}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state}</p>
              <p className="text-xs text-muted-foreground mt-1">{order.phone}</p>
            </div>

            <div>
              <h4 className="font-medium text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                Payment Method
              </h4>
              <div className="flex items-center gap-2 font-medium">
                {order.payment_method === 'paystack' ? (
                  <>
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>Card / Paystack</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Payment on Delivery</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Status: <span className="font-medium text-foreground capitalize">{order.payment_status}</span>
              </p>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center font-semibold text-base">
            <span>Total Amount Paid / Due</span>
            <span className="text-lg text-primary">{formatNaira(order.total)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/shop">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-2xl px-4 py-16 space-y-6 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-8 w-64 mx-auto" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
