import { schema } from './schema.js';
import { MemorySource } from '@orbit/memory';
import { RecordKeyMap } from '@orbit/records';

export const keyMap = new RecordKeyMap();
export const memory = new MemorySource({ schema, keyMap });
