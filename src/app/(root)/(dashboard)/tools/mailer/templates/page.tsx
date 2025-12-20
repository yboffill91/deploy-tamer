import { Templates } from '@/modules/tools/mailer/emails/components/Templates'
import { CommonHeader } from '@/modules/users/admin'
import { LayoutList } from 'lucide-react'

const TemplatesEmailsPage = () => {
    return (
        <>
            
            <CommonHeader desc='Create and Personalize Templates' icon={LayoutList} title='Emails Templates' />
            <Templates />
        </>
  )
}

export default TemplatesEmailsPage