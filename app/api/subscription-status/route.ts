import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscription } from "@/lib/subscription";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ isPro: false });
    }

    const subscription = await getUserSubscription(userId);
    
    return NextResponse.json({
      isPro: subscription?.isPro || false,
      planId: subscription?.planId || "free_user",
      status: subscription?.status || "active",
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ isPro: false });
  }
}
