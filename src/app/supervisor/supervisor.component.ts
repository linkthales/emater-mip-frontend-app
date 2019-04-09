import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../shared/services/http.service';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.scss']
})
export class SupervisorComponent implements OnInit {
  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public supervisorsTable = [];
  public allSupervisors = this.supervisorsTable;
  public allFilteredSupervisors = this.supervisorsTable;
  public supervisorsOriginalTable: any = [];
  public tableKeys = ['name', 'email', 'edit'];
  public tableWidth = [200, 200, 100];
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
    this.getSupervisors(1);
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getSupervisors(startPage) {
    this.loading = true;

    const startElement = this.config.itemsPerPage * (startPage - 1);
    const endElement = this.config.itemsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('supervisors').subscribe(data => {
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

  doSelect(itemsPerPage: number) {
    this.config.itemsPerPage = itemsPerPage;
    this.getSupervisors(1);
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
