import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useExport } from '@/hooks/demo/use-export'
import { toast } from 'sonner'

export function ExportButton() {
  const [format, setFormat] = useState<'csv' | 'json'>('json')
  const { exportData, isLoading } = useExport()

  const handleExport = () => {
    exportData.mutate(
      { format, rows: 100 },
      {
        onSuccess: (data) => {
          toast.success(data.message)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={format} onValueChange={(v) => setFormat(v as 'csv' | 'json')}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleExport} disabled={isLoading}>
        <Download className="mr-2 h-4 w-4" />
        {isLoading ? 'Queueing...' : 'Export Data'}
      </Button>
    </div>
  )
}
