import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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

    // In production, you would:
    // 1. Create a Stripe Checkout session via Clerk API
    // 2. Return the checkout URL
    // For now, redirect to Clerk's billing portal

    const clerkBillingUrl = `${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('test') ? 'https://accounts.dev' : 'https://accounts'}.clerk.dev/user/billing`;

    return NextResponse.json({
      url: clerkBillingUrl,
      message: "Please configure Clerk Billing in the Clerk Dashboard first",
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
