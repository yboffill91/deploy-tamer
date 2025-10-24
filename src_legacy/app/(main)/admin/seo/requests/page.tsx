"use client";

import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Table, TableHeader, TableHead, TableRow, TableBody } from "@/components/ui/table";
import { NotificationCenter } from "../_components/notification-center/notification-center";
import { KeywordRequestTable } from "@/components/keywordRequest/keyword-request-table";
import { useKeywordRequests } from "@/hooks/key_research/use-keyword-requests";
import { useKeywordRequestStore } from "@/stores/key_research/keyword-request-store";
import { useKeywordRequestActions } from "@/components/keywordRequest/keyword-request-actions";
import { KeywordRequest } from "@/types/keyword-request";

export default function RequestsPage() {
  const { error } = useKeywordRequestStore();
  const { handleResultsClick, handleNotificationClick } = useKeywordRequestActions();

  // Fetch keyword requests
  useKeywordRequests(1);

  const onResultsClick = (request: KeywordRequest) => {
    const title =
      request.keyword_request_title || request.keyword_request_positive_keyword?.join(", ") || "Untitled Request";
    handleResultsClick(request.keyword_request_id, title);
  };

  const onNotificationClick = (request: KeywordRequest) => {
    handleNotificationClick(request);
  };

  return (
    <div className="mx-auto mt-8 max-w-6xl p-6">
      <NotificationCenter />
      <h1 className="mb-8 text-3xl font-bold">All Keyword Research Requests</h1>

      {error && (
        <Alert variant="destructive" className="mb-6 flex">
          {error}
        </Alert>
      )}

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Finished</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead className="text-right">
                <div className="flex justify-end gap-2">
                  <span>Actions</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <KeywordRequestTable onNotificationClick={onNotificationClick} onResultsClick={onResultsClick} />
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
