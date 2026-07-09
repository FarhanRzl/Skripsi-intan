import { schema } from './schema.js';
import { JSONAPISource } from '@orbit/jsonapi';
import { JSONAPISerializers } from '@orbit/jsonapi';
import { keyMap } from './memory.js';
import { buildInflector, buildSerializerSettingsFor } from '@orbit/serializers';

// TODO: pindahkan API_BASE_URL ke import.meta.env.VITE_API_BASE_URL (.env Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// override orbit dasherize dan camelize (sama seperti project Svelte lama)
const serializer = buildSerializerSettingsFor({
	sharedSettings: {
		inflectors: {
			resource: buildInflector({}, (input) => input)
		}
	},
	settingsByType: {
		[JSONAPISerializers.ResourceTypePath]: {
			serializationOptions: { inflectors: ['resource'] }
		}
	}
});

export const remote = new JSONAPISource({
	keyMap,
	schema,
	name: 'remote',
	host: `${API_BASE_URL}/api/v1/surveyor`,
	serializerSettingsFor: serializer
});

// untuk update profile, track location
export const baseRemote = new JSONAPISource({
	keyMap,
	schema,
	name: 'remote',
	host: `${API_BASE_URL}/api/v1`,
	serializerSettingsFor: serializer
});

const remotes = {
	surveyor: remote,
	base: baseRemote
};

export const setToken = (token, source) => {
	remotes[source].requestProcessor.defaultFetchSettings.headers['Authorization'] =
		`Bearer ${token}`;
};
