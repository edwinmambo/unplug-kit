import { Component } from '@angular/core';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [UiCardComponent, UiButtonComponent],
  template: `
    <div class="p-4 space-y-4">
      <app-ui-card>
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold tracking-tight">Reclaim your attention 📵</h1>
            <p class="mt-1 text-sm text-(--muted)">Small routines. Big calm. Beautiful progress.</p>
          </div>

          <div class="shrink-0">
            <app-ui-button variant="primary" size="sm">+ Routine</app-ui-button>
          </div>
        </div>
      </app-ui-card>

      <div class="grid grid-cols-2 gap-3">
        <app-ui-card>
          <p class="text-xs text-(--muted)">Streak 🔥</p>
          <p class="mt-1 text-2xl font-semibold">0</p>
        </app-ui-card>

        <app-ui-card>
          <p class="text-xs text-(--muted)">Minutes reclaimed ⏳</p>
          <p class="mt-1 text-2xl font-semibold">0</p>
        </app-ui-card>

        <app-ui-card class="col-span-2">
          <p class="text-xs text-(--muted)">Today’s vibe ✨</p>
          <p class="mt-1 text-base font-medium">Start with something easy: 5 minutes of quiet.</p>
          <div class="mt-3">
            <app-ui-button variant="secondary" size="md">Start a quick session 🧘</app-ui-button>
          </div>
        </app-ui-card>
      </div>

      <app-ui-card>
        <p class="text-sm font-medium">No routines yet 🧘</p>
        <p class="mt-1 text-sm text-(--muted)">
          Create your first routine and we’ll guide you step-by-step.
        </p>
        <div class="mt-3">
          <app-ui-button variant="primary" size="md">Create routine</app-ui-button>
        </div>
      </app-ui-card>
    </div>
  `,
})
export class DashboardPage {}
