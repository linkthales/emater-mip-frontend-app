import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'mip-frontend';

  constructor(private translateService: TranslateService) {
    translateService.addLangs(['pt', 'en']);
    translateService.setDefaultLang('pt');

    const browserLang = translateService.getBrowserLang();
    translateService.use(browserLang.match(/pt|en/) ? browserLang : 'en');
  }
}
