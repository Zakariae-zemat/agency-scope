import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function UpgradePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Upgrade to Premium</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
          Get unlimited access to all agencies and contacts. No daily limits, ever.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Free</span>
              <span className="text-2xl font-bold">$0</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">For occasional use</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>50 contact views per day</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Access to all agencies</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Basic search and filters</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Check className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Daily limit resets at midnight</span>
              </li>
            </ul>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Current Plan
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-blue-600 shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-1 text-xs font-semibold text-white">
              MOST POPULAR
            </span>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Premium</span>
              <div className="text-right">
                <div className="text-2xl font-bold">$49</div>
                <div className="text-xs font-normal text-muted-foreground">per month</div>
              </div>
            </CardTitle>
            <p className="text-sm text-muted-foreground">For power users</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited contact views</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Access to all agencies</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Advanced search and filters</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>CSV export functionality</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>API access (coming soon)</span>
              </li>
            </ul>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Need help deciding?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start with the free plan and upgrade anytime. No credit card required to get started.
        </p>
        <Link href="/dashboard/contacts">
          <Button variant="link">
            Continue with Free Plan →
          </Button>
        </Link>
      </div>
    </div>
  );
}
