import { createBrowserRouter, Navigate } from 'react-router-dom';

// Placeholder pages — akan diganti bertahap sesuai roadmap migrasi.
// Struktur path sengaja dibuat semirip mungkin dengan routes/ SvelteKit lama.
import LoginPage from './auth/LoginPage';
import SurveyorLayout from './surveyor/SurveyorLayout';
import HomePage from './surveyor/HomePage';
import ProfilePage from './surveyor/profile/ProfilePage';
import ChangePasswordPage from './surveyor/profile/ChangePasswordPage';
import EditProfilePage from './surveyor/profile/EditProfilePage';
import SchedulePage from './surveyor/SchedulePage';
import SurveyListPage from './surveyor/survey/SurveyListPage';
import SurveyDetailPage from './surveyor/survey/SurveyDetailPage';
import SurveyStartPage from './surveyor/survey/SurveyStartPage';
import SurveyFormPage from './surveyor/survey/SurveyFormPage';

export const router = createBrowserRouter([
	{
		path: '/',
		// TODO: kalau nanti ada pengecekan auth (getToken), arahkan ke '/login'
		// kalau belum login, atau '/surveyor/home' kalau sudah.
		element: <Navigate to="/surveyor/home" replace />
	},
	{
		path: '/login',
		element: <LoginPage />
	},
	{
		path: '/surveyor',
		element: <SurveyorLayout />,
		children: [
			{ path: 'home', element: <HomePage /> },
			{ path: 'profile', element: <ProfilePage /> },
			{ path: 'profile/changepassword', element: <ChangePasswordPage /> },
			{ path: 'profile/edit', element: <EditProfilePage /> },
			{ path: 'schedule', element: <SchedulePage /> },
			{ path: 'survey', element: <SurveyListPage /> },
			{ path: 'survey/:slug', element: <SurveyDetailPage /> },
			// Padanan src/routes/surveyor/survey/[slug]/start/+page.svelte
			{ path: 'survey/:slug/start', element: <SurveyStartPage /> },
			// Padanan src/routes/surveyor/survey/[slug]/form/+page.svelte
			{ path: 'survey/:slug/form', element: <SurveyFormPage /> }
		]
	}
]);