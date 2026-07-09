import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '$lib/navbars/Navbar';
import Toaster, { addToast } from '$lib/Toaster';
import { getToken } from '$lib/stores/auth';
import { Roles } from '$lib/constants/role';
import { baseRemote, setToken } from '$data/remote.js';
import { USE_MOCK_DATA } from '$lib/config';

interface StoredUser {
	userId: string;
	attributes: Record<string, unknown>;
	location?: { id?: string; updatedAt: string | Date };
}

export default function SurveyorLayout() {
	const navigate = useNavigate();
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const [currentPage, setCurrentPage] = useState('');
	const [locationDisabled, setLocationDisabled] = useState(false);

	const userRef = useRef<StoredUser | null>(null);
	const tokenRef = useRef<string | null>(null);

	useEffect(() => {
		const updateWidth = () => {
			if (containerRef.current) setWidth(containerRef.current.clientWidth);
		};
		updateWidth();
		window.addEventListener('resize', updateWidth);
		return () => window.removeEventListener('resize', updateWidth);
	}, []);

	const showToast = (err: GeolocationPositionError) => {
		let message = '';
		switch (err.code) {
			case 1: // PERMISSION_DENIED
				message = 'Tolong izinkan lokasi di pengaturan browser';
				break;
			case 2: // POSITION_UNAVAILABLE
				message = 'Lokasi tidak tersedia. Pastikan GPS aktif dan coba lagi';
				break;
			case 3: // TIMEOUT
				message = 'Waktu mendapatkan lokasi habis. Silakan coba lagi';
				break;
			default:
				message = err.message;
		}

		addToast({
			data: { title: message, color: 'red', bg: '#FDE0D5', border: 'red', icon: 'warning' }
		});
	};

	const sendLocation = () => {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;
				try {
					const user = userRef.current;
					const token = tokenRef.current;
					if (!token) return;

					setToken(token, 'base');

					const response = await baseRemote.update((t: any) => {
						if (user?.location) {
							return t.updateRecord({
								type: 'userLocations',
								keys: { remoteId: user.location.id?.toString() },
								attributes: { latitude, longitude }
							});
						}
						return t.addRecord({
							type: 'userLocations',
							lid: user?.userId,
							attributes: { latitude, longitude }
						});
					});

					const updatedUser = {
						...user,
						location: { id: (response as any)?.keys?.remoteId, updatedAt: new Date() }
					} as StoredUser;

					userRef.current = updatedUser;
					window.localStorage.setItem('user', JSON.stringify(updatedUser));
				} catch (err) {
					console.error(err);
				}
			},
			(err) => {
				// Cuma set locationDisabled untuk permission denied
				if (err.code === 1) setLocationDisabled(true);
				console.error(err);
				showToast(err);
			},
			{
				enableHighAccuracy: true, // false kalau mau toleransi error max 50 meter
				timeout: 30 * 1000,
				maximumAge: 10 * 60 * 1000 // cache 10 menit
			}
		);
	};

	const checkLocationPermission = (): Promise<string> => {
		return new Promise((resolve) => {
			navigator.permissions
				.query({ name: 'geolocation' as PermissionName })
				.then((permissionStatus) => {
					setLocationDisabled(permissionStatus.state === 'denied');
					permissionStatus.onchange = () => {
						setLocationDisabled(permissionStatus.state === 'denied');
					};
					resolve(permissionStatus.state);
				})
				.catch((err) => {
					console.error('Permission API error:', err);
					navigator.geolocation.getCurrentPosition(
						() => {
							setLocationDisabled(false);
							resolve('granted');
						},
						(err) => {
							setLocationDisabled(true);
							showToast(err);
							resolve('denied');
						}
					);
				});
		});
	};

	useEffect(() => {
		(async () => {
			try {
				const token = getToken();
				const roleId = JSON.parse(window.localStorage.getItem('roleId') ?? 'null');
				const user = JSON.parse(window.localStorage.getItem('user') ?? 'null');

				if (
					!token ||
					!roleId ||
					!user ||
					(roleId != Roles.SURVEYOR && roleId != Roles.GARDENER)
				) {
					throw new Error('Invalid user');
				}

				tokenRef.current = token;
				userRef.current = user;

				if (USE_MOCK_DATA) {
					// Mode mock: skip location tracking sepenuhnya. sendLocation() manggil
					// baseRemote langsung (bukan lewat fetchClient), jadi tidak otomatis
					// ke-mock — kalau dibiarkan, ini akan selalu coba fetch ke backend asli
					// dan gagal (ERR_CONNECTION_REFUSED) meskipun VITE_USE_MOCK_DATA=true.
					return;
				}

				await checkLocationPermission();

				document.addEventListener(
					'click',
					(e) => {
						if (locationDisabled) {
							e.stopPropagation();
							e.preventDefault();
						}
					},
					true
				);

				if (!user?.location?.updatedAt) {
					sendLocation();
				}
			} catch (err) {
				console.error(err);

				if (USE_MOCK_DATA) {
					// Mode mock: jangan paksa redirect ke /login supaya gampang
					// langsung tes halaman surveyor tanpa login dulu.
					console.warn('[mock] Lewati auth check karena VITE_USE_MOCK_DATA=true');
					return;
				}

				window.localStorage.clear();
				navigate('/login');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Kirim ulang lokasi tiap interval kalau data lokasi sudah lama
	useEffect(() => {
		const timeoutMs = 1 * 60 * 1000; // cek tiap 1 menit
		const intervalMs = 5 * 60 * 1000; // kirim tiap 5 menit kalau sudah lewat

		const id = setInterval(() => {
			const user = userRef.current;
			if (
				user?.location &&
				new Date().getTime() - new Date(user.location.updatedAt).getTime() >= intervalMs
			) {
				sendLocation();
			}
		}, timeoutMs);

		return () => clearInterval(id);
	}, []);

	return (
		<div ref={containerRef} className="flex flex-col min-h-screen relative">
			<Outlet />
			<Toaster />
			<Navbar parentWidth={width} onCurrentPageChange={setCurrentPage} />

			{/* Popup saat lokasi ditolak dan lagi di halaman home */}
			{locationDisabled && currentPage === 'home' && (
				<div
					style={{ width }}
					className="fixed z-10 bg-neutral-main/70 h-full flex flex-col items-center justify-center"
				>
					<div className="bg-white w-[90%] flex flex-col items-center space-y-8 py-20 rounded-3xl">
						{/* TODO: pasang asset logo & warning svg asli (Logo_Oke Garden, red-warning.svg) */}
						<div className="space-y-2">
							<h1 className="px-10 text-center text-primary-main text-xl font-semibold">
								Akses Lokasi Diperlukan untuk Menggunakan Sistem
							</h1>
							<p className="px-4 text-xs text-neutral-main text-center">
								Harap aktifkan lokasi Anda. Sistem tidak dapat digunakan apabila
								lokasi belum aktif.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
