import { Component, HostBinding, Input } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  standalone: true,
  selector: 'app-ui-button',
  template: `<button type="button"><ng-content /></button>`,
})
export class UiButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';

  @HostBinding('class')
  get hostClasses() {
    const base =
      'inline-flex items-center justify-center rounded-2xl font-medium active:scale-[0.98] transition select-none';

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-sm px-3 py-2',
      md: 'text-sm px-4 py-3',
      lg: 'text-base px-5 py-4',
    };

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-white text-black shadow-sm',
      secondary: 'border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]',
      ghost: 'bg-transparent text-[var(--text)] hover:bg-[var(--surface)]',
    };

    return [base, sizes[this.size], variants[this.variant]].join(' ');
  }
}
