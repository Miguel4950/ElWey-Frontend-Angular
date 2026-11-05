import { Component, computed, signal } from '@angular/core';

export interface Testimonio {
  id: number;
  nombre: string;
  rol: string;
  estrellas: number;
  comentario: string;
  categoria: 'tacos' | 'quesadillas' | 'domicilios' | 'general';
  avatarEmoji: string;
  fecha: string;
}

@Component({
  selector: 'app-testimonios',
  standalone: true,
  templateUrl: './testimonios.component.html',
  styleUrl: './testimonios.component.css'
})
export class TestimoniosComponent {
  categoriaSeleccionada = signal<'todos' | 'tacos' | 'quesadillas' | 'domicilios'>('todos');

  readonly metricas = [
    { valor: '+2,500', etiqueta: 'Tacos Servidos', icono: '🌮' },
    { valor: '4.9 / 5.0', etiqueta: 'Calificación Promedio', icono: '⭐' },
    { valor: '99%', etiqueta: 'Entregas a Tiempo', icono: '🛵' },
    { valor: '100%', etiqueta: 'Sazón Mexicano', icono: '🇲🇽' }
  ];

  readonly listaTestimonios: Testimonio[] = [
    {
      id: 1,
      nombre: 'Valentina Gómez',
      rol: 'Comensal Verificada',
      estrellas: 5,
      comentario: 'Los mejores tacos al pastor de Chapinero. La piña asada al punto y la salsa verde de tomatillo son idénticas a las que probé en Ciudad de México.',
      categoria: 'tacos',
      avatarEmoji: '👩‍💼',
      fecha: 'Hace 2 días'
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza',
      rol: 'Pedido a Domicilio',
      estrellas: 5,
      comentario: 'Pedí el queso fundido con chorizo y las quesadillas de tinga poblana para una reunión familiar. Llegó caliente, crujiente y perfectamente empacado.',
      categoria: 'quesadillas',
      avatarEmoji: '👨‍💻',
      fecha: 'Hace 4 días'
    },
    {
      id: 3,
      nombre: 'Laura Restrepo',
      rol: 'Amante del Picante',
      estrellas: 5,
      comentario: 'El maridaje con Jarritos de Tamarindo y los totopos con guacamole casero son una locura. La escala de salsas le da el toque perfecto.',
      categoria: 'general',
      avatarEmoji: '👩‍🎨',
      fecha: 'Hace 1 semana'
    },
    {
      id: 4,
      nombre: 'Andrés Forero',
      rol: 'Cliente Frecuente',
      estrellas: 5,
      comentario: 'Excelente servicio y la plataforma web es súper ágil para pedir. El seguimiento de los pedidos da mucha confianza. ¡Viva México!',
      categoria: 'domicilios',
      avatarEmoji: '👨‍🍳',
      fecha: 'Hace 1 semana'
    }
  ];

  testimoniosFiltrados = computed(() => {
    const cat = this.categoriaSeleccionada();
    if (cat === 'todos') {
      return this.listaTestimonios;
    }
    return this.listaTestimonios.filter((t) => t.categoria === cat);
  });

  seleccionarCategoria(cat: 'todos' | 'tacos' | 'quesadillas' | 'domicilios'): void {
    this.categoriaSeleccionada.set(cat);
  }
}
