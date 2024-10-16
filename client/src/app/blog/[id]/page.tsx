"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, UserIcon, ArrowLeft, Edit, User } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

interface ContentBlock {
  id: number;
  text: string;
  type: string;
  style: {
    color: string;
    textSize: string;
    fontWeight: string;
  };
}

interface BlogPost {
  id: string;
  title: string;
  content: ContentBlock[];
  published: boolean;
  authorId: string;
  createdAt: string;
  author: {
    name: string;
  };
}

export default function BlogPostPage() {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<{ post: BlogPost }>(
          `https://server.57ajay-u.workers.dev/api/v1/blog/${params.id}`
        );
        setBlog(response.data.post);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
      setIsLoading(false);
    };

    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  const renderContent = (content: ContentBlock[]) => {
    return content.map((block) => {
      const { color, textSize, fontWeight } = block.style;

      const baseClasses = `${color} ${textSize} font-${fontWeight} mb-4`;

      switch (block.type) {
        case "h1":
          return (
            <motion.h1
              key={block.id}
              className={`${baseClasses} text-3xl md:text-4xl font-bold leading-tight`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {block.text}
            </motion.h1>
          );
        case "h2":
          return (
            <motion.h2
              key={block.id}
              className={`${baseClasses} text-2xl md:text-3xl font-semibold leading-snug`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {block.text}
            </motion.h2>
          );
        case "p":
          return (
            <motion.p
              key={block.id}
              className={`${baseClasses} text-base md:text-lg leading-relaxed`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {block.text}
            </motion.p>
          );
        default:
          return null;
      }
    });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/blog");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Button variant="outline" onClick={handleGoBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      {isLoading ? (
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ) : blog ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full">
            <CardHeader>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-3xl sm:text-4xl font-bold">{blog.title}</CardTitle>
                  {user.id === blog.authorId ? (
                    <Button onClick={() => router.push(`/blog/edit/${blog.id}`)} className="px-4 py-2">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <Button variant="secondary" asChild>
                      <Link href={`/blog/user/${blog.authorId}`} className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Author
                      </Link>
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="mr-1 h-4 w-4" />
                    {blog.author.name}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              {renderContent(blog.content)}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 border-t pt-6">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{blog.author.name}</p>
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center text-sm text-muted-foreground">
                <span>{blog.published ? "Published" : "Draft"}</span>
                <span className="hidden sm:inline">•</span>
                <span>ID: {blog.id}</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <p className="text-center text-xl">Blog post not found.</p>
      )}
    </div>
  );
}