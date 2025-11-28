import { auth, currentUser } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'user';

/**
 * Get the current user's role from Clerk publicMetadata
 * @returns 'admin' if user has admin role, otherwise 'user'
 */
export async function getUserRole(): Promise<UserRole> {
  try {
    const user = await currentUser();
    
    if (!user) {
      return 'user';
    }

    const role = user.publicMetadata?.role as string | undefined;
    
    return role === 'admin' ? 'admin' : 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
}

/**
 * Check if the current user is an admin
 * @returns true if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'admin';
}
