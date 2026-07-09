// Padanan src/lib/survey-form/FormInfrastructure.svelte (project Svelte).
//
// Catatan flow: logic data (exclusivity "Tidak Ada" vs pilihan lain) tetap
// dipertahankan sesuai yang sudah berjalan di app ini — Svelte asli sendiri
// tidak menerapkan exclusivity itu (pure multi-select), tapi itu keputusan
// data-model yang sudah dipakai di sini, jadi tidak diubah. Yang disamakan
// di sini murni tampilan: list vertikal (bukan grid), banner peringatan,
// label & pesan alert, serta modal konfirmasi sebelum uncheck kalau entry
// sudah terisi data (persis seperti di Svelte).
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import Alert from '$lib/Alert';
import TextInput from '$lib/input-fields/TextInput';
import CheckboxCard from '$lib/components/inputs/CheckboxCard';
import UploadFileField from '$lib/components/fields/UploadFileField';
import Warning from '$lib/components/inline-warnings/Warning';
import ConfirmDestructiveModal from '$lib/components/modals/ConfirmDestructiveModal';
import { useUploadFileMutation } from '$lib/stores/files';
import { TAG_TYPES, TAG } from '$lib/constants/tag';
import type { FileCategory } from '$lib/constants/file';
import type { FixedStructureEntry, Stage1FormWithTagsProps } from './types';

interface FormInfrastructureProps extends Stage1FormWithTagsProps {
	// Saat false (Tahap 1 / "Isi Detail Survey", isOngoing) — hanya daftar
	// pilihan infrastruktur (checkbox) yang tampil, input jarak & upload foto
	// disembunyikan dulu. Saat true (Tahap 2 / "Edit Form Survey") — input
	// jarak & upload foto tampil kembali seperti semula. Default true supaya
	// pemanggil lama (kalau ada) tetap dapat perilaku penuh seperti sebelumnya.
	showDetails?: boolean;
}

function isNoneTag(tagId: string, title: string): boolean {
	return tagId === TAG.FIXED_STRUCTURE_NONE || title.trim().toLowerCase() === 'tidak ada';
}

const DESCRIPTION_MAP: Record<string, string> = {
	'Tidak ada': 'Jika tidak ditemukan jaraknya, tuliskan dengan tanda " - "'
};

export default function FormInfrastructure({
	formId,
	surveyData,
	tags,
	updateSurveyEntries,
	showDetails = true
}: FormInfrastructureProps) {
	const fixedStructureTags = tags.filter((tag) => tag.type === TAG_TYPES.FIXED_STRUCTURE);
	const entries = surveyData.fixedStructures ?? [];
	const selectedIds = entries.map((e) => e.fixedStructureId);

	const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFileMutation();
	const [uploadingFor, setUploadingFor] = useState<string | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [structureToUncheck, setStructureToUncheck] = useState<string | null>(null);

	function removeEntry(structureId: string) {
		updateSurveyEntries(formId, {
			fixedStructures: entries.filter((e) => e.fixedStructureId !== structureId)
		});
	}

	function toggle(tag: { id: string; title: string }) {
		const isNone = isNoneTag(tag.id, tag.title);
		const existing = entries.find((e) => e.fixedStructureId === tag.id);

		if (existing) {
			// sudah dicentang -> mau di-uncheck
			if (existing.distanceFromGardenNote || existing.structurePhotos?.length) {
				// sudah ada data terisi -> minta konfirmasi dulu (samakan dgn Svelte)
				setStructureToUncheck(tag.id);
				return;
			}
			removeEntry(tag.id);
			return;
		}

		const newEntry: FixedStructureEntry = {
			id: null,
			fixedStructureId: tag.id,
			distanceFromGardenNote: null,
			otherName: null,
			structurePhotos: []
		};

		if (isNone) {
			updateSurveyEntries(formId, { fixedStructures: [newEntry] });
			return;
		}

		const withoutNone = entries.filter((e) => {
			const t = fixedStructureTags.find((ft) => ft.id === e.fixedStructureId);
			return !(t && isNoneTag(t.id, t.title));
		});
		updateSurveyEntries(formId, { fixedStructures: [...withoutNone, newEntry] });
	}

	function confirmUncheck() {
		if (structureToUncheck) removeEntry(structureToUncheck);
		setStructureToUncheck(null);
	}

	function patchEntry(structureId: string, patch: Partial<FixedStructureEntry>) {
		updateSurveyEntries(formId, {
			fixedStructures: entries.map((e) =>
				e.fixedStructureId === structureId ? { ...e, ...patch } : e
			)
		});
	}

	async function handleAddPhoto(structureId: string, event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files || files.length === 0) return;
		setUploadError(null);
		setUploadingFor(structureId);
		try {
			const uploaded = await Promise.all(
				Array.from(files).map((file) =>
					uploadFile({ fileableType: 'designSurveyReportFixedStructures', file, type: 'fixed_structure' })
				)
			);
			const entry = entries.find((e) => e.fixedStructureId === structureId);
			patchEntry(structureId, {
				structurePhotos: [
					...(entry?.structurePhotos ?? []),
					...uploaded.map((f) => ({ ...f, name: null }))
				]
			});
		} catch (err) {
			console.error(err);
			setUploadError('Gagal mengunggah foto. Silakan coba lagi.');
		} finally {
			setUploadingFor(null);
			event.target.value = '';
		}
	}

	function handleRemovePhoto(structureId: string, fileId: string) {
		const entry = entries.find((e) => e.fixedStructureId === structureId);
		if (!entry) return;
		patchEntry(structureId, { structurePhotos: entry.structurePhotos.filter((f) => f.id !== fileId) });
	}

	return (
		<div className="space-y-2" data-field={`designSurveyReports.${formId}.fixedStructures`}>
			<div className="flex items-center justify-between">
				<div>
					<p className="font-bold text-neutral-main">Infrastruktur Rumah yang Tidak Boleh Dipindahkan</p>
					<p className="text-sm text-neutral-3">Kondisi bisa pilih lebih dari satu</p>
				</div>
			</div>

			<Warning
				message={
					showDetails
						? 'Catat infrastruktur permanen rumah yang ada di dekat area taman (misal: septitank, sumur, tiang utama, panel listrik, pipa permanen). Infrastruktur ini tidak boleh dipindahkan sehingga memengaruhi desain taman. WAJIB tandai dan unggah foto dokumentasinya'
						: 'Catat infrastruktur permanen rumah yang ada di dekat area taman (misal: septitank, sumur, tiang utama, panel listrik, pipa permanen). Infrastruktur ini tidak boleh dipindahkan sehingga memengaruhi desain taman. Detail jarak & foto dokumentasi bisa dilengkapi nanti saat Lengkapi Survey / Edit Form Survey.'
				}
			/>

			<div className="space-y-2">
				{fixedStructureTags.map((opt) => {
					const checked = selectedIds.includes(opt.id);
					const entry = entries.find((e) => e.fixedStructureId === opt.id);
					const none = isNoneTag(opt.id, opt.title);

					return (
						<div key={opt.id} className="space-y-2">
							<CheckboxCard
								id={`designSurveyReports.${formId}.fixedStructures.${opt.id}`}
								name={`designSurveyReports.${formId}.fixedStructures`}
								value={opt.id}
								selectedValues={selectedIds}
								onclick={() => toggle(opt)}
								title={opt.title}
								description={DESCRIPTION_MAP[opt.title] ?? opt.technicalNote ?? ''}
							/>

							{checked && entry && showDetails && !none && (
								<>
									<TextInput
										id={`designSurveyReports.${formId}.fixedStructures.${opt.id}.distanceFromGardenNote`}
										label="Jarak Infrastruktur di Area Taman (m/cm)"
										bg="white"
										value={entry.distanceFromGardenNote ?? ''}
										onInput={(e) =>
											patchEntry(opt.id, {
												distanceFromGardenNote: e.target.value === '' ? null : e.target.value
											})
										}
									/>

									<UploadFileField
										id={`designSurveyReports.${formId}.fixedStructures.${opt.id}.structurePhotos`}
										files={entry.structurePhotos ?? []}
										isLoading={isUploading && uploadingFor === opt.id}
										accept={['.jpg', '.jpeg', '.png', '.webp']}
										showImageFilename={false}
										handleAddFile={(e) => handleAddPhoto(opt.id, e)}
										handleRemoveFile={(fileId: string, category?: FileCategory) => {
											void category;
											handleRemovePhoto(opt.id, fileId);
										}}
									/>
								</>
							)}
						</div>
					);
				})}
			</div>

			{uploadError && <Alert icon="error" message={uploadError} />}

			{structureToUncheck && (
				<ConfirmDestructiveModal
					text="Dokumentasi yang sudah anda isi akan terhapus saat berpindah opsi"
					warningText="Semua informasi yang telah diisi akan terhapus"
					confirmText="Hapus"
					cancelText="Kembali"
					oncancel={() => setStructureToUncheck(null)}
					onconfirm={confirmUncheck}
				/>
			)}
		</div>
	);
}