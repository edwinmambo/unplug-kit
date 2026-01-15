import { Component, EventEmitter, Output, HostListener, signal } from '@angular/core';
import { RoutineStep, RoutineStepType } from '../../core/models/routine.model';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';

const TYPE_OPTIONS: { type: RoutineStepType; label: string; emoji: string }[] = [
  { type: 'breathe', label: 'Breathe', emoji: '🫧' },
  { type: 'read', label: 'Read', emoji: '📖' },
  { type: 'journal', label: 'Journal', emoji: '✍️' },
  { type: 'walk', label: 'Walk', emoji: '🚶' },
  { type: 'custom', label: 'Custom', emoji: '✨' },
];

@Component({
  standalone: true,
  selector: 'app-step-editor-sheet',
  imports: [UiButtonComponent],
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <button
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
        (click)="close()"
        aria-label="Close Backdrop"
      ></button>

      <!-- Sheet -->
      <div
        class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md px-3"
        style="padding-bottom: env(safe-area-inset-bottom);"
      >
        <div class="rounded-t-3xl border border-(--border) bg-(--bg) shadow-2xl">
          <!-- Grab handle -->
          <div class="flex justify-center pt-3">
            <div class="h-1.5 w-10 rounded-full bg-(--border)"></div>
          </div>

          <div class="p-4 space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold">
                  {{ mode() === 'edit' ? 'Edit step ✏️' : 'Add step +️⃣' }}
                </p>
                <p class="mt-0.5 text-sm text-(--muted)">Keep it short and doable.</p>
              </div>

              <button
                type="button"
                class="rounded-xl px-3 py-2 text-sm font-semibold text-(--muted) hover:bg-(--surface) transition-colors"
                (click)="close()"
              >
                Close
              </button>
            </div>

            <!-- Title -->
            <div>
              <label for="draft-title" class="text-xs text-(--muted)">Title</label>
              <input
                id="draft-title"
                class="mt-1 w-full rounded-2xl border border-(--border) bg-(--surface) px-3 py-3 text-sm outline-none focus:border-(--muted)"
                [value]="draftTitle()"
                (input)="draftTitle.set($any($event.target).value)"
                placeholder="e.g. Read 2 pages"
              />
              @if (titleError()) {
                <p class="mt-1 text-xs text-red-300">Title is required.</p>
              }
            </div>

            <!-- Minutes + Type -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="draft-minutes" class="text-xs text-(--muted)">Minutes</label>
                <input
                  id="draft-minutes"
                  class="mt-1 w-full rounded-2xl border border-(--border) bg-(--surface) px-3 py-3 text-sm outline-none focus:border-(--muted)"
                  type="number"
                  min="1"
                  max="120"
                  [value]="draftMinutes()"
                  (input)="draftMinutes.set(Number($any($event.target).value) || 1)"
                />
                @if (minutesError()) {
                  <p class="mt-1 text-xs text-red-300">Minutes must be 1–120.</p>
                }
              </div>

              <div>
                <label for="draft-type" class="text-xs text-(--muted)">Type</label>
                <select
                  id="draft-type"
                  class="mt-1 w-full rounded-2xl border border-(--border) bg-(--surface) px-3 py-3 text-sm outline-none focus:border-(--muted)"
                  [value]="draftType()"
                  (change)="draftType.set($any($event.target).value)"
                >
                  @for (opt of typeOptions; track opt.type) {
                    <option [value]="opt.type">{{ opt.emoji }} {{ opt.label }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <app-ui-button variant="secondary" size="lg" class="flex-1" (click)="close()">
                Cancel
              </app-ui-button>
              <app-ui-button variant="primary" size="lg" class="flex-1" (click)="save()">
                Save ✅
              </app-ui-button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class StepEditorSheetComponent {
  typeOptions = TYPE_OPTIONS;
  readonly Number = Number;

  // Controls
  open = signal(false);
  mode = signal<'add' | 'edit'>('add');

  // Editing state
  private editingId: string | null = null;

  draftTitle = signal('');
  draftMinutes = signal(5);
  draftType = signal<RoutineStepType>('custom');

  titleError = signal(false);
  minutesError = signal(false);

  @Output() saved = new EventEmitter<RoutineStep>();

  /** Call this from parent to open the sheet */
  showAdd(defaults?: Partial<Pick<RoutineStep, 'title' | 'minutes' | 'type'>>) {
    this.mode.set('add');
    this.editingId = null;
    this.resetErrors();

    this.draftTitle.set(defaults?.title ?? '');
    this.draftMinutes.set(defaults?.minutes ?? 5);
    this.draftType.set(defaults?.type ?? 'custom');

    this.open.set(true);
  }

  /** Call this from parent to open with existing step */
  showEdit(step: RoutineStep) {
    this.mode.set('edit');
    this.editingId = step.id;
    this.resetErrors();

    this.draftTitle.set(step.title);
    this.draftMinutes.set(step.minutes);
    this.draftType.set(step.type);

    this.open.set(true);
  }

  close() {
    this.open.set(false);
  }

  private resetErrors() {
    this.titleError.set(false);
    this.minutesError.set(false);
  }

  private validate() {
    const title = this.draftTitle().trim();
    const minutes = this.draftMinutes();

    const titleOk = title.length > 0;
    const minutesOk = Number.isFinite(minutes) && minutes >= 1 && minutes <= 120;

    this.titleError.set(!titleOk);
    this.minutesError.set(!minutesOk);

    return titleOk && minutesOk;
  }

  save() {
    if (!this.validate()) return;

    const step: RoutineStep = {
      id: this.editingId ?? 'temp', // parent will replace for add
      title: this.draftTitle().trim(),
      minutes: this.draftMinutes(),
      type: this.draftType(),
    };

    this.saved.emit(step);
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.open()) this.close();
  }
}
