// TODO: ganti dengan asset asli (no-form-illustration.svg) begitu file-nya
// dikirim. Untuk sekarang dibuat versi SVG sederhana supaya halaman yang
// memakainya tetap bisa dirender & dites.

export function NoFormIllustration({ className = '' }: { className?: string }) {
	return (
		<svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="30" y="20" width="140" height="110" rx="10" fill="#EAFACC" />
			<rect x="50" y="45" width="100" height="10" rx="5" fill="#4EA40F" opacity="0.4" />
			<rect x="50" y="65" width="80" height="10" rx="5" fill="#4EA40F" opacity="0.3" />
			<rect x="50" y="85" width="60" height="10" rx="5" fill="#4EA40F" opacity="0.2" />
			<circle cx="100" cy="140" r="8" fill="#4EA40F" opacity="0.3" />
		</svg>
	);
}
