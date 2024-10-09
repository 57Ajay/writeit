/* eslint-disable */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, LoaderPinwheel } from "lucide-react";

export interface Style {
  fontWeight?: "bold" | "semibold" | "normal";
  textSize?: "text-sm" | "text-md" | "text-lg";
  color?: string;
}

export type ContentType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export interface ContentBlock {
  id: number;
  type: ContentType;
  style: Style;
  text?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: any[];
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
}

interface EditorProps {
  initialData?: {
    id: string;
    title: string;
    content: any[];
  };
  onSubmit: (data: Blog) => Promise<void>;
  submitButtonText: string;
  loading?: boolean;
}

const tailwindColors = [
  "text-black", "text-white", "text-red-500", "text-blue-500", "text-green-500",
  "text-yellow-500", "text-purple-500", "text-pink-500", "text-indigo-500",
  "text-gray-500", "text-orange-500",
];

export const BlogEditor: React.FC<EditorProps> = ({
  initialData,
  onSubmit,
  submitButtonText,
  loading,
}) => {
  const { control, handleSubmit, watch, setValue } = useForm<Blog>({
    defaultValues: initialData || {
      title: "",
      content: [],
    },
  });

  const blogContent = watch("content");
  const [colorSearch, setColorSearch] = useState<string>("");

  const handleAddBlock = (type: ContentType) => {
    const newBlock: ContentBlock = {
      id: blogContent.length,
      type,
      style: {
        fontWeight: "normal",
        textSize: "text-md",
        color: "text-black",
      },
      text: "",
    };
    setValue("content", [...blogContent, newBlock]);
  };

  const handleChange = (id: number, field: keyof ContentBlock, value: any) => {
    const updatedContent = blogContent.map((block) =>
      block.id === id ? { ...block, [field]: value } : block
    );
    setValue("content", updatedContent);
  };

  const handleStyleChange = (id: number, styleKey: keyof Style, value: string) => {
    const updatedContent = blogContent.map((block) =>
      block.id === id ? {
        ...block,
        style: { ...block.style, [styleKey]: value }
      } : block
    );
    setValue("content", updatedContent);
  };

  const handleDeleteBlock = (id: number) => {
    setValue("content", blogContent.filter((block) => block.id !== id));
  };

  const filteredColors = tailwindColors.filter((color) =>
    color.toLowerCase().includes(colorSearch.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="title"
        control={control}
        rules={{ required: "Blog title is required" }}
        render={({ field, fieldState }) => (
          <div>
            <Input
              placeholder="Blog Title"
              className={`w-full text-xl font-bold ${fieldState.invalid ? 'border-red-500' : ''}`}
              {...field}
            />
            {fieldState.error && (
              <p className="text-red-500 mt-1">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {blogContent.map((block) => (
        <motion.div
          key={block.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border rounded-md"
        >
          <div className="flex items-center gap-4 mb-4">
            <Select
              value={block.type}
              onValueChange={(value: ContentType) => handleChange(block.id, "type", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select type">
                  {block.type.toUpperCase()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
                <SelectItem value="h4">Heading 4</SelectItem>
                <SelectItem value="h5">Heading 5</SelectItem>
                <SelectItem value="h6">Heading 6</SelectItem>
                <SelectItem value="p">Paragraph</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant={block.style.fontWeight === "bold" ? "default" : "outline"}
              onClick={() => handleStyleChange(
                block.id,
                "fontWeight",
                block.style.fontWeight === "bold" ? "normal" : "bold"
              )}
            >
              B
            </Button>

            <Select
              value={block.style.textSize}
              onValueChange={(value) => handleStyleChange(block.id, "textSize", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Text size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-sm">Small</SelectItem>
                <SelectItem value="text-md">Medium</SelectItem>
                <SelectItem value="text-lg">Large</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="destructive"
              onClick={() => handleDeleteBlock(block.id)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>

          {block.type === "p" ? (
            <Textarea
              placeholder="Enter paragraph text..."
              className={`w-full ${block.style.textSize} ${block.style.color} ${block.style.fontWeight === "bold" ? "font-bold" : ""}`}
              value={block.text}
              onChange={(e) => handleChange(block.id, "text", e.target.value)}
            />
          ) : (
            <Input
              placeholder={`Enter ${block.type} text...`}
              className={`w-full ${block.style.textSize} ${block.style.color} ${block.style.fontWeight === "bold" ? "font-bold" : ""}`}
              value={block.text}
              onChange={(e) => handleChange(block.id, "text", e.target.value)}
            />
          )}

          <div className="mt-2">
            <Input
              placeholder="Search color"
              value={colorSearch}
              onChange={(e) => setColorSearch(e.target.value)}
              className="mb-2"
            />
            <div className="flex gap-2 overflow-x-auto py-2">
              {filteredColors.map((color) => (
                <button
                key={color}
                type="button"
                className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 ${color}`}
                onClick={() => handleStyleChange(block.id, "color", color)}
                aria-label={color}
              >
                <LoaderPinwheel />
              </button>
              
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="flex gap-4">
        <Button type="button" onClick={() => handleAddBlock("h1")}>Add Heading</Button>
        <Button type="button" onClick={() => handleAddBlock("p")}>Add Paragraph</Button>
      </div>

      <Button disabled={loading} type="submit" className="w-full">
        {submitButtonText}
      </Button>
    </form>
  );
};