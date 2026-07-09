import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';

interface TimerProps {
	checkInAt?: string | null;
}

const format = (digit: number) => (digit < 10 ? `0${digit}` : digit.toString());

export default function Timer({ checkInAt }: TimerProps) {
	const [hh, setHh] = useState(0);
	const [mm, setMm] = useState(0);
	const [ss, setSs] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (checkInAt) {
			const diff = Math.floor(DateTime.now().diff(DateTime.fromISO(checkInAt)).as('seconds'));
			setHh(Math.floor(diff / 3600));
			setMm(Math.floor(diff / 60) % 60);
			setSs(diff % 60);
		}

		intervalRef.current = setInterval(() => {
			setSs((prevSs) => {
				let nextSs = prevSs + 1;
				if (nextSs >= 60) {
					nextSs = 0;
					setMm((prevMm) => {
						let nextMm = prevMm + 1;
						if (nextMm >= 60) {
							nextMm = 0;
							setHh((prevHh) => prevHh + 1);
						}
						return nextMm;
					});
				}
				return nextSs;
			});
		}, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkInAt]);

	return (
		<h1
			className="font-semibold text-4xl tracking-wider"
			style={{ fontFamily: "'Libre Caslon Text', serif", color: '#4EA40F' }}
		>
			<span>{format(hh)}</span>:<span>{format(mm)}</span>:<span>{format(ss)}</span>
		</h1>
	);
}
