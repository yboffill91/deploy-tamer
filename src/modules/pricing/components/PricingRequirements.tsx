"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, CheckCircle2, XCircle, ListCheck } from "lucide-react"
import { usePricingStore } from "../context"
import { RequirementEntity } from "../utils"
import { RequirementDialog } from "./RequirementDialog"
import { CustomEmpty } from "@/components/CustomEmpty"

export function PricingRequirements() {
  const requirements = usePricingStore((state) => state.requirements)
  const plans = usePricingStore((state) => state.plans)
  const addRequirement = usePricingStore((state) => state.addRequirement)
  const updateRequirement = usePricingStore((state) => state.updateRequirement)
  const deleteRequirement = usePricingStore((state) => state.deleteRequirement)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState<RequirementEntity | undefined>(undefined)

  const handleSaveRequirement = (requirement: RequirementEntity) => {
    if (editingRequirement) {
      updateRequirement(requirement)
    } else {
      addRequirement(requirement)
    }
    setDialogOpen(false)
    setEditingRequirement(undefined)
  }

  const handleDeleteRequirement = (id: string) => {
    deleteRequirement(id)
  }

  const handleEditRequirement = (requirement: RequirementEntity) => {
    setEditingRequirement(requirement)
    setDialogOpen(true)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: "bg-accent text-accent-foreground",
      legal: "bg-warning text-warning-foreground",
      business: "bg-success text-success-foreground",
      other: "bg-secondary text-secondary-foreground",
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      technical: "Technical",
      legal: "Legal",
      business: "Business",
      other: "Other",
    }
    return labels[category as keyof typeof labels] || "Other"
  }

  const getPlansUsingRequirement = (requirementId: string) => {
    return plans.filter((plan) => plan.requirementIds.includes(requirementId))
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-foreground'>
            Pricing Requirements
          </h2>
          <p className='text-sm text-muted-foreground'>
            Define technical, legal, and business requirements per plan
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRequirement(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className='mr-2 h-4 w-4' />
          Create
        </Button>
      </div>

      {requirements.length === 0 ? (
        <CustomEmpty
          description='No requirements yet. Create your first requirement to get started.'
          icon={ListCheck}
          title='No Requirements Yet'
          onClick={() => {
            setEditingRequirement(undefined);
            setDialogOpen(true);
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Requirements Table</CardTitle>
            <CardDescription>
              Manage requirements associated with each plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className='text-center'>Mandatory</TableHead>
                  <TableHead>Used in Plans</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((requirement) => {
                  const usedInPlans = getPlansUsingRequirement(requirement.id);
                  return (
                    <TableRow key={requirement.id}>
                      <TableCell className='font-medium'>
                        {requirement.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getCategoryColor(requirement.category)}
                        >
                          {getCategoryLabel(requirement.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className='max-w-75 text-sm text-muted-foreground'>
                        {requirement.description}
                      </TableCell>
                      <TableCell className='text-center'>
                        {requirement.required ? (
                          <CheckCircle2 className='h-5 w-5 text-success mx-auto' />
                        ) : (
                          <XCircle className='h-5 w-5 text-muted-foreground mx-auto' />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {usedInPlans.length > 0 ? (
                            usedInPlans.map((plan) => (
                              <Badge key={plan.id} variant='outline'>
                                {plan.name}
                              </Badge>
                            ))
                          ) : (
                            <span className='text-xs text-muted-foreground italic'>
                              Not assigned
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => handleEditRequirement(requirement)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-destructive'
                            onClick={() =>
                              handleDeleteRequirement(requirement.id)
                            }
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <RequirementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        requirement={editingRequirement}
        onSave={handleSaveRequirement}
      />
    </div>
  );
}
