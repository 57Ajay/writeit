/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { BlogEditor } from '@/components/BlogEditor';



export default function CreateBlogPage() {
  const router = useRouter();

  const handleSuccess = (blog: any) => {
    router.push(`/blog/${blog.id}`);
  };

  return (
    <div className="container mx-auto py-8">
      <BlogEditor onSuccess={handleSuccess} />
    </div>
  );
}