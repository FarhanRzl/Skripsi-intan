import { RequestStrategy, SyncStrategy, Coordinator } from '@orbit/coordinator';
import { memory } from './memory.js';
import { remote } from './remote.js';

// Mode mock: aktif kalau VITE_USE_MOCK_DATA=true di .env
// Di mode ini, coordinator TIDAK menyambungkan memory ke remote sama sekali —
// memory jadi satu-satunya sumber data (diisi dummy data lewat seedMemory.js).
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const sources = USE_MOCK_DATA ? [memory] : [memory, remote];

export const coordinator = new Coordinator({ sources });

if (!USE_MOCK_DATA) {
	// Query ke remote setiap memory di-query
	coordinator.addStrategy(
		new RequestStrategy({
			source: 'memory',
			on: 'beforeQuery',
			target: 'remote',
			action: 'query',
			blocking: true
		})
	);

	// Update ke remote setiap memory di-update
	coordinator.addStrategy(
		new RequestStrategy({
			source: 'memory',
			on: 'beforeUpdate',
			target: 'remote',
			action: 'update',
			blocking: true
		})
	);

	// Sync semua perubahan dari remote ke memory
	coordinator.addStrategy(
		new SyncStrategy({
			source: 'remote',
			target: 'memory',
			blocking: false
		})
	);
}

export const USE_MOCK_DATA_MODE = USE_MOCK_DATA;
