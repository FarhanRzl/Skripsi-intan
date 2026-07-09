// Disusun dari pola pemakaian: <Status label="Perlu Dilengkapi" />
interface StatusProps {
	label: string;
}

const buttonColor: Record<string, string> = {
	'Sedang Ditinjau': 'bg-info-main',
	'Perlu Dilengkapi': 'bg-warning-6'
};

export default function Status({ label }: StatusProps) {
	return (
		<div
			className={`${buttonColor[label] ?? 'bg-neutral-6'} w-fit px-3.5 py-1 rounded-full font-semibold text-xs text-white`}
		>
			{label}
		</div>
	);
}
