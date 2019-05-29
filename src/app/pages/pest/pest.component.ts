import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../shared/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pest',
  templateUrl: './pest.component.html',
  styleUrls: ['./pest.component.scss']
})
export class PestComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public pestsTable = [];
  public validForm = false;
  public validFormFields = { name: false, scientificName: false, size: false };
  public selectedPest: any = {};
  public allPests = this.pestsTable;
  public allFilteredPests = this.pestsTable;
  public pestsOriginalTable: any = [];
  public pestSizesList = ['> 15cm', '< 15cm', '3. ao 5. Instar', 'Adultos']
  public tableKeys = ['name', 'scientificName', 'size', 'edit'];
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
    this.getPests(1);
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getPests(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('pests').subscribe(data => {
      this.pestsTable = data;
      this.allPests = data;
      this.allFilteredPests = data;

      this.pestsTable = this.allFilteredPests.slice(
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
    this.allFilteredPests = this.allPests.filter(this.filterPests, this);
    this.pestsTable = this.allFilteredPests;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterPests(pests) {
    for (const key in pests) {
      if (pests.hasOwnProperty(key)) {
        if (
          this.formatObject(pests[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in pests[key]) {
          if (pests[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(pests[key][childKey]).includes(
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
    this.getPests(pageNumber);
  }

  doSelect(page, type) {
    if (type === 'maxResults') {
      this.config.currentPage = 1;
      this.config.itemsPerPage = page;
      this.getPests(1);
    } else {
      this.selectedPest[type] = page;
      this.validateInput(type);
    }
  }

  action(event) {
    this.selectedPest = { ...event.object };
    this.openModal(this[event.event]);
  }

  openModal(content, newModal?) {
    if (!newModal) {
      Object.keys(this.validFormFields).map(
        key => (this.validFormFields[key] = true)
      );
    }
    this.validForm = !newModal;

    this.selectedPest = newModal
      ? { name: '', scientificName: '', size: '> 15cm' }
      : this.selectedPest;
    this.modalInstance = this.modalService.open(content, {});
  }

  closeModal() {
    this.modalInstance.close();
  }

  createPest() {
    this.httpService.post('pests', this.selectedPest).subscribe(
      data => {
        this.getPests(1);
        this.closeModal();
      },
      error => {
        console.error(error);
      }
    );
  }

  updatePest() {
    this.httpService
      .put(
        `pests/${this.selectedPest.id}`,
        this.selectedPest
      )
      .subscribe(
        data => {
          this.getPests(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  deletePest() {
    this.httpService
      .delete(`pests/${this.selectedPest.id}`)
      .subscribe(
        data => {
          this.getPests(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  validateInput(param, ev?) {
    if (param === 'name') {
      if (this.selectedPest[param].length >= 5) {
        this.validFormFields.name = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields.name = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    } else if (param === 'scientificName') {
      if (this.selectedPest[param].length >= 5) {
        this.validFormFields.scientificName = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields.scientificName = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    } else if (param === 'size') {
      if (this.selectedPest[param] !== null) {
        this.validFormFields[param] = true;
      } else {
        this.validFormFields[param] = false;
      }
    }

    this.validateForm();
  }

  validateForm() {
    if (this.validFormFields.name && this.validFormFields.scientificName && this.validFormFields.size) {
      this.validForm = true;
    } else {
      this.validForm = false;
    }
  }
}
