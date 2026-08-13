import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../services/login/auth-service.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit, OnDestroy {

  private readonly authService = inject(AuthServiceService);
  private readonly router = inject(Router);
  private readonly subscription = new Subscription();

  protected dropdownOpen = false;
  protected rutaCosmica = false;

  /**
   * El estado de sesion se lee directamente de las señales del servicio.
   * Antes habia una suscripcion a authStatus$ mas NgZone.run() mas
   * detectChanges() a mano para mantener esto sincronizado; con señales
   * Angular se entera solo.
   */
  protected get isLoggedIn(): boolean { return this.authService.estaAutenticado(); }
  protected get userName(): string | null { return this.authService.usuario(); }
  protected get email(): string | null { return this.authService.getEmail(); }
  protected get isAdmin(): boolean { return this.authService.esAdmin(); }

  ngOnInit(): void {
    this.checkRuta(this.router.url);

    this.subscription.add(
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      ).subscribe(e => this.checkRuta(e.urlAfterRedirects))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  protected logout(): void {
    this.dropdownOpen = false;
    this.authService.logout();
  }

  private checkRuta(url: string): void {
    this.rutaCosmica = url === '/home' || url.startsWith('/vendetucoche');
  }
}
