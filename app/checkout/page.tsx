'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatNaira } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number; // in kobo
        ref: string;
        currency?: string;
        callback: (response: { reference: string; status: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Lagos',
  });

  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'pod'>('paystack');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = 2500; // Flat delivery fee
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaystackPayment = async (orderRef: string) => {
    const paystackKey =
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_sample_key_for_testing';

    if (typeof window !== 'undefined' && window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: formData.email,
        amount: grandTotal * 100, // Paystack expects amount in Kobo
        ref: orderRef,
        currency: 'NGN',
        callback: async (response) => {
          toast.loading('Verifying payment...');
          try {
            const verifyRes = await fetch('/api/paystack/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: response.reference,
                order_reference: orderRef,
              }),
            });
            const verifyData = await verifyRes.json();
            toast.dismiss();

            if (verifyRes.ok && verifyData.success) {
              toast.success('Payment successful!');
              clearCart();
              router.push(`/checkout/success?ref=${orderRef}`);
            } else {
              toast.error(verifyData.message || 'Payment verification failed');
              setIsSubmitting(false);
            }
          } catch (error) {
            toast.dismiss();
            toast.error('Error verifying payment');
            setIsSubmitting(false);
          }
        },
        onClose: () => {
          toast.error('Payment popup closed');
          setIsSubmitting(false);
        },
      });
      handler.openIframe();
    } else {
      // Fallback if PaystackPop failed to load (e.g. offline or test environment without script load)
      toast.info('Simulating Paystack payment gateway (Test Mode)...');
      setTimeout(async () => {
        try {
          const verifyRes = await fetch('/api/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: 'PAYSTACK-' + Date.now(),
              order_reference: orderRef,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            toast.success('Payment successful!');
            clearCart();
            router.push(`/checkout/success?ref=${orderRef}`);
          } else {
            toast.error('Payment processing failed');
            setIsSubmitting(false);
          }
        } catch {
          toast.error('Error simulating payment');
          setIsSubmitting(false);
        }
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state
    ) {
      toast.error('Please fill in all shipping details');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on server
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          payment_method: paymentMethod,
          total: grandTotal,
          items: items.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || 'Failed to process order');
        setIsSubmitting(false);
        return;
      }

      const orderRef = data.order.reference;

      if (paymentMethod === 'paystack') {
        await handlePaystackPayment(orderRef);
      } else {
        // Payment on Delivery
        toast.success('Order placed successfully!');
        clearCart();
        router.push(`/checkout/success?ref=${orderRef}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto min-h-[60vh] px-4 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">
          You need to add products to your cart before proceeding to checkout.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Explore Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
      />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/shop"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Secure Checkout
          </span>
        </div>

        <h1 className="font-serif text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Form Details & Payment Selection */}
          <div className="space-y-6 lg:col-span-7">
            {/* Customer & Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">1. Shipping Information</CardTitle>
                <CardDescription>
                  Enter the address where you want your order delivered.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Jane Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="08012345678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Street address, house number"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Ikeja"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Lagos"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">2. Payment Method</CardTitle>
                <CardDescription>
                  Select your preferred payment method below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val) => setPaymentMethod(val as 'paystack' | 'pod')}
                  className="space-y-4"
                >
                  {/* Paystack Card Option */}
                  <div
                    className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors cursor-pointer ${
                      paymentMethod === 'paystack'
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => setPaymentMethod('paystack')}
                  >
                    <RadioGroupItem value="paystack" id="paystack" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="paystack"
                          className="font-medium cursor-pointer flex items-center gap-2"
                        >
                          <CreditCard className="h-5 w-5 text-primary" />
                          Pay with Card / Bank Transfer (Paystack)
                        </Label>
                        <span className="text-xs font-semibold uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                          Instant
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Fast & secure payment via Debit Card, Bank Transfer, USSD or Visa/Mastercard via Paystack.
                      </p>
                    </div>
                  </div>

                  {/* Payment on Delivery Option */}
                  <div
                    className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors cursor-pointer ${
                      paymentMethod === 'pod'
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => setPaymentMethod('pod')}
                  >
                    <RadioGroupItem value="pod" id="pod" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="pod"
                          className="font-medium cursor-pointer flex items-center gap-2"
                        >
                          <Truck className="h-5 w-5 text-primary" />
                          Payment on Delivery (POD)
                        </Label>
                        <span className="text-xs font-semibold uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          POD
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Pay cash or POS transfer upon delivery of your items at your doorstep.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6 lg:col-span-5">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 text-sm">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-muted">
                        {item.product.image_url && (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <p className="font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × {formatNaira(item.product.price)}
                        </p>
                      </div>
                      <div className="flex items-center font-medium">
                        {formatNaira(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span>{formatNaira(shippingFee)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-primary">{formatNaira(grandTotal)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base font-semibold py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Processing...'
                    : paymentMethod === 'paystack'
                    ? `Pay ${formatNaira(grandTotal)} with Paystack`
                    : `Place Order (${formatNaira(grandTotal)})`}
                </Button>

                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Encrypted & Safe Checkout</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
}
