import { Injectable } from '@angular/core';
import { SessionLog } from '../models/session.model';

interface StoragePayloadV1 {
  version: 1;
  sessions: SessionLog[];
}

const KEY = 'unplug-kit:sessions';

@Injectable({ providedIn: 'root' })
export class SessionsRepository {
  private readPayload(): StoragePayloadV1 {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { version: 1, sessions: [] };

    try {
      const parsed = JSON.parse(raw) as Partial<StoragePayloadV1>;
      if (parsed.version !== 1 || !Array.isArray(parsed.sessions)) {
        return { version: 1, sessions: [] };
      }
      return { version: 1, sessions: parsed.sessions as SessionLog[] };
    } catch {
      return { version: 1, sessions: [] };
    }
  }

  private writePayload(payload: StoragePayloadV1) {
    localStorage.setItem(KEY, JSON.stringify(payload));
  }

  list(): SessionLog[] {
    return this.readPayload().sessions;
  }

  add(session: SessionLog) {
    const payload = this.readPayload();
    payload.sessions.unshift(session);
    this.writePayload(payload);
  }

  clearAll() {
    this.writePayload({ version: 1, sessions: [] });
  }
}
