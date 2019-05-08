import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../shared/services/http.service';

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
  public validForm = false;
  public validFormFields = { name: false, location: false, cityId: false, farmerId: false, supervisorId: false };
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
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.surveyFieldId = this.activatedRoute.snapshot.params.pestSurveyId
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
        console.log(this.pestsTable);

        this.loading = false;
      },
      error => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  validateInput(param, ev?) {
    // if (param === 'name' || param === 'location') {
    //   if (this.selectedField[param].length >= 5) {
    //     this.validFormFields[param] = true;
    //     ev.path[1].setAttribute('class', 'form-group has-success');
    //   } else {
    //     this.validFormFields[param] = false;
    //     ev.path[1].setAttribute('class', 'form-group has-danger');
    //   }
    // } else if (param === 'cityId' || param === 'farmerId' || param === 'supervisorId') {
    //   if (this.selectedField[param] !== null) {
    //     this.validFormFields[param] = true;
    //     // ev.path[1].setAttribute('class', 'form-group has-success');
    //   } else {
    //     this.validFormFields[param] = false;
    //     // ev.path[1].setAttribute('class', 'form-group has-danger');
    //   }
    // }

    // this.validateForm();
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
