import React from 'react';
import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Type,
  CircuitBoard,
  LayoutGrid,
  Palette,
  Film,
  StepForward,
  Database,
  CloudCog,
  FileJson,
  Cloud,
  Aperture
} from 'lucide-react';

const technologies = [
  { name: 'TypeScript', icon: Type },
  { name: 'React', icon: CircuitBoard },
  {name: 'lucide-react', icon: Aperture},
  { name: 'Redux', icon: LayoutGrid },
  { name: 'Tailwind CSS', icon: Palette },
  { name: 'Framer Motion', icon: Film },
  { name: 'Next.js', icon: StepForward },
  { name: 'Hono.js', icon: CloudCog },
  { name: 'PostgreSQL', icon: Database },
  { name: 'Prisma', icon: Database },
  { name: 'Zod', icon: FileJson },
  { name: 'Cloudflare', icon: Cloud }
];

const features = [
  'Create, delete, and update blog posts',
  'See others blogposts',
  'Markdown support',
  'User authentication (Sign up, Sign in, Sign out)',
  'Responsive design',
  'Dark and light mode support',
];

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/57ajay' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/upajay' },
  { name: 'Twitter', icon: Twitter, url: 'https://x.com/57ajy' },
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/57aja.y' },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 mt-12">
          StoryArc
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">About the Project</h2>
          <p className="text-lg">
            This blogging application is a project developed by Ajay Upadhyay, a CSE undergraduate student. It showcases modern web development techniques and technologies, providing a robust platform for creating and managing blog content.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Technologies Used</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-6 h-6" />
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Connect with Me</h2>
          <div className="flex justify-center space-x-6">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl hover:text-blue-500 transition-colors duration-300"
                >
                  <Icon className="w-8 h-8" />
                </a>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
