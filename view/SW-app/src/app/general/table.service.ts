import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class TableService {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  public getPlenets(): Observable<any[]> {
    return this.http.get(`${this.api}/planets`).map((data: HttpResponse<any>) => {
        return data || data.body;
      });
  }
}
