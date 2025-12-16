import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { CommonHeader } from '@/modules/users/admin';
import { Mail } from 'lucide-react';
import { ReceivingEmails, SendingEmails } from './components';

export const EmailsComponent = () => {
  return (
    <>
      <CommonHeader icon={Mail} desc='Emails Control Pannel' title='Emails' />
      <Tabs defaultValue='sending'>
        <TabsList className='bg-transparent!'>
          <TabsTrigger value='sending' className=''>
            Sending
          </TabsTrigger>
          <TabsTrigger value='receiving'>Receiving</TabsTrigger>
        </TabsList>
        <TabsContent value='sending'>
          <SendingEmails />
        </TabsContent>
        <TabsContent value='receiving'>
          <ReceivingEmails />
        </TabsContent>
      </Tabs>
    </>
  );
};
