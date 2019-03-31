import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.scss']
})
export class FarmerComponent implements OnInit {
  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public resultsPerPage = this.maxResults[0];
  public farmersTable = [
    {
      name: 'Clemente Carnieletto'
    },
    {
      name: 'Gilson Dariva'
    },
    {
      name: 'Luiz Arcangelo Giordani'
    },
    {
      name: 'Maurílio Bertoldo'
    },
    {
      name: 'Rafael Oldoni'
    }
  ];
  public allFarmers = this.farmersTable;
  public allFilteredFarmers = this.farmersTable;
  public farmersOriginalTable: any = [];
  // public farmersColumns: any = [
  //   {
  //     title: 'Nome',
  //     dataKey: 'name',
  //     width: 150
  //   },
  //   {
  //     title: 'Ações',
  //     dataKey: '',
  //     width: 200
  //   }
  // ];
  public tableKeys = ['name', ''];
  public tableWidth = [150, 200];
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };
  public loading = true;
  public user: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private notifyService: UtilService
  ) {}

  ngOnInit() {
    this.getRegions(1);
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  getRegions(startPage) {
    this.loading = false;

    const startElement = this.resultsPerPage * (startPage - 1);
    const endElement = this.resultsPerPage * startPage;

    this.farmersTable = this.allFilteredFarmers.slice(startElement, endElement);
  }

  setSearch(text) {
    this.searchText = text;

    this.keyUp();
  }

  keyUp(event?) {
    this.config.currentPage = 1;
    this.allFilteredFarmers = this.allFarmers.filter(this.filterContacts, this);
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

  filterContacts(regions) {
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

  onPageChange(number: number) {
    this.config.currentPage = number;
    this.getRegions(number);
  }

  doSelect(ev) {}

  doSelectOptions(ev) {}
}
