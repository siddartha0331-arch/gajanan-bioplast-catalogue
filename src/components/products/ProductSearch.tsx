import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SortAsc, SortDesc, X } from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const ProductSearch = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: ProductSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products by name, type, or features..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-12"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sort Select */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[200px] h-12">
          <div className="flex items-center gap-2">
            {sortBy.includes("asc") ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="name_asc">Name (A-Z)</SelectItem>
          <SelectItem value="name_desc">Name (Z-A)</SelectItem>
          <SelectItem value="moq_asc">MOQ (Low to High)</SelectItem>
          <SelectItem value="moq_desc">MOQ (High to Low)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
