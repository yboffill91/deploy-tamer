'use client';

import {
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Download, Mail, Search } from 'lucide-react';
import { useState } from 'react';
import { CustomEmpty } from '@/components/CustomEmpty';
import { DateRange } from 'react-day-picker';

const selectDates = [
  'Today',
  'Yesterday',
  'Last 3 Days',
  'Last 7 days',
  'Last 15 Days',
  'Last 30 Days',
];

export const ReceivingEmails = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });
  return (
    <Card className='w-full'>
      <CardHeader className='grid lg:grid-cols-12 gap-2'>
        <InputGroup className='lg:col-span-8'>
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
          description='Start receiving emails with a redefined address <anything>@fereikaedn.resend.app or set up a custom domain.'
          title='No received emails yet'
        />
      </CardContent>
    </Card>
  );
};
