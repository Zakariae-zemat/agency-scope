import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    
    console.log("=== DEBUGGING SUBSCRIPTION ===");
    console.log("User ID:", userId);
    
    // Get user data
    const user = await client.users.getUser(userId);
    console.log("User publicMetadata:", user.publicMetadata);
    
    // Get billing subscription
    let clerkSubscription;
    try {
      clerkSubscription = await client.billing.getUserBillingSubscription(userId);
      console.log("Clerk Billing Subscription:", JSON.stringify(clerkSubscription, null, 2));
    } catch (error) {
      console.error("Error fetching billing subscription:", error);
    }
    
    // Get database subscription
    const dbSubscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    console.log("Database Subscription:", dbSubscription);

    return NextResponse.json({
      userId,
      userMetadata: user.publicMetadata,
      clerkBillingSubscription: clerkSubscription,
      databaseSubscription: dbSubscription,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ 
      error: "Failed to debug subscription",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
