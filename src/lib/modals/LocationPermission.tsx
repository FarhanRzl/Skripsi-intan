// Disusun dari pola pemakaian:
//   <LocationPermission bind:visible on:confirm={activateLocation} />
import Button from '$lib/buttons/Button';

interface LocationPermissionProps {
	visible: boolean;
	onVisibleChange: (visible: boolean) => void;
	onConfirm: () => void;
}

export default function LocationPermission({
	visible,
	onVisibleChange,
	onConfirm
}: LocationPermissionProps) {
	if (!visible) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
			<div className="bg-white rounded-2xl p-5 space-y-4 max-w-sm w-[85%] text-center">
				<span className="material-symbols-outlined text-primary-main" style={{ fontSize: '2.5rem' }}>
					location_on
				</span>
				<div className="space-y-1.5">
					<h2 className="text-base font-bold text-neutral-800">Izinkan Akses Lokasi</h2>
					<p className="text-sm text-neutral-500 leading-snug">
						Aktifkan GPS untuk mengedit lokasi taman di peta.
					</p>
				</div>
				<div className="flex gap-3">
					<Button
						label="Batal"
						buttonType="secondary"
						style="flex-1"
						action={() => onVisibleChange(false)}
					/>
					<Button
						label="Aktifkan"
						buttonType="primary"
						style="flex-1"
						action={onConfirm}
					/>
				</div>
			</div>
		</div>
	);
}
