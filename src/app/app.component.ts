import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(['pt', 'en']);
    this.translateService.setDefaultLang('pt');
    this.translateService.use('pt');

    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang.match(/pt|en/) ? browserLang : 'pt');
  }
}
