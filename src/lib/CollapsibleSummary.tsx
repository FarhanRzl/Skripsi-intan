import { useState, type ReactNode } from 'react';
import Icon from './Icon';

interface CollapsibleSummaryProps {
	label?: string;
	icon?: string;
	children?: ReactNode;
}

export default function CollapsibleSummary({
	label = 'Label',
	icon,
	children
}: CollapsibleSummaryProps) {
	const [expanded, setExpanded] = useState(false);
	const toggle = () => setExpanded((prev) => !prev);

	return (
		<div className="flex flex-col">
			<button className="flex justify-between items-center px-4 py-3 text-left" onClick={toggle}>
				<div className="flex space-x-3 items-center">
					{icon && <Icon name={icon} size="1.5rem" fill={1} />}
					<p className="font-semibold">{label}</p>
				</div>
				{expanded ? (
					<Icon name="keyboard_arrow_up" color="black" size="1.5rem" />
				) : (
					<Icon name="keyboard_arrow_down" color="black" size="1.5rem" />
				)}
			</button>
			{expanded && children}
		</div>
	);
}
