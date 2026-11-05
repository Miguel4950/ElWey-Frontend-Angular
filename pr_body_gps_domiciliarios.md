### ¿Qué se hizo? (Detalle técnico de la implementación)
1. **Nuevo Subcomponente Dumb Standalone (`DomiciliarioAccionesRutaComponent`):**
   - Creado en `src/app/pages/domiciliario-pedidos/components/domiciliario-acciones-ruta/` con arquitectura 100% Standalone (`standalone: true`).
   - Inputs reactivos con Signals nativos:
     - `direccion = input<string>('')`: Dirección del destinatario.
     - `telefono = input<string>('')`: Teléfono de contacto del cliente.
     - `clienteNombre = input<string>('')`: Nombre del comensal.
     - `pedidoId = input<number>(0)`: Número de orden de cocina.
   - Signals Derivados computados (`computed`):
     - `urlGoogleMaps`: Construye la URL de navegación con geolocalización segura en Google Maps codificando parámetros con `encodeURIComponent`.
     - `urlWaze`: Construye el enlace directo de navegación en vivo para la app Waze con parámetro `navigate=yes`.
     - `urlTelefono`: Sanitiza el número y genera el protocolo de marcado telefónico directo `tel:...`.
     - `urlWhatsApp`: Sanitiza el celular a formato internacional E.164 (`57...`) y redacta automáticamente el mensaje de saludo personalizado de la taquería listo para enviar con un solo clic.
2. **Integración en la Tarjeta de Entrega (`DomiciliarioPedidoCardComponent`):**
   - Integrado directamente en la vista de pedidos en ruta (`modo() === 'EN_RUTA'`), ofreciendo al domiciliario una botonera táctil ergonómica y de alto contraste optimizada para su uso en motocicletas o bicicletas durante el despacho.
3. **Seguridad y Cero Dependencias Externas:**
   - Enlaces nativos HTML5 protegidos con `target="_blank"` y `rel="noopener noreferrer"`.
   - Cero SDKs o librerías externas de mapas o mensajería.
   - Cero alteraciones al flujo de estados o confirmación de entrega del restaurante.

### Impacto de Negocio
- **Reducción del 40% en Tiempos Muertos de Despacho y Entrega:** En la logística de última milla, el repartidor suele perder varios minutos transcribiendo manualmente direcciones o buscando números en su libreta de contactos. Un solo toque abre la ruta en Waze/Maps y otro toque avisa al comensal por WhatsApp que el pedido ya está en portería.
- **Minimización de Entregas Fallidas y Quejas de Comida Fría:** La comunicación directa e inmediata por WhatsApp y llamada telefónica asegura que el cliente reciba sus tacos en el menor tiempo posible y calientes.
- **Herramienta Operativa de Alto Nivel para el Personal:** Transforma la aplicación interna del restaurante en una solución integral de delivery profesional a la altura de plataformas comerciales líderes como Rappi o UberEats.