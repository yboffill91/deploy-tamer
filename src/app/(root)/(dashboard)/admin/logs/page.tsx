"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Eye,
  Logs,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LogsEntity } from "@/core/entities";
import { LogsApiRepository } from "@/infraestructure/repositories/LogsApiRepository";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { AuditLogModal, CommonHeader } from "@/modules/users/admin";
import { CustomPageLoader } from "@/components/CustomPageLoader";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-500/10 text-green-700 dark:text-green-400",
  UPDATE: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  DELETE: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const LIMITS = {
  1: "10",
  2: "25",
  3: "50",
  4: "100",
  5: "200",
};

export default function AuditLogsTable() {
  const [data, setData] = useState<LogsEntity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [isError, setIsError] = useState<string | null>(null);

  const [actionFilter, setActionFilter] = useState<
    "CREATE" | "UPDATE" | "DELETE" | null
  >(null);
  const [tableNameFilter, setTableNameFilter] = useState<string | null>(null);
  const [openActionPopover, setOpenActionPopover] = useState(false);
  const [openTableNamePopover, setOpenTableNamePopover] = useState(false);

  const [limit, setLimit] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedAuditLog, setSelectedAuditLog] = useState<LogsEntity | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const logsRepository = new LogsApiRepository();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await logsRepository.getLogsByPage(currentPage, limit);
        const totalRecords = await logsRepository.getTotalRecord();
        setTotalRecords(totalRecords);
        setData(response);
      } catch (error) {
        setIsError(
          error instanceof Error
            ? error.message
            : "Error getting audit logs data"
        );
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [currentPage, limit]);

  useEffect(() => {
    if (isError) {
      toast.error(isError);
    }
  });

  // Get unique actions and table names for filters
  const uniqueActions = useMemo(
    () => data && Array.from(new Set(data.map((log) => log.action))),
    [data]
  );

  const uniqueTableNames = useMemo(
    () => data && Array.from(new Set(data.map((log) => log.tableName))),
    [data]
  );

  // Filter data
  const filteredData = useMemo(() => {
    return (
      data &&
      data.filter((log) => {
        const actionMatch = !actionFilter || log.action === actionFilter;
        const tableNameMatch =
          !tableNameFilter || log.tableName === tableNameFilter;
        return actionMatch && tableNameMatch;
      })
    );
  }, [data, actionFilter, tableNameFilter]);

  const handleView = async (auditLog: LogsEntity) => {
    setSelectedAuditLog(auditLog);
    setModalOpen(true);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev = prev + 1));
  };

  console.log("🛜 Limit", limit);

  return (
    <>
      {loading && <CustomPageLoader message="Loading logs data ..." />}
      {data && !loading && (
        <div className="w-full">
          <CommonHeader
            icon={Logs}
            title="Audit Logs"
            desc="View and manage audit logs for your application."
          />
          <Card className="container">
            <CardContent>
              <div className="w-full space-y-4">
                <div className=" flex gap-2 w-full flex-wrap flex-col md:flex-row  ">
                  <Popover
                    open={openActionPopover}
                    onOpenChange={setOpenActionPopover}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openActionPopover}
                        className="w-56 justify-between bg-transparent"
                      >
                        {actionFilter
                          ? `Action: ${actionFilter}`
                          : "Filter by Action..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-0">
                      <Command>
                        <CommandInput placeholder="Search actions..." />
                        <CommandList>
                          <CommandEmpty>No actions found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => {
                                setActionFilter(null);
                                setOpenActionPopover(false);
                              }}
                            >
                              Clear Filter
                            </CommandItem>
                            {uniqueActions!.map((action) => (
                              <CommandItem
                                key={action}
                                value={action}
                                onSelect={() => {
                                  setActionFilter(action!);
                                  setOpenActionPopover(false);
                                }}
                              >
                                {action}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Popover
                    open={openTableNamePopover}
                    onOpenChange={setOpenTableNamePopover}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTableNamePopover}
                        className="w-56 justify-between bg-transparent"
                      >
                        {tableNameFilter
                          ? `Table: ${tableNameFilter}`
                          : "Filter by Table Name..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-0">
                      <Command>
                        <CommandInput placeholder="Search tables..." />
                        <CommandList>
                          <CommandEmpty>No tables found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value=""
                              onSelect={() => {
                                setTableNameFilter(null);
                                setOpenTableNamePopover(false);
                              }}
                            >
                              Clear Filter
                            </CommandItem>
                            {uniqueTableNames!.map((tableName) => (
                              <CommandItem
                                key={tableName}
                                value={tableName}
                                onSelect={() => {
                                  setTableNameFilter(tableName!);
                                  setOpenTableNamePopover(false);
                                }}
                              >
                                {tableName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Select onValueChange={(value) => setLimit(Number(value))}>
                    <SelectTrigger className="w-20 justify-between bg-transparent">
                      <SelectValue placeholder={limit} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LIMITS).map(([key, value]) => (
                        <SelectItem
                          key={key}
                          value={value}
                          className={cn(
                            limit === Number(value) &&
                              "text-muted-foreground bg-muted"
                          )}
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Table Name</TableHead>
                        <TableHead>Record ID</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Changed By</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData!.length > 0 ? (
                        filteredData!.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">
                              {log.id}
                            </TableCell>
                            <TableCell>{log.tableName}</TableCell>
                            <TableCell>{log.recordId}</TableCell>
                            <TableCell>
                              <Badge
                                className={cn("", ACTION_COLORS[log.action!])}
                              >
                                {log.action}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {log.changedBy}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(log.timestamp!).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleView(log)}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No audit logs found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {Math.ceil(totalRecords / limit)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">{currentPage}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextPage}
                      disabled={currentPage === Math.ceil(totalRecords / limit)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <AuditLogModal
                  open={modalOpen}
                  onOpenChange={setModalOpen}
                  auditLog={selectedAuditLog}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
