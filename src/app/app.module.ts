import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';  
import { RouterModule } from '@angular/router';  
import { HttpClientModule } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { EmployeeService } from './shared/service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeEditComponent } from './employee/employee-edit/employee-edit.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    EmployeeEditComponent,
    EmployeeDetailComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    // InMemoryWebApiModule.forRoot(EmployeeData)
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
