import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../shared/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.scss']
})
export class SupervisorComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public supervisorsTable = [];
  public regionsList = [];
  public validForm = false;
  public validFormFields = { name: false, email: false, regionId: false };
  public selectedSupervisor: any = {};
  public allSupervisors = this.supervisorsTable;
  public allFilteredSupervisors = this.supervisorsTable;
  public supervisorsOriginalTable: any = [];
  public tableKeys = ['name', 'email', 'region.name', 'edit'];
  public tableWidth = [200, 200, 200, 100];
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
    this.getSupervisors(1);
    this.getRegions();
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getSupervisors(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('supervisors?_expand=region').subscribe(data => {
      this.supervisorsTable = data;
      this.allSupervisors = data;
      this.allFilteredSupervisors = data;

      this.supervisorsTable = this.allFilteredSupervisors.slice(
        startElement,
        endElement
      );

      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  async getRegions() {
    this.httpService.get('regions').subscribe(
      data => {
        this.regionsList = data;
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
    this.allFilteredSupervisors = this.allSupervisors.filter(this.filterSupervisors, this);
    this.supervisorsTable = this.allFilteredSupervisors;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterSupervisors(supervisors) {
    for (const key in supervisors) {
      if (supervisors.hasOwnProperty(key)) {
        if (
          this.formatObject(supervisors[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in supervisors[key]) {
          if (supervisors[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(supervisors[key][childKey]).includes(
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
    this.getSupervisors(pageNumber);
  }

  doSelect(page, type) {
    if (type === 'maxResults') {
      this.config.currentPage = 1;
      this.config.itemsPerPage = page;
      this.getSupervisors(1);
    } else {
      this.selectedSupervisor[type] = page;
      this.validateInput(type);
    }
  }

  action(event) {
    this.selectedSupervisor = { ...event.object };
    this.openModal(this[event.event]);
  }

  openModal(content, newModal?) {
    if (!newModal) {
      Object.keys(this.validFormFields).map(
        key => (this.validFormFields[key] = true)
      );
    }
    this.validForm = !newModal;

    this.selectedSupervisor = newModal
      ? { name: '' }
      : this.selectedSupervisor;
    this.modalInstance = this.modalService.open(content, {});
  }

  closeModal() {
    this.modalInstance.close();
  }

  createSupervisor() {
    this.httpService.post('supervisors', this.selectedSupervisor).subscribe(
      data => {
        this.getSupervisors(1);
        this.closeModal();
      },
      error => {
        console.error(error);
      }
    );
  }

  updateSupervisor() {
    this.httpService
      .put(
        `supervisors/${this.selectedSupervisor.id}`,
        this.selectedSupervisor
      )
      .subscribe(
        data => {
          this.getSupervisors(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  deleteSupervisor() {
    this.httpService
      .delete(`supervisors/${this.selectedSupervisor.id}`)
      .subscribe(
        data => {
          this.getSupervisors(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  validateInput(param, ev?) {
    if (param === 'name') {
      if (this.selectedSupervisor[param].length >= 5) {
        this.validFormFields.name = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields.name = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    } else if (param === 'email' || param === 'regionId') {
      if (this.selectedSupervisor[param] !== null) {
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
      this.validFormFields.email &&
      this.validFormFields.regionId
    ) {
      this.validForm = true;
    } else {
      this.validForm = false;
    }
  }
}
