import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../shared/services/utilities.service';
import { TranslateService } from '@ngx-translate/core';

export class Chart {
  type: string;
  data: Array<any>;
  options: any;
  labels: Array<any>;
  colors: Array<any>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public loading = true;
  public cards = [{
    title: `UR's Cadastradas`,
    icon: 'home',
    quantity: 5,
    button: 'Criar nova UR',
  }, {
    title: `UR's na Pesquisa Atual`,
    icon: 'assignment',
    quantity: 5,
    button: 'Adicionar UR à Pesquisa',
  }, {
    title: `Amostras coletadas`,
    icon: 'list',
    quantity: 25,
    button: 'Coletar amostra',
  }, {
    title: `Pragas registradas`,
    icon: 'bug_report',
    quantity: 7,
    button: 'Observar evolução das pragas',
  }];

  constructor(
    private utilService: UtilService,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.setupCharts();
    this.loadData();

    // this.testData();
  }

  async loadData() {
    const chartsPromise = this.loadCharts();
    const cardsPromise = this.loadCards();

    await this.utilService.pause(3000);
    this.loading = false;
    // Promise.all([chartsPromise, cardsPromise])
    //   .then(() => {
    //     this.loading = false;
    //   })
    //   .catch(error => {
    //     this.loading = false;
    //     this.utilService.notify('Falha ao conectar no servidor!', 'error');
    //     console.error(error);
    //   });
  }

  loadCharts() {
    const mainChartPromise = new Promise((resolve, reject) => {
      // this.leadApi.getLeadsPerMonth().subscribe(
      //   leads => {
      //     this.mainChart.data[0].data = leads.data;
      //     this.mainChart.labels = leads.label;
      //     resolve();
      //   },
      //   error => {
      //     reject(error);
      //   }
      // );
    });

    const chatsByMonthChartPromise = new Promise((resolve, reject) => {
      // this.chatCounterApi.getChatsPerMonth().subscribe(
      //   chatCounter => {
      //     this.chatsByMonthChart.data[0].data = chatCounter.data;
      //     this.chatsByMonthChart.labels = chatCounter.label;
      //     resolve();
      //   },
      //   error => {
      //     reject(error);
      //   }
      // );
    });

    const contactsStatusChartPromise = new Promise((resolve, reject) => {
      // this.leadApi.getFunnelChart().subscribe(
      //   funnelChart => {
      //     this.leadTotal = funnelChart.data[0];
      //     this.contactsStatusChart.data[0].data = funnelChart.data;
      //     this.contactsStatusChart.labels = funnelChart.label;
      //     resolve();
      //   },
      //   error => {
      //     reject(error);
      //   }
      // );
    });

    const chatsByDayChartPromise = new Promise((resolve, reject) => {
      // this.chatCounterApi.getChatsPerDay().subscribe(
      //   chatCounter => {
      //     this.chatsByDayChart.data[0].data = chatCounter.data;
      //     this.chatsByDayChart.labels = chatCounter.label;
      //     resolve();
      //   },
      //   error => {
      //     reject(error);
      //   }
      // );
    });

    return Promise.all([
      mainChartPromise,
      chatsByMonthChartPromise,
      contactsStatusChartPromise,
      chatsByDayChartPromise
    ]);
  }

  loadCards() {
    const serviceTimePromise = new Promise((resolve, reject) => {
      // this.chatApi.getAverageServiceTime().subscribe(
      //   serviceTime => {
      //     this.serviceTime = serviceTime ? serviceTime.toFixed(1) : '';
      //     resolve();
      //   },
      //   error => {
      //     reject(error);
      //   }
      // );
    });

    const responseTimePromise = new Promise((resolve, reject) => {
      // this.chatApi.getAverageResponseTime().subscribe(
      //   responseTime => {
      //     this.responseTime = responseTime ? responseTime.toFixed(1) : '';
      //     resolve();
      //   },
      //   error => {
      //     reject(error);
      //   }
      // );
    });

    return Promise.all([serviceTimePromise, responseTimePromise]);
  }

  createBaseChart(type, options?) {
    const chart = new Chart();

    options = this.setOptions(options);
    chart.data = this.setChartData(options.size);
    chart.options = this.setChartOptions(type, options);
    chart.type = type;

    return chart;
  }

  setOptions(options) {
    if (options) {
      options = {
        labelX: typeof options.labelX !== 'undefined' ? options.labelX : true,
        labelY: typeof options.labelY !== 'undefined' ? options.labelY : true,
        dataLabel:
          typeof options.dataLabel !== 'undefined' ? options.dataLabel : false,
        padLeft: typeof options.padLeft !== 'undefined' ? options.padLeft : 0,
        padRight:
          typeof options.padRight !== 'undefined' ? options.padRight : 0,
        padTop: typeof options.padTop !== 'undefined' ? options.padTop : 0,
        padBottom:
          typeof options.padBottom !== 'undefined' ? options.padBottom : 0,
        size: options.size ? options.size : 1,
        negative: options.negative ? options.negative : false
      };
    } else {
      options = {
        labelX: true,
        labelY: true,
        dataLabel: false,
        size: 1,
        negative: false,
        padLeft: 0,
        padRight: 0,
        padTop: 0,
        padBottom: 0
      };
    }

    return options;
  }

  setChartData(size) {
    const data = [];

    for (let i = 0; i < size; i++) {
      data.push({
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        borderWidth: 2
      });
    }

    return data;
  }

  setChartOptions(type, options) {
    const chartOptions: any = {
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
        fillStyle: '#FFF',
        display: true,
        onClick: e => e.stopPropagation()
      },
      responsive: true,
      scales: {
        xAxes: [
          {
            ticks: {
              display: options.labelX
            },
            gridLines: {
              zeroLineColor: 'transparent',
              drawTicks: options.labelX,
              display: options.labelX,
              drawBorder: options.labelX
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              display: options.labelY
            },
            gridLines: {
              zeroLineColor: 'transparent',
              drawTicks: options.labelY,
              display: options.labelY,
              drawBorder: options.labelY
            }
          }
        ]
      },
      layout: {
        padding: {
          left: options.padLeft,
          right: options.padRight,
          top: options.padTop,
          bottom: options.padBottom
        }
      },
      plugins: {
        datalabels: {
          display: options.dataLabel,
          backgroundColor: function(context) {
            return context.dataset.backgroundColor;
          },
          borderColor: 'white',
          borderRadius: 25,
          borderWidth: 2,
          color: 'white',
          font: {
            weight: 'bold'
          },
          formatter: Math.round
        }
      }
    };

    if (type !== 'funnel') {
      chartOptions.tooltips = {
        bodySpacing: 4,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest',
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      };
    } else {
      chartOptions.sort = 'desc';
    }

    if (options.negative) {
      chartOptions.tooltips = {
        backgroundColor: '#fff',
        titleFontColor: '#333',
        bodyFontColor: '#666'
      };

      chartOptions.scales.xAxes = [
        {
          ticks: {
            fontColor: 'rgba(255,255,255,0.6)',
            fontStyle: 'bold',
            beginAtZero: true,
            maxTicksLimit: 5,
            padding: 10
          },
          gridLines: {
            drawTicks: options.labelX,
            drawBorder: options.labelX,
            display: options.labelX,
            color: 'rgba(255,255,255,0.6)',
            zeroLineColor: 'transparent'
          }
        }
      ];

      chartOptions.scales.yAxes = [
        {
          ticks: {
            fontColor: 'rgba(255,255,255,0.6)',
            fontStyle: 'bold',
            beginAtZero: true,
            maxTicksLimit: 5,
            padding: 10
          },
          gridLines: {
            drawTicks: options.labelY,
            drawBorder: options.labelY,
            display: options.labelY,
            color: 'rgba(255,255,255,0.6)',
            zeroLineColor: 'transparent'
          }
        }
      ];
    }

    return chartOptions;
  }

  // canvasGradient(fillColor0, fillColor1) {
  //   const gradientFill = this.ctx.createLinearGradient(0, 200, 0, 50);

  //   gradientFill.addColorStop(0, fillColor0);
  //   gradientFill.addColorStop(1, fillColor1);

  //   return gradientFill;
  // }

  // setChartColors(chart, primary, alpha, options?) {
  //   options = options ? options : { isPie: false, background: false };

  //   if (typeof primary !== 'string') {
  //     const gradientArray = [];
  //     chart.colors = [];

  //     if (options.isPie) {
  //       primary.forEach(color => {
  //         gradientArray.push(this.hexToRGB(color, alpha));
  //       });

  //       chart.colors.push({
  //         backgroundColor: gradientArray,
  //         borderColor: this.pointBorderColor,
  //         pointBorderColor: this.pointBorderColor,
  //         pointBackgroundColor: options.background
  //           ? options.background
  //           : gradientArray
  //       });
  //     } else {
  //       primary.forEach(color => {
  //         chart.colors.push({
  //           backgroundColor: this.canvasGradient(
  //             this.colorFade,
  //             this.hexToRGB(color, alpha)
  //           ),
  //           borderColor: color,
  //           pointBorderColor: this.pointBorderColor,
  //           pointBackgroundColor: options.background
  //             ? options.background
  //             : color
  //         });
  //       });
  //     }
  //   } else {
  //     chart.colors = [
  //       {
  //         backgroundColor: this.canvasGradient(
  //           this.colorFade,
  //           this.hexToRGB(primary, alpha)
  //         ),
  //         borderColor: primary,
  //         pointBorderColor: this.pointBorderColor,
  //         pointBackgroundColor: options.background
  //           ? options.background
  //           : primary
  //       }
  //     ];
  //   }
  // }

  // Chart events
  chartClicked(e: any): void {
    if (e.active.length) {
      switch (e.active[0]._view.label) {
        case 'Mostraram interesse':
          this.router.navigate(['/contatos', { search: 'Interessado' }]);
          break;
        // case 'Entrou em contato':
        //   this.router.navigate(['/contatos', { search: 'Entrou em contato' }]);
        //   break;
        case 'Total de cadastros':
          this.router.navigate(['/contatos']);
          break;
        default:
          break;
      }
    }
  }

  chartHovered(e: any): void {
    console.log(e);
  }

  hexToRGB(hex, alpha) {
    const red = parseInt(hex.slice(1, 3), 16),
      green = parseInt(hex.slice(3, 5), 16),
      blue = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    } else {
      return `rgb(${red}, ${green}, ${blue})`;
    }
  }
}
