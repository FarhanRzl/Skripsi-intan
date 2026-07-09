// Disusun dari pola pemakaian di +page.svelte (form survey):
//   <Location label placeholder location={lat,lng} mapIsVisible bg handleConfirm />
//
// Pakai OpenLayers ('ol') untuk peta interaktif — user klik peta untuk pilih koordinat.
// TODO: reverse geocoding (isi `address` otomatis dari lat/lng) belum diimplementasikan,
// perlu integrasi API geocoding kalau mau sama persis kayak versi asli.
import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import Button from '$lib/buttons/Button';
import 'ol/ol.css';

interface LocationValue {
	latitude?: number;
	longitude?: number;
	address?: string;
}

interface LocationProps {
	label?: string;
	placeholder?: string;
	location: LocationValue;
	bg?: string;
	onMapIsVisibleChange: (visible: boolean) => void;
	handleConfirm: (params: LocationValue) => void;
}

const DEFAULT_CENTER: [number, number] = [112.1614, -8.0954]; // sekitar Blitar, sebagai default

export default function Location({
	label,
	placeholder,
	location,
	onMapIsVisibleChange,
	handleConfirm
}: LocationProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<Map | null>(null);
	const markerSourceRef = useRef<VectorSource | null>(null);
	const [pickedCoord, setPickedCoord] = useState<[number, number] | null>(
		location.latitude && location.longitude ? [location.longitude, location.latitude] : null
	);

	useEffect(() => {
		if (!mapContainerRef.current) return;

		const markerSource = new VectorSource();
		markerSourceRef.current = markerSource;

		const initialCenter =
			location.longitude && location.latitude
				? [location.longitude, location.latitude]
				: DEFAULT_CENTER;

		const map = new Map({
			target: mapContainerRef.current,
			layers: [
				new TileLayer({ source: new OSM() }),
				new VectorLayer({ source: markerSource })
			],
			view: new View({ center: fromLonLat(initialCenter), zoom: 15 })
		});

		if (location.longitude && location.latitude) {
			markerSource.addFeature(new Feature(new Point(fromLonLat(initialCenter))));
		}

		map.on('click', (e) => {
			const [lon, lat] = toLonLat(e.coordinate);
			markerSource.clear();
			markerSource.addFeature(new Feature(new Point(e.coordinate)));
			setPickedCoord([lon, lat]);
		});

		mapRef.current = map;

		return () => {
			map.setTarget(undefined);
			mapRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleConfirmClick = () => {
		if (!pickedCoord) return;
		const [longitude, latitude] = pickedCoord;
		handleConfirm({ latitude, longitude, address: location.address });
		onMapIsVisibleChange(false);
	};

	return (
		<div className="fixed inset-0 z-50 bg-white flex flex-col">
			<div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
				<h2 className="text-base font-bold text-neutral-800">{label ?? 'Pilih Lokasi'}</h2>
				<button onClick={() => onMapIsVisibleChange(false)} aria-label="Tutup">
					<span className="material-symbols-outlined">close</span>
				</button>
			</div>

			<div ref={mapContainerRef} className="flex-1" />

			<div className="px-4 py-3 border-t border-neutral-100 space-y-2">
				<p className="text-xs text-neutral-500">
					{pickedCoord
						? `${pickedCoord[1].toFixed(6)}, ${pickedCoord[0].toFixed(6)}`
						: (placeholder ?? 'Klik peta untuk memilih koordinat')}
				</p>
				<Button
					label="Konfirmasi Lokasi"
					buttonType="primary"
					style="w-full"
					disabled={!pickedCoord}
					action={handleConfirmClick}
				/>
			</div>
		</div>
	);
}
