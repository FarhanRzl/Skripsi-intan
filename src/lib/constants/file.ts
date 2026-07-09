
export const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.heic', '.heif'];
export const ALLOWED_IMAGE_MIMES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/bmp',
	'image/heic',
	'image/heif'
];
export const ALLOWED_DOCUMENT_EXTS = [
	'.docx',
	'.doc',
	'.xlsx',
	'.xls',
	'.pptx',
	'.ppt',
	'.skp',
	'.pdf'
];
export const ALLOWED_DOCUMENT_MIMES = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.sketchup.skp',
	'application/vnd.koan'
];
export const ALLOWED_VIDEO_EXTS = ['.mp4', '.webm', '.avi', '.mov', '.mpeg', '.mkv', '.flv'];
export const ALLOWED_VIDEO_MIMES = [
	'video/mp4',
	'video/webm',
	'video/x-msvideo',
	'video/vnd.avi',
	'video/avi',
	'video/quicktime',
	'video/mpeg',
	'video/x-matroska',
	'video/x-flv'
];

export const ALLOWED_FILE_EXTS = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_VIDEO_EXTS, ...ALLOWED_DOCUMENT_EXTS];

export const FILE_CATEGORY = {
	IMAGE: 'image',
	VIDEO: 'video',
	DOCUMENT: 'document'
} as const;

export type FileCategory = (typeof FILE_CATEGORY)[keyof typeof FILE_CATEGORY];
