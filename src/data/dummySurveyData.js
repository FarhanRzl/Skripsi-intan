// Dummy data — shape disesuaikan dengan response backend asli
// biar nanti gampang di-swap ke API call beneran

export const dummySunExposureOptions = [
  { id: 1, label: "Full Sun (6+ jam langsung)" },
  { id: 2, label: "Partial Sun (3-6 jam)" },
  { id: 3, label: "Shade (< 3 jam)" },
  { id: 4, label: "Full Shade (tidak terkena sinar langsung)" },
];

export const dummyFixedStructureOptions = [
  { id: 1, label: "Pagar" },
  { id: 2, label: "Gazebo" },
  { id: 3, label: "Kolam" },
  { id: 4, label: "Jalan Setapak" },
  { id: 5, label: "Lainnya" },
];

// Contoh shape "response" backend untuk satu survey report
// (mengikuti pola DesignSurveyReportInputUpdateSchema versi SvelteKit)
export const dummySurveyReport = {
  id: "survey-001",
  orderDesign: {
    id: "order-001",
    customerName: "Budi Santoso",
    address: "Jl. Mawar No. 10, Surabaya",
  },
  areaInfo: {
    gardenCount: 1,
    gardenEntranceAccessNote: "",
  },
  structures: {
    fixedStructures: [],
    fixedStructuresNote: "",
  },
  photos: [
    { id: "photo-1", url: "https://placehold.co/400x300", caption: "Tampak depan" },
  ],
};
