import { Controller } from "react-hook-form";
import ErrorText from "./ErrorText";

export default function SelectField({
  name,
  control,
  label,
  options,
  error,
  dataField,
}) {
  return (
    <div data-field={dataField || name} className="mb-4 flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            value={field.value ?? ""}
            onChange={(e) =>
              field.onChange(e.target.value ? Number(e.target.value) : null)
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">-- Pilih --</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />
      <ErrorText message={error?.message} />
    </div>
  );
}
