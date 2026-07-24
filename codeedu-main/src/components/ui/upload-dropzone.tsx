import { useRef } from 'react'

interface UploadDropzoneProps {
  id: string
  accept?: Record<string, string[]>
  maxSize?: number // in bytes
}

export function UploadDropzone({ id, accept, maxSize }: UploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (maxSize && file.size > maxSize) {
      alert(`File size exceeds limit of ${maxSize / (1024 * 1024)} MB`)
      return
    }

    console.log('Uploaded file:', file)
    // you can handle file upload here
  }

  return (
    <div className="border border-dashed border-gray-400 rounded-lg p-4 text-center">
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={Object.keys(accept || {}).join(',')}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-sm text-blue-600 hover:underline"
      >
        Click to upload
      </button>
      <p className="text-xs text-gray-500 mt-1">Supported: PDF or video, Max {maxSize ? `${maxSize / (1024 * 1024)} MB` : '10 MB'}</p>
    </div>
  )
}
