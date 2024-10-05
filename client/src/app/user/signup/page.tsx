"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { signUpSuccess, signUpStart, signUpFailure } from "@/redux/slices/user.slice"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loading = useAppSelector((state) => state.user.util.loading);
  const error = useAppSelector((state) => state.user.util.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(signUpStart());
      const res = await axios.post(`https://server.57ajay-u.workers.dev/api/v1/user/signup`, {
        name, email, password
      })
      if (res.data) {
        dispatch(signUpSuccess())
      };
      console.log("signUp successfull: \n", res.data);
      router.push("/user/signin")
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(signUpFailure(error.request.response))
        console.log(error.request.response)
      }
      console.log(error)
    }
    console.log("Sign up attempt with:", { name, email, password })
    toast({
      title: "Sign Up Attempted",
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up for StoryArc</h1>
        <p className="text-center text-red-500 font-bold">{error ? error : ""}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button disabled={loading} type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/user/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
