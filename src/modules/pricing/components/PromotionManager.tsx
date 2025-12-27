"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, Percent, Clock } from "lucide-react"
import { format } from "date-fns"
import { usePricingStore } from "../context"
import { PromotionEntity } from "../utils"
import { PromotionDialog } from "./PromotionDialog"
import { CustomEmpty } from "@/components/CustomEmpty"

export function PromotionsManager() {
  const promotions = usePricingStore((state) => state.promotions)
  const addPromotion = usePricingStore((state) => state.addPromotion)
  const updatePromotion = usePricingStore((state) => state.updatePromotion)
  const deletePromotion = usePricingStore((state) => state.deletePromotion)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<PromotionEntity | undefined>(undefined)

  const handleSavePromotion = (promotion: PromotionEntity) => {
    if (editingPromotion) {
      updatePromotion(promotion)
    } else {
      addPromotion(promotion)
    }
    setDialogOpen(false)
    setEditingPromotion(undefined)
  }

  const handleDeletePromotion = (id: string) => {
    deletePromotion(id)
  }

  const handleEditPromotion = (promotion: PromotionEntity) => {
    setEditingPromotion(promotion)
    setDialogOpen(true)
  }

  const isPromotionActive = (promotion: PromotionEntity) => {
    const now = new Date()
    const isInDateRange = now >= promotion.startDate && (!promotion.endDate || now <= promotion.endDate)
    const hasUsageLeft = !promotion.usageLimit || promotion.usageCount < promotion.usageLimit
    return promotion.isActive && isInDateRange && hasUsageLeft
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-foreground'>
            Promotions and Offers
          </h2>
          <p className='text-sm text-muted-foreground'>
            Manage discounts, offers, and scheduled promotions
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPromotion(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className='mr-2 h-4 w-4' />
          Create
        </Button>
      </div>

      {promotions.length === 0 ? (
        <CustomEmpty
          description='Create your first promotion to get started'
          icon={Percent}
          title='No Promotions Yet'
          onClick={() => {
            setEditingPromotion(undefined);
            setDialogOpen(true);
          }}
        />
      ) : (
        <div className='grid gap-4'>
          {promotions.map((promotion) => {
            const active = isPromotionActive(promotion);
            return (
              <Card
                key={promotion.id}
                className={active ? 'border-success' : ''}
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 space-y-1'>
                      <div className='flex items-center gap-2'>
                        <CardTitle>{promotion.name}</CardTitle>
                        <Badge
                          variant={active ? 'default' : 'secondary'}
                          className={
                            active ? 'bg-success text-success-foreground' : ''
                          }
                        >
                          {active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription className='flex items-center gap-4'>
                        <span className='font-mono font-semibold text-foreground'>
                          {promotion.code}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Percent className='h-3 w-3' />
                          {promotion.discount}
                          {promotion.discountType === 'percentage'
                            ? '%'
                            : ' USD'}{' '}
                          discount
                        </span>
                      </CardDescription>
                    </div>
                    <div className='flex gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => handleEditPromotion(promotion)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive'
                        onClick={() => handleDeletePromotion(promotion.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      <span>
                        From: {format(promotion.startDate, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    {promotion.endDate && (
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4' />
                        <span>
                          To: {format(promotion.endDate, 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>
                        Uses: {promotion.usageCount}
                        {promotion.usageLimit && ` / ${promotion.usageLimit}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <PromotionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        promotion={editingPromotion}
        onSave={handleSavePromotion}
      />
    </div>
  );
}
