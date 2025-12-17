'use client';
import { CustomControllerInput } from '@/components/CustomControllerInput';
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Regions } from '@/core/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Asterisk, Globe, Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import Flag from 'react-world-flags';
import { useEffect, useState } from 'react';
import { CreateDomainDTO } from '@/core/dto';
import { MailerApiRepository } from '@/infrastructure/repositories/MailerApiRepository';
import { CustomLoading } from '@/components/CustomLoading';
import { showToast } from '@/components/CustomToaster';
import { useGetUserInfo } from '@/hooks/useGetUserInfo';

const Schema = z.object({
  domain: z
    .string()
    .regex(
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      'Invalid domain format'
    ),
  region: z.string().min(1, 'You must select a region.'),
  fromSender: z.string(),
  companyId: z.string()
});

type Form = z.infer<typeof Schema>;

interface Props {
  onSuccess(): void;
}


export const AddDomainForm = ({onSuccess}: Props) => {
  const [isError, setIsError] = useState('')
  const [creatingDomain, setCreatingDomain] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<Form>({
    resolver: zodResolver(Schema),
    defaultValues: {
      // customPath: '',
      domain: '',
      region: 'send',
      companyId: '',
      fromSender: ''
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isError) {
      showToast({
        description: isError,
        message: 'Error adding new Domain',
        type: 'error'
      })
    }
  })

  const {user} = useGetUserInfo()



  const AvailableRegions = [
    'North Virginia (us-east-1)',
    'Ireland (eu-west-1)',
    'São Paulo (sa-east-1)',
    'Tokio (ap-northeast-1)',
  ];

  const mapToDTO = (data: Form): CreateDomainDTO => {
    return {
      ...data,
      fromSender: user.email,
      companyId: user.companies[0].id,
    };
   };

  const onSubmitHandler = async (data: Form) => {
    const payload = mapToDTO(data)
    const REPO = new MailerApiRepository()

    try {
      setIsError('')
      setCreatingDomain(true)
      await REPO.createDomain(payload)
      onSuccess()
      
    } catch (error) {
      setIsError(error instanceof Error ? error.message : 'Unexpected error trying to add new domain')
    } finally {
      setCreatingDomain(false)
    }
   

    
  }

  return (
    <form className='flex flex-col w-full gap-3' onSubmit={handleSubmit(onSubmitHandler)}>
      <CustomControllerInput
        control={control}
        name='domain'
        placeholder='marketing.mydomain.com'
        addon={Globe}
        disabled={isSubmitting}
        error={errors.domain}
        label='Name'
      />
      <Controller
        control={control}
        name='region'
        render={({ field }) => (
          <div className='flex flex-col gap-1 items-start justify-start w-full'>
            <Label htmlFor='region'>Region:</Label>
            <Select
              {...field}
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={AvailableRegions[0]}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Region'></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {AvailableRegions.map((reg) => (
                  <SelectItem key={reg} value={reg}>
                    <RegionFlag region={reg} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.region && (
              <div className='flex text-[0.6rem] item-center gap-1 text-destructive line-clamp-2 font-semibold'>
                <Asterisk className='w-2 h-3' />
                {errors.region.message}
              </div>
            )}
          </div>
        )}
      />

      {/* <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className='flex flex-col'
      >
        <CollapsibleTrigger asChild>
          <Button
            variant='ghost'
            className='w-full justify-between text-muted-foreground!'
          >
            <span className='sr-only'>Toggle Advanced Options</span> Advanced
            Options
            <ChevronDown
              className={cn(
                'rotate-0 transition-all duration-300 ease-in-out ',
                isOpen && 'rotate-180'
              )}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className='flex flex-col gap-2 min-h-16 items-end justify-end'>
          <CustomControllerInput control={control} name='customPath' placeholder='send' addon={Folder} disabled={isSubmitting} error={errors.customPath} label='Custom Return Path'/>
        </CollapsibleContent>
      </Collapsible> */}
      <Button type='submit' disabled={!isValid || isSubmitting} className='mt-6'>{
        isSubmitting || creatingDomain ? <CustomLoading message='Adding new Domain'/> : <><Plus/>Add Domain</>
      }</Button>
    </form>
  );
};

const RegionFlag = ({ region }: { region: string }) => {
  return (
    <span className='flex items-center gap-2'>
      <Flag
        code={
          region === Regions.NORTH_VIRGINIA
            ? 'us'
            : region === Regions.IRELAND
            ? 'ie'
            : region === Regions.SAO_PAULO
            ? 'br'
            : 'jp'
        }
        className='w-6 h-4 rounded'
      />
      {region}
    </span>
  );
};
