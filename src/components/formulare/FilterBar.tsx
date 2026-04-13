import { Search, X, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormularStatus, FormularType } from "@/data/formular-types";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: FormularType | "all";
  onTypeFilterChange: (value: FormularType | "all") => void;
  statusFilter: FormularStatus | "all";
  onStatusFilterChange: (value: FormularStatus | "all") => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  hasActiveFilters,
  onResetFilters,
}: FilterBarProps) {
  const isPreparedActive = statusFilter === "prepared";

  return (
    <div className="flex items-center gap-3 border-b border-border bg-surface-muted px-4 py-3">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Fahrgestell-Nr., Endkunde suchen…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-background border-border rounded-sm text-sm"
        />
      </div>

      {/* Type filter */}
      <Select value={typeFilter} onValueChange={(v) => onTypeFilterChange(v as FormularType | "all")}>
        <SelectTrigger className="w-48 h-9 rounded-sm bg-background text-sm">
          <SelectValue placeholder="Formularart" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Formulararten</SelectItem>
          <SelectItem value="service">Serviceanmeldung</SelectItem>
          <SelectItem value="inspection">Dichtheitsinspektion</SelectItem>
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as FormularStatus | "all")}>
        <SelectTrigger className="w-40 h-9 rounded-sm bg-background text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Status</SelectItem>
          <SelectItem value="prepared">Vorbereitet</SelectItem>
          <SelectItem value="signed">Signiert</SelectItem>
          <SelectItem value="released">Freigegeben</SelectItem>
        </SelectContent>
      </Select>

      {/* Quick filter: Vorbereitet */}
      <Button
        variant={isPreparedActive ? "default" : "outline"}
        size="sm"
        className="h-9 rounded-sm text-sm gap-1.5"
        onClick={() => onStatusFilterChange(isPreparedActive ? "all" : "prepared")}
      >
        <FileCheck className="h-3.5 w-3.5" />
        Vorbereitet
      </Button>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          className="ml-auto flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Filter zurücksetzen
        </button>
      )}
    </div>
  );
}
