"use client";

import { UserProfile } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UserProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AgencyScope</h1>
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* User Profile with Billing */}
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full max-w-4xl",
              card: "shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}
