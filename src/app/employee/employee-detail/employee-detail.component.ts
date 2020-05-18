import { Component, OnInit } from '@angular/core';
import { Employee } from '../../shared/model';  
import { ActivatedRoute, Router } from '@angular/router';  
import { EmployeeService } from '../../shared/service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  pageTitle = 'Employee Detail';  
  errorMessage = '';  
  employee: Employee | undefined;  
  
  constructor(
    private route: ActivatedRoute,  
    private router: Router,  
    private employeeService: EmployeeService) { }  
  
  ngOnInit(): void {  
    const param = this.route.snapshot.paramMap.get('id');  
    if (param) {  
      const id = param;  
      this.getEmployee(id);  
    }  
  }  
  
  getEmployee(id: string) {  
    this.employeeService.getEmployee(id).subscribe(  
      employee => this.employee = employee,  
      error => this.errorMessage = <any>error);  
  }  
  
  onBack(): void {  
    this.router.navigate(['/employees']);  
  }

}
