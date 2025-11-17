import {
  Card,
  CardContent,
  CardHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { CommonHeader, UploadDocument } from "@/modules/users/admin";
import { CloudCheck, CloudUploadIcon, FileText } from "lucide-react";

const ClientsDocumentsPage = () => {
  return (
    <>
      <CommonHeader
        desc="Clients Documents Management System"
        icon={CloudCheck}
        title="Clients Documents"
      />
      <Card className="w-full">
        <Tabs defaultValue="documents">
          <CardHeader className="w-full">
            <TabsList className="min-w-64 ">
              <TabsTrigger value="documents">
                <FileText />
                Documents
              </TabsTrigger>
              <TabsTrigger value="upload">
                <CloudUploadIcon />
                Upload
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="upload">
              <UploadDocument />
            </TabsContent>
            <TabsContent value="documents">
              <h3>Documents View</h3>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </>
  );
};

export default ClientsDocumentsPage;
