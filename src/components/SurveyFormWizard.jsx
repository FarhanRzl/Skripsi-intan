import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fullSurveySchema } from "../schemas";
import { useSurveyData } from "../context/SurveyDataContext";
import { useScrollToError } from "../hooks/useScrollToError";
import { useAutoSaveLocalStorage, loadDraftFromLocalStorage } from "../hooks/useAutoSaveLocalStorage";
import { submitSurveyReport } from "../api/surveyApi";
import Step1AreaInfo from "./steps/Step1AreaInfo";
import Step2Structures from "./steps/Step2Structures";
import StepIndicator from "./StepIndicator";
import NoteFab from "./NoteFab";

const TOTAL_STEPS = 2;
const STEP_LABELS = ["Info Area", "Struktur"];
const DRAFT_KEY = "survey-form-draft";

export default function SurveyFormWizard() {
  const { initialReport } = useSurveyData();
  const [step, setStep] = useState(1);
  const scrollToFirstError = useScrollToError();

  const draft = loadDraftFromLocalStorage(DRAFT_KEY);

  const methods = useForm({
    resolver: zodResolver(fullSurveySchema),
    mode: "onBlur",
    defaultValues: draft || {
      areaInfo: {
        areaSunExposureId: initialReport.areaInfo.areaSunExposureId,
        gardenCount: initialReport.areaInfo.gardenCount,
        gardenEntranceAccessNote: initialReport.areaInfo.gardenEntranceAccessNote,
      },
      structures: {
        fixedStructures: initialReport.structures.fixedStructures,
        fixedStructuresNote: initialReport.structures.fixedStructuresNote,
      },
      photos: initialReport.photos,
    },
  });

  const watchedValues = methods.watch();
  useAutoSaveLocalStorage(DRAFT_KEY, watchedValues);

  const onSubmit = async (data) => {
    try {
      await submitSurveyReport(initialReport.id, data);
      localStorage.removeItem(DRAFT_KEY);
      alert("Survey berhasil dikirim (dummy)");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim survey");
    }
  };

  const onError = (errors) => {
    scrollToFirstError(errors);
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-xl mx-auto px-4 py-8 pb-32">
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />

        <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
          {step === 1 && <Step1AreaInfo />}
          {step === 2 && <Step2Structures />}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 rounded-md font-semibold text-brand-700 bg-brand-100 hover:bg-brand-100/80"
              >
                Kembali
              </button>
            ) : (
              <span />
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 rounded-md font-semibold text-white bg-brand-500 hover:bg-brand-600"
              >
                Lanjut
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2.5 rounded-md font-semibold text-white bg-brand-500 hover:bg-brand-600"
              >
                Kirim Survey
              </button>
            )}
          </div>
        </form>
      </div>

      <NoteFab />
    </FormProvider>
  );
}
