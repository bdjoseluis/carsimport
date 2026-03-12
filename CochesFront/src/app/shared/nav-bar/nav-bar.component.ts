import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
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
  protected userName: string | null = null;
  protected email: string | null = null;
  protected isAdmin = false;
  protected isLoggedIn = false;
  protected dropdownOpen = false;
  protected rutaCosmica = false;

  private authService = inject(AuthServiceService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.updateUserInfo();
    this.checkRuta(this.router.url);

    this.subscription.add(
      this.authService.authStatus$.subscribe(() => {
        this.ngZone.run(() => this.updateUserInfo());
      })
    );

    this.subscription.add(
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd)
      ).subscribe((e: any) => {
        this.checkRuta(e.urlAfterRedirects);
        this.cdr.detectChanges();
      })
    );
  }

  private checkRuta(url: string): void {
    this.rutaCosmica = url === '/home' || url.startsWith('/vendetucoche');
  }


  protected updateUserInfo(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.userName = this.authService.getUserName();
      this.email = this.authService.getEmail();
      this.isAdmin = this.authService.getUserRole() === 'ADMIN';
    } else {
      this.userName = null;
      this.email = null;
      this.isAdmin = false;
      this.dropdownOpen = false;
    }
    this.cdr.detectChanges();
  }

  protected toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.cdr.detectChanges();
  }

  protected logout(): void {
    this.dropdownOpen = false;
    this.cdr.detectChanges();
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
