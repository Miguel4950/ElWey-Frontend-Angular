import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface PreguntaFrecuente {
  id: number;
  categoria: 'envios' | 'pagos' | 'menu' | 'pedidos';
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-soporte-faq',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './soporte-faq.component.html',
  styleUrl: './soporte-faq.component.css',
})
export class SoporteFaqComponent {
  // Estado modal
  abierto = signal<boolean>(false);
  categoriaSeleccionada = signal<string>('todos');
  busqueda = signal<string>('');
  preguntaExpandida = signal<number | null>(null);

  // Catálogo de preguntas de la taquería
  readonly faqs: PreguntaFrecuente[] = [
    {
      id: 1,
      categoria: 'envios',
      pregunta: '¿Cuáles son las zonas de cobertura y tiempos de entrega en Bogotá?',
      respuesta:
        'Cubrimos las principales zonas de Bogotá (Chapinero, Usaquén, Teusaquillo, Santa Bárbara y Cedritos). El tiempo estimado de entrega es de 35 a 45 minutos en condiciones normales de tráfico.',
    },
    {
      id: 2,
      categoria: 'pagos',
      pregunta: '¿Qué medios de pago puedo utilizar en El Wey?',
      respuesta:
        'Aceptamos pagos en efectivo contra entrega (nuestros domiciliarios llevan cambio exacto), tarjetas de débito/crédito (Visa, MasterCard, Amex) y transferencias bancarias digitales por PSE, Nequi y Daviplata.',
    },
    {
      id: 3,
      categoria: 'menu',
      pregunta: '¿Tienen opciones aptas para celíacos (sin gluten) o vegetarianos?',
      respuesta:
        '¡Por supuesto! Nuestras tortillas tradicionales son 100% de maíz nixtamalizado, libres de gluten de trigo. También ofrecemos opciones vegetarianas como Tacos de Champiñones al Ajillo y Nopales Asados con Queso.',
    },
    {
      id: 4,
      categoria: 'pedidos',
      pregunta: '¿Cómo puedo verificar el estado de mi pedido en cocina?',
      respuesta:
        'Una vez confirmes tu orden, puedes consultar su evolución en tiempo real (Cocinando, Enviado, Entregado) desde "Mi Portal" o ingresando a la vista de detalle del pedido con tu número identificador.',
    },
    {
      id: 5,
      categoria: 'envios',
      pregunta: '¿Cómo garantizan que la comida llegue caliente a mi domicilio?',
      respuesta:
        'Empacamos los tacos y carnes en recipientes térmicos sellados de grado alimentario, y las salsas y totopos en empaques independientes para mantener la textura crujiente y la temperatura óptima.',
    },
    {
      id: 6,
      categoria: 'pedidos',
      pregunta: '¿Puedo solicitar factura electrónica con IVA discriminado?',
      respuesta:
        'Sí. En la pantalla de confirmación y en el detalle de tu pedido dispones de la opción de generar e imprimir el comprobante fiscal detallado con discriminación de consumo y código QR institucional.',
    },
  ];

  // Filtro reactivo con Signals
  readonly faqsFiltradas = computed<PreguntaFrecuente[]>(() => {
    const cat = this.categoriaSeleccionada();
    const q = this.busqueda().trim().toLowerCase();

    return this.faqs.filter((faq) => {
      const matchCat = cat === 'todos' || faq.categoria === cat;
      const matchQuery =
        !q ||
        faq.pregunta.toLowerCase().includes(q) ||
        faq.respuesta.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  });

  toggleModal(): void {
    this.abierto.update((v) => !v);
  }

  cerrarModal(): void {
    this.abierto.set(false);
  }

  setCategoria(cat: string): void {
    this.categoriaSeleccionada.set(cat);
  }

  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  togglePregunta(id: number): void {
    if (this.preguntaExpandida() === id) {
      this.preguntaExpandida.set(null);
    } else {
      this.preguntaExpandida.set(id);
    }
  }

  abrirWhatsApp(): void {
    const texto = encodeURIComponent(
      '¡Hola El Wey! Tengo una consulta sobre el menú y los pedidos a domicilio.'
    );
    window.open(`https://api.whatsapp.com/send?phone=573109876543&text=${texto}`, '_blank');
  }
}
