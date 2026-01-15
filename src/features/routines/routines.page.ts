import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { RoutinesStore } from './routines.store';

@Component({
  standalone: true,
  selector: 'app-routines-page',
  imports: [UiCardComponent, UiButtonComponent, RouterLink],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold">Routines 🧘</h1>
          <p class="mt-1 text-sm text-(--muted)">Build step-by-step calm you can repeat.</p>
        </div>

        <app-ui-button variant="primary" size="sm" (click)="create()"> + New </app-ui-button>
      </div>

      @if (store.count() === 0) {
        <app-ui-card>
          <p class="text-sm font-medium">No routines yet ✨</p>
          <p class="mt-1 text-sm text-(--muted)">Create one in 2 seconds — you can edit it next.</p>
          <div class="mt-3">
            <app-ui-button variant="secondary" size="md" (click)="create()">
              Create a starter routine ⚡
            </app-ui-button>
          </div>
        </app-ui-card>
      } @else {
        <div class="space-y-3">
          @for (r of store.routines(); track r.id) {
            <app-ui-card class="p-0 overflow-hidden">
              <div class="p-4">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="grid h-10 w-10 place-items-center rounded-2xl bg-(--surface-2)">
                      <span class="text-lg">{{ r.emoji }}</span>
                    </div>

                    <div>
                      <p class="text-sm font-semibold">{{ r.name }}</p>
                      <p class="mt-0.5 text-xs text-(--muted)">
                        {{ r.steps.length }} steps · {{ totalMinutes(r) }} min
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="rounded-xl px-3 py-2 text-xs font-semibold text-(--muted)
                           hover:bg-(--surface) transition-colors"
                    (click)="remove(r.id)"
                  >
                    Delete 🗑️
                  </button>
                </div>

                <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
                  @for (s of r.steps; track s.id) {
                    <span
                      class="shrink-0 rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-xs"
                    >
                      {{ s.title }} · {{ s.minutes }}m
                    </span>
                  }
                </div>
              </div>

              <div class="border-t border-(--border) bg-(--bg)/30 px-4 py-3">
                <a class="text-sm font-semibold hover:underline" [routerLink]="['/routines', r.id]">
                  Open routine →
                </a>
              </div>
            </app-ui-card>
          }
        </div>
      }
    </div>
  `,
})
export class RoutinesPage implements OnInit {
  public store = inject(RoutinesStore);

  ngOnInit() {
    this.store.load();
  }

  create() {
    this.store.createQuick('Unplug Starter', '📵');
  }

  remove(id: string) {
    const ok = confirm('Delete this routine?');
    if (ok) this.store.delete(id);
  }

  totalMinutes(r: { steps: { minutes: number }[] }) {
    return r.steps.reduce((sum, s) => sum + (s.minutes ?? 0), 0);
  }
}
