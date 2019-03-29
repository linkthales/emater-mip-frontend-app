import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../shared/services/utilities.service';
import { NgxSelectModule } from 'ngx-select-ex';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { ComponentsModule } from '../../components/components.module';

import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgxSelectModule,
    NgbModule,
    TextMaskModule,
    NgxPaginationModule,
    JwBootstrapSwitchNg2Module
  ],
  declarations: [
    DashboardComponent,
  ],
  exports: [],
  providers: [
    UtilService,
  ]
})
export class AdminLayoutModule {}
