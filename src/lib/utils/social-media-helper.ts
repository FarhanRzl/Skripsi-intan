// TODO: timpa dengan versi asli dari lib/utils/social-media-helper.js kalau
// aturan formatnya berbeda.
export function formatTelegramUsername(input: string): string {
	let value = input.trim();
	value = value.replace(/^https?:\/\/(t\.me|telegram\.me)\//i, '');
	value = value.replace(/^@/, '');
	return value ? `@${value}` : '';
}