
import {takeUntil} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';


import { TableService } from '../table.service';
import { Config } from './config.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TableComponent implements OnInit, OnDestroy {
  public expandedElement = null;
  public films: any[];
  public residents: any[];
  private onDestroy: Subject<any> = new Subject<any>();
  public spinnerState: boolean;
  public dataSource: any[];
  public displayedColumns: string[] = [];
  public columns: Config[] = [
    new Config({columnDef: 'name', header: 'Name'}),
    new Config({columnDef: 'terrain', header: 'Terrain'}),
    new Config({columnDef: 'population', header: 'Population',
    format: (row) => {
      const population = row.population;
      // Used this prefixes - https://en.wikipedia.org/wiki/Metric_prefix
      const ranges = [
        { divider: 1e18 , suffix: 'E' },
        { divider: 1e15 , suffix: 'P' },
        { divider: 1e12 , suffix: 'T' },
        { divider: 1e9 , suffix: 'G' },
        { divider: 1e6 , suffix: 'M' },
        { divider: 1e3 , suffix: 'k' }
      ];
      for (let i = 0; i < ranges.length; i++) {
        if (population >= ranges[i].divider) {
          return (population / ranges[i].divider).toString() + ranges[i].suffix;
        }
      }
      return population.toString();
    }}),
    new Config({columnDef: 'residents', header: 'Residents amount',
    format: (row) => {
      return row.residents.length;
    }}),
    new Config({columnDef: 'films', header: 'Films amount',
    format: (row) => {
      return row.films.length;
    }})
  ];
  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.getData();
  }

  public getValue(column, row) {
    if (column.format) {
      return column.format(row);
    }
    return row[column.columnDef];
  }
  private getData() {
    this.spinnerState = true;
    this.tableService.getPlenets().pipe(
    takeUntil(this.onDestroy))
    .subscribe((data: any[]) => {
      this.spinnerState = false;
      this.dataSource = data;
    });
  }
  onRowClick(row, rowState) {
    const params = [
      {key: 'residents', value: row.residents},
      {key: 'films', value: row.films}
    ];
    const someParam = params.filter(item => item.value !== null && item.value.toString().length)
      .map(item => `${item.key}=${item.value}`)
      .join('&');
    if (rowState) {
      this.spinnerState = true;
      this.tableService.getDetails(someParam).pipe(
      takeUntil(this.onDestroy))
      .subscribe(data => {
        this.films = data.filter(film => film.title);
        this.residents = data.filter(resident => resident.name);
        this.spinnerState = false;
      });
    }
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
  }

}
