// Di-port dari src/lib/survey-form/FormSpecialPresence.svelte (project Svelte).
//
// Catatan: `childrenPresenceId` & `animalPresenceId` sudah ditangani generik
// lewat AdditionalInfoQuestion.tsx + stage2Questions.ts. Bedanya, source
// Svelte ini punya field catatan teks tambahan (`childrenPresenceNote`,
// `animalPresenceNote`) yang BELUM ada di mekanisme generik — sudah
// ditambahkan ke SurveyFormData (lihat types.ts) supaya komponen literal ini
// bisa jalan, tapi belum dipasang ke FormAdditionalInfo.tsx. TIDAK dipasang
// ganda supaya tidak dobel dengan pertanyaan generik yang sudah ada.
import type { ChangeEvent } from 'react';
import { TAG, TAG_TYPES } from '$lib/constants/tag';
import TextInput from '$lib/input-fields/TextInput';
import RadioCard from '$lib/components/inputs/RadioCard';
import Warning from '$lib/components/inline-warnings/Warning';
import InfoTooltip from '$lib/components/tooltips/InfoTooltip';
import type { Stage1FormWithTagsProps } from './types';

export default function FormSpecialPresence({
	formId,
	surveyData,
	tags,
	updateSurveyEntries
}: Stage1FormWithTagsProps) {
	const childPresenceOpts = tags.filter((tag) => tag.type === TAG_TYPES.CHILDREN_PRESENCE);
	const animalPresenceOpts = tags.filter((tag) => tag.type === TAG_TYPES.ANIMAL_PRESENCE);

	return (
		<>
			<div className="space-y-2" data-field={`designSurveyReports.${formId}.childrenPresenceId`}>
				<div className="flex items-center justify-between">
					<div>
						<p className="font-bold text-neutral-main">Keberadaan Anak Kecil</p>
						<p className="text-sm text-neutral-3">Pilih salah satu kondisi di bawah</p>
					</div>
				</div>

				<Warning message="PENTING untuk pemilihan tanaman (hindari beracun/berduri) dan desain area bermain." />

				<div className="space-y-2">
					{childPresenceOpts.map((opt) => (
						<RadioCard
							key={opt.id}
							id={`designSurveyReports.${formId}.childrenPresenceId.${opt.id}`}
							name={`designSurveyReports.${formId}.childrenPresenceId`}
							value={opt.id}
							selectedValue={surveyData.childrenPresenceId}
							onchange={() => updateSurveyEntries(formId, { childrenPresenceId: opt.id })}
							title={opt.title}
							description={opt.technicalNote ?? ''}
						/>
					))}
				</div>

				{surveyData.childrenPresenceId && (
					<>
						<TextInput
							id={`designSurveyReports.${formId}.childrenPresenceNote`}
							name={`designSurveyReports.${formId}.childrenPresenceNote`}
							type="textarea"
							bg="white"
							label="Masukan detail tentang keberadaan anak kecil"
							value={surveyData.childrenPresenceNote ?? ''}
							onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
								updateSurveyEntries(formId, { childrenPresenceNote: e.target.value })
							}
						/>
					</>
				)}
			</div>

			<hr />

			<div className="space-y-2" data-field={`designSurveyReports.${formId}.animalPresenceId`}>
				<div className="flex items-center justify-between mb-1">
					<h3 className="font-bold text-neutral-main">Hewan Peliharaan</h3>
					<InfoTooltip text="Tanyakan ke pemilik rumah apakah ada hewan peliharaan (anjing, kucing, kelinci, burung, dsb). Informasi ini penting agar desain taman aman bagi hewan, serta pemilihan tanaman/material tidak berbahaya." />
				</div>

				<div className="space-y-2">
					{animalPresenceOpts.map((opt) => (
						<RadioCard
							key={opt.id}
							id={`designSurveyReports.${formId}.animalPresenceId.${opt.id}`}
							name={`designSurveyReports.${formId}.animalPresenceId`}
							value={opt.id}
							selectedValue={surveyData.animalPresenceId}
							onchange={() => updateSurveyEntries(formId, { animalPresenceId: opt.id })}
							title={opt.title}
							description={opt.technicalNote ?? ''}
						/>
					))}

					{surveyData.animalPresenceId === TAG.ANIMAL_PRESENCE_OTHER && (
						<>
							<TextInput
								id={`designSurveyReports.${formId}.animalPresenceNote`}
								name={`designSurveyReports.${formId}.animalPresenceNote`}
								label="Hewan lainnya"
								bg="white"
								value={surveyData.animalPresenceNote ?? ''}
								onInput={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
									updateSurveyEntries(formId, { animalPresenceNote: e.target.value })
								}
							/>
						</>
					)}
				</div>
			</div>
		</>
	);
}
