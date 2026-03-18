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

const vehicleModels = [
  "Fendt Bianco Selection 515 SG",
  "Fendt Tendenza 650 SFDW",
  "Fendt Opal 560 SRF",
  "Fendt Saphir 515 SFK",
  "Fendt Diamant 770 SGA",
  "Fendt Platin 720 SFDW",
  "Fendt Bianco Activ 515 SGE",
  "Fendt Tendenza 515 SG",
  "Fendt Opal 650 SFDW",
  "Fendt Bianco Selection 465 SFB",
  "Fendt Tendenza 750 SFDW",
  "Fendt Diamant 650 SG",
  "Fendt Platin 650 SFDW",
  "Fendt Opal 515 SRF",
  "Fendt Saphir 650 SFK",
  "Fendt Bianco Activ 465 SGE",
  "Fendt Tendenza 515 SFDW",
  "Fendt Platin 770 SGA",
  "Fendt Diamant 515 SG",
  "Fendt Opal 720 SFDW",
  "Fendt Bianco Selection 650 SG",
  "Fendt Saphir 770 SFK",
  "Fendt Tendenza 720 SG",
  "Fendt Platin 560 SRF",
  "Fendt Diamant 650 SFDW",
  "Fendt Bianco Activ 720 SGE",
  "Fendt Opal 515 SG",
  "Fendt Saphir 560 SRF",
  "Fendt Tendenza 650 SG",
];

const customers = [
  "Müller, Hans", "Schmidt, Petra", "Weber, Thomas", "Fischer, Maria",
  "Braun, Klaus", "Schneider, Anna", "Hoffmann, Jürgen", "Krüger, Sabine",
  "Wagner, Frank", "Becker, Uwe", "Zimmermann, Claudia", "Richter, Stefan",
  "Hartmann, Elke", "Werner, Dieter", "Lehmann, Brigitte", "Koch, Rainer",
  "Schäfer, Monika", "Neumann, Wolfgang", "Schwarz, Renate", "Maier, Gerhard",
  "Baumann, Ingrid", "Huber, Manfred", "Lang, Heike", "Jung, Bernd",
  "Vogel, Karin", "Friedrich, Horst", "Scholz, Gisela", "Berger, Helmut",
  "Walter, Erika", "Lorenz, Günter", "Engel, Susanne", "Krause, Peter",
  "Böhm, Andrea", "Seidel, Markus", "Franke, Ursula", "Winkler, Norbert",
  "Dietrich, Hannelore", "Fuchs, Rolf", "Haas, Birgit", "Keller, Georg",
];

function generateVin(index: number): string {
  const suffix = String(index).padStart(7, "0");
  return `WF0XXXGCDX${suffix}`;
}

function generateDocuments(): FormularDocument[] {
  const docs: FormularDocument[] = [];
  const statuses: FormularStatus[] = ["prepared", "signed", "released"];
  const types: FormularType[] = ["service", "inspection"];

  // Start date: 2026-03-17, go backwards
  const startDate = new Date("2026-03-17");

  for (let i = 0; i < 75; i++) {
    const type = types[i % 2];
    const status = statuses[i % 3];
    const date = new Date(startDate);
    date.setDate(date.getDate() - i * 2);

    const doc: FormularDocument = {
      id: `DOC-2026-${String(i + 1).padStart(3, "0")}`,
      type,
      vin: generateVin(1000000 + i * 13579),
      vehicleType: vehicleModels[i % vehicleModels.length],
      customer: customers[i % customers.length],
      lastModified: date,
      status,
    };

    if (type === "inspection") {
      doc.inspectionNr = (i % 6) + 1;
    }

    docs.push(doc);
  }

  return docs;
}

export const MOCK_DOCUMENTS: FormularDocument[] = generateDocuments();
