'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/redux/hooks'
import MarkdownDisplay from '@/components/MarkdownDisplay'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit, Loader2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  content: string
  published: boolean
  authorId: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
  }
}

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const user = useAppSelector((state) => state.user.user)
  const router = useRouter()

  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axios.get<{ post: BlogPost }>(
          `https://server.57ajay-u.workers.dev/api/v1/blog/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        setPost(response.data.post)
      } catch (err) {
        setError('Failed to fetch the blog post. Please try again.')
        console.error('Error fetching blog post:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchBlogPost()
    }
  }, [params.id, user.token])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <p>The requested blog post could not be found.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-4xl font-bold mb-4 mt-12">{post.title}</h1>
      <div className="flex items-center justify-between mb-8 text-sm text-muted-foreground">
        <p>By {post.author.name}</p>
        <p>Published on {new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="prose dark:prose-invert max-w-none mb-8">
        <MarkdownDisplay content={post.content} />
      </div>
      {user.id === post.authorId && (
        <Button
          onClick={() => {
            router.push(`/blog/edit/${post.id}`)
          }}
          className="flex items-center gap-2"
        >
          <Edit size={16} />
          Edit Post
        </Button>
      )}
    </motion.div>
  )
}