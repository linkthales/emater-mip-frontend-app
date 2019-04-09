import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../shared/services/http.service';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.scss']
})
export class FarmerComponent implements OnInit {
  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public farmersTable = [];
  public allFarmers = this.farmersTable;
  public allFilteredFarmers = this.farmersTable;
  public farmersOriginalTable: any = [];
  public tableKeys = ['name', 'edit'];
  public tableWidth = [150, 100];
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: this.maxResults[0],
    currentPage: 1
  };
  public loading = true;
  public user: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
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

  doSelectOptions(ev) {}

  action(event) {
    if (event === 'edit') {
      console.log(event);
    } else {
      console.log(event);
    }
  }
}
