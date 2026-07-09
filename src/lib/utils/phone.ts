// Dipakai di CardSurvey & SurveyDetailPage:
//   formatDisplay(user.phone) → teks nomor yang ditampilkan
//   getWaMeUrl(user.phone)    → link wa.me yang bisa diklik
// TODO: timpa kalau ada aturan format lain dari lib/utils/phone.ts project asli.

function normalizeToInternational(phone: string): string {
	let digits = phone.replace(/[^\d]/g, '');
	if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
	if (!digits.startsWith('62')) digits = `62${digits}`;
	return digits;
}

export function formatDisplay(phone?: string | null): string {
	if (!phone) return '';
	return `+${normalizeToInternational(phone)}`;
}

export function getWaMeUrl(phone?: string | null): string {
	if (!phone) return '';
	return `https://wa.me/${normalizeToInternational(phone)}`;
}
