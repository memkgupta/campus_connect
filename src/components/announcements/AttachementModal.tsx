"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"

export type AttachmentType = "file" | "image" | "link"

interface AttachmentModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    type: AttachmentType
    title: string
    description?: string
    linkUrl?: string
    file?: File
  }) => void
}

export default function AttachmentModal({ open, onClose, onSubmit }: AttachmentModalProps) {
  const [type, setType] = useState<AttachmentType>("file")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = () => {
    if (!title) return
    onSubmit({ type, title, description, linkUrl, file: file || undefined })
    onClose()
    setTitle("")
    setDescription("")
    setLinkUrl("")
    setFile(null)
    setType("file")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Attachment</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v: AttachmentType) => setType(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Attachment title" />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (optional)" />
          </div>

          {type === "link" ? (
            <div className="grid gap-2">
              <Label>Link URL</Label>
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label>Upload {type}</Label>
              <Input type="file" accept={type === "image" ? "image/*" : undefined} onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="gap-1">
              <Upload className="w-4 h-4" /> Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
