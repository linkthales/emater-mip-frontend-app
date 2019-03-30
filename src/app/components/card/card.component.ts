import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cards: any[];
  public quantities = [5, 10, 25, 7];

  constructor() {}

  ngOnInit() {
    console.log(this.cards);
    this.cards.map((card, index) => card.quantity = this.quantities[index])
  }
}
