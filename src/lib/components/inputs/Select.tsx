// Disusun dari asumsi pola svelte-select -> react-select
// TODO: sesuaikan props kalau Select.svelte asli beda struktur
import ReactSelect from 'react-select';

interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps {
	id?: string;
	label?: string;
	options: SelectOption[];
	value?: string | null;
	placeholder?: string;
	onChange: (value: string | null) => void;
}

export default function Select({ id, label, options, value, placeholder, onChange }: SelectProps) {
	const selected = options.find((opt) => opt.value === value) ?? null;

	return (
		<div className="space-y-1">
			{label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
			<ReactSelect
				inputId={id}
				options={options}
				value={selected}
				placeholder={placeholder}
				onChange={(opt) => onChange(opt ? (opt as SelectOption).value : null)}
				classNamePrefix="rselect"
			/>
		</div>
	);
}
