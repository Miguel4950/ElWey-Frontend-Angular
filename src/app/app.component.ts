import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SoporteFaqComponent } from './components/soporte-faq/soporte-faq.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SoporteFaqComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ElWey';
}
