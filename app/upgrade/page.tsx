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
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Upgrade to Premium</h1>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
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
            <p className="text-sm text-slate-600">For occasional use</p>
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
              <li className="flex items-start gap-2 text-slate-400">
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
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
              Recommended
            </span>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Premium</span>
              <span className="text-2xl font-bold">$49/mo</span>
            </CardTitle>
            <p className="text-sm text-slate-600">For power users</p>
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
                <span>CSV export capabilities</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>Priority email support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>API access</span>
              </li>
            </ul>
            <Button className="w-full" size="lg">
              <TrendingUp className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
            <p className="text-xs text-center text-slate-500">
              This is a demo. No actual payment will be processed.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Can I cancel anytime?</h3>
              <p className="text-sm text-slate-600">
                Yes, you can cancel your subscription at any time. You'll continue to have
                access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Do you offer refunds?</h3>
              <p className="text-sm text-slate-600">
                We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund
                your payment in full.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">What payment methods do you accept?</h3>
              <p className="text-sm text-slate-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
