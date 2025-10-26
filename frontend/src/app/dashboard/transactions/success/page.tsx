'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { checkoutService } from '@/services/checkout-service';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      checkoutService.getCheckoutSession(sessionId)
        .then(setSession)
        .finally(() => setLoading(false));
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-green-200">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your payment. Your transaction has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {session && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>${(session.amount_total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="capitalize">{session.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Description:</span>
                <span>{session.metadata?.description}</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 pt-4">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard/transactions">
                View Transactions
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}