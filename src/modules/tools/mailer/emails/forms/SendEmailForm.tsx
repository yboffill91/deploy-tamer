'use client';

import type React from 'react';
import { CustomLoading } from '@/components/CustomLoading';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  InputGroup,
  InputGroupInput,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';
import { UsersApiRepository } from '@/infrastructure/repositories';
import { useAuth } from '@/modules/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Mail, Users, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { UsersEntity } from '@/core';

const Schema = z.object({
  from: z.string().min(2, 'From is required'),
  to: z
    .array(z.string().email('Invalid email'))
    .min(1, 'At least one recipient is required'),
  subject: z.string().min(1, 'Subject is required'),
  text: z.string().min(1, 'Message is required'),
});

type Form = z.infer<typeof Schema>;

export const SendEmailForm = () => {
  const { user } = useAuth();
  const UsersRepo = new UsersApiRepository();
  const [emailInput, setEmailInput] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const {
    data: contacts,
    isLoading: loadingContacts,
    error: errorContacts,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => UsersRepo.findAll(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<Form>({
    resolver: zodResolver(Schema),
    defaultValues: {
      from: '',
      subject: '',
      to: [],
      text: '',
    },
    mode: 'onBlur',
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const toEmails = watch('to');

  const handleAddContactEmail = (email: string) => {
    const currentEmails = toEmails || [];
    if (!currentEmails.includes(email)) {
      setValue('to', [...currentEmails, email], { shouldValidate: true });
    }
    setPopoverOpen(false);
  };

  const handleAddManualEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = emailInput.trim();
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const currentEmails = toEmails || [];
        if (!currentEmails.includes(email)) {
          setValue('to', [...currentEmails, email], { shouldValidate: true });
        }
        setEmailInput('');
      }
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const currentEmails = toEmails || [];
    setValue(
      'to',
      currentEmails.filter((email) => email !== emailToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: Form) => {
    console.log('Form data:', data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col items-start justify-start gap-4 w-full'
    >
      <Controller
        name='from'
        control={control}
        render={({ field }) => (
          <div className='w-full space-y-2'>
            <Label htmlFor='from'>From:</Label>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className='w-full' id='from'>
                <SelectValue placeholder='Select account' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={user?.email}>
                  <span className='flex items-center justify-start gap-2'>
                    <Avatar className='rounded-lg size-6'>
                      <AvatarFallback>
                        {user?.email?.at(0)?.toUpperCase()}
                      </AvatarFallback>
                      <AvatarImage
                        alt={user?.email}
                        src={user?.photoURL || '/placeholder.svg'}
                      />
                    </Avatar>
                    {user?.displayName} {`< ${user?.email} >`}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.from && (
              <p className='text-sm text-destructive'>{errors.from.message}</p>
            )}
          </div>
        )}
      />

      <div className='w-full space-y-2'>
        <Label htmlFor='to'>To:</Label>
        <Controller
          control={control}
          name='to'
          render={() => (
            <>
              <div className='flex flex-wrap gap-2 p-2 border bg-accent rounded-md min-h-10.5  focus-within:ring-ring'>
                {toEmails &&
                  toEmails.map((email, index) => (
                    <Badge
                      key={index}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      <Mail className='size-3' />
                      {email}
                      <button
                        type='button'
                        onClick={() => handleRemoveEmail(email)}
                        className='ml-1 hover:bg-destructive/20 rounded-full p-0.5'
                      >
                        <X className='size-3' />
                      </button>
                    </Badge>
                  ))}
                <div className='flex flex-1 items-center gap-2 min-w-50'>
                  <input
                    type='text'
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleAddManualEmail}
                    placeholder='Add email and press Enter or comma'
                    className='flex-1 outline-none bg-transparent text-sm'
                  />
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button type='button' variant='ghost' size='sm'>
                        <Users className='size-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80'>
                      <div className='space-y-2'>
                        <h4 className='font-medium text-sm'>
                          Select from contacts
                        </h4>
                        {loadingContacts ? (
                          <CustomLoading message='Loading Contacts' />
                        ) : errorContacts ? (
                          <p className='text-sm text-destructive'>
                            Error loading contacts
                          </p>
                        ) : (
                          <div className='max-h-75 overflow-y-auto space-y-1'>
                            {contacts?.map((contact: UsersEntity) => (
                              <button
                                key={contact.email}
                                type='button'
                                onClick={() =>
                                  handleAddContactEmail(contact.email)
                                }
                                className='w-full flex items-center gap-2 p-2 hover:bg-accent rounded-md text-left transition-colors'
                                disabled={toEmails?.includes(contact.email)}
                              >
                                <Avatar className='size-8'>
                                  <AvatarFallback>
                                    {contact.email?.at(0)?.toUpperCase()}
                                  </AvatarFallback>
                                  <AvatarImage
                                    alt={contact.email}
                                    src={contact.photoURL || '/placeholder.svg'}
                                  />
                                </Avatar>
                                <div className='flex-1 min-w-0'>
                                  <p className='text-sm font-medium truncate'>
                                    {contact.displayName}
                                  </p>
                                  <p className='text-xs text-muted-foreground truncate'>
                                    {contact.email}
                                  </p>
                                </div>
                                {toEmails?.includes(contact.email) && (
                                  <Badge
                                    variant='secondary'
                                    className='text-xs'
                                  >
                                    Added
                                  </Badge>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {errors.to && (
                <p className='text-sm text-destructive'>{errors.to.message}</p>
              )}
            </>
          )}
        />
      </div>

      <Controller
        name='subject'
        control={control}
        render={({ field }) => (
          <div className='w-full space-y-2'>
            <Label htmlFor='subject'>Subject:</Label>
            <InputGroup>
              <InputGroupInput
                id='subject'
                placeholder='Enter subject'
                {...field}
              />
            </InputGroup>
            {errors.subject && (
              <p className='text-sm text-destructive'>
                {errors.subject.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name='text'
        control={control}
        render={({ field }) => (
          <div className='w-full space-y-2'>
            <Label htmlFor='text'>Message:</Label>
            <Textarea
              id='text'
              placeholder='Write your message here...'
              className='min-h-[200px] resize-y'
              {...field}
            />
            {errors.text && (
              <p className='text-sm text-destructive'>{errors.text.message}</p>
            )}
          </div>
        )}
      />

      <div className='w-full flex justify-end gap-2 pt-4'>
        <Button type='button' variant='outline'>
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting || !isValid}>
          {isSubmitting ? 'Sending...' : 'Send Email'}
        </Button>
      </div>
    </form>
  );
};
