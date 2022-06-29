import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/auth-module/services/auth.service';
import { Course } from 'src/app/shared/models/course.model';
import { Student } from 'src/app/student-module/models/student.model';
import { StudentService } from 'src/app/student-module/services/student.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-roll-number-slip-dialog',
  templateUrl: './roll-number-slip-dialog.component.html',
  styleUrls: ['./roll-number-slip-dialog.component.scss']
})
export class RollNumberSlipDialogComponent implements OnInit {
  course: Course = {};
  student: Student = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RollNumberSlipDialogComponent>,
    private authService: AuthService,
    private router: Router,
    private studentService: StudentService,
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.course = this.data.course;
    this.setStudent();
  }

  setStudent() {
    if(this.authService.userIdExists()) {
      this.authService.getLoggedInUserById().subscribe((res: any)=>{
      if(res.status===200) {
        this.studentService.getStudent(res.data.email).subscribe((res: any)=>{
          if(res.status===200) {
            this.student = res.data;
          }
          else {
            this.dialogRef.close();
            Swal.fire({
              toast: true,
              position: 'top',
              icon: 'error',
              title: res.data,
              timer: 3000,
              showConfirmButton: false
            });
          }
        });
      }
      else {
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'error',
          title: res.data,
          timer: 3000,
          showConfirmButton: false
        });
        if(res.status===400) {
          this.router.navigate(['/student/courses']);
        }
        else {
          this.router.navigate(['/user']);
        }
      }
    });
    }
  }
}
