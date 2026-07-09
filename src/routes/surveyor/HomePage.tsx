import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import Icon from '$lib/Icon';
import CardSurvey from '$lib/CardSurvey';
import Button from '$lib/buttons/Button';
import { NoFormIllustration } from '$lib/assets/Illustrations';
import homeHeader from '$lib/assets/home-header.png';
import lineDivider from '$lib/assets/line.svg';
import { addToast } from '$lib/Toaster';
import { getUserTimezone } from '$lib/stores/auth';
import { useSurveys } from '$data/useSurveys';
import { checkInSurvey } from '$data/surveyActions';

function getStoredUserName(): string {
	try {
		const user = JSON.parse(window.localStorage.getItem('user') ?? 'null');
		return user?.attributes?.name ?? '';
	} catch {
		return '';
	}
}

const headingStyle = { fontFamily: "'Libre Caslon Text', serif", fontWeight: 600 };

export default function HomePage() {
	const navigate = useNavigate();
	const { data: surveys, refetch } = useSurveys();
	const [isCheckingIn, setIsCheckingIn] = useState(false);
	const name = useMemo(getStoredUserName, []);
	const userTimezone = getUserTimezone();

	// survey hari ini yang masih perlu/sedang disurvey
	const todaysSurveys = useMemo(() => {
		if (!surveys) return [];
		return surveys.filter((survey) => {
			const scheduled = DateTime.fromISO(survey.scheduledAt).setZone(userTimezone);
			const today = DateTime.now().setZone(userTimezone);
			return (
				scheduled.hasSame(today, 'day') &&
				(survey.status === 'wait_to_survey' || survey.status === 'ongoing')
			);
		});
	}, [surveys, userTimezone]);

	// survey dengan jadwal setelah sekarang, diurutkan, ambil yang paling dekat
	const upcomingSurvey = useMemo(() => {
		if (!surveys) return undefined;
		return [...surveys]
			.filter(
				(survey) =>
					DateTime.fromISO(survey.scheduledAt).setZone(userTimezone) >
					DateTime.now().setZone(userTimezone)
			)
			.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];
	}, [surveys, userTimezone]);

	const handleCheckIn = async (surveyId: string, status: string) => {
		if (isCheckingIn) return;
		setIsCheckingIn(true);
		try {
			if (status === 'wait_to_survey') {
				await checkInSurvey(surveyId);
				await refetch();
			}
			navigate(`/surveyor/survey/${surveyId}/form`);
		} catch (err) {
			console.error(err);
			addToast({
				data: {
					title: 'Gagal check-in survey',
					color: 'red',
					bg: '#FDE0D5',
					border: 'red',
					icon: 'warning'
				}
			});
		} finally {
			setIsCheckingIn(false);
		}
	};

	return (
		<div className="pb-24">
			<header className="relative flex flex-col items-center text-white">
				<img src={homeHeader} alt="header illustration" className="w-full" />
				<div className="absolute w-full flex flex-col items-center px-5">
					<div className="flex w-full justify-between py-4">
						<p className="font-bold text-lg">Beranda</p>
						<Icon name="notifications" fill={1} color="white" />
					</div>
					<p className="mt-4 mb-2">Selamat Datang,</p>
					<h1
						className="mb-3 text-2xl"
						style={{
							...headingStyle,
							textShadow: '0px 4px 6px rgba(0,0,0,0.10), 0px 2px 4px rgba(0,0,0,0.05)'
						}}
					>
						{name || ''}
					</h1>
					<img src={lineDivider} alt="line" />
				</div>
			</header>

			<main className="flex flex-col pt-10 pb-24 mx-5 space-y-8">
				{todaysSurveys.length > 0 && (
					<>
						<h1 className="mb-7 text-2xl" style={headingStyle}>
							Survey Saat Ini
						</h1>
						<CardSurvey
							page="home"
							schedule={todaysSurveys[0].scheduledAt}
							address={todaysSurveys[0].address}
							status={todaysSurveys[0].status as any}
							user={todaysSurveys[0].user}
							isFirst
							arrowAction={() => navigate(`/surveyor/survey/${todaysSurveys[0].id}`)}
							buttonAction={() => handleCheckIn(todaysSurveys[0].id, todaysSurveys[0].status)}
						/>
						<hr className="mt-8 w-full" />
					</>
				)}

				{todaysSurveys.length < 1 && (
					<>
						<h1 className="mb-7 text-2xl" style={headingStyle}>
							Jadwal Survey Hari ini
						</h1>
						<div className="flex flex-col flex-1 items-center px-4">
							<NoFormIllustration className="w-1/3 pb-4" />
							<h1 className="text-xl text-center" style={headingStyle}>
								Jadwal Survey Hari Ini Telah Selesai
							</h1>
							<Button
								label="Lihat Jadwal"
								action={() => navigate('/surveyor/schedule')}
								style="w-full mt-6"
							/>
						</div>
						<hr className="mt-8 w-full" />
					</>
				)}

				{todaysSurveys.length > 1 && (
					<>
						<h1 className="mb-7 text-2xl" style={headingStyle}>
							Jadwal Berikutnya
						</h1>
						<CardSurvey
							page="home"
							schedule={todaysSurveys[1].scheduledAt}
							address={todaysSurveys[1].address}
							status={todaysSurveys[1].status as any}
							user={todaysSurveys[1].user}
							arrowAction={() => navigate(`/surveyor/survey/${todaysSurveys[1].id}`)}
						/>
					</>
				)}

				{todaysSurveys.length < 1 && upcomingSurvey && (
					<>
						<h1 className="mb-7 text-2xl" style={headingStyle}>
							Jadwal Survey Mendatang
						</h1>
						<CardSurvey
							page="home"
							schedule={upcomingSurvey.scheduledAt}
							address={upcomingSurvey.address}
							status={upcomingSurvey.status as any}
							user={upcomingSurvey.user}
							isFirst
							arrowAction={() => navigate(`/surveyor/survey/${upcomingSurvey.id}`)}
						/>
					</>
				)}
			</main>
		</div>
	);
}