import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../shared/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-survey-field',
  templateUrl: './survey-field.component.html',
  styleUrls: ['./survey-field.component.scss']
})
export class SurveyFieldComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public surveyFieldsTable = [];
  public harvestsList = [];
  public fieldsList = [];
  public validForm = true;
  public validFormFields = { harvestId: false };
  public selectedSurveyField: any = {};
  public allSurveyFields = this.surveyFieldsTable;
  public allFilteredSurveyFields = this.surveyFieldsTable;
  public surveyFieldsOriginalTable: any = [];
  public tableKeys = ['harvest.description', 'plant', 'rustResistant', 'bt', 'sporeCollector', 'plantDate'];
  public tableWidth = [150, 150, 150, 50, 150, 200, 100];
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: this.maxResults[0],
    currentPage: 1
  };
  public modalInstance = null;
  public loading = true;
  public user: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private httpService: HTTPService,
    private utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getSurveyFields(1);
    this.getHarvests();
    this.getFields();
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getSurveyFields(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('survey-fields?_expand=harvest&_expand=field').subscribe(
      data => {
        this.surveyFieldsTable = data;
        this.allSurveyFields = data;
        this.allFilteredSurveyFields = data;

        this.surveyFieldsTable = this.allFilteredSurveyFields.slice(
          startElement,
          endElement
        );

        this.loading = false;
      },
      error => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  async getHarvests() {
    this.httpService.get('harvests').subscribe(
      data => {
        this.harvestsList = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  async getFields() {
    this.httpService.get('fields').subscribe(
      data => {
        this.fieldsList = data;
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
    this.allFilteredSurveyFields = this.allSurveyFields.filter(this.filterSurveyFields, this);
    this.surveyFieldsTable = this.allFilteredSurveyFields;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterSurveyFields(surveyFields) {
    for (const key in surveyFields) {
      if (surveyFields.hasOwnProperty(key)) {
        if (
          this.formatObject(surveyFields[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in surveyFields[key]) {
          if (surveyFields[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(surveyFields[key][childKey]).includes(
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
    this.getSurveyFields(pageNumber);
  }

  doSelect(page, type) {
    if (type === 'maxResults') {
      this.config.currentPage = 1;
      this.config.itemsPerPage = page;
      this.getSurveyFields(1);
    } else {
      this.selectedSurveyField[type] = page;
      this.validateInput(type)
    }
  }

  action(event) {
    this.selectedSurveyField = { ...event.object, harvestId: this.harvestsList[0].id };
    this.openModal(this[event.event]);
  }

  openModal(content, newModal?) {
    Object.keys(this.validFormFields).map(
      key => (this.validFormFields[key] = !newModal)
    );

    this.validForm = true;

    this.selectedSurveyField = newModal
      ? { harvestId: this.harvestsList[0].id }
      : this.selectedSurveyField;
    this.modalInstance = this.modalService.open(content, {});
  }

  closeModal() {
    this.modalInstance.close();
  }

  createSurveyField() {
    this.closeModal();
    this.router.navigate(['/survey-field/select-field', { harvestId: this.selectedSurveyField.harvestId }]);
  }

  deleteSurveyField() {
    this.httpService.delete(`survey-fields/${this.selectedSurveyField.id}`).subscribe(
      data => {
        this.getSurveyFields(1);
        this.closeModal();
      },
      error => {
        console.error(error);
      }
    );
  }

  validateInput(param, ev?) {
    if (param === 'harvestId') {
      if (this.selectedSurveyField[param] !== null) {
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
      this.validFormFields.harvestId
    ) {
      this.validForm = true;
    } else {
      this.validForm = false;
    }
  }
}
