import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planKey } = await req.json();

    if (planKey !== "pro_subscription_plan") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Use Clerk's API to create a subscription checkout session
    const client = await clerkClient();
    
    // Create a subscription for the user
    const subscription = await client.subscriptions.createSubscription({
      userId,
      planId: planKey,
    });

    // Return the checkout URL
    return NextResponse.json({
      url: subscription.stripeCheckoutSessionUrl,
      subscriptionId: subscription.id,
    });
  } catch (error: any) {
    console.error("Error creating checkout:", error);
    return NextResponse.json(
      { 
        error: error?.message || "Internal server error",
        details: error?.errors?.[0]?.message
      },
      { status: 500 }
    );
  }
}
