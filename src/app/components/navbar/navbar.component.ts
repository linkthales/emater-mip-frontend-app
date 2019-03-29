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

  public infoMenu: RouteInfo[] = [
    // {
    //   path: '/macroregion',
    //   navTitle: 'Macrorregião',
    //   title: 'Macrorregião',
    //   icon: 'fas fa-chart-pie'
    // },
    // {
    //   path: '/region',
    //   navTitle: 'Região',
    //   title: 'Região',
    //   icon: 'fas fa-users'
    // },
    // {
    //   path: '/city',
    //   navTitle: 'Município',
    //   title: 'Município',
    //   icon: 'fas fa-shopping-cart'
    // },
    // {
    //   path: '/farmer',
    //   navTitle: 'Produtor',
    //   title: 'Produtor',
    //   icon: 'fas fa-shopping-cart'
    // },
    // {
    //   path: '/supervisor',
    //   navTitle: 'Responsável Técnico',
    //   title: 'Responsável Técnico',
    //   icon: 'fas fa-shopping-cart'
    // },
    // {
    //   path: '/field',
    //   navTitle: 'Unidades de Referência',
    //   title: 'Unidades de Referência',
    //   icon: 'fas fa-shopping-cart'
    // }
  ];

  public researchConfigMenu: RouteInfo[] = [
    {
      path: '/harvest',
      navTitle: 'Safra',
      title: 'Safra',
      icon: 'fas fa-chart-pie'
    },
    {
      path: '/survey-field',
      navTitle: `UR's Participantes`,
      title: `UR's Participantes`,
      icon: 'fas fa-users'
    }
  ];

  public pestMenu: RouteInfo[] = [
    {
      path: '/pest',
      navTitle: 'Insetos Pragas',
      title: 'Insetos Pragas',
      icon: 'fas fa-chart-pie'
    },
    {
      path: '/pest-survey',
      navTitle: `Flutuação das Pragas`,
      title: `Flutuação das Pragas`,
      icon: 'fas fa-users'
    }
  ];

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
