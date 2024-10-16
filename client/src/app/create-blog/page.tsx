'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/redux/hooks'
import MarkdownEditor from '@/components/MarkdownEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function CreateBlog() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const user = useAppSelector((state) => state.user.user)

  const handleCreateBlog = async () => {
    if (!title || !content) {
      alert('Please fill in both title and content')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(
        'https://server.57ajay-u.workers.dev/api/v1/blog/create',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      router.push(`/blog/${response.data.blog.id}`)
    } catch (error) {
      console.error('Error creating blog:', error)
      alert('Failed to create blog. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-3xl font-bold mb-6 mt-12">Create New Blog Post</h1>
      <div className="space-y-6">
        <div className="w-full">
          <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title"
            className="mt-1 w-full"
          />
        </div>
        <div className="w-full">
          <Label htmlFor="content" className="text-lg font-semibold">Content</Label>
          <MarkdownEditor
            initialValue={content}
            onSave={(newContent) => setContent(newContent)}
          />
        </div>
        <Button
          onClick={handleCreateBlog}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Blog Post'
          )}
        </Button>
      </div>
    </motion.div>
  )
}