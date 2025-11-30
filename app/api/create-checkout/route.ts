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

    // Simply return success - let the frontend handle the redirect
    // Clerk's UserProfile component will handle the billing flow
    return NextResponse.json({
      success: true,
      planKey,
      userId,
    });
  } catch (error: any) {
    console.error("Error in checkout:", error);
    return NextResponse.json(
      { 
        error: error?.message || "Internal server error",
        details: "Failed to process checkout"
      },
      { status: 500 }
    );
  }
}
