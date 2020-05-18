import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { EmployeeEditGuard } from './employee/employee-edit.guard';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'employees',
    component: EmployeeListComponent
  },
  {
    path: 'employees/:id',
    component: EmployeeDetailComponent
  },
  {
    path: 'employees/:id/edit',
    canDeactivate: [EmployeeEditGuard],
    component: EmployeeEditComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
