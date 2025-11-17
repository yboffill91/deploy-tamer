"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  Eye,
  ArrowUpDown,
  ArrowRightCircleIcon,
  FilterX,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatesEntity } from "@/core/entities";

export function StatesDataTable({
  data,
  onStateSelect,
}: {
  data: StatesEntity[];
  onStateSelect: (iso2: string) => void;
}) {
  const [sortNameAsc, setSortNameAsc] = useState(true);
  const [selectedState, setSelectedState] = useState<StatesEntity | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a.name! < b.name!) return sortNameAsc ? -1 : 1;
      if (a.name! > b.name!) return sortNameAsc ? 1 : -1;
      return 0;
    });
  }, [data, sortNameAsc]);

  const filteredData = useMemo(() => {
    return sortedData.filter((el) =>
      el.name!.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [sortedData, globalFilter]);

  return (
    <>
      <div className="flex gap-4 mb-4">
        <InputGroup className="w-48">
          <InputGroupInput
            placeholder={`Search by State...`}
            onChange={(event) => setGlobalFilter(event.target.value)}
            value={globalFilter}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupButton
            onClick={() => setGlobalFilter("")}
            disabled={globalFilter.length === 0}
          >
            <FilterX />
          </InputGroupButton>
        </InputGroup>
      </div>

      <Table className="text-left w-96">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="p-2 w-72">
              <span
                onClick={() => setSortNameAsc(!sortNameAsc)}
                className="flex items-center gap-2 cursor-pointer"
              >
                State Name
                <ArrowUpDown className="w-4 h-4" />
              </span>
            </TableHead>
            <TableHead className="p-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((el) => (
            <TableRow key={el.id}>
              <TableCell className="p-2">{el.name}</TableCell>
              <TableCell className="p-2 flex gap-2 items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedState(el!)}
                    >
                      <Eye />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>State Info</DialogTitle>
                    </DialogHeader>
                    {selectedState ? (
                      <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                        {Object.entries(selectedState).map(([key, value]) => (
                          <div
                            key={key}
                            className={cn(
                              "border-b py-2",
                              value === undefined || !value ? "hidden" : "block"
                            )}
                          >
                            <span className="font-medium capitalize">
                              {key}
                            </span>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {typeof value === "object" ? (
                                <pre className="bg-secondary p-2 rounded-md overflow-x-auto text-xs whitespace-pre-wrap">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              ) : (
                                <span>{String(value)}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No data</p>
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  size="icon"
                  variant={"outline"}
                  onClick={() => {
                    onStateSelect(el.iso2!);
                  }}
                >
                  <ArrowRightCircleIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
