"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package } from "lucide-react"
import { PricingPlans, PricingRequirements, PromotionsManager } from "./components"
import { CommonHeader } from "../users/admin";
import { Card } from "@/components/ui";

export default function PricingComponents() {
  return (
    <div className='min-h-screen bg-background'>
      {/* <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
              <Package className='h-5 w-5 text-primary-foreground' />
            </div>
            <div>
              <h1 className='text-xl font-semibold text-foreground'>
                Pricing Manager
              </h1>
              <p className='text-sm text-muted-foreground'>
                Manage plans, promotions, and requirements
              </p>
            </div>
          </div>
        </div>
      </header> */}
      <CommonHeader
        title='Pricing Manager'
        desc='Manage plans, promotions, and requirements'
        icon={Package}
      />

      <Card className='container mx-auto px-4 py-8'>
        <Tabs defaultValue='plans' className='space-y-2 '>
          <TabsList className='grid w-full max-w-md grid-cols-3 bg-transparent'>
            <TabsTrigger value='plans'>Plans</TabsTrigger>
            <TabsTrigger value='promotions'>Promotions</TabsTrigger>
            <TabsTrigger value='requirements'>Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value='plans' className='space-y-6'>
            <PricingPlans />
          </TabsContent>

          <TabsContent value='promotions' className='space-y-6'>
            <PromotionsManager />
          </TabsContent>

          <TabsContent value='requirements' className='space-y-6'>
            <PricingRequirements />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
