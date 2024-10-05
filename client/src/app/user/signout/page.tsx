"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signOutSuccess } from "@/redux/slices/user.slice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SignOutPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user.user);

  if (user.token === "") {
    router.push("/");
    return null;
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        "https://server.57ajay-u.workers.dev/api/v1/user/signout",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      dispatch(signOutSuccess());

      toast({
        title: "Sign Out Successful",
        description: "You have been logged out successfully. See you soon!",
      });

      router.push("/");
    } catch (error) {
      setIsLoading(false);
      let errorMessage = "Sign out failed. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Error occurred during sign out.";
      }
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-12 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign Out</CardTitle>
            <CardDescription>{`We'll`} miss you! Are you sure you want to sign out?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Your data and preferences will be saved</p>
              <p>• You can sign back in anytime</p>
              <p>• Logging out helps keep your account secure</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignOutPage;
