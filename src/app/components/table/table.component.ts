import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild('myTable') table: any;

  @Input() tableData: any[];
  @Input() tableColumns: any[];

  public loadingIndicator = true;
  public detailsHeight: number;
  public expanded: any = {};
  public expandedRow = null;
  public spanSize = 21;

  constructor() {
  }

  ngOnInit() {
  }

  onDetailToggle(event) {}

  toggleExpandRow(row) {
    const rowSize = this.calculateRowSize(row);
    this.detailsHeight = rowSize * this.spanSize;

    setTimeout(() => {
      if (this.expandedRow) {
        if (this.expandedRow == row) {
          this.table.rowDetail.toggleExpandRow(row);
        } else {
          this.table.rowDetail.collapseAllRows();
          this.expandedRow = row;
          this.table.rowDetail.toggleExpandRow(row);
        }
      } else {
        this.expandedRow = row;
        this.table.rowDetail.toggleExpandRow(row);
      }
    }, 50);
  }

  calculateRowSize(row) {
    const scheduledExamSize = this.calculateObjectSize(row.scheduledExam);
    const secondGraduationSize = this.calculateObjectSize(row.secondGraduation);
    const transferRequestSize = this.calculateObjectSize(row.transferRequest);
    const additionalInfoSize = this.calculateObjectSize(row.additionalInfo) + 1;

    const rowSize = Math.max(
      scheduledExamSize,
      secondGraduationSize,
      transferRequestSize,
      additionalInfoSize
    );

    return rowSize;
  }

  calculateObjectSize(obj) {
    return obj ? Object.keys(obj).filter(key => obj[key] !== null).length : 0;
  }

  resizeTable() {
    if (document.querySelectorAll('.datatable-body').length) {
      document
        .querySelectorAll('.datatable-body')[0]
        .setAttribute('style', `height: 700px`);
    }
  }
}
