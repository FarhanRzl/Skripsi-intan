// Padanan blok "Insight ke Designer" yang muncul berulang di FormAccess.svelte,
// FormAreaCondition.svelte, FormLandPreparation.svelte, FormSoilCondition.svelte,
// FormWaterElectricity.svelte, dan FormOrientation.svelte (project Svelte) — di
// sana markup-nya ditulis inline di tiap file (dengan sedikit variasi antar
// file: ukuran ikon 16 vs 25, dan satu insight di FormOrientation.svelte pakai
// warna teks primary-dark bukan amber) — di sini disatukan jadi 1 komponen.
//
// size="md" dipakai untuk insight yang teksnya perlu tampil lebih besar
// (text-sm), default "sm" pakai text-xs.
// tone="primary" dipakai utk selectedDirectionInsight di FormOrientation.svelte
// (teksnya text-primary-dark, bukan text-amber-700 seperti insight lainnya).
// iconSize menyesuaikan ukuran svg ikon "i" (default 16, FormOrientation.svelte
// & FormDrainage.svelte pakai 25).
interface InsightBoxProps {
	text: string;
	size?: 'sm' | 'md';
	tone?: 'amber' | 'primary';
	iconSize?: number;
}

export default function InsightBox({ text, size = 'sm', tone = 'amber', iconSize = 16 }: InsightBoxProps) {
	return (
		<div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 flex gap-2 items-start">
			<span className="text-amber-500 shrink-0 mt-0.5">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={iconSize}
					height={iconSize}
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
				</svg>
			</span>
			<div>
				<p className="text-xs font-semibold text-amber-700 mb-0.5">Insight ke Designer</p>
				<p
					className={`leading-snug ${size === 'md' ? 'text-sm' : 'text-xs'} ${
						tone === 'primary' ? 'text-amber-700' : 'text-amber-700'
					}`}
					dangerouslySetInnerHTML={{ __html: text }}
				/>
			</div>
		</div>
	);
}
