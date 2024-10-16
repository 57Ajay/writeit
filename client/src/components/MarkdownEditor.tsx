"use client"

import React, { useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Editor } from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bold, Italic, List, ListOrdered, Image, Link, Eye } from 'lucide-react'
import MarkdownDisplay from './MarkdownDisplay'

interface MarkdownEditorProps {
  initialValue: string
  onSave: (content: string) => void
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialValue, onSave }) => {
  const [content, setContent] = useState(initialValue)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const { theme } = useTheme()

  const handleEditorChange = useCallback((value: string | undefined) => {
    setContent(value || '')
  }, [])

  const insertMarkdown = (markdown: string) => {
    setContent((prevContent) => prevContent + markdown)
  }

  const toolbarButtons = [
    { icon: <Bold size={18} />, markdown: '**Bold**', label: 'Bold' },
    { icon: <Italic size={18} />, markdown: '*Italic*', label: 'Italic' },
    { icon: <List size={18} />, markdown: '\n- List item', label: 'Unordered List' },
    { icon: <ListOrdered size={18} />, markdown: '\n1. List item', label: 'Ordered List' },
    { icon: <Image size={18} />, markdown: '![Alt text](image-url)', label: 'Image' },
    { icon: <Link size={18} />, markdown: '[Link text](url)', label: 'Link' },
  ]

  return (
    <div className="w-full border rounded-lg overflow-hidden shadow-lg">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'write' | 'preview')}>
        <div className="flex items-center justify-between p-2 bg-muted">
          <TabsList>
            <TabsTrigger value="write" className="data-[state=active]:bg-background">Write</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-background">Preview</TabsTrigger>
          </TabsList>
          <div className="flex space-x-1">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={() => insertMarkdown(button.markdown)}
                title={button.label}
              >
                {button.icon}
              </Button>
            ))}
          </div>
        </div>
        <TabsContent value="write" className="p-0 m-0">
          <Editor
            height="60vh"
            defaultLanguage="markdown"
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            value={content}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              lineNumbers: 'off',
              fontSize: 16,
            }}
          />
        </TabsContent>
        <TabsContent value="preview" className="p-4 m-0 h-[60vh] overflow-auto bg-background">
          <MarkdownDisplay content={content} />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end p-2 bg-muted">
        <Button onClick={() => onSave(content)} className="flex items-center gap-2">
          <Eye size={18} />
          Save
        </Button>
      </div>
    </div>
  )
}

export default MarkdownEditor