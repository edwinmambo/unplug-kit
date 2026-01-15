import { Injectable } from '@angular/core';
import { Routine } from '../models/routine.model';

interface StoragePayloadV1 {
  version: 1;
  routines: Routine[];
}

const KEY = 'unplug-kit:routines';

@Injectable({ providedIn: 'root' })
export class RoutinesRepository {
  private readPayload(): StoragePayloadV1 {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { version: 1, routines: [] };

    try {
      const parsed = JSON.parse(raw) as Partial<StoragePayloadV1>;
      if (parsed.version !== 1 || !Array.isArray(parsed.routines)) {
        return { version: 1, routines: [] };
      }
      return { version: 1, routines: parsed.routines as Routine[] };
    } catch {
      return { version: 1, routines: [] };
    }
  }

  private writePayload(payload: StoragePayloadV1) {
    localStorage.setItem(KEY, JSON.stringify(payload));
  }

  list(): Routine[] {
    return this.readPayload().routines;
  }

  get(id: string): Routine | undefined {
    return this.list().find((r) => r.id === id);
  }

  upsert(routine: Routine): Routine {
    const payload = this.readPayload();
    const idx = payload.routines.findIndex((r) => r.id === routine.id);

    const next = { ...routine, updatedAt: Date.now() };
    if (idx === -1) payload.routines.unshift(next);
    else payload.routines[idx] = next;

    this.writePayload(payload);
    return next;
  }

  delete(id: string) {
    const payload = this.readPayload();
    payload.routines = payload.routines.filter((r) => r.id !== id);
    this.writePayload(payload);
  }

  clearAll() {
    this.writePayload({ version: 1, routines: [] });
  }
}
