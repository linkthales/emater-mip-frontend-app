import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { MacroRegionComponent } from '../../macroregion/macroregion.component';
import { RegionComponent } from '../../region/region.component';
import { CityComponent } from '../../city/city.component';
import { FarmerComponent } from '../../farmer/farmer.component';
import { SupervisorComponent } from '../../supervisor/supervisor.component';
import { FieldComponent } from '../../field/field.component';

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
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
