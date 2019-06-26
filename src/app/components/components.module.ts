import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FormatHourPipe } from '../shared/pipes/format-hour.pipe';
import { FormatDatePipe } from '../shared/pipes/format-date.pipe';
// import { PhoneMaskPipe } from '../shared/pipes/phone-mask.pipe';
// import { CPFMaskPipe } from '../shared/pipes/cpf-mask.pipe';

import { CardComponent } from './card/card.component';
import { LoadingComponent } from './loading/loading.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TableComponent } from './table/table.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgxDatatableModule,
    TranslateModule,
    FormsModule,
  ],
  declarations: [
    CardComponent,
    LoadingComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    FormatHourPipe,
    FormatDatePipe,
    // PhoneMaskPipe,
    // CPFMaskPipe,
  ],
  exports: [
    CardComponent,
    LoadingComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    FormatHourPipe,
    FormatDatePipe,
    // PhoneMaskPipe,
    // CPFMaskPipe,
  ]
})
export class ComponentsModule {}
