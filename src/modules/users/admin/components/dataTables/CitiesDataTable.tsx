"use client";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Dialog,
  Table,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Search, FilterX, ArrowUpDown, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { CitiesEntity } from "@/core/entities";

export function CitiesDataTable({ data }: { data: CitiesEntity[] }) {
  const [sortNameAsc, setSortNameAsc] = useState(true);
  const [selectedCity, setSelectedCity] = useState<CitiesEntity | null>(null);
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
            placeholder={`Search by Name...`}
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
                Name
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
                      onClick={() => setSelectedCity(el)}
                    >
                      <Eye />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>City Info</DialogTitle>
                    </DialogHeader>
                    {selectedCity ? (
                      <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                        {Object.entries(selectedCity).map(([key, value]) => (
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
