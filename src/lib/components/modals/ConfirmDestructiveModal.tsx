// Di-port dari src/lib/components/modals/ConfirmDestructiveModal.svelte (project Svelte).
import { X } from 'lucide-react';

interface ConfirmDestructiveModalProps {
	text: string;
	warningText?: string;
	cancelText: string;
	confirmText: string;
	oncancel: () => void;
	onconfirm: () => void;
}

export default function ConfirmDestructiveModal({
	text,
	warningText,
	cancelText,
	confirmText,
	oncancel,
	onconfirm
}: ConfirmDestructiveModalProps) {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-xl w-80 p-4 relative shadow-lg">
				<div className="flex items-center justify-end">
					<button className="text-danger-main" onClick={oncancel} aria-label="Tutup">
						<X size={16} className="shrink-0" />
					</button>
				</div>

				<div className="flex justify-center mt-2">
					<svg className="w-16 h-16 text-danger-main" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							fill="currentColor"
							d="M2.725 21q-.275 0-.5-.137t-.35-.363t-.137-.488t.137-.512l9.25-16q.15-.25.388-.375T12 3t.488.125t.387.375l9.25 16q.15.25.138.513t-.138.487t-.35.363t-.5.137zm1.725-2h15.1L12 6zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.712T12 10t-.712.288T11 11v3q0 .425.288.713T12 15m0-2.5"
						/>
					</svg>
				</div>

				<div className="text-center mt-4">
					<h2 className="font-semibold text-gray-800 text-xl mb-2">{text}</h2>
					{warningText && <p className="text-xs text-danger-main">{warningText}</p>}
				</div>

				<div className="flex gap-4 justify-center mt-4">
					<button
						type="button"
						className="flex-1 bg-danger-main text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
						onClick={onconfirm}
					>
						{confirmText}
					</button>
					<button
						type="button"
						className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg hover:bg-green-50 transition-colors"
						onClick={oncancel}
					>
						{cancelText}
					</button>
				</div>
			</div>
		</div>
	);
}