import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { HarvestComponent } from '../../harvest/harvest.component';
import { SurveyFieldRouterComponent } from '../../survey-fields/survey-field-router/survey-field-router.component';
import { SurveyFieldComponent } from '../../survey-fields/survey-field/survey-field.component';
import { SelectFieldComponent } from '../../survey-fields/select-field/select-field.component';
import { FieldFormComponent } from '../../survey-fields/field-form/field-form.component';
import { PestComponent } from '../../pest/pest.component';
import { PestSurveyRouterComponent } from '../../pest-surveys/pest-survey-router/pest-survey-router.component';
import { PestSurveyComponent } from '../../pest-surveys/pest-survey/pest-survey.component';
import { AddSampleComponent } from '../../pest-surveys/add-sample/add-sample.component';
import { ListSamplesComponent } from '../../pest-surveys/list-samples/list-samples.component';

import { HTTPService } from '../../shared/services/http.service';
import { UtilService } from '../../shared/services/utilities.service';

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
    HarvestComponent,
    SurveyFieldRouterComponent,
    SurveyFieldComponent,
    SelectFieldComponent,
    FieldFormComponent,
    PestComponent,
    PestSurveyRouterComponent,
    PestSurveyComponent,
    AddSampleComponent,
    ListSamplesComponent,
  ],
  exports: [TranslateModule],
  providers: [
    HTTPService,
    UtilService,
  ]
})
export class AdminLayoutModule {}
