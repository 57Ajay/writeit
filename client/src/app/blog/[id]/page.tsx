"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar } from "@/components/ui/avatar"
import { CalendarIcon, UserIcon } from "lucide-react"
import { useAppSelector } from "@/redux/hooks"
import Link from "next/link"

interface BlogPost {
  post: {
    id: string
    title: string
    content: string
    published: boolean
    authorId: string
    // author: {
    //   name: string
    //   image: string
    // }
    // createdAt: string
  }
}

export default function BlogPostPage() {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const user = useAppSelector((state) => state.user.user);
  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get<BlogPost>(`https://server.57ajay-u.workers.dev/api/v1/blog/${params.id}`)
        setBlog(response.data)
      } catch (error) {
        console.error("Error fetching blog:", error)
      }
      setIsLoading(false)
    }

    if (params.id) {
      fetchBlog()
    }
  }, [params.id])

  // const formatDate = (dateString: string) => {
  //   const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  //   return new Date(dateString).toLocaleDateString(undefined, options)
  // }
  //

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/blog')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Button
        variant="outline"
        onClick={handleGoBack}
        className="mb-4"
      >
        ← Back
      </Button>
      {isLoading ? (
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ) : blog ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full">
            <CardHeader>
              <div className="space-y-1">
                <div className="flex flex-row grid-cols-2 justify-between">
                  <CardTitle className="text-3xl font-bold">{blog.post.title}</CardTitle>
                  {user.id === blog.post.authorId ?
                    <Button onClick={() => router.push(`/blog/edit/${blog.post.id}`)} className="p-3 px-4">Edit</Button>
                    : <Button className="bg-slate-300 text-2xl"><Link href={`/blog/user/${blog.post.authorId}`}>Author</Link></Button>
                  }
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center mt-5">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {/* {formatDate(blog.post.createdAt)} */}
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="mr-1 h-4 w-4 mt-5" />
                    {/* {blog.post.author.name} */}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{blog.post.content}</p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  {/* <AvatarImage src={blog.post.author.image} alt={blog.post.author.name} /> */}
                  {/* <AvatarFallback>{blog.post.author.name.charAt(0)}</AvatarFallback> */}
                </Avatar>
                <div>
                  {/* <p className="text-sm font-medium">{blog.post.author.name}</p> */}
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <span className="text-sm text-muted-foreground">
                  {blog.post.published ? "Published" : "Draft"}
                </span>
                <span className="text-sm text-muted-foreground hidden sm:inline">•</span>
                <span className="text-sm text-muted-foreground">
                  ID: {blog.post.id}
                </span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <p className="text-center text-xl">Blog post not found.</p>
      )}
    </div>
  )
}
