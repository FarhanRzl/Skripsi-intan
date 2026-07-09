// Disusun dari asumsi pola svelte-select (multiple) -> react-select isMulti
// TODO: sesuaikan props kalau MultiSelect.svelte asli beda struktur
import ReactSelect from 'react-select';

interface SelectOption {
	value: string;
	label: string;
}

interface MultiSelectProps {
	id?: string;
	label?: string;
	options: SelectOption[];
	values?: string[];
	placeholder?: string;
	onChange: (values: string[]) => void;
}

export default function MultiSelect({
	id,
	label,
	options,
	values = [],
	placeholder,
	onChange
}: MultiSelectProps) {
	const selected = options.filter((opt) => values.includes(opt.value));

	return (
		<div className="space-y-1">
			{label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
			<ReactSelect
				inputId={id}
				isMulti
				options={options}
				value={selected}
				placeholder={placeholder}
				onChange={(opts) => onChange((opts as SelectOption[]).map((o) => o.value))}
				classNamePrefix="rselect"
			/>
		</div>
	);
}
