import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import navbarTop from '../assets/navbar-top.png';

interface NavbarTopProps {
	pageName: string;
	parentWidth?: number;
	goBack?: boolean;
	showNotification?: boolean;
}

export default function NavbarTop({
	pageName,
	parentWidth,
	goBack = true,
	showNotification = true
}: NavbarTopProps) {
	const navigate = useNavigate();

	return (
		<div
			style={parentWidth ? { width: parentWidth } : undefined}
			className="fixed top-0 z-20 flex items-center justify-between w-full px-5 py-4 text-white"
		>
			{/* background daun hijau, sama seperti header Beranda */}
			<img
				src={navbarTop}
				alt=""
				aria-hidden="true"
				className="absolute inset-0 -z-10 h-full w-full object-cover"
			/>

			<div className="flex items-center space-x-3">
				{goBack && (
					<button
						onClick={() => navigate(-1)}
						className="flex items-center justify-center bg-white rounded-full w-7 h-7 shrink-0"
					>
						<Icon name="arrow_back" size="1.25rem" color="#4EA40F" />
					</button>
				)}
				<p className="font-bold text-lg">{pageName}</p>
			</div>

			{showNotification && <Icon name="notifications" fill={1} color="white" />}
		</div>
	);
}