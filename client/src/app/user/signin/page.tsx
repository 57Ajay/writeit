"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signInStarts, signInFailure, signInSuccess } from "@/redux/slices/user.slice";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user)
  const loading = useAppSelector((state) => state.user.util.loading);
  const error = useAppSelector((state) => state.user.util.error);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(signInStarts());
    console.log("THis is backend Url: \n", process.env.BACKEND_URL);
    try {
      const response = await axios.post(
        `https://server.57ajay-u.workers.dev/api/v1/user/signin`,
        {
          email,
          password,
        }
      );
      console.log(response.data)
      dispatch(signInSuccess(response.data));
      console.log("THis is user from redux: \n", user);
      toast({
        title: "Sign In Successful",
        description: `Welcome back, ${response.data.name}!`,
      });
      router.push("/blog")
    } catch (err) {

      let errorMessage = "Sign-in failed";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || "Invalid credentials";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      dispatch(signInFailure(errorMessage));

      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: errorMessage
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In to StoryArc</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        <p className="mt-4 text-center text-sm">
          {`Don't`} have an account?{" "}
          <Link href="/user/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

