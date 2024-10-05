import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen mt-5">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to StoryArc
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover, create, and share captivating stories with our vibrant community of writers and readers.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/user/signup">Get Started</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 md:mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <span className="text-4xl">✍️</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Write & Publish</h3>
                <p className="text-gray-500 dark:text-gray-400">Create and share your stories with ease on any device.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Discover</h3>
                <p className="text-gray-500 dark:text-gray-400">Find new stories and authors {`you'll`} love, anywhere, anytime.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Engage</h3>
                <p className="text-gray-500 dark:text-gray-400">Connect with other writers and readers in our mobile-friendly community.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Start Your Journey Today</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join our community of storytellers and begin your writing adventure, no matter where you are.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/user/signup">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Write On The Go</h2>
                <p className="text-gray-500 dark:text-gray-400 md:text-lg">
                  {`StoryArc's`} mobile-friendly platform allows you to write, edit, and publish your stories from anywhere.
                  Whether {`you're`} on a bus, in a café, or lounging at home, your next great story is just a tap away.
                </p>
                <Button asChild>
                  <Link href="/user/signup">Start Writing</Link>
                </Button>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-sm h-96 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center">
                  <span className="text-4xl">📱</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 StoryArc. All rights reserved.</p>
            <nav className="flex gap-4 mt-4 md:mt-0">
              <Link className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" href="#">
                Privacy Policy
              </Link>
              <Link className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" href="#">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
