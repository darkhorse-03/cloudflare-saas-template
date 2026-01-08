import { config } from '@repo/config'
import { FileIcon, ImageIcon, Trash2Icon, UploadIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useAvatar,
  useDeleteAvatar,
  useDeleteFile,
  useStorageFiles,
  useStorageStatus,
  useUploadAvatar,
  useUploadFile,
} from '@/hooks/storage/use-storage'
import { useSession } from '@/lib/auth-client'

const IMAGE_EXTENSION_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImageFile(key: string): boolean {
  return IMAGE_EXTENSION_REGEX.test(key)
}

interface StorageFile {
  key: string
  size: number
}

interface FileListProps {
  filesLoading: boolean
  files: { objects: StorageFile[] } | undefined
  deleteFile: { isPending: boolean }
  onDeleteFile: (key: string) => void
}

function FileList({ filesLoading, files, deleteFile, onDeleteFile }: FileListProps) {
  if (filesLoading) {
    return <p className="text-muted-foreground text-sm mt-2">Loading...</p>
  }

  if (!files?.objects || files.objects.length === 0) {
    return <p className="text-muted-foreground text-sm mt-2">No files uploaded yet</p>
  }

  return (
    <ul className="mt-2 space-y-2">
      {files.objects.map((file) => {
        const FileTypeIcon = isImageFile(file.key) ? ImageIcon : FileIcon
        return (
          <li key={file.key} className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div className="flex items-center gap-2 min-w-0">
              <FileTypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm truncate">{file.key.split('/').pop()}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatFileSize(file.size)}
              </span>
            </div>
            <Button
              disabled={deleteFile.isPending}
              onClick={() => onDeleteFile(file.key)}
              size="icon"
              variant="ghost"
            >
              <Trash2Icon className="h-4 w-4" />
              <span className="sr-only">Delete file</span>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export function StorageDemo() {
  const { data: status } = useStorageStatus()
  const { data: session } = useSession()
  const { data: files, isLoading: filesLoading } = useStorageFiles()
  const { data: avatar } = useAvatar()

  const uploadFile = useUploadFile()
  const deleteFile = useDeleteFile()
  const uploadAvatar = useUploadAvatar()
  const deleteAvatar = useDeleteAvatar()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  if (!status?.enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Storage Demo</CardTitle>
          <CardDescription>R2 file storage is not enabled</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            To enable storage, set{' '}
            <code className="bg-muted px-1 rounded">storage.enabled: true</code> in{' '}
            <code className="bg-muted px-1 rounded">packages/config/src/index.ts</code> and
            redeploy.
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    const file = files[0]

    // Validate file size
    if (file.size > config.storage.maxFileSize) {
      toast.error(`File too large. Max size: ${formatFileSize(config.storage.maxFileSize)}`)
      return
    }

    try {
      await uploadFile.mutateAsync({ file })
      toast.success('File uploaded successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    }
  }

  const handleAvatarUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    const file = files[0]

    // Validate file size
    if (file.size > config.storage.avatars.maxSize) {
      toast.error(`Avatar too large. Max size: ${formatFileSize(config.storage.avatars.maxSize)}`)
      return
    }

    try {
      await uploadAvatar.mutateAsync(file)
      toast.success('Avatar uploaded successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Avatar upload failed')
    }
  }

  const handleDeleteFile = async (key: string) => {
    try {
      await deleteFile.mutateAsync(key)
      toast.success('File deleted')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed')
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar.mutateAsync()
      toast.success('Avatar deleted')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileUpload(e.dataTransfer.files)
  }

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Upload your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {avatar?.avatar?.url ? <AvatarImage src={`/api${avatar.avatar.url}`} /> : null}
              <AvatarFallback className="text-2xl">
                {session?.user?.name?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Input
                ref={avatarInputRef}
                accept={config.storage.avatars.allowedTypes.join(',')}
                className="hidden"
                onChange={(e) => handleAvatarUpload(e.target.files)}
                type="file"
              />
              <div className="flex gap-2">
                <Button
                  disabled={uploadAvatar.isPending}
                  onClick={() => avatarInputRef.current?.click()}
                  size="sm"
                  variant="outline"
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  {uploadAvatar.isPending ? 'Uploading...' : 'Upload'}
                </Button>
                {avatar?.avatar && (
                  <Button
                    disabled={deleteAvatar.isPending}
                    onClick={handleDeleteAvatar}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                Max {formatFileSize(config.storage.avatars.maxSize)}.{' '}
                {config.storage.avatars.allowedTypes.join(', ')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>Upload files to R2 storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop Zone */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Drop zone requires drag event handlers */}
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Drop zone requires drag event handlers */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              accept={config.storage.allowedMimeTypes.join(',')}
              className="hidden"
              id="file-upload"
              onChange={(e) => handleFileUpload(e.target.files)}
              type="file"
            />
            <UploadIcon className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop a file here, or{' '}
              <label className="text-primary underline cursor-pointer" htmlFor="file-upload">
                browse
              </label>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Max {formatFileSize(config.storage.maxFileSize)}
            </p>
            {uploadFile.isPending && <p className="mt-2 text-sm text-primary">Uploading...</p>}
          </div>

          {/* File List */}
          <div>
            <Label className="text-sm font-medium">Your Files</Label>
            <FileList
              deleteFile={deleteFile}
              files={files}
              filesLoading={filesLoading}
              onDeleteFile={handleDeleteFile}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
