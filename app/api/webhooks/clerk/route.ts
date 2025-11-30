import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  try {
    switch (eventType) {
      case "subscription.created":
      case "subscription.updated": {
        const { id, user_id, subscription_items, status, current_period_end } = evt.data;
        
        // Extract plan_id from subscription_items array
        const planId = subscription_items?.[0]?.plan_id || 'free_user';

        console.log(`Processing ${eventType} for user ${user_id}:`, {
          subscriptionId: id,
          planId,
          status,
          rawData: evt.data
        });

        await prisma.subscription.upsert({
          where: { userId: user_id },
          update: {
            clerkSubscriptionId: id,
            planId: planId,
            status: status,
            currentPeriodEnd: current_period_end
              ? new Date(current_period_end * 1000)
              : null,
            updatedAt: new Date(),
          },
          create: {
            userId: user_id,
            clerkSubscriptionId: id,
            planId: planId,
            status: status,
            currentPeriodEnd: current_period_end
              ? new Date(current_period_end * 1000)
              : null,
          },
        });

        console.log(`Subscription ${eventType} saved:`, { userId: user_id, planId, status });
        break;
      }

      case "subscription.deleted": {
        const { id } = evt.data;

        await prisma.subscription.delete({
          where: { clerkSubscriptionId: id },
        });

        console.log(`Subscription deleted:`, id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
