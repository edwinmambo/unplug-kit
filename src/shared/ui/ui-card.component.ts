import { Component, HostBinding, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ui-card',
  template: `<ng-content />`,
})
export class UiCardComponent {
  @Input() class = '';

  @HostBinding('class')
  get hostClasses() {
    return [
      'block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm',
      'transition',
      this.class,
    ].join(' ');
  }
}
