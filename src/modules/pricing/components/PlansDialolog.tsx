"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { PlanEntity, PlanFormValues, planSchema } from "../utils"
import { usePricingStore } from "../context"

type PlanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan?: PlanEntity
  onSave: (plan: PlanEntity) => void
}

export function PlanDialog({ open, onOpenChange, plan, onSave }: PlanDialogProps) {
  const requirements = usePricingStore((state) => state.requirements)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      price: 0,
      interval: "month",
      features: "",
      recommended: false,
      requirementIds: [],
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedRequirements = watch("requirementIds") || []

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        features: plan.features.join("\n"),
        recommended: plan.recommended || false,
        requirementIds: plan.requirementIds || [],
      })
    } else {
      reset({
        name: "",
        price: 0,
        interval: "month",
        features: "",
        recommended: false,
        requirementIds: [],
      })
    }
  }, [plan, open, reset])

  const onSubmit = (data: PlanFormValues) => {
    const features = data.features.split("\n").filter((f) => f.trim())
    onSave({
      id: plan?.id || Date.now().toString(),
      name: data.name,
      price: data.price,
      interval: data.interval,
      features,
      recommended: data.recommended,
      requirementIds: data.requirementIds || [],
    })
  }

  const toggleRequirement = (reqId: string) => {
    const currentIds = selectedRequirements || []
    const newIds = currentIds.includes(reqId) ? currentIds.filter((id) => id !== reqId) : [...currentIds, reqId]
    setValue("requirementIds", newIds)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          <DialogDescription>Define pricing plan details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., Premium" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Billing Period</Label>
              <Select
                value={watch("interval")}
                onValueChange={(value) => setValue("interval", value as "month" | "year")}
              >
                <SelectTrigger id="interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Features (one per line)</Label>
            <Textarea
              id="features"
              {...register("features")}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              rows={5}
            />
            {errors.features && <p className="text-sm text-destructive">{errors.features.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recommended"
              checked={watch("recommended")}
              onCheckedChange={(checked) => setValue("recommended", checked)}
            />
            <Label htmlFor="recommended" className="cursor-pointer">
              Mark as recommended
            </Label>
          </div>

          <div className="space-y-3 border-t pt-4">
            <Label className="text-base">Plan Requirements</Label>
            <p className="text-sm text-muted-foreground">Select requirements that apply to this plan</p>
            <div className="space-y-2 max-h-50 overflow-y-auto rounded-md border p-3">
              {requirements.map((req) => (
                <div key={req.id} className="flex items-start space-x-3 py-2">
                  <Checkbox
                    id={`req-${req.id}`}
                    checked={selectedRequirements.includes(req.id)}
                    onCheckedChange={() => toggleRequirement(req.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`req-${req.id}`} className="cursor-pointer font-medium text-sm">
                      {req.name}
                      {req.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{req.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{plan ? "Save Changes" : "Create Plan"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
