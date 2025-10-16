'use client';

import { useAuth } from '@/hooks/use-auth';
import { useActiveSubscription } from '@/hooks/use-subscriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreditCard, User, BarChart3, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: activeSubscription } = useActiveSubscription();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {!activeSubscription && (
          <Button asChild>
            <Link href="/dashboard/subscriptions">
              <Plus className="h-4 w-4 mr-2" />
              Subscribe Now
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.name}</div>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeSubscription ? 'Active' : 'Inactive'}
            </div>
            <div className="flex items-center mt-2">
              <Badge variant={activeSubscription ? 'default' : 'secondary'}>
                {activeSubscription?.status || 'No subscription'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.role}</div>
            <p className="text-xs text-muted-foreground">
              {activeSubscription ? 'Premium' : 'Free'} tier
            </p>
          </CardContent>
        </Card>
      </div>

      {activeSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant="default">{activeSubscription.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Current Period:</span>
                <span>
                  {new Date(activeSubscription.currentPeriodStart).toLocaleDateString()} - {' '}
                  {new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cancel at period end:</span>
                <span>{activeSubscription.cancelAtPeriodEnd ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}