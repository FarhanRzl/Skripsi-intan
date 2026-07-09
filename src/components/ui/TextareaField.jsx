import ErrorText from "./ErrorText";

export default function TextareaField({
  name,
  register,
  label,
  error,
  dataField,
}) {
  return (
    <div data-field={dataField || name} className="mb-4 flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <textarea
        {...register(name)}
        rows={3}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-y"
      />
      <ErrorText message={error?.message} />
    </div>
  );
}
