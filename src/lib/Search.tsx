import type { ChangeEvent, FormEvent } from 'react';
import Icon from './Icon';

interface SearchProps {
	style?: string;
	value?: string;
	onValueChange?: (value: string) => void;
}

export default function Search({ style = '', value = '', onValueChange }: SearchProps) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => onValueChange?.(e.target.value);
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();

	return (
		<form
			onSubmit={handleSubmit}
			className={`${style} flex rounded border border-primary-main mx-5 my-2`}
		>
			<input
				type="text"
				value={value}
				onChange={handleChange}
				placeholder="Search"
				className="flex-1 bg-transparent text-xs px-3 py-1.5 outline-none"
			/>
			<button className="bg-primary-main rounded-r px-2 py-1" type="submit">
				<Icon name="search" color="white" />
			</button>
		</form>
	);
}
