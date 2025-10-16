'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with Argon2 password hashing for maximum security.',
    },
    {
      icon: CreditCard,
      title: 'Stripe Integration',
      description: 'Seamless payment processing and subscription management with Stripe.',
    },
    {
      icon: Zap,
      title: 'Fast & Modern',
      description: 'Built with Next.js 14, TypeScript, and Tailwind CSS for optimal performance.',
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Complete user profile management with transaction and subscription tracking.',
    },
  ];

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SaaS App</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern SaaS Platform
            <span className="text-blue-600 block">Built for Growth</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A complete authentication and payment solution with Stripe integration, 
            built with Next.js, NestJS, and modern development practices.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Built With Modern Technology
          </h3>
          <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-600">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              Next.js 14 + TypeScript
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              NestJS + MongoDB
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              Stripe Payments
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              TanStack Query
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              Zustand State
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              Tailwind CSS
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 SaaS App. Built for learning and demonstration purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}