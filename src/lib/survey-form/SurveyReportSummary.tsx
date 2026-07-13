// Ringkasan lengkap 1 laporan survey ("1 taman") yang SUDAH disubmit —
// dipakai di tab "Form Survey" pada SurveyDetailPage.tsx (status
// in_review/finish, alias halaman "Survey Selesai"). Sebelumnya tab itu cuma
// menampilkan catatan surveyor + ukuran taman ("Form survey lengkap akan
// tersedia di fase berikutnya"); komponen ini menggantinya dengan seluruh
// isian Tahap 1 + Tahap 2 + Dokumentasi, plus status toggle "Memerlukan
// Validasi ke Klien?" per section (read-only, karena laporan yang sudah
// disubmit belum punya jalur update balik ke backend — lihat surveyActions.ts).
import type { ReactNode } from 'react';
import { DateTime } from 'luxon';
import UploadedVideo from '$lib/components/inputs/UploadedVideo';
import UploadedDocument from '$lib/components/inputs/UploadedDocument';
import type { Tag } from '$types/tags';
import type { NameableFile } from '$types/files';
import type { SurveyFormData } from './types';
import { stage2QuestionCatalog } from './stage2Questions';
import { getTagTitle } from './fieldSuggestionUtils';
import ValidationToggle from './ValidationToggle';

interface SurveyReportSummaryProps {
	data: SurveyFormData;
	tags: Tag[];
}

// Key katalog Tahap 2 yang TIDAK dirender lewat loop generik di bawah —
// fixedStructures sudah tampil di section "Infrastruktur" (sama seperti
// FormInfrastructure Tahap 1), 4 sisanya adalah section "Dokumentasi" yang
// dirender terpisah lewat FileGroup (sama seperti SurveyFormV3).
const STAGE2_KEYS_RENDERED_ELSEWHERE = new Set([
	'fixedStructures',
	'PhotoAreaId',
	'existingPlantPhoto',
	'sketchPhoto',
	'otherDocumentation'
]);

function SummaryRow({ label, value, note }: { label: string; value: ReactNode; note?: string | null }) {
	const isEmpty = value === null || value === undefined || value === '';
	return (
		<div className="space-y-0.5">
			<p className="text-xs text-neutral-5">{label}</p>
			<p className="text-sm text-neutral-main">{isEmpty ? '-' : value}</p>
			{note && <p className="text-xs text-neutral-5 italic">{note}</p>}
		</div>
	);
}

function SummarySection({
	title,
	sectionKey,
	data,
	children
}: {
	title: string;
	sectionKey?: string;
	data: SurveyFormData;
	children: ReactNode;
}) {
	return (
		<div className="space-y-2 pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0">
			<h4 className="text-sm font-bold text-primary-main">{title}</h4>
			{children}
			{sectionKey && <ValidationToggle formId="" sectionKey={sectionKey} surveyData={data} readOnly />}
		</div>
	);
}

function formatTime(time: string): string {
	return time.slice(0, 5).replace(':', '.');
}

function formatDate(value: string | null | undefined): string {
	if (!value) return '-';
	const dt = DateTime.fromISO(value);
	return dt.isValid ? dt.setLocale('id').toFormat('d MMMM yyyy') : value;
}

export function FileGroup({
	images,
	videos,
	documents,
	cloudUrl
}: {
	images: NameableFile[];
	videos: NameableFile[];
	documents: NameableFile[];
	cloudUrl?: string | null;
}) {
	const hasFiles = images.length + videos.length + documents.length > 0;

	if (!hasFiles && !cloudUrl) {
		return <p className="text-sm text-neutral-5">Belum ada dokumentasi.</p>;
	}

	return (
		<div className="space-y-2">
			{images.length > 0 && (
				<div className="grid grid-cols-3 gap-2">
					{images.map((file) => (
						<div key={file.id} className="space-y-1">
							<img
								src={file.url}
								alt={file.name ?? file.filename ?? 'dokumentasi'}
								className="w-full aspect-square rounded-lg object-cover border border-neutral-200"
							/>
							{file.name && <p className="text-[10px] text-neutral-5 truncate">{file.name}</p>}
						</div>
					))}
				</div>
			)}
			{videos.map((file) => (
				<UploadedVideo key={file.id} file={file} />
			))}
			{documents.map((file) => (
				<UploadedDocument key={file.id} file={file} />
			))}
			{cloudUrl && (
				<a
					href={cloudUrl}
					target="_blank"
					rel="noreferrer"
					className="text-sm text-primary-main underline break-all block"
				>
					{cloudUrl}
				</a>
			)}
		</div>
	);
}

export default function SurveyReportSummary({ data, tags }: SurveyReportSummaryProps) {
	const fixedStructureEntries = data.fixedStructures ?? [];
	const landPreparationEntries = data.landPreparations ?? [];
	const itemRequestEntries = data.itemRequests ?? [];

	return (
		<div className="space-y-4">
			<SummarySection title="Informasi Umum" data={data}>
				<SummaryRow label="Nama Taman" value={data.gardenName} />
				<SummaryRow label="Ukuran Aktual Taman" value={data.areaSize ? `${data.areaSize} m²` : null} />
			</SummarySection>

			<SummarySection title="Waktu Pencahayaan" sectionKey="areaSunExposureTimes" data={data}>
				<SummaryRow
					label="Jam Terkena Sinar Matahari"
					value={(data.areaSunExposureTimes ?? []).map(formatTime).join(', ') || null}
				/>
			</SummarySection>

			<SummarySection title="Dinding terhadap Pencahayaan" sectionKey="sunExposureObstructionId" data={data}>
				<SummaryRow label="Kondisi" value={getTagTitle(tags, data.sunExposureObstructionId) || null} />
			</SummarySection>

			<SummarySection title="Kondisi Drainase" sectionKey="drainageId" data={data}>
				<SummaryRow label="Drainase" value={getTagTitle(tags, data.drainageId) || null} />
			</SummarySection>

			<SummarySection title="Sumber Air" sectionKey="waterSourceId" data={data}>
				<SummaryRow
					label="Sumber Air"
					value={getTagTitle(tags, data.waterSourceId) || null}
					note={data.waterSourceDistanceNote}
				/>
			</SummarySection>

			<SummarySection title="Sumber Listrik" sectionKey="electricitySourceId" data={data}>
				<SummaryRow
					label="Sumber Listrik"
					value={getTagTitle(tags, data.electricitySourceId) || null}
					note={data.electricitySourceDistanceNote}
				/>
			</SummarySection>

			<SummarySection title="Akses ke Rumah" sectionKey="entranceAccessId" data={data}>
				<SummaryRow label="Akses" value={getTagTitle(tags, data.entranceAccessId) || null} />
			</SummarySection>

			<SummarySection title="Akses Masuk Taman" sectionKey="gardenEntranceAccessId" data={data}>
				<SummaryRow
					label="Akses"
					value={getTagTitle(tags, data.gardenEntranceAccessId) || null}
					note={data.gardenEntranceAccessNote}
				/>
				{(data.gardenEntranceAccessPhotos ?? []).length > 0 && (
					<FileGroup images={data.gardenEntranceAccessPhotos ?? []} videos={[]} documents={[]} />
				)}
			</SummarySection>

			<SummarySection title="Kondisi Area" sectionKey="groundSurfaceConditionId" data={data}>
				<SummaryRow label="Kondisi" value={getTagTitle(tags, data.groundSurfaceConditionId) || null} />
			</SummarySection>

			<SummarySection title="Kebutuhan Pengolahan Lahan" sectionKey="landPreparations" data={data}>
				{landPreparationEntries.length > 0 ? (
					<div className="space-y-1">
						{landPreparationEntries.map((entry, i) => (
							<SummaryRow
								key={entry.id ?? i}
								label={getTagTitle(tags, entry.landPreparationId) || '-'}
								value={entry.surveyorNote}
							/>
						))}
					</div>
				) : (
					<SummaryRow label="Kondisi" value={null} />
				)}
			</SummarySection>

			<SummarySection title="Kelembapan Tanah" sectionKey="soilMoistureId" data={data}>
				<SummaryRow label="Kelembapan" value={getTagTitle(tags, data.soilMoistureId) || null} />
			</SummarySection>

			{data.soilPlantingReadinessId && (
				<SummarySection title="Kesiapan Tanah untuk Ditanam" data={data}>
					<SummaryRow
						label="Kesiapan"
						value={getTagTitle(tags, data.soilPlantingReadinessId) || null}
						note={data.soilPlantingReadinessNote}
					/>
				</SummarySection>
			)}

			<SummarySection title="Infrastruktur Rumah yang Tidak Boleh Dipindahkan" data={data}>
				{fixedStructureEntries.length > 0 ? (
					<div className="space-y-2">
						{fixedStructureEntries.map((entry, i) => (
							<div key={entry.id ?? i} className="space-y-1">
								<SummaryRow
									label={entry.otherName || getTagTitle(tags, entry.fixedStructureId) || '-'}
									value={entry.distanceFromGardenNote}
								/>
								{entry.structurePhotos?.length > 0 && (
									<FileGroup images={entry.structurePhotos} videos={[]} documents={[]} />
								)}
							</div>
						))}
					</div>
				) : (
					<SummaryRow label="Infrastruktur" value={null} />
				)}
			</SummarySection>

			{stage2QuestionCatalog
				.filter((def) => !STAGE2_KEYS_RENDERED_ELSEWHERE.has(def.key))
				.map((def) => {
					if (def.key === 'plantRequests') {
						return (
							<SummarySection key={def.key} title={def.title} sectionKey={def.key} data={data}>
								<SummaryRow
									label="Permintaan"
									value={
										itemRequestEntries
											.map((item) => item.itemableName || item.notExistsNote)
											.filter(Boolean)
											.join(', ') || null
									}
								/>
							</SummarySection>
						);
					}

					if (
						def.key === 'rainWaterFlowDirectionNote' ||
						def.key === 'gardenBudgetNote'
					) {
						return (
							<SummarySection key={def.key} title={def.title} sectionKey={def.key} data={data}>
								<SummaryRow label={def.title} value={data[def.key] as string | null} />
							</SummarySection>
						);
					}

					if (def.key === 'expectedGardenBuildDate') {
						return (
							<SummarySection key={def.key} title={def.title} sectionKey={def.key} data={data}>
								<SummaryRow label={def.title} value={formatDate(data.expectedGardenBuildDate)} />
							</SummarySection>
						);
					}

					const value = data[def.key] as string | null;
					const otherText = def.otherTextKey ? (data[def.otherTextKey] as string | null) : null;
					const showOtherText = Boolean(def.otherTagId) && value === def.otherTagId;

					return (
						<SummarySection key={def.key} title={def.title} sectionKey={def.key} data={data}>
							<SummaryRow
								label={def.title}
								value={getTagTitle(tags, value) || null}
								note={showOtherText ? otherText : null}
							/>
						</SummarySection>
					);
				})}

			<SummarySection title="Catatan Surveyor" data={data}>
				{data.surveyorNote ? (
					<div
						className="text-sm text-neutral-main leading-relaxed [&_ul]:list-disc [&_ul]:pl-5"
						dangerouslySetInnerHTML={{ __html: data.surveyorNote }}
					/>
				) : (
					<p className="text-sm text-neutral-5">Belum ada catatan surveyor.</p>
				)}
			</SummarySection>

			<SummarySection title="Foto Area" data={data}>
				<FileGroup
					images={data.areaPhotoImages ?? []}
					videos={data.areaPhotoVideos ?? []}
					documents={data.areaPhotoDocuments ?? []}
					cloudUrl={data.areaPhotoCloudStorageUrl}
				/>
			</SummarySection>

			<SummarySection title="Tanaman Eksisting" data={data}>
				{(data.plantPresences ?? []).length > 0 && (
					<div className="grid grid-cols-3 gap-2">
						{(data.plantPresences ?? []).map((entry, i) => (
							<div key={entry.photo.id ?? i} className="space-y-1">
								<img
									src={entry.photo.url}
									alt={entry.itemName || entry.photo.filename || 'tanaman eksisting'}
									className="w-full aspect-square rounded-lg object-cover border border-neutral-200"
								/>
								<p className="text-[10px] text-neutral-5 truncate">
									{entry.itemName || '-'} ({entry.volume} {entry.denom})
								</p>
							</div>
						))}
					</div>
				)}
				{(data.plantPresences ?? []).length === 0 && !data.plantPresenceCloudStorageUrl && (
					<p className="text-sm text-neutral-5">Belum ada dokumentasi.</p>
				)}
				{data.plantPresenceCloudStorageUrl && (
					<a
						href={data.plantPresenceCloudStorageUrl}
						target="_blank"
						rel="noreferrer"
						className="text-sm text-primary-main underline break-all block"
					>
						{data.plantPresenceCloudStorageUrl}
					</a>
				)}
			</SummarySection>

			<SummarySection title="Sketch/Gambar" data={data}>
				<FileGroup
					images={data.sketchImages ?? []}
					videos={[]}
					documents={data.sketchDocuments ?? []}
					cloudUrl={data.sketchCloudStorageUrl}
				/>
			</SummarySection>

			<SummarySection title="Dokumentasi Lainnya" data={data}>
				<FileGroup
					images={data.documentationImages ?? []}
					videos={data.documentationVideos ?? []}
					documents={data.documentationDocuments ?? []}
					cloudUrl={data.documentationCloudStorageUrl}
				/>
			</SummarySection>
		</div>
	);
}
