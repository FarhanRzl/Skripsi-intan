import ErrorText from "./ErrorText";

export default function FormField({
  name,
  register,
  label,
  type = "text",
  error,
  dataField,
  registerOptions,
}) {
  return (
    <div data-field={dataField || name} className="mb-4 flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <input
        type={type}
        {...register(name, registerOptions)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />
      <ErrorText message={error?.message} />
    </div>
  );
}
