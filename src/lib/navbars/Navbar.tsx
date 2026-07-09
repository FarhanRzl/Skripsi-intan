import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../Icon';

interface NavbarProps {
	parentWidth?: number;
	onCurrentPageChange?: (page: string) => void;
}

const surveyorMenu = [
	{ path: 'home', icon: 'home', name: 'Beranda' },
	{ path: 'survey', icon: 'assignment_add', name: 'Survey' },
	{ path: 'schedule', icon: 'perm_contact_calendar', name: 'Jadwal Saya' },
	{ path: 'profile', icon: 'account_circle', name: 'Profil' }
];

export default function Navbar({ parentWidth = 0, onCurrentPageChange }: NavbarProps) {
	const location = useLocation();
	const navigate = useNavigate();

	// Padanan `$page.url.pathname.slice(10)` di Svelte — ambil segmen setelah "/surveyor/"
	const currentPage = location.pathname.slice('/surveyor/'.length);

	useEffect(() => {
		onCurrentPageChange?.(currentPage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	const currentColor = (page: string) => (currentPage.includes(page) ? '#4EA40F' : '#656565');

	return (
		<div
			style={{ width: parentWidth }}
			className="fixed bottom-0 flex justify-between px-5 pt-2 pb-5 bg-white text-xs font-semibold"
		>
			{surveyorMenu.map((menu) => (
				<button
					key={menu.path}
					onClick={() => navigate(`/surveyor/${menu.path}`)}
					className="flex flex-col items-center"
				>
					<Icon
						name={menu.icon}
						color={currentColor(menu.path)}
						fill={currentPage === menu.path ? 1 : 0}
					/>
					<p style={{ color: currentColor(menu.path) }}>{menu.name}</p>
				</button>
			))}
		</div>
	);
}
