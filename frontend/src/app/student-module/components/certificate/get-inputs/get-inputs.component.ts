import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AuthService } from 'src/app/auth-module/services/auth.service';
import { StudentService } from 'src/app/student-module/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-get-inputs',
  templateUrl: './get-inputs.component.html',
  styleUrls: ['./get-inputs.component.scss']
})
export class GetInputsComponent implements OnInit {
  inputs: {
    rollNo?: string,
    year?: number,
    course?: string
  } = {};

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<GetInputsComponent>
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.authService.userIdExists()) {
      this.studentService.getCertificate(this.inputs).subscribe((res: any)=>{
        if(res.status==200 || res.status==600) {
          this.dialogRef.close(res);
        } else {
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            title: res.data,
            icon: 'error',
            timer: 3000
          });
          this.dialogRef.close('error');
        }
      });
    }
  }

}
