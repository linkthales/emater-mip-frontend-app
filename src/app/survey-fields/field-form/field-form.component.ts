import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { HTTPService } from '../../shared/services/http.service';

@Component({
  selector: 'app-field-form',
  templateUrl: './field-form.component.html',
  styleUrls: ['./field-form.component.scss']
})
export class FieldFormComponent implements OnInit {
  @ViewChild('tabs') myTabs: any;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public harvest: any;
  public field: any;
  public harvestId;
  public fieldId;
  public fieldForm: any = {};
  public validForm = false;
  public validFormFields = {
    plant: false,
    unitArea: false,
    totalCultivatedArea: false,
    plantPerMeter: false,
    latitude: false,
    longitude: false,
    unitProductivity: false,
    totalProductivity: false,
    plantDate: false,
    emergencyDate: false,
    harvestDate: false
  };
  public modalInstance = null;
  public firstStep = true;
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
    this.harvestId = this.activatedRoute.snapshot.params.harvestId;
    this.fieldId = this.activatedRoute.snapshot.params.fieldId;
    this.getHarvests();
    this.getFields();
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getHarvests() {
    this.loading = true;

    await this.utilService.pause(1000);

    this.httpService.get(`harvests?id=${this.harvestId}`).subscribe(
      data => {
        this.harvest = data[0];

        this.loading = false;
      },
      error => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  async getFields() {
    this.loading = true;

    await this.utilService.pause(1000);

    this.httpService
      .get(`fields?id=${this.fieldId}&_expand=city&_expand=farmer`)
      .subscribe(
        data => {
          this.field = data[0];

          this.loading = false;
        },
        error => {
          console.error(error);
          this.loading = false;
        }
      );
  }

  checkItem(ev, key) {
    this.fieldForm[key] = ev.target.checked;
  }

  validateInput(param, ev?) {
    if (
      param === 'plant' ||
      param === 'plantDate' ||
      param === 'emergencyDate' ||
      param === 'harvestDate'
    ) {
      if (this.fieldForm[param].length) {
        this.validFormFields[param] = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields[param] = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    } else if (
      param === 'unitArea' ||
      param === 'totalCultivatedArea' ||
      param === 'plantPerMeter' ||
      param === 'latitude' ||
      param === 'longitude' ||
      param === 'unitProductivity' ||
      param === 'totalProductivity' ||
      param === 'totalCultivatedArea' ||
      param === 'totalCultivatedArea' ||
      param === 'plantPerMeter'
    ) {
      if (this.fieldForm[param] !== null) {
        this.validFormFields[param] = true;
      } else {
        this.validFormFields[param] = false;
      }
    }

    this.validateForm();
  }

  validateForm() {
    console.log(this.validFormFields);

    if (
      this.validFormFields.plant &&
      this.validFormFields.unitArea &&
      this.validFormFields.totalCultivatedArea &&
      this.validFormFields.plantPerMeter &&
      this.validFormFields.latitude &&
      this.validFormFields.longitude &&
      this.validFormFields.unitProductivity &&
      this.validFormFields.totalProductivity &&
      this.validFormFields.plantDate &&
      this.validFormFields.emergencyDate &&
      this.validFormFields.harvestDate
    ) {
      this.validForm = true;
    } else {
      this.validForm = false;
    }
  }

  buttonAction(action) {
    let currentId = this.myTabs.activeId.substr(-1);

    if (action === 'saveSurveyField') {
      this.saveSurveyField();
    } else if (action === 'next') {
      this.myTabs.select(`tab-selectbyid${++currentId}`);
    } else {
      this.myTabs.select(`tab-selectbyid${--currentId}`);
    }
  }

  checkStep(tabs) {
    if (tabs.nextId === 'tab-selectbyid1') {
      this.firstStep = true;
      this.lastStep = false;
    } else if (tabs.nextId === 'tab-selectbyid4') {
      this.firstStep = false;
      this.lastStep = true;
    } else {
      this.firstStep = false;
      this.lastStep = false;
    }
  }

  async saveSurveyField() {
    await this.utilService.pause(1000);

    this.fieldForm = {
      ...this.fieldForm,
      harvestId: this.harvestId,
      fieldId: this.fieldId,
      cityId: this.field.cityId,
      farmerId: this.field.farmerId,
      supervisorId: this.field.supervisorId
    };

    this.field.onSurvey = true;

    this.httpService.post(`surveyFields`, this.fieldForm).subscribe(
      data => {
      },
      error => {
        console.error(error);
      }
    );

    this.httpService.put(`fields/${this.fieldId}`, this.field).subscribe(
      data => {
        this.router.navigate(['/survey-field']);
      },
      error => {
        console.error(error);
      }
    );
  }
}
