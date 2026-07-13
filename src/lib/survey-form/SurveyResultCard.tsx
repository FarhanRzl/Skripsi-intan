// Kartu "Hasil Survey Taman" — menggantikan placeholder "Preview laporan
// survey lengkap akan tersedia di fase berikutnya" di tab Detail Order
// (SurveyDetailPage.tsx) saat status survey in_review/finish. 1 kartu per
// taman karena "Tanggal Ekspektasi Pembuatan Taman" diisi per taman
// (surveyData.expectedGardenBuildDate), sedangkan Nama Klien/Tanggal
// Survey/Alamat Survey sama untuk semua taman dalam 1 survey yang sama.
import { DateTime } from 'luxon';
import Icon from '$lib/Icon';
import logoOkeGarden from '$lib/assets/Logo_Oke Garden_2021_Logotype_Color.png';

interface SurveyResultCardProps {
	gardenName: string | null | undefined;
	clientName: string | null | undefined;
	checkInAt: string | null | undefined;
	address: string | null | undefined;
	expectedGardenBuildDate: string | null | undefined;
}

function formatFullDate(iso: string | null | undefined, format: string): string {
	if (!iso) return '-';
	const dt = DateTime.fromISO(iso);
	return dt.isValid ? dt.setLocale('id').toFormat(format) : '-';
}

function ResultRow({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs font-semibold text-primary-main">{label}</p>
			<p className="text-sm text-neutral-main">{value}</p>
		</div>
	);
}

export default function SurveyResultCard({
	gardenName,
	clientName,
	checkInAt,
	address,
	expectedGardenBuildDate
}: SurveyResultCardProps) {
	return (
		<div className="w-full rounded-2xl border border-neutral-100 shadow-card bg-white p-5 space-y-4">
			<img src={logoOkeGarden} alt="OKE Garden" className="h-6 w-auto" />

			<div className="flex items-start gap-2">
				<Icon name="description" fill={1} color="#4EA40F" size="1.75rem" />
				<div>
					<p className="font-bold text-neutral-main">Hasil Survey Taman</p>
					<p className="text-xs text-primary-main">{gardenName || 'Taman'}</p>
				</div>
			</div>

			<div className="bg-neutral-50 rounded-xl p-4 space-y-3">
				<ResultRow label="Nama Klien" value={clientName || '-'} />
				<ResultRow label="Tanggal Survey" value={formatFullDate(checkInAt, 'cccc, dd MMMM yyyy')} />
				<ResultRow label="Alamat Survey" value={address || '-'} />
				<ResultRow
					label="Tanggal Ekspektasi Pembuatan Taman"
					value={formatFullDate(expectedGardenBuildDate, 'd MMMM yyyy')}
				/>
			</div>
		</div>
	);
}
