"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKeywordRequestStore } from "@/stores/key_research/keyword-request-store";
import { KeywordRequest } from "@/types/keyword-request";

interface KeywordRequestTableProps {
  onNotificationClick: (request: KeywordRequest) => void;
  onResultsClick: (request: KeywordRequest) => void;
}

export function KeywordRequestTable({ onNotificationClick, onResultsClick }: KeywordRequestTableProps) {
  const { requests, isLoading, error } = useKeywordRequestStore();

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-muted-foreground h-32 text-center">
          Loading requests...
        </TableCell>
      </TableRow>
    );
  }

  if (error) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-muted-foreground h-32 text-center">
          {error}
        </TableCell>
      </TableRow>
    );
  }

  if (requests.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-muted-foreground h-32 text-center">
          No requests found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {requests.map((request, index) => (
        <TableRow key={request.keyword_request_id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
          <TableCell>
            {request.keyword_request_title ||
              request.keyword_request_positive_keyword?.join(", ") ||
              "Untitled Request"}
          </TableCell>
          <TableCell className="capitalize">{request.keyword_request_type}</TableCell>
          <TableCell>
            <span
              className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", {
                "bg-yellow-100 text-yellow-800": request.keyword_request_status === "Draft",
                "bg-blue-100 text-blue-800": request.keyword_request_status === "Created",
                "bg-purple-100 text-purple-800": request.keyword_request_status === "In Progress",
                "bg-green-100 text-green-800": request.keyword_request_status === "Finished",
                "bg-red-100 text-red-800": request.keyword_request_status === "Cancelled",
              })}
            >
              {request.keyword_request_status}
            </span>
          </TableCell>
          <TableCell>{request.keyword_request_finished}</TableCell>
          <TableCell>{request.user_user_id}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => onNotificationClick(request)}>
                      <Bell className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => onResultsClick(request)}
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Finished Keywords</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
