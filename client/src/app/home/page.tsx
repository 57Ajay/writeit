"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.name) {
      router.push("/user/signin");
    }
  }, [user, router]);

  if (!user || !user.name) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Redirecting to Sign In...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Welcome, {user.name}!
        </h1>
        <p className="text-center mb-4">
          <strong>Email: </strong> {user.email}
        </p>
        <Button
          onClick={() => router.push("/user/signout")}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

