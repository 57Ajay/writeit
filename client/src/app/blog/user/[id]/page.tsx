"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Clock, Edit } from 'lucide-react';
import Link from 'next/link';
import router from 'next/router';

interface Author {
  id: string;
  name: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface UserBlogsResponse {
  userBlogs: Blog[];
}

const UserBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = router.query;
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get<UserBlogsResponse>(`https://server.57ajay-u.workers.dev/api/v1/blog/get-by-user?id=${id}`);
        setBlogs(response.data.userBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">My Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4">{blog.content.substring(0, 100)}...</p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <User size={16} className="mr-2" />
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock size={16} className="mr-2" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <Link href={`/blog/edit/${blog.id}`} className="flex items-center text-blue-500 hover:underline">
                <Edit size={16} className="mr-2" />
                Edit Blog
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserBlogsPage;