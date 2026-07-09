import { USE_DUMMY_DATA, API_BASE_URL } from "./config";
import { dummySurveyReport } from "../data/dummySurveyData";

// Simulasi delay network biar UX loading state kelihatan realistis
const fakeDelay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export async function getSurveyReport(surveyId) {
  if (USE_DUMMY_DATA) {
    await fakeDelay();
    return { ...dummySurveyReport, id: surveyId };
  }

  const res = await fetch(`${API_BASE_URL}/surveys/${surveyId}`);
  if (!res.ok) throw new Error("Gagal mengambil data survey");
  return res.json();
}

export async function submitSurveyReport(surveyId, data) {
  if (USE_DUMMY_DATA) {
    await fakeDelay();
    console.log("Submit survey (dummy):", surveyId, data);
    return { success: true, id: surveyId };
  }

  const res = await fetch(`${API_BASE_URL}/surveys/${surveyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal menyimpan survey");
  return res.json();
}
