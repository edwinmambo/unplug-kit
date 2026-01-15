import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ui-weekly-bars',
  template: `
    <div class="flex items-end gap-2 h-28">
      @for (d of data; track d.dayStart) {
        <div class="flex-1 flex flex-col items-center gap-2">
          <div
            class="w-full rounded-2xl border border-(--border) bg-(--surface-2)"
            [style.height.px]="barHeightPx(d.minutes)"
            title="{{ d.minutes }} minutes"
          ></div>

          <div class="text-[10px] text-(--muted)">
            {{ label(d.dayStart) }}
          </div>
        </div>
      }
    </div>
  `,
})
export class WeeklyBarsComponent {
  @Input({ required: true }) data!: { dayStart: number; minutes: number }[];

  private readonly MAX_BAR_PX = 88; // fits nicely inside h-28 container
  private readonly MIN_BAR_PX = 6; // always visible, even for 0

  private maxMinutes(): number {
    if (!this.data?.length) return 1;
    return Math.max(1, ...this.data.map((x) => x.minutes));
  }

  barHeightPx(minutes: number): number {
    const max = this.maxMinutes();
    const ratio = max <= 0 ? 0 : minutes / max;
    const px = Math.round(ratio * this.MAX_BAR_PX);
    return Math.max(this.MIN_BAR_PX, px);
  }

  label(dayStart: number): string {
    const d = new Date(dayStart);
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  }
}
