'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/redux/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import MarkdownDisplay from '@/components/MarkdownDisplay'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

interface Blog {
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

interface BlogsResponse {
  posts: Blog[]
  currentPage: number
  totalPages: number
  totalBlogs: number
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const user = useAppSelector((state) => state.user.user)

  const fetchBlogs = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await axios.get<BlogsResponse>(
        `https://server.57ajay-u.workers.dev/api/v1/blog/get-all?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setBlogs(response.data.posts)
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      alert('Failed to fetch blogs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs(currentPage)
  }, [currentPage, user.token])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  if (isLoading) {
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
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Card key={blog.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <MarkdownDisplay content={blog.content.slice(0, 150) + '...'} />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                By {blog.author.name} on {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              <div className="space-x-2">
                <Button onClick={() => router.push(`/blog/${blog.id}`)}>View</Button>
                {blog.authorId === user.id && (
                  <Button variant="outline" onClick={() => router.push(`/update-blog/${blog.id}`)}>
                    Edit
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center items-center mt-8 space-x-4">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  )
}