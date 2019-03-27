import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatProgressSpinnerModule, MatListModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { TableComponent } from './table/table.component';
import { TableService } from './table.service';

const routes: Routes = [{
  path: '',
  component: TableComponent,
  pathMatch: 'full'
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatListModule,
    CdkTableModule,
    HttpModule,
    HttpClientModule
  ],
  declarations: [TableComponent],
  providers: [TableService]
})
export class GeneralModule { }
