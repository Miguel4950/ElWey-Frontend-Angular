import { Component, input, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ClienteDTO } from '../../../../dtos/cliente.dto';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

interface NivelInfo {
  nombre: string;
  badge: string;
  icono: string;
  color: string;
  proxNivel: string;
  progreso: number;
  beneficio: string;
}

/**
 * Tarjeta interactiva de fidelización y gamificación "Club Puntos Wey".
 * Computa dinámicamente el puntaje acumulado y nivel de membresía
 * a partir del historial real de compras del cliente.
 * Cumple con la doctrina de Angarita: Standalone puro, Signals reactivos.
 */
@Component({
  selector: 'app-portal-fidelizacion-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './portal-fidelizacion-card.component.html',
  styleUrl: './portal-fidelizacion-card.component.css',
})
export class PortalFidelizacionCardComponent {
  cliente = input<ClienteDTO | null>(null);
  pedidosEntregados = input<PedidoDTO[]>([]);

  beneficioCanjeado = signal<boolean>(false);

  // Gasto total acumulado en compras exitosas
  gastoTotal = computed(() => {
    return this.pedidosEntregados().reduce((sum, p) => sum + (p.total || 0), 0);
  });

  // Cada $100 COP equivale a 1 Punto Wey acumulable
  puntosWey = computed(() => {
    return Math.floor(this.gastoTotal() / 100);
  });

  // Consecutivo único de tarjeta VIP
  codigoMembresia = computed(() => {
    const id = this.cliente()?.id ?? 1;
    return `WEY-VIP-${String(id).padStart(4, '0')}`;
  });

  // Nivel de membresía calculado reactivamente
  nivel = computed<NivelInfo>(() => {
    const pts = this.puntosWey();
    if (pts >= 1500) {
      return {
        nombre: 'Mero Mero Taquero',
        badge: 'Nivel Oro 🥇',
        icono: '👑',
        color: 'oro',
        proxNivel: '¡Nivel Máximo de Honor!',
        progreso: 100,
        beneficio: 'Envíos gratis ilimitados + Salsa secreta tatemada en cada pedido.',
      };
    }
    if (pts >= 500) {
      const restantes = 1500 - pts;
      const prog = Math.min(100, Math.round(((pts - 500) / 1000) * 100));
      return {
        nombre: 'Compadre Wey',
        badge: 'Nivel Plata 🥈',
        icono: '🌮',
        color: 'plata',
        proxNivel: `${restantes} pts para Nivel Oro`,
        progreso: prog,
        beneficio: 'Bebida artesanal mexicana gratis en compras superiores a $35.000.',
      };
    }
    const prog = Math.min(100, Math.round((pts / 500) * 100));
    return {
      nombre: 'Taquero Novato',
      badge: 'Nivel Bronce 🥉',
      icono: '🍃',
      color: 'bronce',
      proxNivel: `${500 - pts} pts para Nivel Plata`,
      progreso: prog,
      beneficio: '5% de descuento en postres mexicanos y aguas frescas.',
    };
  });

  canjearRecompensa(): void {
    this.beneficioCanjeado.set(true);
  }
}
