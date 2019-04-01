import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/services/utilities.service';
import { PaginationInstance } from 'ngx-pagination';
import { HTTPService } from '../shared/services/http.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {
  public searchText = '';
  public maxResults = [10, 25, 50, 100];
  public resultsPerPage = this.maxResults[0];
  public regionsTable = [
    // {
    //   name: 'Apucarana',
    //   macroregion: 'Macro Noroeste'
    // },
    // {
    //   name: 'Campo Mourão',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Cascavel',
    //   macroregion: 'Macro Oeste'
    // },
    // {
    //   name: 'Cianorte',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Cornélio Procópio',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Curitiba',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Dois Vizinhos',
    //   macroregion: 'Macro Sul'
    // },
    // {
    //   name: 'Francisco Beltrão',
    //   macroregion: 'Macro Sul'
    // },
    // {
    //   name: 'Guarapuava',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Irati',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Ivaiporã',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Laranjeiras do Sul',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Londrina',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Maringá',
    //   macroregion: 'Macro Noroeste'
    // },
    // {
    //   name: 'Paranaguá',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Paranavaí',
    //   macroregion: 'Macro Noroeste'
    // },
    // {
    //   name: 'Pato Branco',
    //   macroregion: 'Macro Sul'
    // },
    // {
    //   name: 'Ponta Grossa',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Sto. Antonio da Platina',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Toledo',
    //   macroregion: 'Macro Norte'
    // },
    // {
    //   name: 'Umuarama',
    //   macroregion: 'Macro Noroeste'
    // },
    // {
    //   name: 'União da Vitória',
    //   macroregion: 'Macro Sul'
    // }
  ];
  public allRegions = this.regionsTable;
  public allFilteredRegions = this.regionsTable;
  public regionsOriginalTable: any = [];
  public tableKeys = ['name', 'macroregion', ''];
  public tableWidth = [150, 200, 200];
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
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
    this.getRegions(1);
    this.searchText = this.activatedRoute.snapshot.params.search
      ? this.activatedRoute.snapshot.params.search
      : '';
  }

  async getRegions(startPage) {
    this.loading = true;

    const startElement = this.resultsPerPage * (startPage - 1);
    const endElement = this.resultsPerPage * startPage;

    await this.utilService.pause(1000);

    this.httpService.get('regions/').subscribe(data => {
      this.regionsTable = data;
      this.allRegions = data;
      this.allFilteredRegions = data;

      this.regionsTable = this.allFilteredRegions.slice(
        startElement,
        endElement
      );

      this.loading = false;
    });
  }

  setSearch(text) {
    this.searchText = text;

    this.keyUp();
  }

  keyUp(event?) {
    this.config.currentPage = 1;
    this.allFilteredRegions = this.allRegions.filter(this.filterContacts, this);
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

  doSelect(number: number) {
    this.config.itemsPerPage = number;
    this.getRegions(1);
  }

  doSelectOptions(ev) {}
}
