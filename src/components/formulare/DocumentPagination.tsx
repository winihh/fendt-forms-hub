import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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

function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  pages.push(total);

  return pages;
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

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className={cn("flex items-center justify-between text-sm text-muted-foreground", className)}>
      <span className="font-medium text-foreground">
        {totalItems > 0 ? <><span className="tabular-nums">{rangeStart}–{rangeEnd}</span> von <span className="tabular-nums">{totalItems}</span></> : "0 Einträge"}
      </span>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {currentPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onPageChange(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onPageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          )}

          {visiblePages.map((page, idx) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground select-none">
                …
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )
          )}

          {currentPage < totalPages && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onPageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onPageChange(totalPages)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
