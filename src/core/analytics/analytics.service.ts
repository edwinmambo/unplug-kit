import { inject, Injectable } from '@angular/core';
import { SessionsRepository } from '../storage/sessions.repository';
import { SessionLog } from '../models/session.model';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function dayKey(ts: number) {
  // Stable key for local day grouping
  return String(startOfDay(ts));
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private sessionsRepo = inject(SessionsRepository);

  listSessions(): SessionLog[] {
    // Ensure newest-first if repo ever changes behavior
    return this.sessionsRepo
      .list()
      .slice()
      .sort((a, b) => b.endedAt - a.endedAt);
  }

  totalMinutes(): number {
    return this.listSessions().reduce((sum, s) => sum + (s.completedMinutes ?? 0), 0);
  }

  lastNDaysMinutes(n: number): { dayStart: number; minutes: number }[] {
    const now = Date.now();
    const todayStart = startOfDay(now);

    // Build buckets from oldest -> newest
    const buckets: { dayStart: number; minutes: number }[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const dayStart = todayStart - i * DAY_MS;
      buckets.push({ dayStart, minutes: 0 });
    }

    // Index for O(1) lookups
    const index = new Map<string, number>();
    buckets.forEach((b, i) => index.set(String(b.dayStart), i));

    for (const s of this.listSessions()) {
      const key = dayKey(s.endedAt);
      const idx = index.get(key);
      if (idx !== undefined) {
        buckets[idx].minutes += s.completedMinutes ?? 0;
      }
    }

    return buckets;
  }

  minutesThisWeek(): number {
    // MVP definition: last 7 days
    return this.lastNDaysMinutes(7).reduce((sum, d) => sum + d.minutes, 0);
  }

  currentStreak(): number {
    // Streak counts consecutive days with >=1 COMPLETED session.
    const completed = this.listSessions().filter((s) => s.endedReason === 'completed');
    if (completed.length === 0) return 0;

    // Unique completed days (newest -> oldest)
    const uniqueDays: number[] = [];
    const seen = new Set<string>();

    for (const s of completed) {
      const d = startOfDay(s.endedAt);
      const k = String(d);
      if (!seen.has(k)) {
        seen.add(k);
        uniqueDays.push(d);
      }
    }

    const today = startOfDay(Date.now());
    const yesterday = today - DAY_MS;

    // Streak can start today or yesterday. Otherwise streak = 0.
    if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = uniqueDays[i - 1];
      const expected = prev - DAY_MS;
      if (uniqueDays[i] === expected) streak++;
      else break;
    }

    return streak;
  }

  recentSessions(limit = 5): SessionLog[] {
    return this.listSessions().slice(0, limit);
  }
}
