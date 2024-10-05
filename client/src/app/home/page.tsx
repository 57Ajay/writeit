"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface UserBlog {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}

interface UserBlogsResponse {
  userBlogs: UserBlog[];
}

export default function HomePage() {
  const user = useAppSelector((state) => state.user.user);
  const [userBlogs, setUserBlogs] = useState<UserBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user.token) {
      router.push("/");
      return;
    }

    const fetchUserBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<UserBlogsResponse>(
          `https://server.57ajay-u.workers.dev/api/v1/blog/get-by-user?id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );
        setUserBlogs(response.data.userBlogs);
      } catch (error) {
        console.error("Error fetching user blogs:", error);

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBlogs();
  }, [router, user.id, user.token]);


  if (!user.token) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Welcome to StoryArc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Your Blogs</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userBlogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex grid-cols-2 justify-between">
                      <CardTitle>{blog.title}</CardTitle>
                      <Button><Link href={`/blog/edit/${blog.id}`}>Edit</Link></Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {blog.content.length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {blog.published ? "Published" : "Draft"}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/blog/${blog.id}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center p-6">
              <p className="text-muted-foreground mb-4">You {`haven't`} created any blogs yet.</p>
              <Button asChild>
                <Link href="/create-blog">Create Your First Blog</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="flex justify-center">
          <Button
            className="w-[95%] mt-2 bg-red-500 text-white font-semibold hover:bg-red-700 px-4 py-2 rounded-md transition-all duration-300 ease-in-out"
          >
            <Link href={`/blog/delete`} className="w-full text-center">
              Delete Blogs
            </Link>
          </Button>
        </div>

      </motion.div>
    </div>
  );
}
