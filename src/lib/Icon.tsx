// Berdasarkan pola nama ikon (`home`, `assignment_add`, `account_circle`, dst)
// dan prop `fill={0|1}` yang dipakai di Navbar.svelte — ini adalah Material
// Symbols (Google), bukan lucide. Font-nya di-load lewat index.html.
//
// TODO: kalau ternyata Icon.svelte asli beda implementasinya, sesuaikan lagi.

interface IconProps {
	name: string;
	color?: string;
	size?: string;
	fill?: 0 | 1;
}

export default function Icon({ name, color = 'currentColor', size = '1.5rem', fill = 0 }: IconProps) {
	return (
		<span
			className="material-symbols-outlined select-none leading-none"
			style={{
				color,
				fontSize: size,
				fontVariationSettings: `'FILL' ${fill}`
			}}
		>
			{name}
		</span>
	);
}
