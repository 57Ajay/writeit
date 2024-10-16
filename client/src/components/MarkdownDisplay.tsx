import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'
import { CodeProps } from 'react-markdown/lib/ast-to-react'

interface MarkdownDisplayProps {
  content: string
}

type CodeProp = typeof CodeProps

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }: CodeProp) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
              style={vscDarkPlus as any}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        img: (props) => (
          <Image
            src={props.src || ''}
            alt={props.alt || ''}
            width={500}
            height={300}
            className="rounded-lg my-4"
          />
        ),
      }}
      className="prose dark:prose-invert max-w-none"
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownDisplay