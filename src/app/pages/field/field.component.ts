import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../shared/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
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
  public tableKeys = ['name', 'location', 'city.name', 'farmer.name', 'supervisor.name', 'edit'];
  public tableWidth = [150, 100, 200, 200, 200, 100];
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
    private modalService: NgbModal,
    private httpService: HTTPService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.getFields(1);
    this.getCities();
    this.getFarmers();
    this.getSupervisors();
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getFields(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('fields?_expand=city&_expand=farmer&_expand=supervisor').subscribe(data => {
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

  async getCities() {
    this.httpService.get('cities').subscribe(
      data => {
        this.citiesList = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  async getFarmers() {
    this.httpService.get('farmers').subscribe(
      data => {
        this.farmersList = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  async getSupervisors() {
    this.httpService.get('supervisors').subscribe(
      data => {
        this.supervisorsList = data;
      },
      error => {
        console.error(error);
      }
    );
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
    } else {
      this.selectedField[type] = page;
      this.validateInput(type);
    }
  }

  action(event) {
    this.selectedField = { ...event.object };
    this.openModal(this[event.event]);
  }

  openModal(content, newModal?) {
    if (!newModal) {
      Object.keys(this.validFormFields).map(
        key => (this.validFormFields[key] = true)
      );
    }
    this.validForm = !newModal;

    this.selectedField = newModal
      ? { name: '', onSurvey: false }
      : this.selectedField;
    this.modalInstance = this.modalService.open(content, {});
  }

  closeModal() {
    this.modalInstance.close();
  }

  createField() {
    this.httpService.post('fields', this.selectedField).subscribe(
      data => {
        this.getFields(1);
        this.closeModal();
      },
      error => {
        console.error(error);
      }
    );
  }

  updateField() {
    this.httpService
      .put(
        `fields/${this.selectedField.id}`,
        this.selectedField
      )
      .subscribe(
        data => {
          this.getFields(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  deleteField() {
    this.httpService
      .delete(`fields/${this.selectedField.id}`)
      .subscribe(
        data => {
          this.getFields(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  validateInput(param, ev?) {
    if (param === 'name' || param === 'location') {
      if (this.selectedField[param].length >= 5) {
        this.validFormFields[param] = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields[param] = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    } else if (param === 'cityId' || param === 'farmerId' || param === 'supervisorId') {
      if (this.selectedField[param] !== null) {
        this.validFormFields[param] = true;
        // ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields[param] = false;
        // ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    }

    this.validateForm();
  }

  validateForm() {
    if (
      this.validFormFields.name &&
      this.validFormFields.location &&
      this.validFormFields.cityId &&
      this.validFormFields.farmerId &&
      this.validFormFields.supervisorId
    ) {
      this.validForm = true;
    } else {
      this.validForm = false;
    }
  }
}
