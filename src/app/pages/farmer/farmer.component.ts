import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../shared/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.scss']
})
export class FarmerComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public farmersTable = [];
  public validForm = false;
  public validFormFields = { name: false };
  public selectedFarmer: any = {};
  public allFarmers = this.farmersTable;
  public allFilteredFarmers = this.farmersTable;
  public farmersOriginalTable: any = [];
  public tableKeys = ['name', 'edit'];
  public tableWidth = [150, 100];
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
    this.getFarmers(1);
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getFarmers(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('farmers').subscribe(data => {
      this.farmersTable = data;
      this.allFarmers = data;
      this.allFilteredFarmers = data;

      this.farmersTable = this.allFilteredFarmers.slice(
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
    this.allFilteredFarmers = this.allFarmers.filter(this.filterFarmers, this);
    this.farmersTable = this.allFilteredFarmers;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterFarmers(farmers) {
    for (const key in farmers) {
      if (farmers.hasOwnProperty(key)) {
        if (
          this.formatObject(farmers[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in farmers[key]) {
          if (farmers[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(farmers[key][childKey]).includes(
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
    this.getFarmers(pageNumber);
  }

  doSelect(itemsPerPage: number) {
    this.config.itemsPerPage = itemsPerPage;
    this.getFarmers(1);
  }

  action(event) {
    this.selectedFarmer = { ...event.object };
    this.openModal(this[event.event]);
  }

  openModal(content, newModal?) {
    if (!newModal) {
      Object.keys(this.validFormFields).map(
        key => (this.validFormFields[key] = true)
      );
    }
    this.validForm = !newModal;

    this.selectedFarmer = newModal
      ? { name: '' }
      : this.selectedFarmer;
    this.modalInstance = this.modalService.open(content, {});
  }

  closeModal() {
    this.modalInstance.close();
  }

  createFarmer() {
    this.httpService.post('farmers', this.selectedFarmer).subscribe(
      data => {
        this.getFarmers(1);
        this.closeModal();
      },
      error => {
        console.error(error);
      }
    );
  }

  updateFarmer() {
    this.httpService
      .put(
        `farmers/${this.selectedFarmer.id}`,
        this.selectedFarmer
      )
      .subscribe(
        data => {
          this.getFarmers(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  deleteFarmer() {
    this.httpService
      .delete(`farmers/${this.selectedFarmer.id}`)
      .subscribe(
        data => {
          this.getFarmers(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  validateInput(param, ev?) {
    if (param === 'name') {
      if (this.selectedFarmer[param].length >= 5) {
        this.validFormFields.name = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields.name = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    }

    this.validateForm();
  }

  validateForm() {
    if (this.validFormFields.name) {
      this.validForm = true;
    } else {
      this.validForm = false;
    }
  }
}
