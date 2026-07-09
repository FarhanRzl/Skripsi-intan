// Disusun dari pola pemakaian: <Option label="Simpan Perubahan" action={...} />
// dan <Option label="Hapus Form Survey" type="cancel" action={...} />
interface OptionProps {
	label: string;
	type?: 'default' | 'cancel';
	action?: () => void;
}

export default function Option({ label, type = 'default', action }: OptionProps) {
	return (
		<button
			onClick={action}
			className={`px-3 py-1.5 rounded shadow-md text-sm font-medium ${
				type === 'cancel'
					? 'bg-danger-surface text-danger-main'
					: 'bg-primary-surface text-success-hover'
			}`}
		>
			{label}
		</button>
	);
}
