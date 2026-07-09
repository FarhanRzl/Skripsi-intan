const STORAGE_KEY = "design-surveys";

export function getStoredSurveys() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

export function saveStoredSurveys(data: any) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}