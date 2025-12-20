'use client'
import { CustomControllerInput } from "@/components/CustomControllerInput"
import { Card, CardContent, Checkbox, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from "@/components/ui"
import { ALargeSmall, Heading, Tag, Type, Vault } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { EmailTemplateEditor } from "../components/CodeEditor"

const Schema = z.object({
    name: z.string().min(3, 'Template Title is required'),
    subject: z.string().min(3, 'Template Subject is required'),
    body: z.string().min(1, 'Template Body is required'),
    templateType: z.enum(['WELCOME', 'PASSWORD_RESET', 'NEWSLETTER', 'PROMOTIONAL', 'TRANSACTIONAL']).default('PROMOTIONAL'),
    bodyType: z.enum(['HTML', 'TEXT', 'REACT']).default('TEXT'),
    clickTracking: z.boolean().default(false)

})


type Form = z.infer<typeof Schema>

export const CreateEmailTemplate = () => {


    const {control, handleSubmit, formState: {errors, isSubmitting, isValid} } = useForm<Form>({
        defaultValues: {
            name: '',
            body: '',
            subject: '',
            bodyType: 'TEXT',
            templateType: 'PROMOTIONAL',
            clickTracking: true,
        }
    })

  
  const TemplatesTypes = [
    {
      type: 'WELCOME',
      value: 'Welcome',
    },
    {
      type: 'PASSWORD_RESET',
      value: 'Password Reset',
    },
    {
      type: 'NEWSLETTER',
      value: 'Newsletter',
    },
    {
      type: 'PROMOTIONAL',
      value: 'Promotional',
    },
    {
      type: 'INFORMATIONAL',
      value: 'Informational',
    },
  ];





  return (
    <Card>
      <CardContent>
        <form>
          <CustomControllerInput
            control={control}
            name='name'
            placeholder="Template's Name"
            addon={Tag}
            error={errors.name}
            label="Template's Name"
          />
          <CustomControllerInput
            control={control}
            name='subject'
            placeholder="Template's Subject"
            addon={ALargeSmall}
            error={errors.subject}
            label='Subject'
          />
          <Controller
            control={control}
            name='clickTracking'
            render={({ field }) => (
              <div className='flex gap-2 w-full '>
                <Switch
                  onCheckedChange={field.onChange}
                  checked={field.value}
                  id='clickTracking'
                />
                <Label htmlFor='clickTracking' className='w-full'>
                  Enable Click Tracking
                </Label>
              </div>
            )}
          />
          <Controller name="templateType" render={({ field }) => (
            <div className="mt-4">
              <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Template Type'></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TemplatesTypes.map((template) => (
                    <SelectItem key={template.type} value={template.type} >{template.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )} control={control} />

          <EmailTemplateEditor />
        </form>
      </CardContent>
    </Card>
  );
}
