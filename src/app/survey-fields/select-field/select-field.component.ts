import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../shared/services/http.service';

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public harvestId;
  public fieldsTable = [];
  public citiesList = [];
  public farmersList = [];
  public supervisorsList = [];
  public validForm = false;
  public validFormFields = { name: false, location: false, cityId: false, farmerId: false, supervisorId: false };
  public selectedField: any = {};
  public allFields = this.fieldsTable;
  public allFilteredFields = this.fieldsTable;
  public fieldsOriginalTable: any = [];
  public tableKeys = ['name', 'location', 'city.name', 'farmer.name', 'supervisor.name'];
  public tableWidth = [150, 100, 200, 200, 200];
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: this.maxResults[0],
    currentPage: 1,
    totalItems: 0
  };
  public modalInstance = null;
  public loading = true;
  public user: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HTTPService,
    private utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getFields(1);
    this.harvestId = this.activatedRoute.snapshot.params.harvestId;
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getFields(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('fields?onSurvey=false&_expand=city&_expand=farmer&_expand=supervisor').subscribe(data => {
      this.fieldsTable = data;
      this.allFields = data;
      this.allFilteredFields = data;

      this.fieldsTable = this.allFilteredFields.slice(
        startElement,
        endElement
      );

      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  setSearch(text) {
    this.searchText = text;

    this.keyUp();
  }

  keyUp(event?) {
    this.config.currentPage = 1;
    this.allFilteredFields = this.allFields.filter(this.filterFields, this);
    this.fieldsTable = this.allFilteredFields;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterFields(fields) {
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        if (
          this.formatObject(fields[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in fields[key]) {
          if (fields[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(fields[key][childKey]).includes(
                this.formatText(this.searchText)
              )
            ) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  formatObject(object) {
    const text = String(object).toString();
    return this.formatText(text);
  }

  formatText(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  onPageChange(pageNumber: number) {
    this.config.currentPage = pageNumber;
    this.getFields(pageNumber);
  }

  doSelect(page, type) {
    if (type === 'maxResults') {
      this.config.currentPage = 1;
      this.config.itemsPerPage = page;
      this.getFields(1);
    }
  }

  action(event) {
    this.router.navigate(['/survey-field/field-form', { harvestId: this.harvestId, fieldId: event.object.id }]);
  }
}
