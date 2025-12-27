"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Package } from "lucide-react"
import { usePricingStore } from "../context"
import { PlanEntity } from "../utils"
import { ToolSelector } from "./ToolSelector"
import { PlanDialog } from "./PlansDialolog"
import { CustomEmpty } from "@/components/CustomEmpty"
import { cn } from "@/lib/utils"

export function PricingPlans() {
  const plans = usePricingStore((state) => state.plans)
  const requirements = usePricingStore((state) => state.requirements)
  const addPlan = usePricingStore((state) => state.addPlan)
  const updatePlan = usePricingStore((state) => state.updatePlan)
  const deletePlan = usePricingStore((state) => state.deletePlan)

  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PlanEntity | undefined>(undefined)

  const filteredPlans = selectedTool ? plans.filter((p) => p.toolId === selectedTool) : plans

  const handleSavePlan = (plan: PlanEntity) => {
    if (editingPlan) {
      updatePlan(plan)
    } else {
      addPlan(plan)
    }
    setDialogOpen(false)
    setEditingPlan(undefined)
  }

  const handleDeletePlan = (id: string) => {
    deletePlan(id)
  }

  const handleEditPlan = (plan: PlanEntity) => {
    setEditingPlan(plan)
    setDialogOpen(true)
  }

  const getPlanRequirements = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    if (!plan) return []
    return requirements.filter((req) => plan.requirementIds.includes(req.id))
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


  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-foreground'>
            Pricing Plans
          </h2>
          <p className='text-sm text-muted-foreground'>
            Configure available plans for your tools
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPlan(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className='mr-2 h-4 w-4' />
          Create
        </Button>
      </div>

      <ToolSelector
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
      />

      {filteredPlans.length === 0 ? (
        <CustomEmpty
          description='Create yout first pricing to get started'
          icon={Package}
          title='No Plans Yet'
          onClick={() => {
            setEditingPlan(undefined);
            setDialogOpen(true);
          }}
        />
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredPlans.map((plan) => {
            const planRequirements = getPlanRequirements(plan.id);

            return (
              <Card
                key={plan.id}
                className={cn(
                  '',
                  plan.recommended && 'bg-success/5 border-success bprder-2'
                )}
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <CardTitle className='flex items-center gap-2 text-2xl'>
                        {plan.name}
                        {plan.recommended && (
                          <Badge variant='success'>Recommended</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        <span className='text-3xl font-bold text-foreground'>
                          ${plan.price}
                        </span>
                        <span className='text-muted-foreground'>
                          /{plan.interval === 'month' ? 'mo' : 'yr'}
                        </span>
                      </CardDescription>
                    </div>
                    <div className='flex gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive'
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h4 className='text-sm font-medium mb-2'>Features</h4>
                    <ul className='space-y-2'>
                      {plan.features.map((feature, i) => (
                        <li key={i} className='flex items-start gap-2 text-sm'>
                          <CheckCircle2 className='h-4 w-4 text-success mt-0.5 shrink-0' />
                          <span className='text-foreground'>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {planRequirements.length > 0 && (
                    <div className='border-t pt-4'>
                      <h4 className='text-sm font-medium mb-3'>
                        Requirements ({planRequirements.length})
                      </h4>
                      <div className='rounded-md border'>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className='h-9 text-xs'>
                                Requirement
                              </TableHead>
                              <TableHead className='h-9 text-xs'>
                                Type
                              </TableHead>
                              <TableHead className='h-9 text-xs text-center w-16'>
                                Req.
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {planRequirements.map((req) => (
                              <TableRow key={req.id}>
                                <TableCell className='py-2 text-xs font-medium'>
                                  {req.name}
                                </TableCell>
                                <TableCell className='py-2'>
                                  <Badge
                                    variant='outline'
                                    className={`text-xs ${getCategoryColor(
                                      req.category
                                    )}`}
                                  >
                                    {getCategoryLabel(req.category)}
                                  </Badge>
                                </TableCell>
                                <TableCell className='py-2 text-center'>
                                  {req.required ? (
                                    <CheckCircle2 className='h-4 w-4 text-success mx-auto' />
                                  ) : (
                                    <XCircle className='h-4 w-4 text-muted-foreground mx-auto' />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <PlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={editingPlan}
        onSave={handleSavePlan}
      />
    </div>
  );
}
