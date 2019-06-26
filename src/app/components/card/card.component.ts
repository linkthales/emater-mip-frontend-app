import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges {
  @Input() cards: any[];
  @Input() quantities: any[];

  constructor() {}

  ngOnChanges() {
    this.cards.map((card, index) => card.quantity = this.quantities[index]);
  }
}
