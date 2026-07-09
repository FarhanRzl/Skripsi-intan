// Di-port dari CheckboxCard.svelte (project Svelte).
import type { MouseEvent } from 'react';
import { Check, Info } from 'lucide-react';

interface CheckboxCardProps {
	id?: string;
	name?: string;
	value?: string;
	selectedValues?: string[];
	title?: string;
	description?: string;
	onclick?: (event: MouseEvent<HTMLInputElement>) => void;
}

export default function CheckboxCard({
	id,
	name,
	value,
	selectedValues = [],
	title = '',
	description = '',
	onclick
}: CheckboxCardProps) {
	const checked = value !== undefined && selectedValues?.includes(value);

	return (
		<label
			htmlFor={id}
			data-field={id}
			className={`block border rounded-md p-3 transition-all cursor-pointer select-none ${
				checked ? 'border-primary-main shadow-sm' : 'border-gray-300'
			}`}
		>
			<div className="flex items-center gap-2">
				{/* using builtin checked is too complicated when need full control */}
				<input type="checkbox" id={id} name={name} value={value} checked={checked} onClick={onclick} readOnly hidden />
				<div
					className={`flex items-center justify-center rounded-sm size-4 shrink-0 ${
						checked ? 'bg-primary-main' : 'bg-white border border-gray-500'
					}`}
				>
					{checked && <Check className="text-white" size={14} />}
				</div>
				<span className="font-normal text-sm">{title}</span>
			</div>

			{description && (
				<div
					className={`pl-4 text-xs mt-1 transition-all duration-300 flex gap-2 ${
						checked ? 'text-green-700' : 'text-blue-600'
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