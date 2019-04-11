import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { HTTPService } from '../shared/services/http.service';
import { UtilService } from '../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-macroregion',
  templateUrl: './macroregion.component.html',
  styleUrls: ['./macroregion.component.scss']
})
export class MacroRegionComponent implements OnInit {
  @ViewChild('edit') edit: ElementRef;
  @ViewChild('delete') delete: ElementRef;

  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public macroregionsTable = [];
  public validForm = false;
  public validFormFields = {name: false};
  public allMacroregions = this.macroregionsTable;
  public allFilteredMacroregions = this.macroregionsTable;
  public selectedMacroregion: any = {};
  public macroregionsOriginalTable: any = [];
  public tableKeys = ['name', 'edit'];
  public tableWidth = [150, 100];
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: this.maxResults[0],
    currentPage: 1,
    totalItems: 25
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
    this.getMacroregions(1);
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getMacroregions(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('macroregions').subscribe(data => {
      this.macroregionsTable = data;
      this.allMacroregions = data;
      this.allFilteredMacroregions = data;

      this.macroregionsTable = this.allFilteredMacroregions.slice(
        startElement,
        endElement
      );

      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  setSearch(text) {
    this.searchText = text;

    this.keyUp();
  }

  keyUp(event?) {
    this.config.currentPage = 1;
    this.allFilteredMacroregions = this.allMacroregions.filter(
      this.filterMacroregions,
      this
    );
    this.macroregionsTable = this.allFilteredMacroregions;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterMacroregions(macroregions) {
    for (const key in macroregions) {
      if (macroregions.hasOwnProperty(key)) {
        if (
          this.formatObject(macroregions[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in macroregions[key]) {
          if (macroregions[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(macroregions[key][childKey]).includes(
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
    this.getMacroregions(pageNumber);
  }

  doSelect(itemsPerPage: number) {
    this.config.itemsPerPage = itemsPerPage;
    this.getMacroregions(1);
  }

  doSelectOptions(ev) {}

  openModal(content, newModal?) {
    this.selectedMacroregion = newModal ? {name: ''} : this.selectedMacroregion;
    this.modalInstance = this.modalService.open(content, {});
  }

  closeModal() {
    this.modalInstance.close();
  }

  createMacroregion() {
    this.httpService.post('macroregions', this.selectedMacroregion).subscribe(data => {
      this.getMacroregions(1);
      this.closeModal();
    }, error => {
      console.error(error);
    });
  }

  updateMacroregion() {
    this.httpService.put(`macroregions/${this.selectedMacroregion.id}`, this.selectedMacroregion).subscribe(data => {
      this.getMacroregions(1);
      this.closeModal();
    }, error => {
      console.error(error);
    });
  }
  
  deleteMacroregion() {
    this.httpService.delete(`macroregions/${this.selectedMacroregion.id}`).subscribe(data => {
      this.getMacroregions(1);
      this.closeModal();
    }, error => {
      console.error(error);
    });
  }

  action(event) {
    this.selectedMacroregion = { ...event.object };
    this.openModal(this[event.event]);
  }

  validateInput(param, ev?) {
    if (param === 'name') {
      if(this.selectedMacroregion[param].length >= 5) {
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
