import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare interface RouteInfo {
  module: string;
  path: string;
  navTitle: string;
  title: string;
  icon: string;
}
export const ROUTES: RouteInfo[] = [
  {
    module: 'dashboard',
    path: '/dashboard',
    navTitle: 'Dashboard',
    title: 'Dashboard',
    icon: 'fas fa-chart-pie'
  },
  {
    module: 'contatos',
    path: '/contatos',
    navTitle: 'Tabela de Contatos',
    title: 'Contatos',
    icon: 'fas fa-users'
  },
  {
    module: 'user',
    path: '/versao',
    navTitle: 'Versionamento',
    title: 'Versões',
    icon: 'fas fa-shopping-cart'
  },
  {
    module: 'admin',
    path: '/configuracao',
    navTitle: 'Configuração',
    title: 'Configurações',
    icon: 'fas fa-shopping-cart'
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input()
  public expanded = false;
  public menuItems: any[] = [];
  public user: any = {};
  public feedback: any = {};

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.menuItems = ROUTES;
  }

  ngOnChanges() {}

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

  openModal(content) {
    this.modalService.open(content, { centered: true }).result.then(
      result => {
        if (result === 'close') {
          this.feedback = {};
        }
      },
      reason => {}
    );
  }
}
