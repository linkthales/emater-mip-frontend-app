import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../shared/services/http.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public citiesTable = [];
  public allCities = this.citiesTable;
  public allFilteredCities = this.citiesTable;
  public citiesOriginalTable: any = [];
  public tableKeys = ['name', 'region.name', 'macroregion.name', 'edit'];
  public tableWidth = [150, 200, 200, 100];
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
    this.getCities(1);
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getCities(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    
    await this.utilService.pause(1000);
    
    this.httpService.get('cities?_expand=region&_expand=macroregion').subscribe(data => {
      this.citiesTable = data;
      this.allCities = data;
      this.allFilteredCities = data;
      
      this.citiesTable = this.allFilteredCities.slice(startElement, endElement);

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
    this.allFilteredCities = this.allCities.filter(this.filterCities, this);
    this.citiesTable = this.allFilteredCities;

    this.resizeTable();
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }

  filterCities(cities) {
    for (const key in cities) {
      if (cities.hasOwnProperty(key)) {
        if (
          this.formatObject(cities[key]).includes(
            this.formatText(this.searchText)
          )
        ) {
          return true;
        }
        for (const childKey in cities[key]) {
          if (cities[key].hasOwnProperty(childKey)) {
            if (
              this.formatObject(cities[key][childKey]).includes(
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
    this.getCities(pageNumber);
  }

  doSelect(itemsPerPage: number) {
    this.config.itemsPerPage = itemsPerPage;
    this.getCities(1);
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
