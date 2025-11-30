import { prisma } from "./prisma";
import { auth } from "@clerk/nextjs/server";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "unpaid"
  | "incomplete"
  | "trialing";

export interface UserSubscription {
  id: string;
  planId: string;
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  isPro: boolean;
}

/**
 * Get user's active subscription
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscription | null> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return null;
    }

    const isPro =
      subscription.status === "active" &&
      subscription.planId === "pro_subscription_plan";

    return {
      ...subscription,
      isPro,
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

/**
 * Check if user has active Pro subscription
 */
export async function hasProSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription?.isPro || false;
}

/**
 * Check if user's subscription is active (any plan)
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription?.status === "active" || false;
}

/**
 * Get current user's subscription (from auth context)
 */
export async function getCurrentUserSubscription(): Promise<UserSubscription | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return getUserSubscription(userId);
}

/**
 * Check if current user has Pro subscription
 */
export async function currentUserHasPro(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return hasProSubscription(userId);
}

/**
 * Get subscription status for display
 */
export function getSubscriptionStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "Active",
    canceled: "Canceled",
    past_due: "Past Due",
    unpaid: "Unpaid",
    incomplete: "Incomplete",
    trialing: "Trial",
  };

  return labels[status] || "Unknown";
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isSubscriptionExpiringSoon(
  subscription: UserSubscription | null
): boolean {
  if (!subscription || !subscription.currentPeriodEnd) {
    return false;
  }

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  return subscription.currentPeriodEnd <= sevenDaysFromNow;
}
