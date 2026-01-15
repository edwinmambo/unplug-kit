import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';
import { RoutinesStore } from '../routines/routines.store';
import { SessionsRepository } from '../../core/storage/sessions.repository';
import { Routine } from '../../core/models/routine.model';
import { SessionLog } from '../../core/models/session.model';

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

@Component({
  standalone: true,
  selector: 'app-session-page',
  imports: [UiCardComponent, UiButtonComponent, RouterLink],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex items-center justify-between">
        <a routerLink="/" class="text-sm font-semibold hover:underline">← Home</a>

        <button
          type="button"
          class="rounded-xl px-3 py-2 text-sm font-semibold text-(--muted) hover:bg-(--surface) transition-colors"
          (click)="endEarly()"
        >
          End
        </button>
      </div>

      @if (!routine()) {
        <app-ui-card>
          <p class="text-sm font-medium">Routine not found 😶‍🌫️</p>
          <p class="mt-1 text-sm text-(--muted)">Go back and try again.</p>
        </app-ui-card>
      } @else if (done()) {
        <app-ui-card class="text-center space-y-2">
          <p class="text-2xl font-semibold">Nice work 🎉</p>
          <p class="text-sm text-(--muted)">{{ completedMinutes() }} minutes reclaimed ✨</p>
          <div class="pt-2">
            <app-ui-button variant="primary" size="lg" class="w-full" (click)="goHome()">
              Back to Dashboard 🏠
            </app-ui-button>
          </div>
        </app-ui-card>
      } @else {
        <app-ui-card class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs text-(--muted)">Now</p>
              <p class="mt-1 text-lg font-semibold">{{ routine()!.emoji }} {{ routine()!.name }}</p>
              <p class="mt-1 text-sm text-(--muted)">
                Step {{ stepIndex() + 1 }} of {{ stepsTotal() }}
              </p>
            </div>

            <div class="grid place-items-center">
              <!-- Progress ring -->
              <svg width="88" height="88" viewBox="0 0 100 100" class="block">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255,255,255,0.12)"
                  stroke-width="10"
                  fill="none"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="white"
                  stroke-width="10"
                  fill="none"
                  stroke-linecap="round"
                  [attr.stroke-dasharray]="circumference()"
                  [attr.stroke-dashoffset]="dashOffset()"
                  transform="rotate(-90 50 50)"
                ></circle>
              </svg>
              <div class="-mt-18 text-center">
                <p class="text-xl font-semibold leading-none">{{ mmss() }}</p>
                <p class="mt-1 text-xs text-(--muted)">left</p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-(--border) bg-(--surface) p-4">
            <p class="text-xs text-(--muted)">Step</p>
            <p class="mt-1 text-base font-semibold">
              {{ currentStepTitle() }}
            </p>
          </div>

          <div class="flex gap-2">
            <app-ui-button variant="secondary" size="lg" class="flex-1" (click)="togglePause()">
              {{ paused() ? 'Resume ▶️' : 'Pause ⏸️' }}
            </app-ui-button>

            <app-ui-button variant="primary" size="lg" class="flex-1" (click)="nextStep()">
              Next →
            </app-ui-button>
          </div>
        </app-ui-card>

        <!-- Sticky helper -->
        <app-ui-card class="border-dashed">
          <p class="text-sm font-medium">Tip 🌿</p>
          <p class="mt-1 text-sm text-(--muted)">
            If your mind wanders, gently come back. That counts as progress.
          </p>
        </app-ui-card>
      }
    </div>
  `,
})
export class SessionPage implements OnInit, OnDestroy {
  routine = signal<Routine | null>(null);

  stepIndex = signal(0);
  paused = signal(false);
  done = signal(false);

  // Timer state
  private intervalId: number | null = null;
  private stepRemainingSec = signal(0);
  private stepTotalSec = signal(1);

  // Session accounting
  private startedAt = Date.now();
  private completedMinutesAcc = signal(0);
  private stepsCompletedAcc = signal(0);

  stepsTotal = computed(() => this.routine()?.steps.length ?? 0);
  currentStep = computed(() => {
    const r = this.routine();
    const idx = this.stepIndex();
    return r?.steps[idx] ?? null;
  });

  currentStepTitle = computed(() => this.currentStep()?.title ?? '');
  completedMinutes = computed(() => this.completedMinutesAcc());

  circumference = computed(() => 2 * Math.PI * 42);

  dashOffset = computed(() => {
    const total = this.stepTotalSec();
    const left = this.stepRemainingSec();
    const progress = total <= 0 ? 0 : 1 - left / total;
    return this.circumference() * (1 - progress);
  });

  mmss = computed(() => {
    const s = Math.max(0, this.stepRemainingSec());
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  });

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routinesStore = inject(RoutinesStore);
  private sessionsRepo = inject(SessionsRepository);

  ngOnInit() {
    this.routinesStore.load();

    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const r = this.routinesStore.routines().find((x) => x.id === id) ?? null;
    this.routine.set(r);

    if (r) {
      this.startedAt = Date.now();
      this.loadStep(0);
      this.startTimer();
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private loadStep(idx: number) {
    const r = this.routine();
    if (!r) return;

    const step = r.steps[idx];
    if (!step) return;

    this.stepIndex.set(idx);
    const total = Math.max(1, step.minutes) * 60;
    this.stepTotalSec.set(total);
    this.stepRemainingSec.set(total);
  }

  private startTimer() {
    this.stopTimer();
    this.intervalId = setInterval(() => {
      if (this.paused() || this.done()) return;

      const left = this.stepRemainingSec();
      if (left <= 1) {
        // Step finished
        this.completeCurrentStep();
        this.advanceOrFinish();
      } else {
        this.stepRemainingSec.set(left - 1);
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }

  togglePause() {
    this.paused.set(!this.paused());
  }

  nextStep() {
    // Count partial completion: credit elapsed seconds -> rounded down to minutes at end
    this.completeCurrentStep(true);
    this.advanceOrFinish();
  }

  private completeCurrentStep(partial = false) {
    const total = this.stepTotalSec();
    const left = this.stepRemainingSec();
    const elapsedSec = Math.max(0, total - left);

    // Only credit minutes in whole minutes for MVP
    const minutes = Math.floor(elapsedSec / 60);
    if (minutes > 0) this.completedMinutesAcc.update((m) => m + minutes);

    if (!partial) {
      this.stepsCompletedAcc.update((n) => n + 1);
    }
  }

  private advanceOrFinish() {
    const next = this.stepIndex() + 1;
    if (next >= this.stepsTotal()) {
      this.finish('completed');
    } else {
      this.loadStep(next);
    }
  }

  endEarly() {
    const ok = confirm('End session early?');
    if (!ok) return;
    this.finish('ended_early');
  }

  private finish(reason: SessionLog['endedReason']) {
    if (this.done()) return;
    this.done.set(true);
    this.paused.set(false);
    this.stopTimer();

    const r = this.routine();
    if (!r) return;

    const plannedMinutes = r.steps.reduce((sum, s) => sum + (s.minutes ?? 0), 0);
    const endedAt = Date.now();

    const log: SessionLog = {
      id: uid('session'),
      routineId: r.id,
      routineName: r.name,
      routineEmoji: r.emoji,
      startedAt: this.startedAt,
      endedAt,
      plannedMinutes,
      completedMinutes: Math.min(plannedMinutes, this.completedMinutesAcc()),
      stepsPlanned: r.steps.length,
      stepsCompleted: Math.min(r.steps.length, this.stepsCompletedAcc()),
      endedReason: reason,
    };

    this.sessionsRepo.add(log);
  }

  goHome() {
    this.router.navigateByUrl('/');
  }
}
