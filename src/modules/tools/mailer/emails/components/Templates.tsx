'use client'

import { CustomEmpty } from "@/components/CustomEmpty";
import { Card, CardContent, CardHeader, InputGroup, InputGroupAddon, InputGroupInput, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"
import { ResendApiRepository } from "@/infrastructure/repositories/ResendApiRepository";
import { Search, Layout } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export const Templates = () => {


  const router = useRouter()
  

 






  return (
    <>
      <Card className='w-full'>
        <CardHeader className='grid lg:grid-cols-12 gap-2'>
          <InputGroup className='lg:col-span-8'>
            <InputGroupInput placeholder='Search...' />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>

          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='All Statuses' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='draft'>Draft</SelectItem>
              <SelectItem value='published'>Published</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <CustomEmpty
            icon={Layout}
            description='Create a new template or import an existing one to reuse in your emails.'
                      title='No templates yet'
                      onClick={()=> {router.push('/tools/mailer/templates/editor')}}
                      
          />
        </CardContent>
      </Card>
    </>
  );
}
