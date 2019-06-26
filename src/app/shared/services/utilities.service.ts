import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(private toastr: ToastrService) {}

  pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  notify(msg, type, timeout = 8000) {
    this.toastr[type](
      `<span class="now-ui-icons ui-1_bell-53"></span> ${msg}`,
      '',
      {
        timeOut: timeout,
        closeButton: true,
        enableHtml: true,
        toastClass: `alert alert-${type} alert-with-icon`,
        positionClass: 'toast-top-right'
      }
    );
  }
}
