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
import { CategoriasAdicionalesPageComponent } from './pages/categorias-adicionales-page/categorias-adicionales-page.component';
import { OperadoresPageComponent } from './pages/operadores-page/operadores-page.component';
import { DomiciliariosPageComponent } from './pages/domiciliarios-page/domiciliarios-page.component';
import { DomiciliarioPedidosComponent } from './pages/domiciliario-pedidos/domiciliario-pedidos.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },

  // Catálogo de comidas
  { path: 'comidas', component: ComidaTablePageComponent },
  { path: 'comidas/tabla', component: ComidaTablePageComponent },
  { path: 'comidas/tarjetas', component: ComidaTablePageComponent },
  { path: 'comidas/new', redirectTo: 'comidas/crear', pathMatch: 'full' },
  { path: 'comidas/crear', component: ComidaFormComponent },
  { path: 'comidas/editar/:id', component: ComidaFormComponent },
  { path: 'comidas/:id', component: ComidaDetailComponent },

  // Administración
  { path: 'admin/adicionales', component: AdicionalesPageComponent },
  { path: 'admin/categorias-adicionales', component: CategoriasAdicionalesPageComponent },
  { path: 'adicionales', redirectTo: 'admin/adicionales', pathMatch: 'full' },

  { path: 'admin/operadores', component: OperadoresPageComponent },
  { path: 'operadores', redirectTo: 'admin/operadores', pathMatch: 'full' },

  { path: 'admin/domiciliarios', component: DomiciliariosPageComponent },
  { path: 'domiciliarios', redirectTo: 'admin/domiciliarios', pathMatch: 'full' },

  // Autenticación
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // Portales según rol
  { path: 'cliente/portal', component: MiPortalComponent },
  { path: 'cliente/portal/:id', component: MiPortalComponent },
  { path: 'domiciliario/pedidos', component: DomiciliarioPedidosComponent },
  { path: 'pedidos', component: PedidosPageComponent },
  { path: 'pedidos/:id', component: PedidoDetailComponent },

  // Carrito de compras
  { path: 'carrito', component: CarritoPageComponent },

  // Ruta comodín para redirigir a inicio
  { path: '**', redirectTo: '' },
];
