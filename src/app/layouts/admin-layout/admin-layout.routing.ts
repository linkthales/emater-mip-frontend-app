import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { MacroRegionComponent } from '../../pages/macroregion/macroregion.component';
import { RegionComponent } from '../../pages/region/region.component';
import { CityComponent } from '../../pages/city/city.component';
import { FarmerComponent } from '../../pages/farmer/farmer.component';
import { SupervisorComponent } from '../../pages/supervisor/supervisor.component';
import { FieldComponent } from '../../pages/field/field.component';
import { HarvestComponent } from '../../pages/harvest/harvest.component';
import { SurveyFieldRouterComponent } from '../../pages/survey-fields/survey-field-router/survey-field-router.component';
import { SurveyFieldComponent } from '../../pages/survey-fields/survey-field/survey-field.component';
import { SelectFieldComponent } from '../../pages/survey-fields/select-field/select-field.component';
import { FieldFormComponent } from '../../pages/survey-fields/field-form/field-form.component';
import { PestComponent } from '../../pages/pest/pest.component';
import { PestSurveyRouterComponent } from '../../pages/pest-surveys/pest-survey-router/pest-survey-router.component';
import { PestSurveyComponent } from '../../pages/pest-surveys/pest-survey/pest-survey.component';
import { AddSampleComponent } from '../../pages/pest-surveys/add-sample/add-sample.component';
import { ListSamplesComponent } from '../../pages/pest-surveys/list-samples/list-samples.component';

export const AdminLayoutRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'macroregion',
    component: MacroRegionComponent
  },
  {
    path: 'region',
    component: RegionComponent
  },
  {
    path: 'city',
    component: CityComponent
  },
  {
    path: 'farmer',
    component: FarmerComponent
  },
  {
    path: 'supervisor',
    component: SupervisorComponent
  },
  {
    path: 'field',
    component: FieldComponent
  },
  {
    path: 'harvest',
    component: HarvestComponent
  },
  {
    path: 'survey-field',
    component: SurveyFieldRouterComponent,
    children: [
      { path: '', component: SurveyFieldComponent },
      { path: 'select-field', component: SelectFieldComponent },
      { path: 'field-form', component: FieldFormComponent },
    ]
  },
  {
    path: 'pest',
    component: PestComponent
  },
  {
    path: 'pest-survey',
    component: PestSurveyRouterComponent,
    children: [
      { path: '', component: PestSurveyComponent },
      { path: 'add-sample', component: AddSampleComponent },
      { path: 'list-samples', component: ListSamplesComponent },
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
