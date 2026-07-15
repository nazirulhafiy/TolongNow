export type ReportedPpsFallback = {
  district: string;
  sourcePublishedAt: string;
  sourceTitle: string;
  sourceUrl: string;
  victimCount: number;
  familyCount: number;
  centres: Array<{
    id: string;
    name: string;
    address: string;
    district: string;
    state: string;
    latitude?: number;
    longitude?: number;
    mapUrl?: string;
  }>;
};

const source = {
  sourcePublishedAt: "2026-07-12T16:14:43+08:00",
  sourceTitle: "Kosmo, 12 July 2026",
  sourceUrl: "https://www.kosmo.com.my/2026/07/12/2-lagi-pps-dibuka-di-melaka-mangsa-banjir-kini-1005-orang/",
};

const fallbacks: ReportedPpsFallback[] = [
  {
    ...source,
    district: "Melaka Tengah",
    victimCount: 942,
    familyCount: 301,
    centres: [
      { id: "reported-sjkc-bertam-ulu", name: "SJK (C) Bertam Ulu", address: "Bertam Ulu, 76450 Melaka", district: "Melaka Tengah", state: "Melaka", latitude: 2.289246, longitude: 102.193169 },
      { id: "reported-japerun-pantai-kundur", name: "JAPERUN Pantai Kundur", address: "Pantai Kundor, Tanjung Kling, Melaka 76400", district: "Melaka Tengah", state: "Melaka", mapUrl: "https://www.openstreetmap.org/search?query=Pantai%20Kundor%2C%20Tanjung%20Kling%2C%20Melaka%2076400" },
      { id: "reported-sk-tanjung-minyak-2", name: "SK Tanjung Minyak 2", address: "87, Jalan PBR 28, Kampung Tanjung Minyak, 75260 Melaka", district: "Melaka Tengah", state: "Melaka", latitude: 2.268093, longitude: 102.194022 },
      { id: "reported-sk-taman-bukit-rambai", name: "SK Taman Bukit Rambai", address: "Bukit Rambai, 75250 Melaka", district: "Melaka Tengah", state: "Melaka", latitude: 2.25803, longitude: 102.171183 },
    ],
  },
  {
    ...source,
    district: "Alor Gajah",
    victimCount: 20,
    familyCount: 6,
    centres: [
      { id: "reported-perkim-masjid-tanah", name: "PERKIM Masjid Tanah", address: "Masjid Tanah, Alor Gajah, Melaka", district: "Alor Gajah", state: "Melaka" },
      { id: "reported-balairaya-kampung-seri-jeram", name: "Balairaya Kampung Seri Jeram", address: "Kampung Seri Jeram, Alor Gajah, Melaka", district: "Alor Gajah", state: "Melaka" },
    ],
  },
  {
    ...source,
    district: "Jasin",
    victimCount: 43,
    familyCount: 11,
    centres: [
      { id: "reported-sk-tehel", name: "Sekolah Kebangsaan Tehel", address: "Tehel, Jasin, Melaka", district: "Jasin", state: "Melaka" },
    ],
  },
];

export function getReportedPpsFallback(district?: string): ReportedPpsFallback | undefined {
  if (!district) return undefined;
  return fallbacks.find((fallback) => fallback.district.toLocaleLowerCase("en-MY") === district.toLocaleLowerCase("en-MY"));
}
