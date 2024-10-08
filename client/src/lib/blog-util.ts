/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import axios from 'axios';

// Types based on backend schema
export const markType = z.enum([
  "bold",
  "italic",
  "underline",
  "strike",
  "code",
  "subscript",
  "superscript",
]) as z.ZodEnum<["bold", "italic", "underline", "strike", "code", "subscript", "superscript"]>;

export type MarkType = z.infer<typeof markType>;

export const colorAttr = z.object({
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
});

export type ColorAttributes = z.infer<typeof colorAttr>;

export const alignmentAttr = z.enum(["left", "center", "right", "justify"]);
export type AlignmentType = z.infer<typeof alignmentAttr>;

// Define the schema recursively to handle circular references
const contentNodeSchema: z.ZodType<any> = z.lazy(() => 
  z.object({
    type: z.enum([
      "paragraph",
      "heading",
      "bulletList",
      "orderedList",
      "codeBlock",
      "blockquote",
      "horizontalRule",
    ]),
    attrs: z.object({
      alignment: alignmentAttr.optional(),
    }).and(colorAttr).optional(),
    content: z.array(
      z.union([
        textNodeSchema,
        listItemSchema,
        contentNodeSchema
      ])
    ),
  })
);

const textNodeSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  marks: z.array(
    z.object({
      type: markType,
      attrs: colorAttr.optional(),
    })
  ).optional(),
});

const listItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.literal("listItem"),
    content: z.array(contentNodeSchema),
  })
);

export const blogContentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(contentNodeSchema),
});

// Derive types from schemas
export type TextNode = z.infer<typeof textNodeSchema>;
export type ContentNode = z.infer<typeof contentNodeSchema>;
export type ListItem = z.infer<typeof listItemSchema>;
export type BlogContent = z.infer<typeof blogContentSchema>;

// API interfaces
export interface Blog {
  id: string;
  title: string;
  content: BlogContent;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = 'https://server.57ajay-u.workers.dev/api/v1/blog';

export const createBlog = async (title: string, content: BlogContent, token: string): Promise<Blog> => {
  const response = await axios.post(
    `${BASE_URL}/create`,
    { title, content },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.blog;
};

export const updateBlog = async (id: string, updates: { title?: string; content?: BlogContent }, token: string): Promise<Blog> => {
  const response = await axios.patch(
    `${BASE_URL}/update?id=${id}`,
    updates,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.blog;
};