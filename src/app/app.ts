import { Component, inject, signal } from '@angular/core';
import { AppShellComponent } from '../core/layout/app-shell.component';
import { ThemeService } from '../core/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [AppShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('unplug-kit');

  private readonly theme = inject(ThemeService);

  constructor() {
    this.theme.init();
  }
}
