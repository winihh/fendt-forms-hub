import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle, CheckCircle, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { MOCK_DOCUMENTS, type FormularType } from "@/data/formular-types";

interface NewDocumentWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

type WizardStep = "type" | "vin" | "details" | "confirm";

export function NewDocumentWizard({ open, onOpenChange, onCreated }: NewDocumentWizardProps) {
  const [step, setStep] = useState<WizardStep>("type");
  const [formType, setFormType] = useState<FormularType | null>(null);
  const [vin, setVin] = useState("");
  const [vinValidated, setVinValidated] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);
  const [existingDocId, setExistingDocId] = useState<string | null>(null);
  const [inspectionNr, setInspectionNr] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [inspectionResult, setInspectionResult] = useState<"ok" | "deviation" | null>(null);
  const [deviations, setDeviations] = useState("");
  const [measures, setMeasures] = useState("");

  const reset = () => {
    setStep("type");
    setFormType(null);
    setVin("");
    setVinValidated(false);
    setVinError(null);
    setExistingDocId(null);
    setInspectionNr(1);
    setCustomerName("");
    setVehicleType("");
    setInspectionResult(null);
    setDeviations("");
    setMeasures("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(reset, 200);
  };

  const handleVinCheck = () => {
    if (vin.length < 10) {
      setVinError("Bitte geben Sie eine gültige Fahrgestell-Nr. ein.");
      setVinValidated(false);
      return;
    }

    // Check for existing service document with this VIN
    if (formType === "service") {
      const existingService = MOCK_DOCUMENTS.find(
        (doc) => doc.type === "service" && doc.vin === vin
      );
      if (existingService) {
        setExistingDocId(existingService.id);
        setVinError(null);
        setVinValidated(true);
        return;
      }
    }

    // For inspection, find existing inspections and auto-increment
    if (formType === "inspection") {
      const existingInspections = MOCK_DOCUMENTS.filter(
        (doc) => doc.type === "inspection" && doc.vin === vin
      );
      if (existingInspections.length > 0) {
        const maxNr = Math.max(...existingInspections.map((d) => d.inspectionNr ?? 0));
        setInspectionNr(maxNr + 1);
      }
    }

    // Simulate vehicle lookup – find matching doc or use fallback
    const matchingDoc = MOCK_DOCUMENTS.find((doc) => doc.vin === vin);
    setExistingDocId(null);
    setVinError(null);
    setVinValidated(true);
    setVehicleType(matchingDoc?.vehicleType ?? "Unbekannter Fahrzeugtyp");
    setCustomerName(matchingDoc?.customer ?? "");
  };

  const handleCreate = () => {
    onCreated();
    handleClose();
  };

  const stepLabels: Record<WizardStep, string> = {
    type: "Formularart",
    vin: "Fahrzeug",
    details: "Details",
    confirm: "Bestätigung",
  };

  const steps: WizardStep[] = ["type", "vin", "details", "confirm"];
  const currentStepIndex = steps.indexOf(step);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[640px] rounded-sm shadow-modal p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">Neues Dokument erstellen</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {stepLabels[step]}
          </DialogDescription>
          {/* Step indicator */}
          <div className="flex items-center gap-1 mt-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`h-1.5 rounded-sm transition-colors ${
                    i <= currentStepIndex ? "bg-primary w-12" : "bg-border w-12"
                  }`}
                />
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="px-6 py-6 min-h-[280px]">
          {/* Step 1: Type selection */}
          {step === "type" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Welche Art von Dokument möchten Sie erstellen?
              </p>
              <button
                onClick={() => {
                  setFormType("service");
                  setStep("vin");
                }}
                className={`w-full flex items-center gap-4 p-4 border rounded-sm transition-colors text-left hover:border-primary hover:bg-primary/5 ${
                  formType === "service" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Serviceanmeldung</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Pro Fahrzeug nur einmal möglich
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </button>
              <button
                onClick={() => {
                  setFormType("inspection");
                  setStep("vin");
                }}
                className={`w-full flex items-center gap-4 p-4 border rounded-sm transition-colors text-left hover:border-primary hover:bg-primary/5 ${
                  formType === "inspection" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Dichtheitsinspektion</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Jährlich wiederkehrend, mit Inspektionsnummer
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </button>
            </div>
          )}

          {/* Step 2: VIN entry */}
          {step === "vin" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Fahrgestell-Nr.</Label>
                <div className="flex gap-2">
                  <Input
                    value={vin}
                    onChange={(e) => {
                      setVin(e.target.value.toUpperCase());
                      setVinValidated(false);
                      setVinError(null);
                      setExistingDocId(null);
                    }}
                    placeholder="z. B. WF0XXXGCDX1234567"
                    className="font-mono rounded-sm h-10"
                  />
                  <Button onClick={handleVinCheck} variant="outline" size="default">
                    Prüfen
                  </Button>
                </div>
                {vinError && (
                  <p className="text-xs text-destructive">{vinError}</p>
                )}
              </div>

              {/* Duplicate warning for service */}
              {vinValidated && existingDocId && formType === "service" && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-sm p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">
                        Serviceanmeldung existiert bereits
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Für dieses Fahrzeug wurde bereits eine Serviceanmeldung erstellt (ID: {existingDocId}).
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-8">
                    <Button size="sm" onClick={handleClose}>
                      Dokument öffnen
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleClose}>
                      Zur Übersicht
                    </Button>
                  </div>
                </div>
              )}

              {/* Success + existing inspections for inspection type */}
              {vinValidated && !existingDocId && (
                <div className="bg-status-released-bg border border-success/20 rounded-sm p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Fahrzeug gefunden</p>
                      <p className="text-xs text-muted-foreground mt-1">{vehicleType}</p>
                    </div>
                  </div>
                </div>
              )}

              {vinValidated && !existingDocId && formType === "inspection" && inspectionNr > 1 && (
                <div className="bg-status-signed-bg rounded-sm p-4 mt-3">
                  <p className="text-xs font-semibold text-status-signed-text mb-2">
                    Bisherige Inspektionen
                  </p>
                  <div className="space-y-1">
                    {Array.from({ length: inspectionNr - 1 }, (_, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Inspektion Nr. {i + 1}</span>
                        <span>{2024 + i}.04.15</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Label className="text-xs font-semibold">Nächste Nr.:</Label>
                    <Input
                      type="number"
                      value={inspectionNr}
                      onChange={(e) => setInspectionNr(Number(e.target.value))}
                      className="w-20 h-8 rounded-sm text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Details */}
          {step === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-4 items-center">
                <Label className="text-sm font-semibold text-right">Formularart</Label>
                <span className="text-sm">{formType === "service" ? "Serviceanmeldung" : "Dichtheitsinspektion"}</span>

                <Label className="text-sm font-semibold text-right">Fahrgestell-Nr.</Label>
                <span className="text-sm font-mono">{vin}</span>

                <Label className="text-sm font-semibold text-right">Fahrzeugtyp</Label>
                <span className="text-sm">{vehicleType}</span>

                <Label className="text-sm font-semibold text-right">Endkunde</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-9 rounded-sm text-sm"
                />

                {formType === "inspection" && (
                  <>
                    <Label className="text-sm font-semibold text-right">Inspektions-Nr.</Label>
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={inspectionNr}
                      onChange={(e) => setInspectionNr(Number(e.target.value))}
                      className="w-14 h-9 rounded-sm text-sm text-center tabular-nums"
                    />
                  </>
                )}
              </div>

              {/* Inspection result - progressive disclosure */}
              {formType === "inspection" && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <Label className="text-sm font-semibold">Ergebnis</Label>
                  <RadioGroup
                    value={inspectionResult ?? ""}
                    onValueChange={(v) => {
                      setInspectionResult(v as "ok" | "deviation");
                      if (v === "ok") {
                        setDeviations("");
                        setMeasures("");
                      }
                    }}
                    className="space-y-2"
                  >
                    <label className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-colors ${inspectionResult === "ok" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}>
                      <RadioGroupItem value="ok" />
                      <span className="text-sm font-medium">Fahrzeug in Ordnung</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-colors ${inspectionResult === "deviation" ? "border-destructive/50 bg-destructive/5" : "border-border hover:border-muted-foreground/30"}`}>
                      <RadioGroupItem value="deviation" />
                      <span className="text-sm font-medium">Abweichungen festgestellt</span>
                    </label>
                  </RadioGroup>

                  {inspectionResult === "deviation" && (
                    <div className="ml-1 pl-4 border-l-2 border-destructive/30 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">Abweichungen</Label>
                        <Textarea
                          value={deviations}
                          onChange={(e) => setDeviations(e.target.value)}
                          placeholder="Festgestellte Abweichungen beschreiben…"
                          className="rounded-sm text-sm min-h-[72px] resize-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">Maßnahmen</Label>
                        <Textarea
                          value={measures}
                          onChange={(e) => setMeasures(e.target.value)}
                          placeholder="Eingeleitete oder empfohlene Maßnahmen…"
                          className="rounded-sm text-sm min-h-[72px] resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="bg-surface-muted rounded-sm p-4 space-y-2">
                <h4 className="text-sm font-bold">Zusammenfassung</h4>
                <div className="grid grid-cols-[140px_1fr] gap-y-1.5 gap-x-4 text-sm">
                  <span className="text-muted-foreground">Formularart</span>
                  <span>{formType === "service" ? "Serviceanmeldung" : "Dichtheitsinspektion"}</span>
                  <span className="text-muted-foreground">Fahrgestell-Nr.</span>
                  <span className="font-mono">{vin}</span>
                  <span className="text-muted-foreground">Fahrzeugtyp</span>
                  <span>{vehicleType}</span>
                  <span className="text-muted-foreground">Endkunde</span>
                  <span>{customerName}</span>
                  {formType === "inspection" && (
                    <>
                      <span className="text-muted-foreground">Inspektions-Nr.</span>
                      <span>{inspectionNr}</span>
                      <span className="text-muted-foreground">Ergebnis</span>
                      <span>{inspectionResult === "ok" ? "Fahrzeug in Ordnung" : "Abweichungen festgestellt"}</span>
                      {inspectionResult === "deviation" && (
                        <>
                          <span className="text-muted-foreground">Abweichungen</span>
                          <span className="whitespace-pre-wrap">{deviations || "–"}</span>
                          <span className="text-muted-foreground">Maßnahmen</span>
                          <span className="whitespace-pre-wrap">{measures || "–"}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Nach dem Speichern erhält das Dokument den Status „Vorbereitet". Die Signierung über Signotec kann jederzeit nachgeholt werden.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface-muted">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (step === "type") handleClose();
              else setStep(steps[currentStepIndex - 1]);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {step === "type" ? "Abbrechen" : "Zurück"}
          </Button>

          {step !== "type" && step !== "confirm" && (
            <Button
              size="default"
              disabled={
                (step === "vin" && (!vinValidated || !!existingDocId)) ||
                (step === "details" && !customerName) ||
                (step === "details" && formType === "inspection" && !inspectionResult) ||
                (step === "details" && formType === "inspection" && inspectionResult === "deviation" && (!deviations || !measures))
              }
              onClick={() => setStep(steps[currentStepIndex + 1])}
            >
              Weiter
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {step === "confirm" && (
            <div className="flex items-center gap-2">
              <Button
                size="default"
                onClick={handleCreate}
              >
                Formular speichern
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={handleCreate}
              >
                Speichern & Signieren
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
