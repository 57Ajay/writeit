"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppSelector } from "@/redux/hooks"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  content: string
  published: boolean
  authorId: string
}

interface BlogResponse {
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  totalBlogs: number
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const user = useAppSelector((state) => state.user.user)

  const fetchBlogs = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await axios.get<BlogResponse>(`https://server.57ajay-u.workers.dev/api/v1/blog/get-all?page=${page}&limit=5`)
      setBlogs(response.data.posts)
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBlogs(currentPage)
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleReadMore = (blogId: string) => {
    router.push(`/blog/${blogId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h1>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="w-full">
                <CardHeader>
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="w-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex grid-cols-2 justify-between">
                      <CardTitle>{blog.title}</CardTitle>
                      {user.id === blog.authorId ?
                        <Button><Link href={`/blog/edit/${blog.id}`}>Edit</Link></Button> :
                        ""
                      }
                    </div>

                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{blog.content.substring(0, 150)}...</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {blog.published ? "Published" : "Draft"}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleReadMore(blog.id)}>
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-center mt-8 space-x-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          variant="outline"
        >
          Previous
        </Button>
        <span className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md">
          {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div >
  )
}
