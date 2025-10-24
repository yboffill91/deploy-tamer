import { City } from "@/types/cities";
import { useCityStore } from "@/stores/key_research/city-store";
import { useCities } from "@/hooks/key_research/use-cities";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { CityEditDialog } from "./city-edit-dialog";

export function CityTable() {
  const {
    currentPage,
    setCurrentPage,
    searchQuery,
    ITEMS_PER_PAGE,
    showEditDialog,
    setShowEditDialog,
    setEditingCity,
  } = useCityStore();

  const { citiesQuery, removeCity } = useCities();

  if (citiesQuery.isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground flex h-32 items-center justify-center text-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading cities...
        </p>
      </Card>
    );
  }

  if (citiesQuery.isError) {
    return (
      <Card className="p-6">
        <p className="flex h-32 items-center justify-center text-center text-red-500">Error loading cities</p>
      </Card>
    );
  }

  const filteredCities = (citiesQuery.data ?? []).filter((city: City) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCities.length / ITEMS_PER_PAGE);
  const paginatedCities = filteredCities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground h-32 text-center">
                No cities found
              </TableCell>
            </TableRow>
          ) : (
            paginatedCities.map((city, index) => (
              <TableRow key={city.id}>
                <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                <TableCell>{city.name}</TableCell>
                <TableCell>{city.country}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingCity(city);
                        setShowEditDialog(true);
                      }}
                      className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeCity.mutate(city.id)}
                      disabled={removeCity.isPending}
                      className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      {removeCity.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <CityEditDialog open={showEditDialog} onOpenChange={setShowEditDialog} />
    </Card>
  );
}
