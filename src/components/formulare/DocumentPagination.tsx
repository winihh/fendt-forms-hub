import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function DocumentPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  className,
}: DocumentPaginationProps) {
  const rangeStart = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = totalItems > 0 ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className={cn("flex items-center justify-between text-sm text-muted-foreground", className)}>
      <span className="font-medium text-foreground">
        {totalItems > 0 ? <><span className="tabular-nums">{rangeStart}–{rangeEnd}</span> von <span className="tabular-nums">{totalItems}</span></> : "0 Einträge"}
      </span>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Weiter
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
