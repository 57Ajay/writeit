"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
  id: string
  title: string
  content: string
  published: boolean
  authorId: string
}

interface UserBlogsResponse {
  userBlogs: BlogPost[]
}

export default function UserBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserBlogs = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get<UserBlogsResponse>(
          `https://server.57ajay-u.workers.dev/api/v1/blog/get-by-user?id=${id}`
        )
        setBlogs(response.data.userBlogs)
      } catch (error) {
        console.error("Error fetching user blogs:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user blogs. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchUserBlogs()
    }
  }, [id, toast])

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center">User Blogs</h1>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="w-full">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="w-full h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold line-clamp-2">{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">{blog.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {blog.published ? "Published" : "Draft"}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/blog/${blog.id}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-muted-foreground">This user has not created any blogs yet.</p>
        )}
        <div className="mt-8 text-center">
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </motion.div>
    </div>
  )
}
