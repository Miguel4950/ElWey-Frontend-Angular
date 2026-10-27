# 🌮 Restaurante El Wey — Plataforma Web (Frontend SPA Angular 19)

> **Asignatura:** Desarrollo Web  
> **Institución:** Pontificia Universidad Javeriana  
> **Integrantes:**  
> - Miguel Ángel Acuña  
> - Samuel Manrique  
> - Javier Jaimes  
> - Juan Pablo Mota  
> **Framework Base:** Angular 19.2 (Arquitectura 100% Standalone) | TypeScript 5.7  

---

## 📌 Descripción del Proyecto

**Restaurante El Wey** es una Single Page Application (SPA) moderna desarrollada para la gestión comercial y operativa de un restaurante de comida tradicional mexicana. La plataforma cuenta con catálogos dinámicos de platillos, fichas técnicas de detalle, gestión de inventario gastronómico y un flujo de clientes fiel a la aplicación central (Inicio de Sesión, Registro y Mi Portal para consulta, actualización y eliminación de cuenta con persistencia en memoria), estructurado bajo la doctrina y buenas prácticas de ingeniería de software para Angular 19.

---

## 📐 Diagramas del Sistema

Los diagramas arquitectónicos y de datos del sistema se encuentran ubicados en el directorio [`Diagramas/`](Diagramas/):

1. **Diagrama de Clases UML ([`Diagramas/DiagramaDeClases.png`](Diagramas/DiagramaDeClases.png)):**
   - Modela la jerarquía, atributos, métodos y relaciones entre `Cliente`, `Pedido`, `ItemPedido`, `Comida`, `Categoria`, `Adicional`, `Domiciliario`, `Operador` y `Administrador`.
2. **Diagrama Entidad-Relación ([`Diagramas/Diagrama_Entidad_Relacion.png`](Diagramas/Diagrama_Entidad_Relacion.png)):**
   - Esquema relacional de base de datos con notación Crow's Foot que modela tablas, llaves primarias (PK), foráneas (FK), tipos de datos y cardinalidades completas.

---

## 🧭 Estructura del Código Fuente

```text
src/
├── public/                                # Recursos estáticos servidos en raíz (imágenes de comidas, logo)
│   └── images/
│       ├── logo_el_wey.jpg
│       └── comidas/                       # Fotografías de los platillos de la carta
├── app/
│   ├── components/                        # Componentes GLOBALES de layout
│   │   ├── navbar/                        # Barra de navegación principal
│   │   ├── footer/                        # Pie de página temático
│   │   └── calaveras/                     # Separador gráfico temático
│   ├── models/                            # Modelos de dominio tipados
│   │   ├── comida.model.ts
│   │   ├── categoria.model.ts
│   │   ├── adicional.model.ts
│   │   ├── cliente.model.ts
│   │   ├── pedido.model.ts
│   │   ├── item-pedido.model.ts
│   │   ├── domiciliario.model.ts
│   │   ├── operador.model.ts
│   │   └── administrador.model.ts
│   ├── pages/                             # Páginas asociadas a rutas principales
│   │   ├── landing-page/                  # Portada comercial (Hero, Nosotros, Destacados, Galería)
│   │   ├── comida-table-page/             # Gestión de catálogo de comidas (Tabla interactiva)
│   │   ├── comida-form/                   # Formulario Crear / Editar platillo
│   │   ├── comida-detail/                 # Vista detallada de platillo y adicionales
│   │   ├── login/                         # Pantalla de autenticación y acceso al sistema
│   │   ├── registro/                      # Pantalla de creación de cuenta de cliente
│   │   └── mi-portal/                     # Portal personal de cliente (ver, editar y eliminar)
│   ├── service/                           # Servicios Singleton de estado y datos en memoria
│   │   ├── comida.service.ts              # Catálogo con 40 comidas y categorías
│   │   └── cliente.service.ts             # Servicio de clientes y autenticación en memoria
│   ├── app.component.ts                   # Componente raíz (Shell)
│   ├── app.config.ts                      # Proveedores de la aplicación (Router)
│   └── app.routes.ts                      # Definición y precedencia estricta de rutas
```

---

## 🌐 Mapeo de Rutas del Sistema

| Módulo | Ruta | Componente | Descripción |
| :--- | :--- | :--- | :--- |
| **Inicio** | `/` | `LandingPageComponent` | Portada comercial con menú destacado y presentación. |
| **Comidas** | `/comidas` / `/comidas/tabla` | `ComidaTablePageComponent` | Tabla de gestión e inventario gastronómico. |
| | `/comidas/tarjetas` | `ComidaTablePageComponent` | Vista en cuadrícula de tarjetas de menú. |
| | `/comidas/new` | `ComidaFormComponent` | Registro de nuevo plato en la carta. |
| | `/comidas/editar/:id` | `ComidaFormComponent` | Edición de plato existente. |
| | `/comidas/:id` | `ComidaDetailComponent` | Ficha técnica de detalle de la comida. |
| **Administración** | `/admin/categorias-adicionales` | `CategoriasAdicionalesPageComponent` | Asignación de adicionales a categorías. |
| **Clientes** | `/login` | `LoginComponent` | Inicio de sesión con credenciales de prueba. |
| | `/registro` | `RegistroComponent` | Registro de cliente nuevo (Create). |
| | `/cliente/portal` | `MiPortalComponent` | Portal personal para consulta y edición de datos (Read / Update). |
| | `/cliente/portal/:id` | `MiPortalComponent` | Portal de cliente accesible por identificador. |

---

## 🚀 Instrucciones de Ejecución

### Requisitos Previos:
- **Node.js:** Versión 18.x o 20.x o superior.
- **NPM:** Incluido con Node.js.
- **Angular CLI:** Versión 19 recomendada (`npm install -g @angular/cli@19`).

### 1. Clonar el Repositorio:
```bash
git clone https://github.com/Miguel4950/ElweyAngular.git
cd ElweyAngular
```

### 2. Instalar Dependencias:
```bash
npm install
```

### 3. Iniciar el Servidor de Desarrollo:
```bash
npm start
# o alternativamente:
ng serve
```

### 4. Abrir en el Navegador:
Navegar a **`http://localhost:4200`** para interactuar con la aplicación.
