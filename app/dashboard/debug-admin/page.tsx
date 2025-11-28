import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserRole, isAdmin } from '@/lib/getUserRole';

export default async function DebugPage() {
  const { sessionClaims } = await auth();
  const clerkUser = await currentUser();
  const userRole = await getUserRole();
  const userIsAdmin = await isAdmin();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            🔍 Admin Role Debug Information
          </h1>
          
          <div className="space-y-4">
            <div className="border-l-4 border-cyan-500 pl-4">
              <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                getUserRole() Result:
              </h2>
              <code className="text-lg font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">
                {userRole}
              </code>
            </div>

            <div className="border-l-4 border-cyan-500 pl-4">
              <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                isAdmin() Result:
              </h2>
              <code className="text-lg font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">
                {userIsAdmin ? 'true ✅' : 'false ❌'}
              </code>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                currentUser() publicMetadata:
              </h2>
              <pre className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
                {JSON.stringify(clerkUser?.publicMetadata, null, 2)}
              </pre>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                sessionClaims publicMetadata:
              </h2>
              <pre className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
                {JSON.stringify(sessionClaims?.publicMetadata, null, 2)}
              </pre>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                Full sessionClaims:
              </h2>
              <pre className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto max-h-96">
                {JSON.stringify(sessionClaims, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-6 p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg">
            <h3 className="font-bold text-cyan-900 dark:text-cyan-100 mb-2">
              💡 What to check:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200">
              <li>Is <code className="bg-cyan-100 dark:bg-cyan-900/50 px-1 rounded">publicMetadata.role</code> set to <code className="bg-cyan-100 dark:bg-cyan-900/50 px-1 rounded">"admin"</code>?</li>
              <li>Did you save the metadata in Clerk Dashboard?</li>
              <li>Did you sign out and sign back in after setting the role?</li>
              <li>Try clearing browser cookies and signing in again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
