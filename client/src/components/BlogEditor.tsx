import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BlogContent, createBlog, updateBlog } from '../lib/blog-util';

interface BlogEditorProps {
  initialBlog?: {
    id: string;
    title: string;
    content: BlogContent;
  };
  onSuccess: (blog: {id: string}) => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ initialBlog, onSuccess }) => {
  const user = useAppSelector((state) => state.user.user);
  const [title, setTitle] = useState(initialBlog?.title || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialBlog?.content || {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: '' }]
      }]
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    setIsLoading(true);
    setError(null);

    try {
      const content = editor.getJSON() as BlogContent;
      let result;
      
      if (initialBlog) {
        result = await updateBlog(
          initialBlog.id,
          { title, content },
          user.token
        );
      } else {
        result = await createBlog(title, content, user.token);
      }

      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{initialBlog ? 'Edit Blog' : 'Create New Blog'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-semibold"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
                <div className="border-l mx-2" />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  data-active={editor.isActive('bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  data-active={editor.isActive('italic')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  data-active={editor.isActive('underline')}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  data-active={editor.isActive('code')}
                >
                  <Code className="h-4 w-4" />
                </Button>
                <div className="border-l mx-2" />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  data-active={editor.isActive({ textAlign: 'left' })}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  data-active={editor.isActive({ textAlign: 'center' })}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  data-active={editor.isActive({ textAlign: 'right' })}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  data-active={editor.isActive({ textAlign: 'justify' })}
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
                <div className="border-l mx-2" />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  data-active={editor.isActive('heading', { level: 1 })}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  data-active={editor.isActive('heading', { level: 2 })}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  data-active={editor.isActive('bulletList')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  data-active={editor.isActive('orderedList')}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  data-active={editor.isActive('blockquote')}
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <EditorContent editor={editor} />
              </div>
            </div>

            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialBlog ? 'Update Blog' : 'Publish Blog'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};