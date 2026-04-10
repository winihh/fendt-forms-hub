import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Eye,
  Download,
  CheckCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { FormularDocument, FormularStatus } from "@/data/formular-types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STATUS_LABELS: Record<FormularStatus, string> = {
  prepared: "Vorbereitet",
  signed: "Signiert",
  released: "Freigegeben",
};

const STATUS_VARIANT: Record<FormularStatus, "prepared" | "signed" | "released"> = {
  prepared: "prepared",
  signed: "signed",
  released: "released",
};

const TYPE_LABELS = {
  service: "Service",
  inspection: "Dichtheit",
};

export type SortField = "type" | "vin" | "vehicleType" | "customer" | "lastModified" | "status";
export type SortDirection = "asc" | "desc";

interface DocumentTableProps {
  documents: FormularDocument[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (doc: FormularDocument) => void;
  onView: (doc: FormularDocument) => void;
  onDownload: (doc: FormularDocument) => void;
  onRelease: (doc: FormularDocument) => void;
}

function SortIcon({ field, currentField, direction }: { field: SortField; currentField: SortField; direction: SortDirection }) {
  if (field !== currentField) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
  return direction === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
}

export function DocumentTable({
  documents,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onView,
  onDownload,
  onRelease,
}: DocumentTableProps) {
  const renderActions = (doc: FormularDocument) => {
    switch (doc.status) {
      case "prepared":
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onEdit(doc)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bearbeiten</TooltipContent>
            </Tooltip>
          </div>
        );
      case "signed":
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onView(doc)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ansehen</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onDownload(doc)}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Herunterladen</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onRelease(doc)}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Freigeben</TooltipContent>
            </Tooltip>
          </div>
        );
      case "released":
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onView(doc)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ansehen</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onDownload(doc)}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Herunterladen</TooltipContent>
            </Tooltip>
          </div>
        );
    }
  };

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-muted">
            {[
              { field: "type" as SortField, label: "Formularart", width: "w-[110px]" },
              { field: "vin" as SortField, label: "Fahrgestell-Nr.", width: "w-[170px]" },
              { field: "vehicleType" as SortField, label: "Fahrzeugtyp", width: "" },
              { field: "customer" as SortField, label: "Endkunde", width: "" },
              { field: "lastModified" as SortField, label: "Geändert", width: "w-[100px]" },
              { field: "status" as SortField, label: "Status", width: "w-[110px]" },
            ].map((col) => (
              <th
                key={col.field}
                className={`px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-primary cursor-pointer select-none hover:bg-muted/50 transition-colors ${col.width}`}
                onClick={() => onSort(col.field)}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  <SortIcon field={col.field} currentField={sortField} direction={sortDirection} />
                </span>
              </th>
            ))}
              <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider text-primary w-[140px]">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">
                Keine Dokumente gefunden.
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <tr
                key={doc.id}
                className={`border-t border-border hover:bg-[#f4f7f9] transition-colors h-12 ${
                  doc.highlighted ? "animate-row-highlight" : ""
                }`}
              >
                <td className="px-3 py-2">
                  <span className="text-sm font-medium">{TYPE_LABELS[doc.type]}</span>
                  {doc.type === "inspection" && doc.inspectionNr && (
                    <span className="ml-1 text-xs text-muted-foreground">({doc.inspectionNr})</span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm font-mono tabular-nums">{doc.vin}</td>
                <td className="px-3 py-2 text-sm truncate max-w-[180px]">{doc.vehicleType}</td>
                <td className="px-3 py-2 text-sm truncate max-w-[120px]">{doc.customer}</td>
                <td className="px-3 py-2 text-sm tabular-nums">
                  {format(doc.lastModified, "dd.MM.yyyy", { locale: de })}
                </td>
                <td className="px-3 py-2">
                  <Badge variant={STATUS_VARIANT[doc.status]}>
                    {STATUS_LABELS[doc.status]}
                  </Badge>
                </td>
                <td className="px-3 py-2">{renderActions(doc)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
