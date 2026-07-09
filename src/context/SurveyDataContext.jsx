import { createContext, useContext } from "react";
import {
  dummySunExposureOptions,
  dummyFixedStructureOptions,
  dummySurveyReport,
} from "../data/dummySurveyData";

// Context ini isinya data referensi (opsi dropdown, dummy report)
// yang dibaca banyak komponen tapi jarang berubah — bukan form state
const SurveyDataContext = createContext(null);

export function SurveyDataProvider({ children }) {
  const value = {
    sunExposureOptions: dummySunExposureOptions,
    fixedStructureOptions: dummyFixedStructureOptions,
    initialReport: dummySurveyReport,
  };

  return (
    <SurveyDataContext.Provider value={value}>
      {children}
    </SurveyDataContext.Provider>
  );
}

export function useSurveyData() {
  const ctx = useContext(SurveyDataContext);
  if (!ctx) {
    throw new Error("useSurveyData harus dipanggil di dalam SurveyDataProvider");
  }
  return ctx;
}
