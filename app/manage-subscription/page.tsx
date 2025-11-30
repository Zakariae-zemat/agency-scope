import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSubscription, getSubscriptionStatusLabel } from "@/lib/subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, XCircle, Calendar, CreditCard } from "lucide-react";

export default async function ManageSubscriptionPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const subscription = await getUserSubscription(userId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Manage Subscription</h1>
            <Link href="/dashboard">
              <Button variant="ghost">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Current Subscription */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription ? (
              <>
                {/* Plan Details */}
                <div className="flex items-start justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {subscription.planId === "pro_subscription_plan"
                          ? "Pro Plan"
                          : "Free Plan"}
                      </h3>
                      {subscription.status === "active" ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <XCircle className="w-4 h-4" />
                          {getSubscriptionStatusLabel(subscription.status)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {subscription.planId === "pro_subscription_plan"
                        ? "$39 per month"
                        : "Free forever"}
                    </p>
                  </div>
                  {subscription.isPro && (
                    <div className="text-right">
                      <div className="text-3xl font-bold">$39</div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>
                  )}
                </div>

                {/* Billing Info */}
                {subscription.currentPeriodEnd && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">
                        {subscription.cancelAtPeriodEnd
                          ? "Subscription ends on"
                          : "Next billing date:"}
                      </span>
                      <span className="ml-2 font-medium">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {subscription.isPro && !subscription.cancelAtPeriodEnd && (
                    <Button variant="outline" className="flex-1">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Update Payment Method
                    </Button>
                  )}
                  {subscription.isPro && !subscription.cancelAtPeriodEnd && (
                    <Button variant="destructive" className="flex-1">
                      Cancel Subscription
                    </Button>
                  )}
                  {subscription.cancelAtPeriodEnd && (
                    <Button className="flex-1">Reactivate Subscription</Button>
                  )}
                  {!subscription.isPro && (
                    <Link href="/pricing" className="flex-1">
                      <Button className="w-full">Upgrade to Pro</Button>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Free Plan</h3>
                  <p className="text-muted-foreground mb-6">
                    You're currently on the free plan with 50 contact views per day
                  </p>
                  <Link href="/pricing">
                    <Button size="lg">Upgrade to Pro</Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {subscription?.isPro ? (
                <>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Unlimited Contact Views</div>
                      <div className="text-sm text-muted-foreground">
                        No daily limits
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Priority Support</div>
                      <div className="text-sm text-muted-foreground">
                        Fast response times
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Advanced Analytics</div>
                      <div className="text-sm text-muted-foreground">
                        Detailed insights
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Export Contacts</div>
                      <div className="text-sm text-muted-foreground">
                        CSV downloads
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">50 Daily Views</div>
                      <div className="text-sm text-muted-foreground">
                        Resets every 24 hours
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Browse Agencies</div>
                      <div className="text-sm text-muted-foreground">
                        900+ agencies
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Search & Filters</div>
                      <div className="text-sm text-muted-foreground">
                        Basic search
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Basic Support</div>
                      <div className="text-sm text-muted-foreground">
                        Email support
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
