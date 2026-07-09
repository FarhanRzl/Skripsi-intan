// Di-port dari RadioCard.svelte (project Svelte).
import { Info } from 'lucide-react';

interface RadioCardProps {
	id?: string;
	name?: string;
	value?: string;
	selectedValue?: string | null;
	title?: string;
	description?: string;
	onchange?: () => void;
	handleOnClick?: () => void;
}

export default function RadioCard({
	id,
	name,
	value,
	selectedValue,
	title = '',
	description = '',
	onchange,
	handleOnClick
}: RadioCardProps) {
	const checked = value === selectedValue;

	return (
		<label
			htmlFor={id}
			data-field={id}
			className={`block border rounded-xl p-3 transition-all cursor-pointer select-none ${
				checked ? 'border-primary-main shadow-sm' : 'border-gray-300'
			}`}
		>
			<div className="flex items-center gap-2">
				{/* using builtin checked is too complicated when need full control */}
				<input
					type="radio"
					id={id}
					name={name}
					value={value}
					checked={checked}
					onChange={onchange}
					onClick={handleOnClick}
					hidden
				/>
				<div
					className={`flex items-center justify-center size-4 rounded-full shrink-0 ${
						checked ? 'bg-primary-main' : 'bg-white border border-gray-500'
					}`}
				>
					<div className="size-3 rounded-full border border-white"></div>
				</div>
				<span className="font-Regular text-sm">{title}</span>
			</div>

			{description && (
				<div
					className={`pl-4 text-xs mt-1 transition-all duration-300 flex gap-2 ${
						checked ? 'text-primary-main' : 'text-blue-600'
					}`}
				>
					<Info size={13} className="shrink-0" />
					<div
						className={`transition-all duration-300 [&>ul]:list-disc [&>ul]:pl-4 ${
							checked ? '' : 'line-clamp-2'
						}`}
						dangerouslySetInnerHTML={{ __html: description }}
					/>
				</div>
			)}
		</label>
	);
}
