"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { useAppSelector } from "@/redux/hooks"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
  id: string
  title: string
  content: string
  published: boolean
  authorId: string
}

export default function DeleteBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const user = useAppSelector((state) => state.user.user)

  useEffect(() => {
    const fetchUserBlogs = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get<{ userBlogs: BlogPost[] }>(
          `https://server.57ajay-u.workers.dev/api/v1/blog/get-by-user?id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        setBlogs(response.data.userBlogs)
      } catch (error) {
        console.error("Error fetching user blogs:", error)
        toast({
          title: "Error",
          description: "Failed to fetch your blogs. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserBlogs()
  }, [user.id, user.token, toast])

  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    )
  }

  const handleDeleteBlogs = async () => {
    if (selectedBlogs.length === 0) {
      toast({
        title: "No blogs selected",
        description: "Please select at least one blog to delete.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)
    try {
      await axios.delete("https://server.57ajay-u.workers.dev/api/v1/blog/delete", {
        data: { blogIds: selectedBlogs },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => !selectedBlogs.includes(blog.id)))
      setSelectedBlogs([])

      toast({
        title: "Success",
        description: `${selectedBlogs.length} blog(s) deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting blogs:", error)
      toast({
        title: "Error",
        description: "Failed to delete blogs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Delete Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : blogs.length > 0 ? (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        id={blog.id}
                        checked={selectedBlogs.includes(blog.id)}
                        onCheckedChange={() => handleSelectBlog(blog.id)}
                      />
                      <label
                        htmlFor={blog.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {blog.title}
                      </label>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">You have no blogs to delete.</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/blog")}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBlogs}
              disabled={isDeleting || selectedBlogs.length === 0}
            >
              {isDeleting ? "Deleting..." : `Delete ${selectedBlogs.length} Blog(s)`}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
