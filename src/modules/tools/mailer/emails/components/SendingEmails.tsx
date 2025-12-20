'use client'

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@/components/ui';
import { EmailEvents, ResendEmailEntity } from '@/core/entities';
import { Download, Mail, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { CustomEmpty } from '@/components/CustomEmpty';
import { DateRange } from 'react-day-picker';
import { useQuery } from '@tanstack/react-query';
import { MailerApiRepository } from '@/infrastructure/repositories/MailerApiRepository';
import { showToast } from '@/components/CustomToaster';
import { CustomPageLoader } from '@/components/CustomPageLoader';
import { DataTable } from '@/components/data-table/DataTable';

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
  const getEmails = async () => {
    const REPO = new MailerApiRepository();
    return await REPO.getMailList();
  };

  const {
    data: Emails,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['emails'],
    queryFn: getEmails,
  });

  useEffect(() => {
    if (isError) {
      showToast({
        type: 'error',
        message: 'Error getting Emails List',
        description: error.message,
      });
    }
  }, []);

  console.log(JSON.stringify(Emails));

  return (
    <>
      {isLoading && <CustomPageLoader message='Getting Email List' />}

      {Emails && Emails.length > 0 && (
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Event</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>
                      <p className='text-xs'>{email.from}</p>
                    </TableCell>
                    <TableCell>
                      {email.to.map((to, idx) => (
                        <p className='text-xs' key={idx}>
                          {to}
                        </p>
                      ))}
                    </TableCell>
                    <TableCell>
                      <p className='text-xs'>{email.subject}</p>
                    </TableCell>
                    <TableCell>
                      <p> {email.created_at} </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={email.last_event} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {Emails && Emails.length === 0 && (
        <CustomEmpty
          icon={Mail}
          description='Start sending emails to see insights and previews for every message.'
          title='No sent emails yet'
          onClick={() => alert('Implement')}
        />
      )}
    </>
  );
};

