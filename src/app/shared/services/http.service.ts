import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {
  private backendURL = 'http://127.0.0.1:3000/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {}

  get(url, httpOptions?): Observable<any> {
    if (httpOptions) {
      this.httpOptions = httpOptions;
    }

    return this.http.get(this.backendURL + url, this.httpOptions);
  }

  post(url, httpOptions?): Observable<any> {
    if (httpOptions) {
      this.httpOptions = httpOptions;
    }

    return this.http.post(this.backendURL + url, this.httpOptions);
  }

  put(url, httpOptions?): Observable<any> {
    if (httpOptions) {
      this.httpOptions = httpOptions;
    }

    return this.http.put(this.backendURL + url, this.httpOptions);
  }

  patch(url, httpOptions?): Observable<any> {
    if (httpOptions) {
      this.httpOptions = httpOptions;
    }

    return this.http.patch(this.backendURL + url, this.httpOptions);
  }
}