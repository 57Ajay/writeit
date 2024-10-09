"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { BlogEditor, Blog } from '@/components/BlogEditor';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/hooks';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateBlogPage() {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBlog = async (data: Blog) => {
    if (data.content.length === 0) {
      toast({
        title: "Error",
        description: "Blog contents cannot be empty.",
        variant: "destructive",
      });
      console.log("Fill other things")
      return;
    }
    console.log("Creating blog:", data)
    setIsCreating(true);
    try {
      const res = await axios.post("https://server.57ajay-u.workers.dev/api/v1/blog/create", data, {
        headers: {
          "Authorization": `Bearer ${user.token}`,
        }
      });
      console.log("Created blog:", res.data);
      toast({
        title: "Success",
        description: "Blog created successfully!",
      });
      router.push(`/blog/${res.data.id}`);
    } catch (error) {
      console.error("Error creating blog:", error);
      toast({
        title: "Error",
        description: "Failed to create blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 mt-12"
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center mb-6">
            <CardTitle className="text-3xl font-bold">Create New Blog</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => router.push('/blog')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BlogEditor
            onSubmit={handleCreateBlog}
            submitButtonText="Create Blog"
            loading={isCreating}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}