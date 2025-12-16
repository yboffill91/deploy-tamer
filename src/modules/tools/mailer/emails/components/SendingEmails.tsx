'use client'

import { Button, Calendar, Card, CardContent, CardHeader, InputGroup, InputGroupAddon, InputGroupInput, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui"
import { EmailEvents } from "@/core/entities"
import { Download, Mail, Search } from "lucide-react"
import { useState } from "react"
import { StatusBadge } from "./StatusBadge"
import { CustomEmpty } from "@/components/CustomEmpty"
import { DateRange } from 'react-day-picker';
import { SendEmailForm } from '../forms/SendEmailForm';

const selectDates = [
  'Today',
  'Yesterday',
  'Last 3 Days',
  'Last 7 days',
  'Last 15 Days',
  'Last 30 Days',
];

const Status = [
  'BOUNCED',
  'CANCELED',
  'CLICKED',
  'COMPLAINED',
  'DELIVERED',
  'DELIVERY_DELAYED',
  'FAILED',
  'OPENED',
  'QUEUED',
  'SHCEDULED',
  'SENT',
];

export const SendingEmails = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });
  return (
    <Card className='w-full'>
      <CardHeader className='grid lg:grid-cols-12 gap-2'>
        <InputGroup className='lg:col-span-5'>
          <InputGroupInput placeholder='Search...' />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Select>
          <SelectTrigger className='w-full lg:col-span-3'>
            <SelectValue placeholder='Date' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>In days</SelectLabel>
              {selectDates.map((date, index) => (
                <SelectItem key={index + date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectSeparator />
              <SelectLabel>Calendar Pick Date</SelectLabel>
              <Calendar
                mode='range'
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                className='rounded-lg border shadow-sm'
              />
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className='w-full lg:col-span-3'>
            <SelectValue placeholder='All Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup></SelectGroup>
            {Status.map((st, index) => (
              <SelectItem key={st + index} value={st}>
                <StatusBadge status={EmailEvents[st]} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant='outline'
          className='w-full lg:col-span-1 justify-start text-muted-foreground'
        >
          <Download />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <CustomEmpty
          icon={Mail}
          description='Start sending emails to see insights and previews for every message.'
          title='No sent emails yet'
          onClick={() => alert('Implement')}
        />
        <SendEmailForm />
      </CardContent>
    </Card>
  );
};
