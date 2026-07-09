import { useFormContext } from "react-hook-form";
import { useSurveyData } from "../../context/SurveyDataContext";
import SelectField from "../ui/SelectField";
import FormField from "../ui/FormField";
import TextareaField from "../ui/TextareaField";

export default function Step1AreaInfo() {
  const { sunExposureOptions } = useSurveyData();
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const gardenCount = watch("areaInfo.gardenCount");

  return (
    <div data-field="areaInfo">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Informasi Area</h2>

      <SelectField
        name="areaInfo.areaSunExposureId"
        dataField="areaInfo.areaSunExposureId"
        control={control}
        label="Paparan Sinar Matahari"
        options={sunExposureOptions}
        error={errors?.areaInfo?.areaSunExposureId}
      />

      <FormField
        name="areaInfo.gardenCount"
        dataField="areaInfo.gardenCount"
        register={register}
        label="Jumlah Taman"
        type="number"
        registerOptions={{ valueAsNumber: true }}
        error={errors?.areaInfo?.gardenCount}
      />

      {gardenCount > 1 && (
        <TextareaField
          name="areaInfo.gardenEntranceAccessNote"
          dataField="areaInfo.gardenEntranceAccessNote"
          register={register}
          label="Catatan Akses Masuk Taman"
          error={errors?.areaInfo?.gardenEntranceAccessNote}
        />
      )}
    </div>
  );
}
