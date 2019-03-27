import { Component, OnInit, OnDestroy } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import 'rxjs/add/operator/takeUntil';


import { TableService } from '../table.service';
import { Config } from './config.model';
import { format } from 'url';
import { Subject } from 'rxjs/Subject';

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

  public getValue(column, row) {
    if (column.format) {
      return column.format(row);
    }
    return row[column.columnDef];
  }
  private getData() {
    this.spinnerState = true;
    this.tableService.getPlenets()
    .takeUntil(this.onDestroy)
    .subscribe((data: any[]) => {
      this.spinnerState = false;
      this.dataSource = data;
    });
  }
  ngOnInit() {
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.getData();
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
  }

}
