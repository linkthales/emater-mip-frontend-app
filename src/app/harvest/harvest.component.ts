import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../shared/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
  styleUrls: ['./harvest.component.scss']
})
export class HarvestComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public harvestsTable = [];
  public validForm = false;
  public validFormFields = { description: false, startDate: false, endDate: false };
  public selectedHarvest: any = {};
  public allHarvests = this.harvestsTable;
  public allFilteredHarvests = this.harvestsTable;
  public harvestsOriginalTable: any = [];
  public tableKeys = ['description', 'startDate', 'endDate', 'edit'];
  public tableWidth = [150, 150, 150, 100];
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
    this.getHarvests(1);
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getHarvests(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('harvests').subscribe(data => {
      this.harvestsTable = data;
      this.allHarvests = data;
      this.allFilteredHarvests = data;

      this.harvestsTable = this.allFilteredHarvests.slice(
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
    this.allFilteredHarvests = this.allHarvests.filter(this.filterHarvests, this);
    this.harvestsTable = this.allFilteredHarvests;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterHarvests(harvests) {
    for (const key in harvests) {
      if (harvests.hasOwnProperty(key)) {
        if (
          this.formatObject(harvests[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in harvests[key]) {
          if (harvests[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(harvests[key][childKey]).includes(
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
    this.getHarvests(pageNumber);
  }

  doSelect(itemsPerPage: number) {
    this.config.itemsPerPage = itemsPerPage;
    this.getHarvests(1);
  }

  action(event) {
    this.selectedHarvest = { ...event.object };
    this.openModal(this[event.event]);
  }

  openModal(content, newModal?) {
    if (!newModal) {
      Object.keys(this.validFormFields).map(
        key => (this.validFormFields[key] = true)
      );
    }
    this.validForm = !newModal;

    this.selectedHarvest = newModal
      ? { description: '', startDate: '', endDate: '' }
      : this.selectedHarvest;
    this.modalInstance = this.modalService.open(content, {});
  }

  closeModal() {
    this.modalInstance.close();
  }

  createHarvest() {
    this.httpService.post('harvests', this.selectedHarvest).subscribe(
      data => {
        this.getHarvests(1);
        this.closeModal();
      },
      error => {
        console.error(error);
      }
    );
  }

  updateHarvest() {
    this.httpService
      .put(
        `harvests/${this.selectedHarvest.id}`,
        this.selectedHarvest
      )
      .subscribe(
        data => {
          this.getHarvests(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  deleteHarvest() {
    this.httpService
      .delete(`harvests/${this.selectedHarvest.id}`)
      .subscribe(
        data => {
          this.getHarvests(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  validateInput(param, ev?) {
    if (param === 'description') {
      if (this.selectedHarvest[param].length >= 5) {
        this.validFormFields.description = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields.description = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    } else if (param === 'startDate') {
      if (this.selectedHarvest[param].length >= 5) {
        this.validFormFields.startDate = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields.startDate = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    } else if (param === 'endDate') {
      if (this.selectedHarvest[param].length >= 5) {
        this.validFormFields.endDate = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields.endDate = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    }

    this.validateForm();
  }

  validateForm() {
    if (this.validFormFields.description && this.validFormFields.startDate && this.validFormFields.endDate) {
      this.validForm = true;
    } else {
      this.validForm = false;
    }
  }
}
