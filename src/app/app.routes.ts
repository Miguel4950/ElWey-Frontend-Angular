import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ComidaTablePageComponent } from './pages/comida-table-page/comida-table-page.component';
import { ComidaFormComponent } from './pages/comida-form/comida-form.component';
import { ComidaDetailComponent } from './pages/comida-detail/comida-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { MiPortalComponent } from './pages/mi-portal/mi-portal.component';
import { PedidosPageComponent } from './pages/pedidos-page/pedidos-page.component';
import { PedidoDetailComponent } from './pages/pedido-detail/pedido-detail.component';
import { CarritoPageComponent } from './pages/carrito-page/carrito-page.component';
import { AdicionalesPageComponent } from './pages/adicionales-page/adicionales-page.component';
import { OperadoresPageComponent } from './pages/operadores-page/operadores-page.component';
import { DomiciliariosPageComponent } from './pages/domiciliarios-page/domiciliarios-page.component';

/**
 * Definición central de rutas de la aplicación Angular "El Wey".
 * Incluye rutas públicas de clientes, portal de pedidos y CRUDs administrativos.
 */
export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'comidas',
    component: ComidaTablePageComponent,
  },
  {
    path: 'comidas/tabla',
    component: ComidaTablePageComponent,
  },
  {
    path: 'comidas/tarjetas',
    component: ComidaTablePageComponent,
  },
  {
    path: 'comidas/new',
    component: ComidaFormComponent,
  },
  {
    path: 'comidas/crear',
    component: ComidaFormComponent,
  },
  {
    path: 'comidas/editar/:id',
    component: ComidaFormComponent,
  },
  {
    path: 'comidas/:id',
    component: ComidaDetailComponent,
  },
  // Gestión de Adicionales (Admin)
  {
    path: 'admin/adicionales',
    component: AdicionalesPageComponent,
  },
  {
    path: 'adicionales',
    component: AdicionalesPageComponent,
  },
  // Gestión de Operadores de Cocina (Admin)
  {
    path: 'admin/operadores',
    component: OperadoresPageComponent,
  },
  {
    path: 'operadores',
    component: OperadoresPageComponent,
  },
  // Gestión de Domiciliarios y Flota (Admin / Operador)
  {
    path: 'admin/domiciliarios',
    component: DomiciliariosPageComponent,
  },
  {
    path: 'domiciliarios',
    component: DomiciliariosPageComponent,
  },
  // Autenticación y Registro
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  },
  // Portal del Cliente
  {
    path: 'cliente/portal',
    component: MiPortalComponent,
  },
  {
    path: 'cliente/portal/:id',
    component: MiPortalComponent,
  },
  // Gestión y Monitoreo de Pedidos
  {
    path: 'pedidos',
    component: PedidosPageComponent,
  },
  {
    path: 'pedidos/:id',
    component: PedidoDetailComponent,
  },
  // Carrito de compras
  {
    path: 'carrito',
    component: CarritoPageComponent,
  },
  // Redirección por defecto ante rutas desconocidas
  {
    path: '**',
    redirectTo: '',
  },
];
