/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { BlogEditor } from '@/components/BlogEditor';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/redux/hooks';


export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://server.57ajay-u.workers.dev/api/v1/blog/${params.id}`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          }
        );
        setBlog(response.data.blog);
      } catch (err) {
        console.log(err)
        setError('Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id, user.token]);

  const handleSuccess = (updatedBlog: { id: string; }) => {
    router.push(`/blog/${updatedBlog.id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="container mx-auto py-8">
      <BlogEditor
        initialBlog={{
          id: blog.id,
          title: blog.title,
          content: blog.content,
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}