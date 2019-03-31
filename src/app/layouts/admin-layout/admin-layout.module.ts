import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../shared/services/utilities.service';
import { NgxSelectModule } from 'ngx-select-ex';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { MacroRegionComponent } from '../../macroregion/macroregion.component';
import { RegionComponent } from '../../region/region.component';
import { CityComponent } from '../../city/city.component';
import { FarmerComponent } from '../../farmer/farmer.component';
import { SupervisorComponent } from '../../supervisor/supervisor.component';
import { FieldComponent } from '../../field/field.component';

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
    TranslateModule,
    NgxPaginationModule,
    JwBootstrapSwitchNg2Module
  ],
  declarations: [
    DashboardComponent,
    MacroRegionComponent,
    RegionComponent,
    CityComponent,
    FarmerComponent,
    SupervisorComponent,
    FieldComponent,
  ],
  exports: [TranslateModule],
  providers: [
    UtilService,
  ]
})
export class AdminLayoutModule {}
