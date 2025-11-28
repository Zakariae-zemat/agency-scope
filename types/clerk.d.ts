// Extend Clerk's types to include custom publicMetadata
declare global {
  interface CustomJwtSessionClaims {
    publicMetadata: {
      role?: 'admin' | 'user';
    };
  }
}

export {};
