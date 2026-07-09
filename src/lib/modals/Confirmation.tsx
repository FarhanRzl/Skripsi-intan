// Disusun dari pola pemakaian di +page.svelte:
//   <Confirmation bind:visible parentWidth action title desc button={label, buttonType} />
import Button from '$lib/buttons/Button';

interface ConfirmationButton {
	label: string;
	buttonType?: 'primary' | 'secondary' | 'danger';
}

interface ConfirmationProps {
	visible: boolean;
	onVisibleChange: (visible: boolean) => void;
	parentWidth?: number;
	action: () => void;
	title: string;
	desc?: string;
	button: ConfirmationButton;
}

export default function Confirmation({
	visible,
	onVisibleChange,
	parentWidth,
	action,
	title,
	desc,
	button
}: ConfirmationProps) {
	if (!visible) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
			<div
				style={parentWidth ? { width: parentWidth * 0.85 } : undefined}
				className="bg-white rounded-2xl p-5 space-y-4 max-w-sm w-[85%]"
			>
				<div className="space-y-1.5">
					<h2 className="text-base font-bold text-neutral-800">{title}</h2>
					<p className="text-sm text-neutral-500 leading-snug">{desc}</p>
				</div>
				<div className="flex gap-3">
					<Button
						label="Batal"
						buttonType="secondary"
						style="flex-1"
						action={() => onVisibleChange(false)}
					/>
					<Button
						label={button.label}
						buttonType={button.buttonType ?? 'primary'}
						style="flex-1"
						action={action}
					/>
				</div>
			</div>
		</div>
	);
}