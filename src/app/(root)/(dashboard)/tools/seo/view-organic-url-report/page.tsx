import { ReviewOrganicUrlData } from "@/modules/tools/keyword-research/all-request/ReviewOrganicUrlData"
import { CommonHeader } from "@/modules/users/admin"
import { Link2 } from "lucide-react"

const ViewOrganicUrlResult = () => {
  return (
    <div>
      <CommonHeader icon={Link2} desc="View the Organic URL Result" title="Organic URL Report"/>
      
      <ReviewOrganicUrlData /></div>
  )
}

export default ViewOrganicUrlResult