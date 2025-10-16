
'use client';

import { useState } from 'react';
import { useSubscriptionProducts, useCreateSubscription, useUserSubscriptions, useCancelSubscription, useActiveSubscription } from '@/hooks/use-subscriptions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, Crown, Star, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function SubscriptionsPage() {
  const { data: products, isLoading: productsLoading } = useSubscriptionProducts();
  const { data: userSubscriptions } = useUserSubscriptions();
  const { data: activeSubscription } = useActiveSubscription();
  const createSubscription = useCreateSubscription();
  const cancelSubscription = useCancelSubscription();

  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const handleSubscribe = (priceId: string) => {
    setSelectedPriceId(priceId);
    createSubscription.mutate({ priceId });
  };

  const handleCancel = (subscriptionId: string) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      cancelSubscription.mutate(subscriptionId);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic plan':
        return <Star className="h-6 w-6 text-blue-500" />;
      case 'premium plan':
        return <Zap className="h-6 w-6 text-yellow-500" />;
      case 'enterprise plan':
        return <Crown className="h-6 w-6 text-purple-500" />;
      default:
        return <Star className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPlanFeatures = (planName: string) => {
    const baseFeatures = ['Secure Authentication', 'Basic Support', 'API Access'];
    
    switch (planName.toLowerCase()) {
      case 'basic plan':
        return [...baseFeatures, 'Up to 10 projects', '1GB Storage'];
      case 'premium plan':
        return [...baseFeatures, 'Unlimited projects', '10GB Storage', 'Priority Support', 'Advanced Analytics'];
      case 'enterprise plan':
        return [...baseFeatures, 'Unlimited everything', 'Custom Solutions', '24/7 Phone Support', 'Dedicated Account Manager'];
      default:
        return baseFeatures;
    }
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-gray-600">Choose a plan that fits your needs. Cancel anytime.</p>
      </div>

      {/* Current Active Subscription */}
      {activeSubscription && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Active Subscription
            </CardTitle>
            <CardDescription>
              You are currently subscribed to {activeSubscription.status} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Current Period: {format(new Date(activeSubscription.currentPeriodStart), 'MMM dd, yyyy')} - {' '}
                  {format(new Date(activeSubscription.currentPeriodEnd), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-600">
                  Status: <Badge variant={activeSubscription.status === 'active' ? 'default' : 'secondary'}>
                    {activeSubscription.status}
                  </Badge>
                  {activeSubscription.cancelAtPeriodEnd && (
                    <Badge variant="outline" className="ml-2">
                      Cancels at period end
                    </Badge>
                  )}
                </p>
              </div>
              {activeSubscription.status === 'active' && !activeSubscription.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  onClick={() => handleCancel(activeSubscription.id)}
                  disabled={cancelSubscription.isPending}
                >
                  {cancelSubscription.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Card 
            key={product.id} 
            className={`relative transition-all hover:shadow-lg ${
              product.name.includes('Premium') ? 'border-yellow-200 ring-1 ring-yellow-200' :
              product.name.includes('Enterprise') ? 'border-purple-200 ring-1 ring-purple-200' : ''
            }`}
          >
            {product.name.includes('Premium') && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="default" className="bg-yellow-500">
                  Most Popular
                </Badge>
              </div>
            )}
            {product.name.includes('Enterprise') && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="default" className="bg-purple-500">
                  Enterprise
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                {getPlanIcon(product.name)}
              </div>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Pricing */}
              {product.prices.map((price) => (
                <div key={price.id} className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">
                      ${price.unitAmount}
                    </span>
                    <span className="text-gray-600">/{price.interval}</span>
                  </div>
                  
                  {/* Features */}
                  <ul className="mt-4 space-y-2 text-sm">
                    {getPlanFeatures(product.name).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Subscribe Button */}
                  <Button
                    className="w-full mt-6"
                    onClick={() => handleSubscribe(price.id)}
                    disabled={createSubscription.isPending && selectedPriceId === price.id}
                    variant={
                      product.name.includes('Premium') ? 'default' :
                      product.name.includes('Enterprise') ? 'default' : 'outline'
                    }
                    size="lg"
                  >
                    {createSubscription.isPending && selectedPriceId === price.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : activeSubscription ? (
                      'Current Plan'
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscription History */}
      {userSubscriptions && userSubscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userSubscriptions.map((subscription: any) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Subscription</span>
                        <Badge variant={
                          subscription.status === 'active' ? 'default' :
                          subscription.status === 'canceled' ? 'secondary' : 'outline'
                        }>
                          {subscription.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Created: {format(new Date(subscription.createdAt), 'PPpp')}
                      </p>
                      {subscription.canceledAt && (
                        <p className="text-sm text-gray-600">
                          Canceled: {format(new Date(subscription.canceledAt), 'PPpp')}
                        </p>
                      )}
                    </div>
                  </div>
                  {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(subscription.id)}
                      disabled={cancelSubscription.isPending}
                    >
                      {cancelSubscription.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Cancel'
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}