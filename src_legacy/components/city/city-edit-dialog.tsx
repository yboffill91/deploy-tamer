import { useState, useEffect } from "react";
import { useCities } from "@/hooks/key_research/use-cities";
import { useCityStore } from "@/stores/key_research/city-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CityEditDialog({ open, onOpenChange }: Props) {
  const { editingCity, setEditingCity } = useCityStore();
  const { editCity } = useCities();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (editingCity) {
      setName(editingCity.name);
      setCountry(editingCity.country);
    }
  }, [editingCity]);

  const handleUpdate = () => {
    if (!editingCity) return;
    editCity.mutate(
      { id: editingCity.id, name, country },
      {
        onSuccess: () => {
          setEditingCity(null);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit City</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Input placeholder="City name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <Button size="sm" className="mt-2 w-full" onClick={handleUpdate} disabled={editCity.isPending}>
            {editCity.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update City"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
