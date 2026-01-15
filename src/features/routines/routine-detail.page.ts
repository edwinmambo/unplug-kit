import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { RoutinesStore } from './routines.store';
import { RoutineStep, RoutineStepType } from '../../core/models/routine.model';

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const EMOJIS = ['📵', '🧘', '📖', '✍️', '🚶', '🫧', '🌿', '✨'];
const STEP_TYPES: { type: RoutineStepType; label: string; emoji: string }[] = [
  { type: 'breathe', label: 'Breathe', emoji: '🫧' },
  { type: 'read', label: 'Read', emoji: '📖' },
  { type: 'journal', label: 'Journal', emoji: '✍️' },
  { type: 'walk', label: 'Walk', emoji: '🚶' },
  { type: 'custom', label: 'Custom', emoji: '✨' },
];

@Component({
  standalone: true,
  selector: 'app-routine-detail-page',
  imports: [UiCardComponent, UiButtonComponent, RouterLink],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex items-center justify-between">
        <a routerLink="/routines" class="text-sm font-semibold hover:underline">← Back</a>

        <app-ui-button variant="secondary" size="sm"> Start 🧘 </app-ui-button>
      </div>

      @if (!routine()) {
        <app-ui-card>
          <p class="text-sm font-medium">Routine not found 😶‍🌫️</p>
          <p class="mt-1 text-sm text-(--muted)">It may have been deleted.</p>
        </app-ui-card>
      } @else {
        <!-- Routine header -->
        <app-ui-card class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs text-(--muted)">Routine</p>
              <p class="mt-1 text-lg font-semibold leading-tight">
                {{ routine()!.emoji }} {{ routine()!.name }}
              </p>
              <p class="mt-1 text-sm text-(--muted)">
                {{ routine()!.steps.length }} steps · {{ totalMinutes() }} minutes
              </p>
            </div>

            <div class="flex flex-col gap-2">
              <select
                class="rounded-2xl border border-(--border) bg-(--surface) px-3 py-2 text-sm"
                [value]="routine()!.emoji"
                (change)="setEmoji($any($event.target).value)"
                aria-label="Routine emoji"
              >
                @for (e of emojis; track e) {
                  <option [value]="e">{{ e }}</option>
                }
              </select>
            </div>
          </div>

          <div>
            <label for="routine-name" class="text-xs text-(--muted)">Name</label>
            <input
              id="routine-name"
              class="mt-1 w-full rounded-2xl border border-(--border) bg-(--surface) px-3 py-3 text-sm outline-none focus:border-(--muted)"
              [value]="routine()!.name"
              (input)="setName($any($event.target).value)"
              placeholder="e.g. Evening wind-down"
            />
          </div>
        </app-ui-card>

        <!-- Steps -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold">Steps 🧩</h2>
            <app-ui-button variant="primary" size="sm" (click)="addQuickStep()">
              + Step
            </app-ui-button>
          </div>

          @for (s of routine()!.steps; track s.id) {
            <app-ui-card class="p-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-semibold truncate">
                    {{ stepEmoji(s.type) }} {{ s.title }}
                  </p>
                  <p class="mt-0.5 text-xs text-(--muted)">{{ s.minutes }} min · {{ s.type }}</p>
                </div>

                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    class="rounded-xl px-2 py-2 text-xs font-semibold text-(--muted) hover:bg-(--surface) transition-colors"
                    (click)="move(s.id, 'up')"
                    aria-label="Move step up"
                  >
                    ⬆️
                  </button>
                  <button
                    type="button"
                    class="rounded-xl px-2 py-2 text-xs font-semibold text-(--muted) hover:bg-(--surface) transition-colors"
                    (click)="move(s.id, 'down')"
                    aria-label="Move step down"
                  >
                    ⬇️
                  </button>
                  <button
                    type="button"
                    class="rounded-xl px-2 py-2 text-xs font-semibold text-(--muted) hover:bg-(--surface) transition-colors"
                    (click)="editStep(s)"
                    aria-label="Edit step"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    class="rounded-xl px-2 py-2 text-xs font-semibold text-(--muted) hover:bg-(--surface) transition-colors"
                    (click)="removeStep(s.id)"
                    aria-label="Delete step"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </app-ui-card>
          }

          <app-ui-card class="border-dashed">
            <p class="text-sm font-medium">Tip ✨</p>
            <p class="mt-1 text-sm text-(--muted)">
              Keep routines short. 10–20 minutes is perfect.
            </p>
          </app-ui-card>
        </div>
      }
    </div>
  `,
})
export class RoutineDetailPage implements OnInit {
  emojis = EMOJIS;

  private id = '';
  routine = signal<ReturnType<RoutinesStore['routines']>[number] | null>(null);

  totalMinutes = computed(() => {
    const r = this.routine();
    if (!r) return 0;
    return r.steps.reduce((sum, st) => sum + (st.minutes ?? 0), 0);
  });

  private route = inject(ActivatedRoute);
  private store = inject(RoutinesStore);

  ngOnInit() {
    this.store.load();
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    const found = this.store.routines().find((r) => r.id === this.id) ?? null;
    this.routine.set(found);
  }

  // Keep local signal in sync after updates (simple approach for MVP)
  private refresh() {
    const found = this.store.routines().find((r) => r.id === this.id) ?? null;
    this.routine.set(found);
  }

  setName(name: string) {
    this.store.updateRoutine(this.id, { name });
    this.refresh();
  }

  setEmoji(emoji: string) {
    this.store.updateRoutine(this.id, { emoji });
    this.refresh();
  }

  addQuickStep() {
    const step: RoutineStep = {
      id: uid('step'),
      title: 'Custom step',
      minutes: 5,
      type: 'custom',
    };
    this.store.addStep(this.id, step);
    this.refresh();
  }

  removeStep(stepId: string) {
    const ok = confirm('Delete this step?');
    if (!ok) return;
    this.store.deleteStep(this.id, stepId);
    this.refresh();
  }

  move(stepId: string, dir: 'up' | 'down') {
    this.store.moveStep(this.id, stepId, dir);
    this.refresh();
  }

  editStep(step: RoutineStep) {
    // MVP: simple prompt-based editor (fast). We'll replace with a modal/bottom sheet soon.
    const title = prompt('Step title', step.title) ?? step.title;
    const minutesRaw = prompt('Minutes', String(step.minutes)) ?? String(step.minutes);
    const minutes = Math.max(1, Math.min(120, Number(minutesRaw) || step.minutes));

    const typeRaw = prompt(
      'Type (breathe/read/journal/walk/custom)',
      step.type,
    ) as RoutineStepType | null;

    const type = (['breathe', 'read', 'journal', 'walk', 'custom'] as const).includes(
      (typeRaw ?? step.type) as RoutineStepType,
    )
      ? ((typeRaw ?? step.type) as RoutineStepType)
      : step.type;

    const r = this.routine();
    if (!r) return;

    const nextSteps = r.steps.map((s) =>
      s.id === step.id ? { ...s, title: title.trim() || s.title, minutes, type } : s,
    );

    this.store.updateSteps(this.id, nextSteps);
    this.refresh();
  }

  stepEmoji(type: RoutineStepType) {
    return STEP_TYPES.find((t) => t.type === type)?.emoji ?? '✨';
  }
}
