"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { PromotionEntity, PromotionFormValues, promotionSchema } from "../utils"

type PromotionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion?: PromotionEntity
  onSave: (promotion: PromotionEntity) => void
}

export function PromotionDialog({ open, onOpenChange, promotion, onSave }: PromotionDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: "",
      code: "",
      discount: 0,
      discountType: "percentage",
      startDate: new Date(),
      isActive: true,
    },
  })

  useEffect(() => {
    if (promotion) {
      reset({
        name: promotion.name,
        code: promotion.code,
        discount: promotion.discount,
        discountType: promotion.discountType,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        isActive: promotion.isActive,
        usageLimit: promotion.usageLimit,
      })
    } else {
      reset({
        name: "",
        code: "",
        discount: 0,
        discountType: "percentage",
        startDate: new Date(),
        isActive: true,
      })
    }
  }, [promotion, open, reset])

  const onSubmit = (data: PromotionFormValues) => {
    onSave({
      id: promotion?.id || Date.now().toString(),
      ...data,
      usageCount: promotion?.usageCount || 0,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-137.5">
        <DialogHeader>
          <DialogTitle>{promotion ? "Edit Promotion" : "Create New Promotion"}</DialogTitle>
          <DialogDescription>Configure promotion or discount details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promo-name">Promotion Name</Label>
            <Input id="promo-name" {...register("name")} placeholder="e.g., Black Friday 2024" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Promotion Code</Label>
            <Input
              id="code"
              {...register("code")}
              placeholder="e.g., BLACKFRIDAY2024"
              onChange={(e) => setValue("code", e.target.value.toUpperCase())}
            />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input id="discount" type="number" step="0.01" {...register("discount", { valueAsNumber: true })} />
              {errors.discount && <p className="text-sm text-destructive">{errors.discount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-type">Type</Label>
              <Select
                // eslint-disable-next-line react-hooks/incompatible-library
                value={watch("discountType")}
                onValueChange={(value) => setValue("discountType", value as "percentage" | "fixed")}
              >
                <SelectTrigger id="discount-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "MMM dd, yyyy") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => date && field.onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "MMM dd, yyyy") : "No limit"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage-limit">Usage Limit (Optional)</Label>
            <Input
              id="usage-limit"
              type="number"
              {...register("usageLimit", { valueAsNumber: true })}
              placeholder="Unlimited"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <Label htmlFor="active" className="cursor-pointer">
              Active promotion
            </Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{promotion ? "Save Changes" : "Create Promotion"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
