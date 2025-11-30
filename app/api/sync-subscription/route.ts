import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const clerkSubscription = await client.billing.getUserBillingSubscription(userId);

    console.log("Clerk subscription data:", JSON.stringify(clerkSubscription, null, 2));

    if (!clerkSubscription || !clerkSubscription.subscriptionItems || clerkSubscription.subscriptionItems.length === 0) {
      return NextResponse.json({ 
        error: "No subscription found in Clerk",
        clerkData: clerkSubscription 
      }, { status: 404 });
    }

    const subscriptionItem = clerkSubscription.subscriptionItems[0];
    // Use plan SLUG, not plan ID!
    const planSlug = subscriptionItem.plan?.slug || "free_user";

    // Sync to database
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        clerkSubscriptionId: clerkSubscription.id,
        planId: planSlug,
        status: clerkSubscription.status,
        updatedAt: new Date(),
      },
      create: {
        userId,
        clerkSubscriptionId: clerkSubscription.id,
        planId: planSlug,
        status: clerkSubscription.status,
      },
    });

    const isPro = subscription.status === "active" && subscription.planId === "pro_subscription_plan";

    return NextResponse.json({ 
      success: true,
      subscription,
      isPro,
      clerkData: clerkSubscription
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ 
      error: "Failed to sync subscription",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
