import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../../shared/services/http.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public regionsTable = [];
  public macroregionsList = [];
  public citiesList = [];
  public validForm = false;
  public validFormFields = { name: false, macroregionId: false, cityId: false };
  public selectedRegion: any = {};
  public allRegions = this.regionsTable;
  public allFilteredRegions = this.regionsTable;
  public regionsOriginalTable: any = [];
  public tableKeys = ['name', 'macroregion.name', 'city.name', 'edit'];
  public tableWidth = [150, 200, 100];
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
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.getRegions(1);
    this.getMacroregions();
    this.getCities();
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getRegions(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('regions?_expand=macroregion&_expand=city').subscribe(
      data => {
        this.regionsTable = data;
        this.allRegions = data;
        this.allFilteredRegions = data;

        this.regionsTable = this.allFilteredRegions.slice(
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

  async getMacroregions() {
    this.httpService.get('macroregions').subscribe(
      data => {
        this.macroregionsList = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  async getCities() {
    this.httpService.get('cities').subscribe(
      data => {
        this.citiesList = data;
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
    this.allFilteredRegions = this.allRegions.filter(this.filterRegions, this);
    this.regionsTable = this.allFilteredRegions;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterRegions(regions) {
    for (const key in regions) {
      if (regions.hasOwnProperty(key)) {
        if (
          this.formatObject(regions[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in regions[key]) {
          if (regions[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(regions[key][childKey]).includes(
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
    this.getRegions(pageNumber);
  }

  doSelect(page, type) {
    if (type === 'maxResults') {
      this.config.currentPage = 1;
      this.config.itemsPerPage = page;
      this.getRegions(1);
    } else {
      this.selectedRegion[type] = page;
      this.validateInput(type);
    }
  }

  action(event) {
    this.selectedRegion = { ...event.object, cityId: 1 };
    this.openModal(this[event.event]);
  }

  openModal(content, newModal?) {
    Object.keys(this.validFormFields).map(
      key => (this.validFormFields[key] = !newModal)
    );

    this.validForm = !newModal;

    this.selectedRegion = newModal
      ? { name: '', macroregionId: null, cityId: null }
      : this.selectedRegion;
    this.modalInstance = this.modalService.open(content, {});
  }

  closeModal() {
    this.modalInstance.close();
  }

  createRegion() {
    this.httpService.post('regions', this.selectedRegion).subscribe(
      data => {
        this.getRegions(1);
        this.closeModal();
      },
      error => {
        console.error(error);
      }
    );
  }

  updateRegion() {
    this.httpService
      .put(`regions/${this.selectedRegion.id}`, this.selectedRegion)
      .subscribe(
        data => {
          this.getRegions(1);
          this.closeModal();
        },
        error => {
          console.error(error);
        }
      );
  }

  deleteRegion() {
    this.httpService.delete(`regions/${this.selectedRegion.id}`).subscribe(
      data => {
        this.getRegions(1);
        this.closeModal();
      },
      error => {
        console.error(error);
      }
    );
  }

  validateInput(param, ev?) {
    if (param === 'name') {
      if (this.selectedRegion[param].length >= 5) {
        this.validFormFields.name = true;
        ev.path[1].setAttribute('class', 'form-group has-success');
      } else {
        this.validFormFields.name = false;
        ev.path[1].setAttribute('class', 'form-group has-danger');
      }
    } else if (param === 'macroregionId' || param === 'cityId') {
      if (this.selectedRegion[param] !== null) {
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
      this.validFormFields.macroregionId &&
      this.validFormFields.cityId
    ) {
      this.validForm = true;
    } else {
      this.validForm = false;
    }
  }
}
