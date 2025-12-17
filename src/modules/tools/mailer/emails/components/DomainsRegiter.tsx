'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddDomainForm } from '../forms';
import { showToast } from '@/components/CustomToaster';

interface Step {
  id: number;
  title: string;
  description?: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Domain',
    description: 'Domain name and region for your sending and receiving.',
  },
  {
    id: 2,
    title: 'DNS Records',
  },
];


export function DomainsRegiter() {
    const [currentStep, setCurrentStep] = useState(1);
    
    

  const handleDomainSuccess = () => {
      setCurrentStep(2);
      showToast({
          description: 'Domain added successfully',
          message: 'Success',
          type: 'success'
      })
  };

  return (
    <div className='min-h-screen bg-background p-6'>
      <div className='max-w-xl '>
        <div className='flex items-start gap-4 mb-8'>
          <div className='w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center'>
            <Globe className='w-8 h-8 text-foreground' />
          </div>
          <div className='flex flex-col'>
            <h1 className='text-2xl font-semibold text-foreground'>
              Add Domain
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Use a domain you own to send and receive emails.
            </p>
          </div>
        </div>

        {/* Multistep Content */}
        <div className='flex gap-6'>
          {/* Left Progress Indicator */}
          <div className='flex flex-col items-center pt-1'>
            {steps.map((step, index) => (
              <div key={step.id} className='flex flex-col items-center'>
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 transition-all duration-300',
                    currentStep === step.id
                      ? 'border-foreground bg-foreground'
                      : currentStep > step.id
                      ? 'border-foreground bg-foreground'
                      : 'border-muted-foreground bg-transparent'
                  )}
                />
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-80 transition-all duration-300',
                      currentStep > step.id ? 'bg-foreground' : 'bg-border'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className='flex-1 space-y-8'>
            <div className=''>
              <div>
                <h2 className='text-lg font-medium text-foreground'>
                  {steps[0].title}
                </h2>
                {currentStep === 1 && steps[0].description && (
                  <p className='text-sm text-muted-foreground '>
                    {steps[0].description}
                  </p>
                )}
              </div>

              {currentStep === 1 && (
                <div className='mt-4'>
                  <AddDomainForm onSuccess={handleDomainSuccess} />
                </div>
              )}
            </div>

            <div className='pt-2'>
              <div>
                <h2 className={cn('text-lg font-medium ', currentStep === 2 ? 'text-foreground' : 'text-muted-foreground')}>
                  {steps[1].title}
                </h2>
                {currentStep === 2 && (
                  <p className='text-sm text-muted-foreground mt-1'>
                    Configure your DNS records to verify domain ownership.
                  </p>
                  //   Aqui el formulario de DNS
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
