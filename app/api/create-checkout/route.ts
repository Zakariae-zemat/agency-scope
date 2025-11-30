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

    // Get the Clerk client
    const client = await clerkClient();
    
    // Get the user's billing subscription to check existing status
    try {
      const billingSubscription = await client.billing.getUserBillingSubscription(userId);
      
      // If user already has a subscription, return subscription management URL
      if (billingSubscription && billingSubscription.status === 'active') {
        return NextResponse.json({
          alreadySubscribed: true,
          message: "You already have an active subscription"
        });
      }
    } catch (error) {
      // User doesn't have a subscription yet, which is fine
      console.log("No existing subscription found");
    }

    // Return success - frontend will handle redirect to Clerk billing
    return NextResponse.json({
      success: true,
      planKey,
      userId,
      // The frontend will redirect to Clerk's billing portal
      redirectUrl: `https://accounts.clerk.com/subscribe/${planKey}`
    });
  } catch (error: any) {
    console.error("Error in checkout:", error);
    return NextResponse.json(
      { 
        error: error?.message || "Internal server error",
        details: error?.errors?.[0]?.message || "Failed to process checkout"
      },
      { status: 500 }
    );
  }
}
