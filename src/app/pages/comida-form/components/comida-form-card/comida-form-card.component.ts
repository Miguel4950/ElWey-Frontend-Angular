import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaDTO } from '../../../../dtos/categoria.dto';

@Component({
  selector: 'app-comida-form-card',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './comida-form-card.component.html',
  styleUrl: './comida-form-card.component.css',
})
export class ComidaFormCardComponent {
  comidaForm = input.required<FormGroup>();
  categorias = input.required<CategoriaDTO[]>();
  isEdit = input<boolean>(false);

  formSubmitted = output<void>();

  onSubmit(): void {
    this.formSubmitted.emit();
  }
}
