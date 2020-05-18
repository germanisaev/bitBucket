import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { Employee } from '../../shared/model';
import { EmployeeService } from '../../shared/service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from '../../shared/model';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  pageTitle = 'Employee Edit';
  errorMessage: string;
  employeeForm: FormGroup;

  employee: Employee;
  private sub: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.validationMessages = {
      name: {
        required: 'Employee name is required.',
        minlength: 'Employee name must be at least three characters.',
        maxlength: 'Employee name cannot exceed 50 characters.'
      },
      address: {
        required: 'Employee address is required.',
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(50)
      ]],
      address: ['', [Validators.required]],
      gender: '',
      company: '',
      designation: ''
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = params.get('id');
        if (id == '0') {
          const employee: Employee = { id: "0", name: "", address: "", gender: "", company: "", designation: "" };
          this.displayEmployee(employee);
        }
        else {
          this.getEmployee(id);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.  
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable  
    merge(this.employeeForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.employeeForm);
    });
  }


  getEmployee(id: string): void {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: Employee) => this.displayEmployee(employee),
        (error: any) => this.errorMessage = <any>error
      );
  }

  displayEmployee(employee: Employee): void {
    if (this.employeeForm) {
      this.employeeForm.reset();
    }
    this.employee = employee;

    if (this.employee.id == '0') {
      this.pageTitle = 'Add Employee';
    } else {
      this.pageTitle = `Edit Employee: ${this.employee.name}`;
    }

    // Update the data on the form  
    this.employeeForm.patchValue({
      name: this.employee.name,
      address: this.employee.address,
      gender: this.employee.gender,
      company: this.employee.company,
      designation: this.employee.designation
    });
  }

  deleteEmployee(): void {
    if (this.employee.id == '0') {
      // Don't delete, it was never saved.  
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Employee: ${this.employee.name}?`)) {
        this.employeeService.deleteEmployee(this.employee.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      if (this.employeeForm.dirty) {
        const p = { ...this.employee, ...this.employeeForm.value };
        if (p.id === '0') {
          this.employeeService.createEmployee(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        } else {
          this.employeeService.updateEmployee(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }


  onSaveComplete(): void {
    // Reset the form to clear the flags  
    this.employeeForm.reset();
    this.router.navigate(['/employees']);
  }

}
