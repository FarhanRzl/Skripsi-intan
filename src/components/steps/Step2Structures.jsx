import { useFormContext } from "react-hook-form";
import { useSurveyData } from "../../context/SurveyDataContext";
import TextareaField from "../ui/TextareaField";
import ErrorText from "../ui/ErrorText";

export default function Step2Structures() {
  const { fixedStructureOptions } = useSurveyData();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selected = watch("structures.fixedStructures") || [];

  const toggleStructure = (id) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setValue("structures.fixedStructures", next, { shouldValidate: true });
  };

  return (
    <div data-field="structures">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">
        Struktur Tetap di Area
      </h2>

      <div data-field="structures.fixedStructures" className="mb-4 flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-800">
          Pilih struktur yang ada
        </label>
        <div className="flex flex-col gap-2 mt-1">
          {fixedStructureOptions.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 text-sm font-normal">
              <input
                type="checkbox"
                checked={selected.includes(opt.id)}
                onChange={() => toggleStructure(opt.id)}
                className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <ErrorText message={errors?.structures?.fixedStructures?.message} />
      </div>

      {selected.includes(5) && (
        <TextareaField
          name="structures.fixedStructuresNote"
          dataField="structures.fixedStructuresNote"
          register={register}
          label="Sebutkan struktur lainnya"
          error={errors?.structures?.fixedStructuresNote}
        />
      )}
    </div>
  );
}
