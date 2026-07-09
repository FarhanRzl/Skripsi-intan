import { useState, useEffect, useCallback, useRef } from 'react';
import { memory } from './memory';
import { coordinator, USE_MOCK_DATA_MODE } from './coordinator';

let coordinatorStarted = false;
let coordinatorStartPromise: Promise<void> | null = null;

/**
 * Pastikan coordinator (memory <-> remote sync strategy) hanya di-start sekali,
 * meskipun dipanggil dari banyak komponen/hook secara bersamaan.
 * Di mode mock (VITE_USE_MOCK_DATA=true), otomatis seed dummy data juga.
 */
export function ensureCoordinatorStarted(): Promise<void> {
	if (coordinatorStarted) return Promise.resolve();
	if (!coordinatorStartPromise) {
		coordinatorStartPromise = coordinator.activate().then(async () => {
			if (USE_MOCK_DATA_MODE) {
				const { seedDummyDataIfNeeded } = await import('./mock/seedMemory.js');
				await seedDummyDataIfNeeded();
			}
			coordinatorStarted = true;
		});
	}
	return coordinatorStartPromise ?? Promise.resolve();
}

type QueryBuilderFn = (q: any) => any;
type TransformBuilderFn = (t: any) => any;

interface OrbitQueryState<T> {
	data: T | null;
	isPending: boolean;
	error: unknown;
}

/**
 * Padanan React untuk pola query Orbit yang dulunya reactive lewat Svelte store.
 *
 * Contoh pakai:
 *   const { data, isPending, error } = useOrbitQuery((q) => q.findRecords('tags'), []);
 */
export function useOrbitQuery<T = any>(queryBuilderFn: QueryBuilderFn, deps: any[] = []) {
	const [state, setState] = useState<OrbitQueryState<T>>({
		data: null,
		isPending: true,
		error: null
	});
	const queryBuilderRef = useRef(queryBuilderFn);
	queryBuilderRef.current = queryBuilderFn;

	const runQuery = useCallback(async () => {
		setState((prev) => ({ ...prev, isPending: true }));
		try {
			await ensureCoordinatorStarted();
			const result = (await memory.query(queryBuilderRef.current)) as T;
			setState({ data: result, isPending: false, error: null });
		} catch (error) {
			setState({ data: null, isPending: false, error });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			setState((prev) => ({ ...prev, isPending: true }));
			try {
				await ensureCoordinatorStarted();
				const result = (await memory.query(queryBuilderRef.current)) as T;
				if (!cancelled) setState({ data: result, isPending: false, error: null });
			} catch (error) {
				if (!cancelled) setState({ data: null, isPending: false, error });
			}
		})();

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return { ...state, refetch: runQuery };
}

/**
 * Padanan untuk update/mutation ke memory source (otomatis ikut sync ke remote
 * lewat strategy yang sudah didefinisikan di coordinator.js — kecuali mode mock).
 *
 * Contoh pakai:
 *   const { mutate, isLoading, error } = useOrbitMutation();
 *   await mutate((t) => t.addRecord({ type: 'tags', attributes: {...} }));
 */
export function useOrbitMutation() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<unknown>(null);

	const mutate = useCallback(async (transformBuilderFn: TransformBuilderFn) => {
		setIsLoading(true);
		setError(null);
		try {
			await ensureCoordinatorStarted();
			const result = await memory.update(transformBuilderFn);
			setIsLoading(false);
			return result;
		} catch (err) {
			setError(err);
			setIsLoading(false);
			throw err;
		}
	}, []);

	return { mutate, isLoading, error };
}
