'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/redux/hooks'
import MarkdownEditor from '@/components/MarkdownEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function UpdateBlog({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const router = useRouter()
  const user = useAppSelector((state) => state.user.user)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://server.57ajay-u.workers.dev/api/v1/blog/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        setTitle(response.data.post.title)
        setContent(response.data.post.content)
      } catch (error) {
        console.error('Error fetching blog:', error)
        alert('Failed to fetch blog. Please try again.')
      } finally {
        setIsFetching(false)
      }
    }

    fetchBlog()
  }, [params.id, user.token])

  const handleUpdateBlog = async () => {
    if (!title || !content) {
      alert('Please fill in both title and content')
      return
    }

    setIsLoading(true)
    try {
      await axios.post(
        `https://server.57ajay-u.workers.dev/api/v1/blog/update?id=${params.id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      router.push(`/blog/${params.id}`)
    } catch (error) {
      console.error('Error updating blog:', error)
      alert('Failed to update blog. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
      <h1 className="text-3xl font-bold mb-6 mt-12">Update Blog Post</h1>
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <MarkdownEditor
            initialValue={content}
            onSave={(newContent) => setContent(newContent)}
          />
        </div>
        <Button
          onClick={handleUpdateBlog}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Blog Post'
          )}
        </Button>
      </div>
    </motion.div>
  )
}