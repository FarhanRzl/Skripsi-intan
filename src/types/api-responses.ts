// TODO: sesuaikan dengan bentuk response asli backend (dicontek dari cara
// SurveyReportApi.submit/update pakai `response.data` di project Svelte)
export interface SuccessResponse<T> {
	data: T;
	message?: string;
}
