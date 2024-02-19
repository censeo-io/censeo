import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'censeo-async-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './async-loader.component.html',
  styleUrls: ['./async-loader.component.scss'],
})
export class AsyncLoaderComponent {
  @Input() loading: boolean | null = true;
  @Input() error: string | null = null;
}
