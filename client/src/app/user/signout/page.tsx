"use client";

import { useAppDispatch } from "@/redux/hooks";
import { signOutSuccess } from "@/redux/slices/user.slice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";

const SignOut = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  console.log("This is user Token: \n", user.token);
  useEffect(() => {
    const signOutUser = async () => {
      try {
        console.log("Check: \n", user.token)
        await axios.post("https://server.57ajay-u.workers.dev/api/v1/user/signout", {}, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        dispatch(signOutSuccess());


        toast({
          title: "Sign Out Successful",
          description: "You have been logged out successfully.",
        });
        router.push("/");
      } catch (error) {

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

    signOutUser();
  }, []);

  return null
};

export default SignOut;

