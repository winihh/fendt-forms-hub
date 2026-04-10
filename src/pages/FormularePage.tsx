import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/formulare/FilterBar";
import { DocumentTable, type SortField, type SortDirection } from "@/components/formulare/DocumentTable";
import { DocumentPagination } from "@/components/formulare/DocumentPagination";
import { NewDocumentWizard } from "@/components/formulare/NewDocumentWizard";
import { DeleteConfirmDialog } from "@/components/formulare/DeleteConfirmDialog";
import { MOCK_DOCUMENTS, type FormularDocument, type FormularStatus, type FormularType } from "@/data/formular-types";
import { toast } from "sonner";

const PAGE_SIZE = 20;

export default function FormularePage() {
  const [documents, setDocuments] = useState<FormularDocument[]>(MOCK_DOCUMENTS);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FormularDocument | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<FormularType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FormularStatus | "all">("all");
  const [showReleased, setShowReleased] = useState(false);

  // Sort
  const [sortField, setSortField] = useState<SortField>("lastModified");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const hasActiveFilters = searchQuery !== "" || typeFilter !== "all" || statusFilter !== "all" || showReleased;

  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setShowReleased(false);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredDocuments = useMemo(() => {
    let docs = [...documents];

    // Hide released by default
    if (!showReleased && statusFilter !== "released") {
      docs = docs.filter((d) => d.status !== "released");
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.vin.toLowerCase().includes(q) ||
          d.customer.toLowerCase().includes(q) ||
          d.vehicleType.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== "all") {
      docs = docs.filter((d) => d.type === typeFilter);
    }

    if (statusFilter !== "all") {
      docs = docs.filter((d) => d.status === statusFilter);
    }

    // Sort
    docs.sort((a, b) => {
      let cmp = 0;
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (fieldA instanceof Date && fieldB instanceof Date) {
        cmp = fieldA.getTime() - fieldB.getTime();
      } else if (typeof fieldA === "string" && typeof fieldB === "string") {
        cmp = fieldA.localeCompare(fieldB);
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return docs;
  }, [documents, searchQuery, typeFilter, statusFilter, showReleased, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedDocuments = useMemo(
    () => filteredDocuments.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE),
    [filteredDocuments, safeCurrentPage]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleAction = (action: string, doc: FormularDocument) => {
    toast.info(`${action}: ${doc.id}`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    toast.success(`Dokument ${deleteTarget.id} wurde gelöscht.`);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-background">
        <div className="max-w-[965px] mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Formulare</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filteredDocuments.length} Dokument{filteredDocuments.length !== 1 ? "e" : ""}
              {totalPages > 1 && ` · Seite ${safeCurrentPage} von ${totalPages}`}
            </p>
          </div>
          <Button onClick={() => setWizardOpen(true)}>
            <Plus className="h-4 w-4" />
            Neues Dokument
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[965px] mx-auto px-6 py-4">
        {/* Filter bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          showReleased={showReleased}
          onShowReleasedChange={setShowReleased}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />

        {/* Top pagination (always visible) */}
        <DocumentPagination
          className="mt-3"
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          totalItems={filteredDocuments.length}
          onPageChange={handlePageChange}
        />

        {/* Table */}
        <div className="mt-3">
          <DocumentTable
            documents={paginatedDocuments}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={(field) => {
              handleSort(field);
              setCurrentPage(1);
            }}
            onEdit={(doc) => handleAction("Bearbeiten", doc)}
            onView={(doc) => handleAction("Ansehen", doc)}
            onDownload={(doc) => handleAction("Herunterladen", doc)}
            onDelete={(doc) => setDeleteTarget(doc)}
            onRelease={(doc) => handleAction("Freigeben", doc)}
          />

          {/* Bottom pagination */}
          <DocumentPagination
            className="mt-4"
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalItems={filteredDocuments.length}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* New document wizard */}
      <NewDocumentWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onCreated={() => {
          toast.success("Dokument erfolgreich erzeugt. Übergabe an Signotec…");
        }}
      />

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        document={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
