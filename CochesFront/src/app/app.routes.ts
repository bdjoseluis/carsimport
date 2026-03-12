import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VendeTuCocheComponent } from './pages/vende-tu-coche/vende-tu-coche.component';
import { NuestrosCochesComponent } from './pages/nuestros-coches/nuestros-coches.component';
import { ImportacionComponent } from './pages/importacion/importacion.component';
import { DetalleImportadoComponent } from './components/detalleImportado/detalle-importado.component';
import { DetalleCocheComponent } from './components/detalleCoche/detalle-coche.component';
import { PublicarCocheComponent } from './pages/publicar-coche/publicar-coche.component';
import { authGuard } from '.././core/guards/auth.guard';
import { adminGuard } from '.././core/guards/admin.guard';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { AdminOfertasComponent } from './pages/admin-ofertas-venta/admin-ofertas.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'nuestroscoches',
    component: NuestrosCochesComponent,
  },
  {
    path: 'vendetucoche',
    component: VendeTuCocheComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'importacion',
    component: ImportacionComponent,
  },
  {
    path: 'importacion/:id',
    component: DetalleImportadoComponent,
  },
  {
    path: 'nuestros-coches/:id',
    component: DetalleCocheComponent,
  },
  {
    path: 'admin/publicar-coche',
    component: PublicarCocheComponent,
    canActivate: [adminGuard],  // ← solo ADMIN
  },
  {
    path: 'reservar/:id',
    component: ReservaComponent,
    canActivate: [authGuard],  // solo usuarios logueados
  },
  {
    path: 'admin/ofertas',
    component: AdminOfertasComponent,
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
  
];
