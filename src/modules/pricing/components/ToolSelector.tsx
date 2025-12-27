"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const TOOLS = [
  { id: 'all', name: 'All Tools' },
  { id: 'keyword-research', name: 'Keyword Research' },
  { id: 'mailer', name: 'Mailer Tool' },
];

type ToolSelectorProps = {
  selectedTool: string | null
  onToolChange: (tool: string | null) => void
}

export function ToolSelector({ selectedTool, onToolChange }: ToolSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-muted/20 p-1 rounded-lg">
      <Label htmlFor="tool-selector" className="text-sm font-medium whitespace-nowrap">
        Tool:
      </Label>
      <Select value={selectedTool || "all"} onValueChange={(value) => onToolChange(value === "all" ? null : value)}>
        <SelectTrigger id="tool-selector" className="w-62.5">
          <SelectValue placeholder='Tools'/>
        </SelectTrigger>
        <SelectContent>
          {TOOLS.map((tool) => (
            <SelectItem key={tool.id} value={tool.id}>
              {tool.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
