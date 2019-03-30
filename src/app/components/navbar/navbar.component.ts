import { Component, Output, EventEmitter } from '@angular/core';
import { Router, GuardsCheckEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare interface RouteInfo {
  path: string;
  navTitle: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output()
  toggleSidebar = new EventEmitter<any>();

  public isCollapsed = true;

  constructor(private router: Router, private translateService: TranslateService) {
    this.router.events.forEach(event => {
      if (event instanceof GuardsCheckEnd) {
        const navMenu = document.getElementById('menuDropdown');
        navMenu.click();
      }
    });
  }
}
