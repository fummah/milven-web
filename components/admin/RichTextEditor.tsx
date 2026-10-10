"use client"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import TiptapImage from "@tiptap/extension-image"
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo2,
  Redo2,
  ImagePlus
} from "lucide-react"
import { cn } from "@/lib/utils"

function ToolbarButton({
  active,
  onClick,
  children
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-navy-600 transition-colors hover:bg-cream",
        active && "bg-navy-900 text-white"
      )}
    >
      {children}
    </button>
  )
}

export function RichTextEditor({
  value,
  onChange
}: {
  value: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      TiptapImage
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose-milven min-h-[360px] rounded-b-xl border border-t-0 border-navy-100 bg-white p-5 focus:outline-none"
      }
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  })

  if (!editor) {
    return <div className="h-64 animate-pulse rounded-xl bg-cream" />
  }

  function setLink() {
    const url = window.prompt("Link URL")
    if (!url) return
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  function addImage() {
    const url = window.prompt("Image URL")
    if (!url) return
    editor!.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-navy-100 bg-cream/60 p-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage}>
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-navy-100" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
