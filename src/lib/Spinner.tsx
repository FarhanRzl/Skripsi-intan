// Disusun dari pola pemakaian: <Spinner {width} /> — overlay full-width loading
interface SpinnerProps {
	width?: number;
}

export default function Spinner({ width }: SpinnerProps) {
	return (
		<div
			style={width ? { width } : undefined}
			className="fixed inset-0 z-[60] bg-white/70 flex items-center justify-center"
		>
			<div className="w-10 h-10 border-4 border-primary-main border-t-transparent rounded-full animate-spin" />
		</div>
	);
}
