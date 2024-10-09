"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BlogEditor } from '@/components/BlogEditor';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/hooks';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye } from 'lucide-react';

interface BlogContent {
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
  content: BlogContent[];
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
}

export default function UpdateBlogPage({ params }: { params: { id: string } }) {
  const user = useAppSelector((state) => state.user.user);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://server.57ajay-u.workers.dev/api/v1/blog/${params.id}`);
        setBlog(response.data.post);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast({
          title: "Error",
          description: "Failed to fetch blog. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  const handleUpdateBlog = async (data: BlogPost) => {
    if (!blog) return;

    setUpdating(true);
    try {
      const updateData = {
        ...data,
        published: blog.published,
      };

      const res = await axios.post(`https://server.57ajay-u.workers.dev/api/v1/blog/update?id=${params.id}`, updateData, {
        headers: {
          "Authorization": `Bearer ${user.token}`,
        }
      });
      console.log("Updated blog:", res.data);
      toast({
        title: "Success",
        description: "Blog updated successfully!",
      });
      router.push(`/blog/${params.id}`);
    } catch (error) {
      console.error("Error updating blog:", error);
      toast({
        title: "Error",
        description: "Failed to update blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 mt-12">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-xl">Blog not found</p>
        <Button onClick={() => router.push('/blog')}>Back to Blogs</Button>
      </div>
    );
  }

  const editorInitialData = {
    id: blog.id,
    title: blog.title,
    content: blog.content.map((block) => ({
      id: block.id,
      type: block.type,
      text: block.text || "",
      style: {
        fontWeight: block.style.fontWeight || "normal",
        textSize: block.style.textSize || "text-md",
        color: block.style.color || "text-black",
      }
    }))
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 mt-12"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-6">
            <CardTitle className="text-3xl font-bold">Update Blog</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => router.push('/blog')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Button>
              <Button variant="outline" onClick={() => router.push(`/blog/${params.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Blog
              </Button>
            </div>
          </div>
          <div className="bg-muted p-4 rounded-md mb-6 text-sm">
            <p><strong>Author:</strong> {blog.author.name}</p>
            <p><strong>Last Updated:</strong> {new Date(blog.updatedAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {blog.published ? 'Published' : 'Draft'}</p>
          </div>
        </CardHeader>
        <CardContent>
          <BlogEditor
            initialData={editorInitialData}
            onSubmit={handleUpdateBlog}
            submitButtonText="Update Blog"
            loading={updating}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}