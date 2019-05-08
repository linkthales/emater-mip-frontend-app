import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../shared/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-samples',
  templateUrl: './list-samples.component.html',
  styleUrls: ['./list-samples.component.scss']
})
export class ListSamplesComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public pestSurveysTable = [];
  public harvestsList = [];
  public fieldsList = [];
  public surveyFieldId;
  public validForm = true;
  public validFormFields = { harvestId: false };
  public selectedPestSurvey: any = {};
  public allPestSurveys = this.pestSurveysTable;
  public allFilteredPestSurveys = this.pestSurveysTable;
  public pestSurveysOriginalTable: any = [];
  public tableKeys = [];
  public tableWidth = [150, 200, 300, 150, 100];
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
    this.surveyFieldId = this.activatedRoute.snapshot.params.pestSurveyId
    this.getPestSurveys(1);
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getPestSurveys(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get(`survey-fields?id=${this.surveyFieldId}&_expand=harvest&_expand=field&_expand=city&_expand=farmer&_expand=supervisor`).subscribe(
      data => {
        this.pestSurveysTable = data;
        this.allPestSurveys = data;
        this.allFilteredPestSurveys = data;
        console.log(this.pestSurveysTable)

        this.pestSurveysTable = this.allFilteredPestSurveys.slice(
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

  setSearch(text) {
    this.searchText = text;

    this.keyUp();
  }

  keyUp(event?) {
    this.config.currentPage = 1;
    this.allFilteredPestSurveys = this.allPestSurveys.filter(this.filterPestSurveys, this);
    this.pestSurveysTable = this.allFilteredPestSurveys;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterPestSurveys(pestSurveys) {
    for (const key in pestSurveys) {
      if (pestSurveys.hasOwnProperty(key)) {
        if (
          this.formatObject(pestSurveys[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in pestSurveys[key]) {
          if (pestSurveys[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(pestSurveys[key][childKey]).includes(
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
    this.getPestSurveys(pageNumber);
  }

  doSelect(page) {
    this.config.currentPage = 1;
    this.config.itemsPerPage = page;
    this.getPestSurveys(1);
  }

  action(event) {
    if (event.event === 'collect') {
      this.router.navigate(['/pest-survey/add-sample', { pestSurveyId: event.object.id }]);
    } else {
      this.router.navigate(['/pest-survey/list-samples', { pestSurveyId: event.object.id }]);
    }
  }
}
