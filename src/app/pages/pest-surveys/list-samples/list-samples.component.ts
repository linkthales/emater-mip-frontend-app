import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../../shared/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-list-samples',
  templateUrl: './list-samples.component.html',
  styleUrls: ['./list-samples.component.scss']
})
export class ListSamplesComponent implements OnInit {
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public pestSamplesTable = [];
  public surveyFieldId;
  public pestSurvey: any = {};
  public selectedPestSample: any = {};
  public allPestSamples = this.pestSamplesTable;
  public allFilteredPestSamples = this.pestSamplesTable;
  public pestSamplesOriginalTable: any = [];
  public tableKeys = ['collectionDate', 'daysAfterEmergency', 'defoliation', 'stadiumOfCulture', 'sampleActions'];
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
    this.surveyFieldId = this.activatedRoute.snapshot.params.pestSurveyId;
    this.getPestSamples(1);
    this.getPestSurveys();
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getPestSamples(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get(`samples?surveyFieldId=${this.surveyFieldId}&_expand=surveyField`).subscribe(
      data => {
        data = data.map((sample) => {
          sample.daysAfterEmergency = moment(sample.collectionDate).diff(sample.surveyField.emergencyDate, 'days');
          return sample;
        });

        this.pestSamplesTable = data;
        this.allPestSamples = data;
        this.allFilteredPestSamples = data;

        this.pestSamplesTable = this.allFilteredPestSamples.slice(
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

  async getPestSurveys() {
    this.httpService.get(`surveyFields?id=${this.surveyFieldId}&_expand=harvest&_expand=field&_expand=city&_expand=farmer&_expand=supervisor`).subscribe(
      data => {
        this.pestSurvey = data[0];
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

  openModal(content, newModal?) {
    this.modalInstance = this.modalService.open(content, {});
  }

  closeModal() {
    this.modalInstance.close();
  }

  keyUp(event?) {
    this.config.currentPage = 1;
    this.allFilteredPestSamples = this.allPestSamples.filter(this.filterPestSamples, this);
    this.pestSamplesTable = this.allFilteredPestSamples;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterPestSamples(pestSamples) {
    for (const key in pestSamples) {
      if (pestSamples.hasOwnProperty(key)) {
        if (
          this.formatObject(pestSamples[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in pestSamples[key]) {
          if (pestSamples[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(pestSamples[key][childKey]).includes(
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
    this.getPestSamples(pageNumber);
  }

  doSelect(page) {
    this.config.currentPage = 1;
    this.config.itemsPerPage = page;
    this.getPestSamples(1);
  }

  deleteSample() {
    this.httpService.delete(`samples/${this.selectedPestSample.id}`).subscribe(
      data => {
        this.getPestSamples(1);
        this.closeModal();
      },
      error => {
        console.error(error);
      }
    );
  }

  action(event) {
    if (event.event === 'details') {
      // this.router.navigate(['/pest-survey/add-sample', { pestSampleId: event.object.id }]);
    } else {
      this.selectedPestSample = { ...event.object };
      this.openModal(this[event.event]);
    }
  }
}
