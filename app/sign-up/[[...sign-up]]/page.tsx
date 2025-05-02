"use client";

import { SignUp } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Redirect to home page if user is already signed in
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Only render the SignUp component if the user is not signed in
  // This prevents the "already signed in" message
  return (
    <div className="flex min-h-screen items-center justify-center">
      {isLoaded && !isSignedIn ? <SignUp /> : <div className="text-center"><p>Redirecting you...</p></div>}
    </div>
  );
}
