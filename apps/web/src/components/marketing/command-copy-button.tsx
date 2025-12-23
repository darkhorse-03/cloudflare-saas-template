import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface CommandCopyButtonProps {
  command: string
  variant?: 'default' | 'large'
}

export function CommandCopyButton({ command, variant = 'default' }: CommandCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      toast.success('Command copied to clipboard!', {
        description: 'Run it in your terminal to get started.',
      })

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (_error) {
      toast.error('Failed to copy', {
        description: 'Please try again or copy the command manually.',
      })
    }
  }

  if (variant === 'large') {
    return (
      <div className="group relative">
        <Button
          className="relative h-14 w-full rounded-lg bg-primary px-8 font-mono text-lg transition-all hover:scale-105 sm:w-auto sm:min-w-[400px]"
          onClick={handleCopy}
          size="lg"
        >
          <span className="flex items-center gap-3">
            {copied ? (
              <>
                <Check className="size-5 animate-in fade-in zoom-in" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-5" />
                <span>{command}</span>
              </>
            )}
          </span>
        </Button>
      </div>
    )
  }

  return (
    <div className="not-prose group relative flex items-center gap-2 rounded-lg bg-muted/50 p-4">
      <code className="flex-1 font-mono text-sm">{command}</code>
      <Button
        aria-label="Copy command"
        className="size-8 p-0 transition-colors hover:bg-background"
        onClick={handleCopy}
        size="sm"
        variant="ghost"
      >
        {copied ? (
          <Check className="size-4 animate-in fade-in zoom-in text-green-500" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </div>
  )
}
