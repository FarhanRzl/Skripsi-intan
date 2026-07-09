// Padanan routes/surveyor/survey/+page.svelte
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarTop from '$lib/navbars/NavbarTop';
import CardSurvey from '$lib/CardSurvey';
import Filter from '$lib/buttons/Filter';
import Search from '$lib/Search';
import Icon from '$lib/Icon';
import Button from '$lib/buttons/Button';
import { useSurveys } from '$data/useSurveys';

// status: wait_to_survey, ongoing, incomplete, in_review, finish
const statusMap: Record<string, string[]> = {
	'Dalam Proses': ['wait_to_survey', 'ongoing'],
	Tinjauan: ['incomplete', 'in_review'],
	Selesai: ['finish']
};

// date filtering — belum diimplementasikan (padanan comment di versi Svelte lama)
const filterOptions = ['Hari ini', 'Kemarin', 'Minggu ini', 'Bulan ini'];

export default function SurveyListPage() {
	const navigate = useNavigate();
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	const { data: surveys } = useSurveys();

	const [filter, setFilter] = useState('Dalam Proses');
	const [keyword, setKeyword] = useState('');
	const [menuOpen, setMenuOpen] = useState(false);
	const [dateFilter, setDateFilter] = useState<string | null>(null);

	useEffect(() => {
		if (containerRef.current) setWidth(containerRef.current.clientWidth);
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setFilter(params.get('filter') || 'Dalam Proses');
	}, []);

	const filteredSortedSurveys = () => {
		const all = surveys ?? [];
		const statuses = statusMap[filter];
		const filteredByStatus =
			filter === 'Tinjauan'
				? [...all].reverse().filter((survey) => statuses?.includes(survey.status))
				: all.filter((survey) => statuses?.includes(survey.status));

		return filteredByStatus.filter((survey) =>
			survey.user.name.toLowerCase().includes(keyword.toLowerCase())
		);
	};

	return (
		<main ref={containerRef} className="pb-24">
			<NavbarTop parentWidth={width} pageName="Survey" goBack={false} />
			<div className="flex items-center mt-16">
				<Search style="w-4/5" value={keyword} onValueChange={setKeyword} />
				<button onClick={() => setMenuOpen((prev) => !prev)} aria-label="Filter">
					<Icon name="filter_list" color="black" size="2rem" />
				</button>
			</div>
			<div className="flex w-full justify-between space-x-3.5 py-8 px-5">
				<Filter label="Dalam Proses" filter={filter} action={() => setFilter('Dalam Proses')} />
				<Filter label="Tinjauan" filter={filter} action={() => setFilter('Tinjauan')} />
				<Filter label="Selesai" filter={filter} action={() => setFilter('Selesai')} />
			</div>
			<div className="px-5 space-y-8">
				{filteredSortedSurveys().map((item) => (
					<CardSurvey
						key={item.id}
						page="survey"
						schedule={item.scheduledAt}
						address={item.address}
						status={item.status as any}
						user={item.user}
						buttonAction={() =>
							navigate(`/surveyor/survey/${item.id}${item.status === 'incomplete' ? '/form' : ''}`)
						}
					/>
				))}
				{filteredSortedSurveys().length === 0 && (
					<p className="text-center text-sm text-neutral-5 pt-4">Tidak ada survey pada kategori ini.</p>
				)}
			</div>

			{menuOpen && (
				<div
					style={{ width }}
					className="fixed bottom-0 bg-white rounded-t-[1.25rem] pt-6 pb-20 px-8 space-y-3 shadow-centered"
				>
					<p className="text-lg font-bold text-primary-main">Filter</p>
					{filterOptions.map((option) => (
						<div key={option} className="flex items-center space-x-3 text-sm">
							<button
								onClick={() => setDateFilter(option)}
								className="grid h-5 w-5 place-items-center rounded-full bg-white shadow-sm border-2 border-primary-main hover:bg-primary-main/10 hover:cursor-pointer"
								id={option}
								aria-labelledby={`${option}-label`}
							>
								{dateFilter === option && <div className="h-3 w-3 rounded-full bg-primary-main" />}
							</button>
							<label htmlFor={option}>{option}</label>
						</div>
					))}

					<div className="flex w-full justify-end space-x-3 pt-5">
						<Button
							label="Kembali"
							buttonType="secondary"
							style="w-1/3"
							action={() => setMenuOpen(false)}
						/>
						<Button label="Tambah Filter" style="w-1/2" action={() => setMenuOpen(false)} />
					</div>
				</div>
			)}
		</main>
	);
}
