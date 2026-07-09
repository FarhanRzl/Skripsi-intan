// Disusun dari pola pemakaian di survey/+page.svelte:
//   <Filter bind:filter label="Dalam Proses" action={() => setFilter('Dalam Proses')} />
interface FilterProps {
	label: string;
	filter: string;
	action?: () => void;
}

export default function Filter({ label, filter, action }: FilterProps) {
	const active = filter === label;

	return (
		<button
			onClick={action}
			className={`flex-1 px-3 py-2.5 rounded-lg font-semibold text-sm ${
				active ? 'bg-primary-main text-white' : 'bg-white text-black border border-neutral-7'
			}`}
		>
			{label}
		</button>
	);
}
