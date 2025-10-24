import { useState } from "react";
import { useCities } from "@/hooks/key_research/use-cities";
import { useCityStore } from "@/stores/key_research/city-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function CityAddDialog() {
  const { showAddDialog, setShowAddDialog } = useCityStore();
  const { addCity } = useCities();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !country.trim()) return;
    addCity.mutate(
      { name, country },
      {
        onSuccess: () => {
          setName("");
          setCountry("");
          setShowAddDialog(false);
        },
      },
    );
  };

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add City</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Input placeholder="City name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <Button size="sm" className="mt-2 w-full" onClick={handleAdd} disabled={addCity.isPending}>
            {addCity.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add City"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
