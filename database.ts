import Dexie, { type Table } from 'dexie';
import type { Recording } from '../types';

export class UltraCallDB extends Dexie {
  recordings!: Table<Recording, string>;

  constructor() {
    super('UltraCallVault2026');
    this.version(1).stores({
      recordings: 'id, callId, phoneNumber, contactName, direction, startTime, durationSeconds, isFavorite, sourceMethod, *tags',
    });
  }
}

export const db = new UltraCallDB();
