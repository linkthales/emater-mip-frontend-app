import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  public loadingMessage: String = '';
  public loadingMessages: String[] = [
    'Por favor, aguarde um instante.',
    'Estou trabalhando nos seus dados, por favor, aguarde um instante.',
    'Estamos quase lá, aguarde mais alguns instantes por favor.'
  ];

  constructor() {
    this.loadingMessage = this.loadingMessages[0];
  }

  ngOnInit() {
    setInterval(() => {
      this.loadingMessage = this.loadingMessages[Math.floor(Math.random() * 4)];
    }, 5000);
  }
}
