import type { EmergencyContact } from "@/types";

export const emergencyContacts: EmergencyContact[] = [
  {
    id: "mecs-999",
    agency: "Malaysian Emergency Response Services (MERS)",
    purpose: "Police, Fire and Rescue, ambulance and other emergency services.",
    phone: "999",
    coverage: "Nationwide",
    sourceUrl: "https://www.malaysia.gov.my/my/my-initiative/keselamatan-siber-dan-tindak-balas-serta-pemulihan-bencana/tindak-balas-serta-pemulihan-bencana/malaysia-emergency-response-services-mers-999",
    lastVerifiedAt: "2026-07-11",
  },
  {
    id: "nadma-portal",
    agency: "National Disaster Management Agency (NADMA)",
    purpose: "Official national disaster information, agency updates and general enquiries.",
    phone: "+603 8870 4800",
    website: "https://www.nadma.gov.my/",
    coverage: "Nationwide",
    sourceUrl: "https://www.nadma.gov.my/",
    lastVerifiedAt: "2026-07-12",
  },
  {
    id: "jkm-pps",
    agency: "Department of Social Welfare (JKM)",
    purpose: "Official lookup for active temporary evacuation centres (PPS) and JKM public enquiries.",
    phone: "03-8000 8000",
    website: "https://infobencanajkmv2.jkm.gov.my/landing/",
    coverage: "Nationwide",
    sourceUrl: "https://www.jkm.gov.my/main/article/ibu-pejabat",
    lastVerifiedAt: "2026-07-12",
  },
];
