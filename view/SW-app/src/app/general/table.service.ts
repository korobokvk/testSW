
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class TableService {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  public getPlenets(): Observable<any[]> {
    return this.http.get(`${this.api}/planets`).pipe(map((data: HttpResponse<any>) => {
        return data || data.body;
      }));
  }
  public getDetails(params) {
    return this.http.get(`${this.api}/details`, {params: new HttpParams({ fromString: params })})
    .pipe(map((data: HttpResponse<any>) => {
      return data || data.body;
    }));
  }
}
