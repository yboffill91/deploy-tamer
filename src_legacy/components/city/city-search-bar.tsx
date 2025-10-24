import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCityStore } from "@/stores/key_research/city-store";

export function CitySearchBar() {
  const { searchQuery, setSearchQuery, setCurrentPage } = useCityStore();

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
      <Input
        placeholder="Search cities..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        className="w-[250px] pl-9"
      />
    </div>
  );
}
