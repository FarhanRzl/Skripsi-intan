import type { ChangeEvent } from 'react';

// TODO: sesuaikan lagi kalau ada style/behavior tambahan di TextInput.svelte asli
interface TextInputProps {
	id?: string;
	name?: string;
	label?: string;
	type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea';
	bg?: 'white' | string;
	required?: boolean;
	value?: string;
	placeholder?: string;
	onInput?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function TextInput({
	id,
	name,
	label,
	type = 'text',
	bg,
	required = false,
	value = '',
	placeholder,
	onInput
}: TextInputProps) {
	const baseClass = `w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-primary-main ${
		bg === 'white' ? 'bg-white' : 'bg-neutral-50'
	}`;

	return (
		<div className="space-y-1">
			{label && (
				<label htmlFor={id} className="block text-sm font-medium text-neutral-700">
					{label}
					{required && <span className="text-danger-main"> *</span>}
				</label>
			)}
			{type === 'textarea' ? (
				<textarea
					id={id}
					name={name}
					value={value}
					placeholder={placeholder}
					onChange={onInput}
					className={`${baseClass} min-h-[100px] resize-none`}
				/>
			) : (
				<input
					id={id}
					name={name}
					type={type}
					value={value}
					placeholder={placeholder}
					onChange={onInput}
					className={baseClass}
				/>
			)}
		</div>
	);
}
