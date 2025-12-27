"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RequirementEntity, RequirementFormValues, requirementSchema } from "../utils"

type RequirementDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  requirement?: RequirementEntity
  onSave: (requirement: RequirementEntity) => void
}

export function RequirementDialog({ open, onOpenChange, requirement, onSave }: RequirementDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RequirementFormValues>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      name: "",
      description: "",
      required: false,
      category: "technical",
    },
  })

  useEffect(() => {
    if (requirement) {
      reset(requirement)
    } else {
      reset({
        name: "",
        description: "",
        required: false,
        category: "technical",
      })
    }
  }, [requirement, open, reset])

  const onSubmit = (data: RequirementFormValues) => {
    onSave({
      id: requirement?.id || Date.now().toString(),
      ...data,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{requirement ? "Edit Requirement" : "Create New Requirement"}</DialogTitle>
          <DialogDescription>Define requirements that will be assigned to plans from plan editing</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="req-name">Requirement Name</Label>
            <Input id="req-name" {...register("name")} placeholder="e.g., SSL Certificate" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              // eslint-disable-next-line react-hooks/incompatible-library
              value={watch("category")}
              onValueChange={(value) => setValue("category", value as RequirementEntity["category"])}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe the requirement..."
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={watch("required")}
              onCheckedChange={(checked) => setValue("required", checked)}
            />
            <Label htmlFor="required" className="cursor-pointer">
              Mandatory requirement
            </Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{requirement ? "Save Changes" : "Create Requirement"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
