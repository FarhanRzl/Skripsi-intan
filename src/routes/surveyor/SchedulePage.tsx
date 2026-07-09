// Padanan routes/surveyor/schedule/+page.svelte
// Catatan: Calendar.tsx & AddAvailability.tsx best-effort (source aslinya
// tidak ikut dikirim) — timpa kalau ada versi aslinya.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import NavbarTop from '$lib/navbars/NavbarTop';
import Button from '$lib/buttons/Button';
import Icon from '$lib/Icon';
import Calendar from '$lib/Calendar';
import AddAvailability from '$lib/modals/AddAvailability';
import { NoFormIllustration } from '$lib/assets/Illustrations';
import { addToast } from '$lib/Toaster';
import { getUserTimezone } from '$lib/stores/auth';
import { useSurveys } from '$data/useSurveys';
import { memory } from '$data/memory';
import { ensureCoordinatorStarted } from '$data/hooks';

export default function SchedulePage() {
	const navigate = useNavigate();
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	const { data: surveys, refetch } = useSurveys();
	const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
	const [visible, setVisible] = useState(false);
	const [availableDates, setAvailableDates] = useState<string[]>([]);

	const userTimezone = getUserTimezone();

	useEffect(() => {
		if (containerRef.current) setWidth(containerRef.current.clientWidth);
	}, []);

	useEffect(() => {
		(async () => {
			await ensureCoordinatorStarted();
			const availabilityData = (await memory.query((q: any) =>
				q.findRecords('surveyorAvailabilities')
			)) as any[];
			setAvailableDates(availabilityData.map((d) => d.attributes.availableAt));
		})();
	}, []);

	const assignedDates = (surveys ?? []).map((s) => s.scheduledAt);

	const handleSubmit = async (selectedSlots: string[]) => {
		try {
			await ensureCoordinatorStarted();
			await Promise.all(
				selectedSlots.map((slot) =>
					memory.update((t: any) =>
						t.addRecord({
							type: 'surveyorAvailabilities',
							attributes: { availableAt: slot }
						})
					)
				)
			);

			addToast({
				data: {
					title: 'Jadwal Telah Ditambahkan',
					color: '#3DBF2B',
					bg: '#EAFACC',
					border: '#3DBF2B',
					icon: 'check_box'
				}
			});

			setAvailableDates((prev) => [...prev, ...selectedSlots]);
			await refetch();
			setVisible(false);
		} catch (err) {
			console.error('Error:', err);
		}
	};

	const filteredSurveys = () => {
		if (!selectedDate || !surveys) return [];
		const selectedDt = DateTime.fromFormat(selectedDate, 'yyyy-MM-dd');
		return surveys.filter((survey) =>
			DateTime.fromISO(survey.scheduledAt).hasSame(selectedDt, 'day')
		);
	};

	const formattedDay = (date: string) => DateTime.fromISO(date).setLocale('id-ID').toFormat('cccc');
	const formattedDate = (date: string) =>
		DateTime.fromISO(date).setZone(userTimezone).toFormat('dd/MM/yyyy');
	const formattedTime = (date: string) =>
		DateTime.fromISO(date).setZone(userTimezone).toFormat('HH:mm');

	const results = filteredSurveys();

	return (
		<div ref={containerRef} className="flex flex-col w-full pb-24">
			<NavbarTop parentWidth={width} pageName="Jadwal Saya" goBack={false} />
			<Button
				label="Tambah Jadwal"
				action={() => setVisible(true)}
				style="w-1/2 self-end mx-5 mt-20"
			/>

			<div className="flex flex-col m-5">
				<Calendar
					selectedDate={selectedDate}
					onSelectedDateChange={setSelectedDate}
					assignedDates={assignedDates}
					availableDates={availableDates}
					allowAll
				/>
			</div>

			<hr className="mx-5 mt-4 mb-6" />

			{results.length > 0 ? (
				<div className="flex flex-col space-y-5">
					{results.map((survey) => (
						<button key={survey.id} onClick={() => navigate(`/surveyor/survey/${survey.id}`)}>
							<div className="flex flex-col bg-white mx-5 px-3 py-4 space-y-3.5 rounded-lg border border-primary-main text-left">
								<div className="flex items-center space-x-2">
									<Icon name="person" size="1rem" fill={1} />
									<p className="text-xs">{survey.user.name}</p>
								</div>
								<div className="flex justify-between">
									<div className="flex items-center space-x-2">
										<Icon name="calendar_month" size="1rem" fill={1} />
										<p className="text-xs">
											{formattedDay(survey.scheduledAt)}, {formattedDate(survey.scheduledAt)}
										</p>
									</div>
									<div className="flex items-center space-x-2">
										<Icon name="schedule" size="1rem" fill={1} />
										<p className="text-xs">{formattedTime(survey.scheduledAt)}</p>
									</div>
								</div>
								<div className="flex items-start space-x-2 text-left">
									<Icon name="location_on" size="1rem" fill={1} />
									<p className="text-xs">{survey.address}</p>
								</div>
							</div>
						</button>
					))}
				</div>
			) : (
				<div className="flex flex-col flex-1 items-center px-4">
					<NoFormIllustration className="w-1/3 pb-4" />
					<h1 className="text-xl text-center">
						{selectedDate
							? 'Anda belum memiliki jadwal di hari ini'
							: 'Pilih tanggal untuk melihat jadwal'}
					</h1>
				</div>
			)}

			<AddAvailability visible={visible} onVisibleChange={setVisible} handleSubmit={handleSubmit} />
		</div>
	);
}