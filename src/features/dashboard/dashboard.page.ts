import { Component, inject } from '@angular/core';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { WeeklyBarsComponent } from '../../shared/ui/weekly-bars.component';
import { SessionLog } from '../../core/models/session.model';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [UiCardComponent, UiButtonComponent, WeeklyBarsComponent],
  template: `
    <div class="p-4 space-y-4">
      <app-ui-card>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold tracking-tight">Reclaim your attention 📵</h1>
            <p class="mt-1 text-sm text-(--muted)">Small routines. Big calm. Real progress.</p>
          </div>

          <div class="shrink-0">
            <app-ui-button variant="secondary" size="sm" (click)="refresh()"
              >Refresh ✨</app-ui-button
            >
          </div>
        </div>
      </app-ui-card>

      <div class="grid grid-cols-2 gap-3">
        <app-ui-card>
          <p class="text-xs text-(--muted)">Streak 🔥</p>
          <p class="mt-1 text-2xl font-semibold">{{ streak }}</p>
          <p class="mt-1 text-xs text-(--muted)">days</p>
        </app-ui-card>

        <app-ui-card>
          <p class="text-xs text-(--muted)">This week ⏳</p>
          <p class="mt-1 text-2xl font-semibold">{{ weekMinutes }}</p>
          <p class="mt-1 text-xs text-(--muted)">minutes</p>
        </app-ui-card>

        <app-ui-card class="col-span-2">
          <p class="text-xs text-(--muted)">Total reclaimed ✨</p>
          <p class="mt-1 text-2xl font-semibold">{{ totalMinutes }}</p>
          <p class="mt-1 text-xs text-(--muted)">minutes</p>
        </app-ui-card>
      </div>

      <app-ui-card>
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold">Weekly minutes 📈</p>
          <p class="text-xs text-(--muted)">last 7 days</p>
        </div>
        <div class="mt-4">
          <app-ui-weekly-bars [data]="weekData" />
        </div>
      </app-ui-card>

      <app-ui-card>
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold">Recent sessions 🕘</p>
          <p class="text-xs text-(--muted)">latest 5</p>
        </div>

        @if (recent.length === 0) {
          <p class="mt-3 text-sm text-(--muted)">
            No sessions yet. Start a routine to see progress here 🎉
          </p>
        } @else {
          <div class="mt-3 space-y-2">
            @for (s of recent; track s.id) {
              <div
                class="flex items-center justify-between rounded-2xl border border-(--border) bg-(--surface) px-3 py-3"
              >
                <div class="min-w-0">
                  <p class="text-sm font-semibold truncate">
                    {{ s.routineEmoji }} {{ s.routineName }}
                  </p>
                  <p class="mt-0.5 text-xs text-(--muted)">
                    {{ formatDate(s.endedAt) }} ·
                    {{ s.endedReason === 'completed' ? 'Completed ✅' : 'Ended early 🫶' }}
                  </p>
                </div>
                <div class="shrink-0 text-sm font-semibold">{{ s.completedMinutes }}m</div>
              </div>
            }
          </div>
        }
      </app-ui-card>
    </div>
  `,
})
export class DashboardPage {
  streak = 0;
  totalMinutes = 0;
  weekMinutes = 0;
  weekData: { dayStart: number; minutes: number }[] = [];
  recent: SessionLog[] = [];

  private analytics = inject(AnalyticsService);

  constructor() {
    this.refresh();
  }

  refresh() {
    this.streak = this.analytics.currentStreak();
    this.totalMinutes = this.analytics.totalMinutes();
    this.weekData = this.analytics.lastNDaysMinutes(7);
    this.weekMinutes = this.analytics.minutesThisWeek();
    this.recent = this.analytics.recentSessions(5);
  }

  formatDate(ts: number) {
    return new Date(ts).toLocaleString(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
