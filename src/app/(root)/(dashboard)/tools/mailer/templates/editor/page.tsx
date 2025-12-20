import { CreateEmailTemplate } from "@/modules/tools/mailer/emails/forms/CreateEmailTemplate"
import { CommonHeader } from "@/modules/users/admin"
import { Layout } from "lucide-react"

const MailerTemplatesEditor = () => {
  return (
      <>
          <CommonHeader desc="Create and Edit Emails Templates" icon={Layout} title="Emails Editor" />
          <CreateEmailTemplate />
      </>
  )
}

export default MailerTemplatesEditor