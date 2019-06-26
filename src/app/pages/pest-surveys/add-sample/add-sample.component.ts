import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-add-sample',
  templateUrl: './add-sample.component.html',
  styleUrls: ['./add-sample.component.scss']
})
export class AddSampleComponent implements OnInit {
  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public stadiumOfCulture = ['V1', 'V5', 'R2'];
  public pestsTable = [];
  public fieldsTable = [];
  public surveyFieldId;
  public sampleForm: any = {};
  public validForm = false;
  public validFormFields = { collectionDate: false, stadiumOfCulture: true, defoliation: false };
  public lastStep = false;
  public loading = true;
  public user: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpService: HTTPService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.surveyFieldId = this.activatedRoute.snapshot.params.pestSurveyId;
    this.sampleForm.surveyFieldId = this.surveyFieldId;
    this.sampleForm.stadiumOfCulture = this.stadiumOfCulture[0];
    this.getPests();
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getPests() {
    this.loading = true;

    await this.utilService.pause(1000);

    this.httpService.get(`pests`).subscribe(
      data => {
        this.pestsTable = data;
        this.sampleForm.pestList = {};
        this.pestsTable.map(pest => {
          this.sampleForm.pestList[pest.id] = { average: 0.0 };
        });

        this.loading = false;
      },
      error => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  doSelect(stadiumOfCulture, param) {
    this.sampleForm[param] = stadiumOfCulture;
    this.validateInput(param);
  }

  validateInput(param, ev?) {
    if (param === 'collectionDate') {
      if (this.sampleForm[param].length) {
        this.validFormFields[param] = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields[param] = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    } else if (param === 'stadiumOfCulture' || param === 'defoliation') {
      if (this.sampleForm[param] !== null) {
        this.validFormFields[param] = true;
      } else {
        this.validFormFields[param] = false;
      }
    }

    this.validateForm();
  }

  validateForm() {
    if (
      this.validFormFields.collectionDate &&
      this.validFormFields.stadiumOfCulture &&
      this.validFormFields.defoliation
    ) {
      this.validForm = true;
    } else {
      this.validForm = false;
    }
  }

  buttonAction(action) {
    if(action === 'saveSample') {
      this.saveSample();
    } else if (action === 'next') {
      this.lastStep = true;
    } else {
      this.lastStep = false;
    }
  }

  async saveSample() {
    await this.utilService.pause(1000);

    this.httpService.post(`samples`, this.sampleForm).subscribe(
      data => {
        this.router.navigate(['/pest-survey']);
      },
      error => {
        console.error(error);
      }
    );
  }
}
