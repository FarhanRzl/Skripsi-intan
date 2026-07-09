// Padanan CardSurvey.svelte. Dipakai di SurveyListPage & SurveyDetailPage
// (dan nantinya HomePage, tapi HomePage masih di-hold dulu).
import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import Icon from './Icon';
import Button from './buttons/Button';
import Status from './buttons/Status';
import { getUserTimezone } from './stores/auth';
import { formatDisplay, getWaMeUrl } from './utils/phone';

export type SurveyStatus =
	| 'wait_to_survey'
	| 'ongoing'
	| 'incomplete'
	| 'in_review'
	| 'finish'
	| 'No status';

export type CardSurveyPage = 'home' | 'survey' | 'Detail Survey';

interface CardSurveyUser {
	name?: string;
	phone?: string;
}

interface CardSurveyProps {
	page?: CardSurveyPage;
	status?: SurveyStatus;
	schedule?: string;
	address?: string;
	user?: CardSurveyUser;
	isFirst?: boolean;
	arrowAction?: () => void;
	buttonAction?: () => void;
}

const labels: Record<string, Partial<Record<string, string>>> = {
	home: { wait_to_survey: 'Mulai Survey', ongoing: 'Mulai Survey' },
	survey: {
		wait_to_survey: 'Detail Survey',
		ongoing: 'Detail Survey',
		incomplete: 'Lengkapi Survey',
		in_review: 'Detail Survey'
	},
	'Detail Survey': {
		wait_to_survey: 'Mulai Survey',
		ongoing: 'Mulai Survey',
		incomplete: 'Lengkapi Survey'
	}
};

export default function CardSurvey({
	page = 'survey',
	status = 'No status',
	schedule = '',
	address = 'No Address',
	user,
	isFirst = false,
	arrowAction = () => {},
	buttonAction = () => {}
}: CardSurveyProps) {
	const scheduleLuxon = useMemo(() => {
		const jsDate = typeof schedule === 'string' ? new Date(schedule) : schedule;
		return DateTime.fromJSDate(jsDate).setZone(getUserTimezone()).setLocale('id');
	}, [schedule]);

	const validTime = () => new Date() >= new Date(schedule);

	const [lessThan10Mins, setLessThan10Mins] = useState(false);
	useEffect(() => {
		const diff = scheduleLuxon.diffNow('milliseconds').milliseconds;
		setLessThan10Mins(diff <= 600000 && diff >= 0);
	}, [scheduleLuxon]);

	return (
		<div className="bg-white p-4 rounded-xl shadow-card tracking-wide space-y-2">
			{lessThan10Mins ? (
				<p className="text-danger-main text-xs">Survey Akan Berlangsung</p>
			) : isFirst ? (
				<p className="text-danger-main text-xs">Survey yang akan datang</p>
			) : status === 'ongoing' ? (
				<p className="text-danger-main text-xs">Survey Berlangsung</p>
			) : null}

			<div className="flex justify-between items-center">
				<p className="text-sm text-primary-3 font-bold">
					{scheduleLuxon.weekdayLong}, {scheduleLuxon.toFormat('dd-MM-yyyy')}
				</p>
				{status === 'incomplete' && <Status label="Perlu Dilengkapi" />}
				{status === 'finish' && <Status label="Selesai" />}
			</div>

			<hr className="pb-2" />
			<div className="flex items-center justify-between py-4">
				<div className="flex flex-col gap-2">
					<p className="font-semibold">{user?.name || 'No name'}</p>
					{user?.phone ? (
						<a
							href={getWaMeUrl(user.phone)}
							target="_blank"
							rel="noreferrer"
							className="underline text-xs"
						>
							{formatDisplay(user.phone)}
						</a>
					) : (
						<p className="text-xs">No Phone</p>
					)}
					<p className="text-xs text-neutral-3">{address}</p>
				</div>
				{page === 'home' && (
					<button onClick={arrowAction} aria-label="Lihat detail">
						<Icon name="chevron_right" />
					</button>
				)}
			</div>
			<div className="flex items-center justify-between space-x-4">
				<h1
					className="w-1/3 text-3xl text-danger-main text-center"
					style={{ fontFamily: "'Libre Caslon Text', serif", fontWeight: 600 }}
				>
					{scheduleLuxon.toFormat('HH.mm')}
				</h1>
				<Button
					label={labels[page]?.[status] ?? 'Detail'}
					style="w-2/3"
					buttonType="primary"
					disabled={page !== 'survey' && !validTime()}
					action={buttonAction}
				/>
			</div>
		</div>
	);
}
