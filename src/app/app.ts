import { Component, signal } from '@angular/core';
import { AppShellComponent } from '../core/layout/app-shell.component';

@Component({
  selector: 'app-root',
  imports: [AppShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('unplug-kit');
}
