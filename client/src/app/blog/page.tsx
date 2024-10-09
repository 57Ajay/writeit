'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight, Calendar, User, Eye, Edit, UserCircle } from 'lucide-react'
import { useAppSelector } from '@/redux/hooks'

type StyleObject = {
  color?: string
  textSize?: string
  fontSize?: string
  fontWeight?: string
}

type ContentItem = {
  id: number | string
  text?: string
  type: string
  style?: StyleObject
  styles?: StyleObject
  content?: string
}

type BlogPost = {
  id: string
  title: string
  content: ContentItem[]
  published: boolean
  authorId: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
  }
}

type BlogResponse = {
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  totalBlogs: number
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const user = useAppSelector((state) => state.user.user)

  useEffect(() => {
    fetchBlogs(currentPage)
    setCurrentUserId(user.id)
  }, [currentPage])

  const fetchBlogs = async (page: number) => {
    try {
      const response = await fetch(`https://server.57ajay-u.workers.dev/api/v1/blog/get-all?page=${page}&limit=6`)
      const data: BlogResponse = await response.json()
      setBlogs(data.posts)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  }

  return (
    <div className="container mx-auto py-8 mt-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <BlogCard key={blog.id} blog={blog} index={index} currentUserId={currentUserId} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            Page {currentPage} of {totalPages}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Pagination>
      </div>
    </div>
  )
}

function BlogCard({ blog, index, currentUserId }: { blog: BlogPost; index: number; currentUserId: string | null }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-1 h-3 w-3" />
            {blog.author.name}
            <span className="mx-1">•</span>
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(blog.createdAt).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          {blog.content.slice(0, 2).map((item, i) => {
            const Element = item.type as keyof JSX.IntrinsicElements
            const style: StyleObject = { ...item.style, ...item.styles }
            const text = item.text || item.content || ''
            
            return (
              <Element
                key={item.id}
                className={`
                  ${style.color ?? ''}
                  ${style.textSize ?? style.fontSize ?? ''}
                  ${style.fontWeight ?? ''}
                  ${i > 0 ? 'mt-2' : ''}
                `.trim()}
              >
                {text}
              </Element>
            )
          })}
          {blog.content.length > 2 && (
            <p className="mt-2 text-sm text-muted-foreground">
              ... (more content available)
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/blog/${blog.id}`} passHref>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>
          {currentUserId === blog.authorId ? (
            <Link href={`/blog/edit/${blog.id}`} passHref>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          ) : (
            <Link href={`/blog/user/${blog.author.id}`} passHref>
              <Button variant="outline" size="sm">
                <UserCircle className="mr-2 h-4 w-4" />
                Author
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}