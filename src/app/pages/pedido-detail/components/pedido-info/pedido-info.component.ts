import { Component, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { PedidoDTO } from '../../../../dtos/pedido.dto';

/**
 * Subcomponente visual para la comanda, datos del cliente, resumen y desglose de platos con adicionales.
 */
@Component({
  selector: 'app-pedido-info',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './pedido-info.component.html',
  styleUrl: './pedido-info.component.css',
})
export class PedidoInfoComponent {
  pedido = input.required<PedidoDTO>();

  readonly ticketCopiado = signal<boolean>(false);

  copiarTicketWhatsApp(): void {
    const p = this.pedido();
    if (!p) return;

    const fecha = p.fechaCreacion || 'Hoy';
    let ticket = `🌮 *RESTAURANTE EL WEY — COMANDA #${p.id}*\n`;
    ticket += `📅 *Fecha:* ${fecha}\n`;
    ticket += `👤 *Cliente:* ${p.clienteNombre}\n`;
    if (p.clienteTelefono) ticket += `📞 *Teléfono:* ${p.clienteTelefono}\n`;
    if (p.clienteDireccion) ticket += `📍 *Dirección:* ${p.clienteDireccion}\n`;
    ticket += `🛵 *Estado:* ${p.estado}\n`;
    if (p.domiciliarioNombre) ticket += `🚴 *Repartidor:* ${p.domiciliarioNombre}\n`;
    ticket += `------------------------------------\n`;
    ticket += `📦 *DETALLE DE LA ORDEN:*\n`;

    if (p.items && p.items.length > 0) {
      p.items.forEach((item) => {
        ticket += `• *${item.cantidad}x ${item.comidaNombre}* — $${Math.round(item.subtotal || 0).toLocaleString('es-CO')}\n`;
        if (item.adicionales && item.adicionales.length > 0) {
          item.adicionales.forEach((adic) => {
            ticket += `   ↳ +${adic.cantidad}x ${adic.nombre} ($${Math.round(adic.subtotal || 0).toLocaleString('es-CO')})\n`;
          });
        }
      });
    }

    ticket += `------------------------------------\n`;
    ticket += `💰 *TOTAL A PAGAR: $${Math.round(p.total || 0).toLocaleString('es-CO')}*\n`;
    ticket += `\n¡Gracias por ordenar en Taquería El Wey! 🌶️🇲🇽`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ticket).then(() => {
        this.ticketCopiado.set(true);
        setTimeout(() => this.ticketCopiado.set(false), 2500);
      }).catch(() => {
        // Fallback seguro si clipboard no está disponible
      });
    }
  }
}
