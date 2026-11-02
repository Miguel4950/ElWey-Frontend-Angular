import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro-form',
  imports: [ReactiveFormsModule],
  templateUrl: './registro-form.component.html',
  styleUrl: './registro-form.component.css',
})
export class RegistroFormComponent {
  registroForm = input.required<FormGroup>();
  errorMessage = input<string>('');

  formSubmitted = output<void>();

  onSubmit(): void {
    this.formSubmitted.emit();
  }
}
