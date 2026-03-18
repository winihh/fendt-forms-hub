export type FormularStatus = "prepared" | "signed" | "released";
export type FormularType = "service" | "inspection";

export interface FormularDocument {
  id: string;
  type: FormularType;
  vin: string;
  vehicleType: string;
  customer: string;
  inspectionNr?: number;
  lastModified: Date;
  status: FormularStatus;
  highlighted?: boolean;
}

export const MOCK_DOCUMENTS: FormularDocument[] = [
  {
    id: "DOC-2026-001",
    type: "service",
    vin: "WF0XXXGCDX1234567",
    vehicleType: "Fendt Bianco Selection 515 SG",
    customer: "Müller, Hans",
    lastModified: new Date("2026-03-17"),
    status: "prepared",
  },
  {
    id: "DOC-2026-002",
    type: "inspection",
    vin: "WF0XXXGCDX9876543",
    vehicleType: "Fendt Tendenza 650 SFDW",
    customer: "Schmidt, Petra",
    inspectionNr: 3,
    lastModified: new Date("2026-03-16"),
    status: "prepared",
  },
  {
    id: "DOC-2026-003",
    type: "service",
    vin: "WF0XXXGCDX5551234",
    vehicleType: "Fendt Opal 560 SRF",
    customer: "Weber, Thomas",
    lastModified: new Date("2026-03-15"),
    status: "signed",
  },
  {
    id: "DOC-2026-004",
    type: "inspection",
    vin: "WF0XXXGCDX7773456",
    vehicleType: "Fendt Saphir 515 SFK",
    customer: "Fischer, Maria",
    inspectionNr: 2,
    lastModified: new Date("2026-03-14"),
    status: "signed",
  },
  {
    id: "DOC-2026-005",
    type: "inspection",
    vin: "WF0XXXGCDX7773456",
    vehicleType: "Fendt Saphir 515 SFK",
    customer: "Fischer, Maria",
    inspectionNr: 1,
    lastModified: new Date("2025-04-10"),
    status: "released",
  },
  {
    id: "DOC-2026-006",
    type: "service",
    vin: "WF0XXXGCDX3339876",
    vehicleType: "Fendt Diamant 770 SGA",
    customer: "Braun, Klaus",
    lastModified: new Date("2026-02-28"),
    status: "released",
  },
  {
    id: "DOC-2026-007",
    type: "inspection",
    vin: "WF0XXXGCDX4441234",
    vehicleType: "Fendt Platin 720 SFDW",
    customer: "Schneider, Anna",
    inspectionNr: 4,
    lastModified: new Date("2026-03-12"),
    status: "prepared",
  },
  {
    id: "DOC-2026-008",
    type: "service",
    vin: "WF0XXXGCDX6665432",
    vehicleType: "Fendt Bianco Activ 515 SGE",
    customer: "Hoffmann, Jürgen",
    lastModified: new Date("2026-03-10"),
    status: "signed",
  },
  {
    id: "DOC-2026-009",
    type: "inspection",
    vin: "WF0XXXGCDX8887654",
    vehicleType: "Fendt Tendenza 515 SG",
    customer: "Krüger, Sabine",
    inspectionNr: 5,
    lastModified: new Date("2025-11-20"),
    status: "released",
  },
  {
    id: "DOC-2026-010",
    type: "service",
    vin: "WF0XXXGCDX2224567",
    vehicleType: "Fendt Opal 650 SFDW",
    customer: "Wagner, Frank",
    lastModified: new Date("2025-08-15"),
    status: "released",
  },
];
