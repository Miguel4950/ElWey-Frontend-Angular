### ¿Qué se hizo? (Detalle técnico de la implementación)
1. **Nuevo Subcomponente Dumb Standalone (`ComidaPromocionesComponent`):**
   - Creado en `src/app/pages/comida-table-page/components/comida-promociones/` con arquitectura 100% Standalone (`standalone: true`).
   - Estado reactivo con Signals nativos:
     - `promoActivaIndex`: Señal numérica que controla la pestaña del combo o especial seleccionado en tiempo real.
     - `tiempoRestante`: Señal de texto con cuenta regresiva sincrónica ("03h 42m 15s") calculada dinámicamente hasta la hora de cierre de despacho de cocina.
     - `promocionSeleccionada`: Salida reactiva (`output<string>()`) que emite la categoría del combo para filtrar la carta al instante.
2. **Temporizador y Cero Fugas de Memoria:**
   - Temporizador dinámico por segundos con cálculo exacto de horas, minutos y segundos restantes.
   - Cancelación e higiene estricta de memoria mediante `clearInterval(this.timerId)` en el ciclo de vida `ngOnDestroy()`.
3. **Pestañas Interactivas de Combos con Ahorro Calculado:**
   - Tres combos destacados con icono, descripción gourmet, precio regular tachado y precio especial de oferta:
     - 🌮 *2x1 en Tacos al Pastor Clásicos* (50% OFF).
     - 🎉 *Taquiza Fiesta Wey* (12 Tacos + Totopos + 1L Horchata, ahorras $15.100).
     - 🧀 *Trío de Quesadillas Oaxaca + Guacamole Rústico* (Ahorras $9.500).
   - Botón interactivo que filtra la cuadrícula de platos en el catálogo al instante sin recargar la página.
4. **Integración Modular en `ComidaTablePageComponent`:**
   - Inserción limpia del banner `<app-comida-promociones>` en la vista de tarjetas gastronómicas para clientes (`esVistaTarjetas`), manteniendo intacta la vista tabular de administración del restaurante.

### Impacto de Negocio
- **Aumento del Ticket Promedio y Efecto Urgencia (FOMO):** En la industria de restaurantes, los banners con cuenta regresiva dinámica generan un sentido de urgencia en el consumidor, incrementando las tasas de conversión y estimulando la compra de combos de mayor valor en lugar de ítems individuales.
- **Venta Sugerida y Descubrimiento del Menú:** Facilita que los nuevos comensales no se sientan abrumados por la carta completa, guiándolos directamente hacia las especialidades más rentables y populares de la taquería.
- **Experiencia Visual Dinámica y Demostrable:** Aporta dinamismo a la interfaz con badges animados de pulso de fuego y pestañas interactivas, ideal para lucir la capacidad técnica y comercial de la plataforma en la sustentación final ante el profesor Angarita.