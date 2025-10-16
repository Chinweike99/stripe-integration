'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, profile } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your basic account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="text-lg flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account Role</label>
              <div className="mt-1">
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Account Status
            </CardTitle>
            <CardDescription>
              Your subscription and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Login</label>
              <p className="text-lg">
                {profile?.lastLogin ? format(new Date(profile.lastLogin), 'PPpp') : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Verification</label>
              <div className="mt-1">
                <Badge variant={profile?.isEmailVerified ? 'default' : 'secondary'}>
                  {profile?.isEmailVerified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Stripe Customer</label>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                {profile?.stripeCustomerId || 'Not available'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>
            Your account activity and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Transactions</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Active Subscriptions</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {profile?.isEmailVerified ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-gray-600">Email Verified</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {user.role}
              </div>
              <div className="text-sm text-gray-600">Account Tier</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}