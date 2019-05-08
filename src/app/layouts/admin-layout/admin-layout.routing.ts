import { Routes } from '@angular/router';

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
