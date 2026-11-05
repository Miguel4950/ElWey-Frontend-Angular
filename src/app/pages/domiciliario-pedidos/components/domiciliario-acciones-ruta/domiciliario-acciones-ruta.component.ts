import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-domiciliario-acciones-ruta',
  standalone: true,
  imports: [],
  templateUrl: './domiciliario-acciones-ruta.component.html',
  styleUrl: './domiciliario-acciones-ruta.component.css',
})
export class DomiciliarioAccionesRutaComponent {
  direccion = input<string>('');
  telefono = input<string>('');
  clienteNombre = input<string>('');
  pedidoId = input<number>(0);

  urlGoogleMaps = computed<string>(() => {
    const dir = this.direccion().trim() || 'Bogotá, Colombia';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dir + ', Bogotá')}`;
  });

  urlWaze = computed<string>(() => {
    const dir = this.direccion().trim() || 'Bogotá';
    return `https://waze.com/ul?q=${encodeURIComponent(dir + ', Bogotá')}&navigate=yes`;
  });

  urlTelefono = computed<string | null>(() => {
    const raw = this.telefono() || '';
    const digits = raw.replace(/\D/g, '');
    return digits.length >= 7 ? `tel:${digits}` : null;
  });

  urlWhatsApp = computed<string | null>(() => {
    const raw = this.telefono() || '';
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 10) return null;

    const phone = digits.length === 10 ? `57${digits}` : digits;
    const nombre = this.clienteNombre() || 'Comensal';
    const numPedido = this.pedidoId();
    const texto = `¡Hola ${nombre}! Te saluda tu repartidor de El Wey 🌮. Ya voy en camino con tu Pedido #${numPedido}. Por favor está atento en la portería para entregártelo calientito.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;
  });
}
