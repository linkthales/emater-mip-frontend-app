import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public resultsPerPage = this.maxResults[0];
  public fieldsTable = [
    {
      name: 'Bertoldo',
      location: '1',
      city: 'Pato Branco',
      farmer: 'Maurílio Bertoldo',
      supervisor: 'José Francisco Vilas Boas',
    },
    {
      name: 'Carnieletto',
      location: '',
      city: 'Pato Branco',
      farmer: 'Clemente Carnieletto',
      supervisor: 'Vilmar Grando',
    },
    {
      name: 'MIP e MID',
      location: '',
      city: 'Mariópolis',
      farmer: 'Luiz Arcangelo Giordani',
      supervisor: 'Ivanderson Borelli',
    },
    {
      name: 'Oldoni',
      location: '',
      city: 'Pato Branco',
      farmer: 'Rafael Oldoni',
      supervisor: 'Vilmar Grando',
    },
    {
      name: 'Trevo',
      location: '',
      city: `Itapejara D'Oeste`,
      farmer: 'Gilson Dariva',
      supervisor: 'Lari Maroli',
    },
  ];
  public allFields = this.fieldsTable;
  public allFilteredFields = this.fieldsTable;
  public fieldsOriginalTable: any = [];
  // public fieldsColumns: any = [
  //   {
  //     title: 'Nome',
  //     dataKey: 'name',
  //     width: 150
  //   },
  //   {
  //     title: 'Localização',
  //     dataKey: 'location',
  //     width: 200
  //   },
  //   {
  //     title: 'Município',
  //     dataKey: 'city',
  //     width: 200
  //   },
  //   {
  //     title: 'Produtor',
  //     dataKey: 'farmer',
  //     width: 200
  //   },
  //   {
  //     title: 'Responsável Técnico',
  //     dataKey: 'supervisor',
  //     width: 200
  //   },
  //   {
  //     title: 'Ações',
  //     dataKey: '',
  //     width: 200
  //   }
  // ];
  public tableKeys = ['name', 'location', 'city', 'farmer', 'supervisor', ''];
  public tableWidth = [150, 200, 200, 200, 200, 200];
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

    this.fieldsTable = this.allFilteredFields.slice(startElement, endElement);
  }

  setSearch(text) {
    this.searchText = text;

    this.keyUp();
  }

  keyUp(event?) {
    this.config.currentPage = 1;
    this.allFilteredFields = this.allFields.filter(this.filterContacts, this);
    this.fieldsTable = this.allFilteredFields;

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
