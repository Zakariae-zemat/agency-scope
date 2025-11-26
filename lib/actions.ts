'use server';

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function trackContactView(contactId: string) {
  const user = await requireAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check today's view count
  const viewCount = await prisma.contactView.count({
    where: {
      userId: user.id,
      viewedAt: {
        gte: today,
      },
    },
  });

  if (viewCount >= 50) {
    return { success: false, limitReached: true };
  }

  // Create view record
  await prisma.contactView.create({
    data: {
      userId: user.id,
      contactId,
    },
  });

  revalidatePath('/contacts');
  revalidatePath('/dashboard');

  return { success: true, limitReached: false };
}

export async function getTodayViewCount() {
  const user = await requireAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.contactView.count({
    where: {
      userId: user.id,
      viewedAt: {
        gte: today,
      },
    },
  });

  return { count, remaining: Math.max(0, 50 - count) };
}
