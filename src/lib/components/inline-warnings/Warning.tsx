interface WarningProps {
	message: string;
}

export default function Warning({ message }: WarningProps) {
	return (
		<div className="flex items-center gap-2 bg-warning-surface border border-warning-surface rounded-xl px-3 py-2.5">
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="shrink-0"
			>
				<mask id="mask0_9_82051" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
					<rect width="20" height="20" fill="#D9D9D9" />
				</mask>
				<g mask="url(#mask0_9_82051)">
					<path
						d="M0.833496 17.5003L10.0002 1.66699L19.1668 17.5003H0.833496ZM3.7085 15.8337H16.2918L10.0002 5.00033L3.7085 15.8337ZM10.0002 15.0003C10.2363 15.0003 10.4342 14.9205 10.5939 14.7607C10.7536 14.601 10.8335 14.4031 10.8335 14.167C10.8335 13.9309 10.7536 13.733 10.5939 13.5732C10.4342 13.4135 10.2363 13.3337 10.0002 13.3337C9.76405 13.3337 9.56614 13.4135 9.40641 13.5732C9.24669 13.733 9.16683 13.9309 9.16683 14.167C9.16683 14.4031 9.24669 14.601 9.40641 14.7607C9.56614 14.9205 9.76405 15.0003 10.0002 15.0003ZM9.16683 12.5003H10.8335V8.33366H9.16683V12.5003Z"
						fill="#D69F02"
					/>
				</g>
			</svg>
			<p className="text-sm text-warning-hover leading-snug">{message}</p>
		</div>
	);
}