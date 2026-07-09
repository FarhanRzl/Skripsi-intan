// TODO: sesuaikan lagi kalau ada varian/style tambahan di Button.svelte asli
interface ButtonProps {
	label: string;
	buttonType?: 'primary' | 'secondary' | 'danger';
	style?: string;
	isLoading?: boolean;
	disabled?: boolean;
	action?: () => void;
	type?: 'button' | 'submit';
}

const VARIANT_CLASSES: Record<string, string> = {
	primary: 'bg-primary-main text-white',
	secondary: 'border border-primary-main text-primary-main bg-white',
	danger: 'bg-danger-main text-white'
};

export default function Button({
	label,
	buttonType = 'primary',
	style = '',
	isLoading = false,
	disabled = false,
	action,
	type = 'button'
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled || isLoading}
			onClick={action}
			className={`py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${VARIANT_CLASSES[buttonType]} ${style}`}
		>
			{label}
		</button>
	);
}
